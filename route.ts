import { NextResponse } from "next/server";
import { researchRequestSchema } from "@/lib/schemas";
import { deepClean } from "@/lib/sanitize";
import { analyzeCareer } from "@/lib/ai/analyze";
import { researchContext } from "@/lib/ai/research";
import {
  enforceRequestLimit,
  errorResponse,
  json,
  mapError,
  readBody,
} from "@/lib/api-helpers";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request): Promise<NextResponse> {
  const limited = enforceRequestLimit(req);
  if (limited) return limited;

  const parsed = await readBody(req);
  if (!parsed.ok) return parsed.res;

  const cleaned = deepClean(parsed.body);
  const result = researchRequestSchema.safeParse(cleaned);
  if (!result.success) {
    return errorResponse("Please complete the required fields.", 422);
  }

  const form = result.data.form;
  if (!form.confirmation.allowResearch) {
    return errorResponse("Research was not enabled for this request.", 400);
  }

  try {
    // Light analysis first to focus the research on terms worth clarifying.
    let terms = null;
    try {
      terms = await analyzeCareer(form);
    } catch {
      terms = null;
    }
    const research = await researchContext(form, terms);
    return json({ research });
  } catch (err) {
    // Research is non-essential; degrade gracefully rather than failing hard.
    return mapError(err);
  }
}
