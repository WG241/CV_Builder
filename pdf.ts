// ---------------------------------------------------------------------------
// PDF export via pdfmake. Runs in the browser. Produces a clean, ATS-friendly,
// A4 document with real selectable text that mirrors the on-screen preview.
// ---------------------------------------------------------------------------

import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import type { StructuredCV } from "../types";
import { hasContent, safeFileName } from "./shared";

// pdfmake and its virtual font system are loaded lazily to keep them out of the
// server bundle and off the initial page load.
async function getPdfMake() {
  const pdfMakeModule = await import("pdfmake/build/pdfmake");
  const vfsModule = await import("pdfmake/build/vfs_fonts");
  const pdfMake = (pdfMakeModule as unknown as { default: PdfMakeStatic })
    .default;
  const vfs =
    (vfsModule as unknown as { default?: Record<string, string> }).default ??
    (vfsModule as unknown as Record<string, string>);
  pdfMake.vfs = vfs;
  return pdfMake;
}

interface PdfMakeStatic {
  vfs: Record<string, string>;
  createPdf(def: TDocumentDefinitions): {
    getBlob(cb: (blob: Blob) => void): void;
  };
}

const NAVY = "#0a2540";
const MUTED = "#5b6b83";
const LINE = "#c9d3df";

function sectionHeader(text: string): Content {
  return {
    text: text.toUpperCase(),
    style: "sectionHeader",
    margin: [0, 12, 0, 4],
  };
}

function divider(): Content {
  return {
    canvas: [
      { type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.75, lineColor: LINE },
    ],
    margin: [0, 0, 0, 6],
  };
}

function bullets(items: string[]): Content | null {
  const clean = items.map((s) => s.trim()).filter(Boolean);
  if (!clean.length) return null;
  return {
    ul: clean,
    style: "bullet",
    margin: [0, 2, 0, 4],
  };
}

function dateRange(start?: string, end?: string): string {
  return [start, end].filter(Boolean).join(" – ");
}

export async function downloadPdf(cv: StructuredCV): Promise<void> {
  const pdfMake = await getPdfMake();
  const content: Content[] = [];

  // Header — name, headline, contact.
  content.push({ text: cv.personalDetails.fullName, style: "name" });
  if (cv.professionalHeadline) {
    content.push({ text: cv.professionalHeadline, style: "headline" });
  }
  if (cv.personalDetails.contactLine) {
    content.push({ text: cv.personalDetails.contactLine, style: "contact" });
  }
  if (cv.personalDetails.linkedin) {
    content.push({ text: cv.personalDetails.linkedin, style: "contact" });
  }

  // Professional profile.
  if (cv.professionalProfile) {
    content.push(sectionHeader("Professional Profile"));
    content.push(divider());
    content.push({ text: cv.professionalProfile, style: "body" });
  }

  // Core competencies — two-column list, ATS-safe (plain text).
  if (cv.coreCompetencies.length) {
    content.push(sectionHeader("Core Competencies"));
    content.push(divider());
    const mid = Math.ceil(cv.coreCompetencies.length / 2);
    content.push({
      columns: [
        { ul: cv.coreCompetencies.slice(0, mid), style: "bullet" },
        { ul: cv.coreCompetencies.slice(mid), style: "bullet" },
      ],
      columnGap: 20,
      margin: [0, 2, 0, 0],
    });
  }

  // Career experience.
  if (cv.careerExperience.length) {
    content.push(sectionHeader("Professional / Military Experience"));
    content.push(divider());
    cv.careerExperience.forEach((e, idx) => {
      const titleLine = [e.appointment, e.rank].filter(Boolean).join(" — ");
      const orgLine = [e.organisation, e.formation].filter(Boolean).join(", ");
      content.push({
        columns: [
          { text: titleLine, style: "roleTitle", width: "*" },
          {
            text: dateRange(e.startDate, e.endDate),
            style: "roleDates",
            width: "auto",
            alignment: "right",
          },
        ],
        margin: [0, idx === 0 ? 2 : 8, 0, 0],
      });
      const sub = [orgLine, e.location].filter(Boolean).join("  ·  ");
      if (sub) content.push({ text: sub, style: "roleOrg" });
      const r = bullets(e.responsibilities);
      if (r) content.push(r);
      if (e.achievements.some((a) => a.trim())) {
        content.push({ text: "Key achievements", style: "microLabel" });
        const a = bullets(e.achievements);
        if (a) content.push(a);
      }
    });
  }

  // Education.
  if (cv.education.length) {
    content.push(sectionHeader("Education"));
    content.push(divider());
    cv.education.forEach((e) => {
      const left = [e.qualification, e.field].filter(Boolean).join(", ");
      const inst = [e.institution, e.location].filter(Boolean).join(", ");
      content.push({
        columns: [
          { text: [left, inst].filter(Boolean).join(" — "), style: "body", width: "*" },
          { text: e.year || "", style: "roleDates", width: "auto", alignment: "right" },
        ],
        margin: [0, 1, 0, 1],
      });
    });
  }

  const simpleSection = (
    title: string,
    items: { title: string; detail?: string; year?: string }[]
  ) => {
    if (!items.length) return;
    content.push(sectionHeader(title));
    content.push(divider());
    items.forEach((it) => {
      const left = [it.title, it.detail].filter(Boolean).join(" — ");
      content.push({
        columns: [
          { text: left, style: "body", width: "*" },
          { text: it.year || "", style: "roleDates", width: "auto", alignment: "right" },
        ],
        margin: [0, 1, 0, 1],
      });
    });
  };

  // Combine military & professional development into one section where present.
  const devItems = [
    ...cv.militaryTraining,
    ...cv.professionalCertifications,
    ...cv.executiveEducation,
  ];
  simpleSection("Military & Professional Development", devItems);

  const genericSection = (
    title: string,
    items: {
      organisation: string;
      role: string;
      dates?: string;
      location?: string;
      points: string[];
    }[]
  ) => {
    if (!items.length) return;
    content.push(sectionHeader(title));
    content.push(divider());
    items.forEach((e, idx) => {
      const titleLine = [e.role, e.organisation].filter(Boolean).join(", ");
      content.push({
        columns: [
          { text: titleLine, style: "roleTitle", width: "*" },
          { text: e.dates || "", style: "roleDates", width: "auto", alignment: "right" },
        ],
        margin: [0, idx === 0 ? 2 : 6, 0, 0],
      });
      if (e.location) content.push({ text: e.location, style: "roleOrg" });
      const b = bullets(e.points);
      if (b) content.push(b);
    });
  };

  if (cv.boardExperience.length) {
    content.push(sectionHeader("Board & Governance Experience"));
    content.push(divider());
    cv.boardExperience.forEach((e, idx) => {
      content.push({
        columns: [
          {
            text: [e.role, e.organisation].filter(Boolean).join(", "),
            style: "roleTitle",
            width: "*",
          },
          { text: e.dates || "", style: "roleDates", width: "auto", alignment: "right" },
        ],
        margin: [0, idx === 0 ? 2 : 6, 0, 0],
      });
      const b = bullets(e.points);
      if (b) content.push(b);
    });
  }

  genericSection("Post-Military Employment", cv.postMilitaryExperience);
  genericSection("Consulting & Advisory Experience", cv.consultingExperience);
  genericSection("International Assignments", cv.internationalAssignments);
  genericSection("Major Projects & Initiatives", cv.projects);
  genericSection("Training & Instructional Experience", cv.trainingExperience);

  simpleSection("Publications", cv.publications);
  simpleSection("Speaking Engagements", cv.speakingEngagements);
  simpleSection("Professional Memberships", cv.professionalMemberships);
  simpleSection("Awards & Decorations", cv.awards);

  if (cv.languages.length) {
    content.push(sectionHeader("Languages"));
    content.push(divider());
    content.push({
      text: cv.languages
        .map((l) => [l.language, l.proficiency].filter(Boolean).join(" (") + (l.proficiency ? ")" : ""))
        .join("   ·   "),
      style: "body",
    });
  }

  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [40, 40, 40, 48],
    defaultStyle: { font: "Roboto", fontSize: 10, color: "#1c2836", lineHeight: 1.25 },
    info: {
      title: `${cv.personalDetails.fullName} — CV`,
      author: cv.personalDetails.fullName,
    },
    content,
    styles: {
      name: { fontSize: 22, bold: true, color: NAVY, margin: [0, 0, 0, 2] },
      headline: { fontSize: 12, color: MUTED, margin: [0, 0, 0, 4] },
      contact: { fontSize: 9.5, color: MUTED, margin: [0, 0, 0, 1] },
      sectionHeader: { fontSize: 11, bold: true, color: NAVY, characterSpacing: 0.5 },
      body: { fontSize: 10, color: "#1c2836" },
      bullet: { fontSize: 10, color: "#1c2836" },
      roleTitle: { fontSize: 10.5, bold: true, color: "#101c2b" },
      roleOrg: { fontSize: 9.5, italics: true, color: MUTED, margin: [0, 0, 0, 2] },
      roleDates: { fontSize: 9.5, color: MUTED },
      microLabel: { fontSize: 9, bold: true, color: NAVY, margin: [0, 3, 0, 0] },
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `${cv.personalDetails.fullName}   ·   Page ${currentPage} of ${pageCount}`,
      alignment: "center",
      fontSize: 8,
      color: MUTED,
      margin: [0, 12, 0, 0],
    }),
  };

  return new Promise<void>((resolve) => {
    pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
      triggerDownload(blob, `${safeFileName(cv.personalDetails.fullName)}-CV.pdf`);
      resolve();
    });
  });
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2_000);
}

// Re-exported so callers can gate the button on whether there is anything to
// export.
export { hasContent };
