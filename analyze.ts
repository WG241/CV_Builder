// Stage A — career analysis.
import "server-only";
import type { CvFormDataParsed } from "../schemas";
import { careerAnalysisSchema } from "../schemas";
import type { CareerAnalysis } from "../types";
import { MODEL_LIGHT } from "../constants";
import { completeJson } from "./client";
import { analysisSystem, serialiseForm } from "./prompts";

export async function analyzeCareer(
  form: CvFormDataParsed
): Promise<CareerAnalysis> {
  const user = `Analyse the following supplied career information for a CV aimed
at: "${form.personal.cvPurpose}"${
    form.personal.targetRole ? ` (target role: ${form.personal.targetRole})` : ""
  }.

${serialiseForm(form)}`;

  return completeJson({
    model: MODEL_LIGHT,
    system: analysisSystem(),
    user,
    schema: careerAnalysisSchema,
    temperature: 0.3,
    maxTokens: 4_000,
  });
}
