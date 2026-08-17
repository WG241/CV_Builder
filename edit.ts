// Targeted, fact-preserving edits of a single field or list.
import "server-only";
import { z } from "zod";
import { MODEL_LIGHT } from "../constants";
import type { EditAction, EditField } from "../types";
import { completeJson } from "./client";
import { editSystem } from "./prompts";

const textResultSchema = z.object({ text: z.string() });
const listResultSchema = z.object({ items: z.array(z.string()) });

interface EditArgs {
  action: EditAction;
  field: EditField;
  text: string | string[];
  factContext: string;
}

const LIST_FIELDS: EditField[] = [
  "coreCompetencies",
  "responsibilities",
  "achievements",
];

export async function editContent(
  args: EditArgs
): Promise<{ text?: string; items?: string[] }> {
  const isList = LIST_FIELDS.includes(args.field);
  const current = Array.isArray(args.text)
    ? args.text.map((t) => `- ${t}`).join("\n")
    : args.text;

  const user = `Edit action: ${args.action}
Field: ${args.field}
Field type: ${isList ? "list of items" : "single text"}

FACTUAL CONTEXT THAT MUST BE PRESERVED (never alter or add to these facts):
${args.factContext || "(none supplied)"}

CURRENT CONTENT:
${current}`;

  if (isList) {
    const res = await completeJson({
      model: MODEL_LIGHT,
      system: editSystem(),
      user,
      schema: listResultSchema,
      temperature: 0.4,
      maxTokens: 2_000,
    });
    return { items: res.items.map((s) => s.trim()).filter(Boolean) };
  }

  const res = await completeJson({
    model: MODEL_LIGHT,
    system: editSystem(),
    user,
    schema: textResultSchema,
    temperature: 0.4,
    maxTokens: 2_000,
  });
  return { text: res.text.trim() };
}
