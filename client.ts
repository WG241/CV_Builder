// ---------------------------------------------------------------------------
// OpenAI client wrapper. Server-only. Provides two primitives:
//   - completeJson: a strict-JSON structured call validated with a Zod schema;
//   - completeWithSearch: a call that may use the hosted web_search tool.
// The API key is read from the environment and never leaves the server.
// ---------------------------------------------------------------------------

import "server-only";
import OpenAI from "openai";
import { z } from "zod";

let cached: OpenAI | null = null;

export function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AiConfigError("OPENAI_API_KEY is not configured.");
  }
  if (!cached) {
    cached = new OpenAI({ apiKey });
  }
  return cached;
}

export class AiConfigError extends Error {}
export class AiOutputError extends Error {}

// Extract the first balanced JSON object/array from a string. Models are asked
// to return raw JSON, but this defends against stray prose or code fences.
function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1]!.trim() : trimmed;

  const firstObj = body.indexOf("{");
  const firstArr = body.indexOf("[");
  let start = -1;
  let open = "{";
  let close = "}";
  if (firstObj === -1 && firstArr === -1) return body;
  if (firstArr !== -1 && (firstObj === -1 || firstArr < firstObj)) {
    start = firstArr;
    open = "[";
    close = "]";
  } else {
    start = firstObj;
  }

  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < body.length; i++) {
    const ch = body[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return body.slice(start, i + 1);
    }
  }
  return body.slice(start);
}

interface CompleteJsonOptions<T extends z.ZodTypeAny> {
  model: string;
  system: string;
  user: string;
  schema: T;
  maxTokens?: number;
  temperature?: number;
}

export async function completeJson<T extends z.ZodTypeAny>(
  opts: CompleteJsonOptions<T>
): Promise<z.infer<T>> {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 8_000,
    temperature: opts.temperature ?? 0.4,
    // JSON mode guarantees syntactically valid JSON output. It requires the
    // word "json" to appear in the prompt, which every system prompt satisfies.
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: opts.system },
      { role: "user", content: opts.user },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(raw));
  } catch {
    throw new AiOutputError("The model returned invalid JSON.");
  }

  const result = opts.schema.safeParse(parsed);
  if (!result.success) {
    throw new AiOutputError(
      "The model output did not match the expected structure."
    );
  }
  return result.data;
}

interface SearchOptions {
  model: string;
  system: string;
  user: string;
  maxUses?: number;
  maxTokens?: number;
}

// Runs a call with the hosted web_search tool enabled and returns the final
// text. Used only by the research stage; tightly scoped by the system prompt.
// Uses the Responses API, which exposes OpenAI's hosted web search tool.
export async function completeWithSearch(opts: SearchOptions): Promise<string> {
  const client = getClient();
  const response = await client.responses.create({
    model: opts.model,
    max_output_tokens: opts.maxTokens ?? 4_000,
    temperature: 0.2,
    tools: [{ type: "web_search_preview" }],
    input: [
      { role: "system", content: opts.system },
      { role: "user", content: opts.user },
    ],
  });
  return response.output_text ?? "";
}
