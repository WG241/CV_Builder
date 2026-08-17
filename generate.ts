// Full generation pipeline: draft -> factual audit -> quality review, all
// producing a validated StructuredCV. Analysis and (optional) confirmed
// research suggestions feed the draft.
import "server-only";
import type { CvFormDataParsed } from "../schemas";
import { structuredCvSchema } from "../schemas";
import type { CareerAnalysis, PublicSourceSuggestion, StructuredCV } from "../types";
import { MODEL_HEAVY, MODEL_LIGHT } from "../constants";
import { completeJson } from "./client";
import {
  auditSystem,
  draftingSystem,
  qualitySystem,
  serialiseForm,
} from "./prompts";
import { applyFactualContact, pruneEmpties } from "./normalize";

interface GenerateArgs {
  form: CvFormDataParsed;
  analysis: CareerAnalysis;
  confirmedSuggestions: PublicSourceSuggestion[];
}

export async function generateCv({
  form,
  analysis,
  confirmedSuggestions,
}: GenerateArgs): Promise<StructuredCV> {
  const serialised = serialiseForm(form);

  const analysisBlock = `PRIOR ANALYSIS:
Seniority: ${analysis.seniorityLevel} — ${analysis.seniorityRationale}
Career themes: ${analysis.careerThemes.join("; ")}
Supported competencies: ${analysis.candidateCompetencies.join("; ")}
Facts: ${analysis.facts.join("; ")}
Interpretations (supportable): ${analysis.interpretations.join("; ")}
Missing evidence (do NOT invent): ${analysis.missingEvidence.join("; ")}`;

  const confirmedBlock = confirmedSuggestions.length
    ? `USER-CONFIRMED PUBLIC FACTS (safe to include, cite nothing in the CV body):
${confirmedSuggestions.map((s) => `- ${s.proposed} (source: ${s.source})`).join("\n")}`
    : "No public-source suggestions were confirmed. Do not add researched facts.";

  // ---- Draft (heavy model) ----
  const draft = await completeJson({
    model: MODEL_HEAVY,
    system: draftingSystem(),
    user: `Write the structured CV for this person, tailored (emphasis only) to:
"${form.personal.cvPurpose}"${
      form.personal.targetRole ? ` — target role: ${form.personal.targetRole}` : ""
    }.

${analysisBlock}

${confirmedBlock}

SUPPLIED INFORMATION:
${serialised}`,
    schema: structuredCvSchema,
    temperature: 0.5,
    maxTokens: 8_000,
  });

  // ---- Factual audit (light model) ----
  const audited = await completeJson({
    model: MODEL_LIGHT,
    system: auditSystem(),
    user: `ORIGINAL SUPPLIED INFORMATION:
${serialised}

${confirmedBlock}

DRAFT CV (JSON):
${JSON.stringify(draft)}`,
    schema: structuredCvSchema,
    temperature: 0.1,
    maxTokens: 8_000,
  });

  // ---- Quality review (heavy model) ----
  const reviewed = await completeJson({
    model: MODEL_HEAVY,
    system: qualitySystem(),
    user: `Target purpose: "${form.personal.cvPurpose}". Improve wording and
positioning WITHOUT adding facts. Preserve all dates, ranks, organisations and
qualifications exactly.

CV (JSON):
${JSON.stringify(audited)}`,
    schema: structuredCvSchema,
    temperature: 0.3,
    maxTokens: 8_000,
  });

  // Contact details are user facts — enforce them, then prune empties.
  return pruneEmpties(applyFactualContact(reviewed as StructuredCV, form));
}
