// Stage B — controlled public web research. Opt-in only. Returns terminology
// clarifications and confirm-first public-source suggestions; never auto-inserts
// individual facts.
import "server-only";
import type { CvFormDataParsed } from "../schemas";
import { researchResultSchema } from "../schemas";
import type { CareerAnalysis, ResearchResult } from "../types";
import { MODEL_LIGHT } from "../constants";
import { completeWithSearch } from "./client";
import { researchSystem, serialiseForm } from "./prompts";

function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1]!.trim() : trimmed;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    return {};
  }
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch {
    return {};
  }
}

export async function researchContext(
  form: CvFormDataParsed,
  analysis: CareerAnalysis | null
): Promise<ResearchResult> {
  const terms = analysis?.terminologyToClarify?.length
    ? `Prioritise clarifying these terms: ${analysis.terminologyToClarify.join(
        "; "
      )}.`
    : "";

  const user = `Conduct tightly controlled public research to support this CV.
${terms}

Only clarify terminology and public institutional facts, and propose (never
insert) any individual-specific public facts for the user to confirm.

Supplied information:
${serialiseForm(form)}`;

  const raw = await completeWithSearch({
    model: MODEL_LIGHT,
    system: researchSystem(),
    user,
    maxUses: 4,
    maxTokens: 4_000,
  });

  const parsed = researchResultSchema.safeParse(extractJsonObject(raw));
  if (!parsed.success) {
    // Research is best-effort; a malformed result should not break generation.
    return { terminologyClarifications: [], publicSourceSuggestions: [], notes: [] };
  }
  // Ensure suggestion ids are present/unique for the confirm flow.
  const result = parsed.data;
  result.publicSourceSuggestions = result.publicSourceSuggestions.map(
    (s, i) => ({ ...s, id: s.id || `sug_${i + 1}` })
  );
  return result;
}
