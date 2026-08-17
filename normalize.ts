// Normalises a validated structured CV: builds the contact line, trims empties,
// and guarantees the personal details reflect the user's own contact input
// (these are facts and must not be model-altered).
import type { CvFormDataParsed } from "../schemas";
import type { StructuredCV } from "../types";

export function buildContactLine(form: CvFormDataParsed): string {
  const p = form.personal;
  const location = [p.city, p.country].filter(Boolean).join(", ");
  return [p.email, p.phone, location].filter(Boolean).join("  ·  ");
}

export function applyFactualContact(
  cv: StructuredCV,
  form: CvFormDataParsed
): StructuredCV {
  const p = form.personal;
  const location = [p.city, p.country].filter(Boolean).join(", ");
  return {
    ...cv,
    personalDetails: {
      ...cv.personalDetails,
      fullName: p.fullName || cv.personalDetails.fullName,
      contactLine: buildContactLine(form),
      email: p.email || undefined,
      phone: p.phone || undefined,
      location: location || undefined,
      linkedin: p.linkedin || undefined,
    },
  };
}

// Remove list items that are empty strings and drop entirely empty entries.
export function pruneEmpties(cv: StructuredCV): StructuredCV {
  const cleanStrArr = (a: string[]) => a.map((s) => s.trim()).filter(Boolean);
  return {
    ...cv,
    coreCompetencies: cleanStrArr(cv.coreCompetencies),
    careerExperience: cv.careerExperience.map((e) => ({
      ...e,
      responsibilities: cleanStrArr(e.responsibilities),
      achievements: cleanStrArr(e.achievements),
    })),
    boardExperience: cv.boardExperience.map((e) => ({
      ...e,
      points: cleanStrArr(e.points),
    })),
    postMilitaryExperience: cv.postMilitaryExperience.map((e) => ({
      ...e,
      points: cleanStrArr(e.points),
    })),
    consultingExperience: cv.consultingExperience.map((e) => ({
      ...e,
      points: cleanStrArr(e.points),
    })),
    internationalAssignments: cv.internationalAssignments.map((e) => ({
      ...e,
      points: cleanStrArr(e.points),
    })),
    projects: cv.projects.map((e) => ({ ...e, points: cleanStrArr(e.points) })),
    trainingExperience: cv.trainingExperience.map((e) => ({
      ...e,
      points: cleanStrArr(e.points),
    })),
  };
}
