// Shared helpers for the exporters.
import type { StructuredCV } from "../types";

export function safeFileName(name: string): string {
  return (
    (name || "workforce")
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "workforce"
  );
}

// True if the CV has any substantive content worth exporting.
export function hasContent(cv: StructuredCV | null | undefined): boolean {
  if (!cv) return false;
  return Boolean(
    cv.professionalProfile ||
      cv.coreCompetencies.length ||
      cv.careerExperience.length ||
      cv.education.length
  );
}
