// ---------------------------------------------------------------------------
// DOCX export via the `docx` library. Runs in the browser. Produces a genuinely
// editable, professionally formatted Word document mirroring the preview.
// ---------------------------------------------------------------------------

import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
  type ISectionOptions,
} from "docx";
import type { StructuredCV } from "../types";
import { safeFileName } from "./shared";

const NAVY = "0A2540";
const MUTED = "5B6B83";
const INK = "1C2836";
const RIGHT_TAB = 9026; // ~ right margin in twips for A4 with 1" margins

function heading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 220, after: 60 },
    border: {
      bottom: { color: "C9D3DF", size: 6, style: BorderStyle.SINGLE, space: 2 },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        color: NAVY,
        size: 22, // half-points -> 11pt
        characterSpacing: 10,
      }),
    ],
  });
}

function body(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 20, color: INK })],
  });
}

function bulletPara(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 20 },
    children: [new TextRun({ text, size: 20, color: INK })],
  });
}

// A title on the left, dates on the right, using a right tab stop.
function titleWithDates(
  left: TextRun[],
  right: string,
  spacingBefore = 120
): Paragraph {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
    spacing: { before: spacingBefore, after: 10 },
    children: [
      ...left,
      new TextRun({ text: right ? `\t${right}` : "", color: MUTED, size: 19 }),
    ],
  });
}

function dateRange(start?: string, end?: string): string {
  return [start, end].filter(Boolean).join(" – ");
}

export async function downloadDocx(cv: StructuredCV): Promise<void> {
  const children: Paragraph[] = [];

  // Header.
  children.push(
    new Paragraph({
      spacing: { after: 20 },
      children: [
        new TextRun({ text: cv.personalDetails.fullName, bold: true, size: 40, color: NAVY }),
      ],
    })
  );
  if (cv.professionalHeadline) {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: cv.professionalHeadline, size: 24, color: MUTED })],
      })
    );
  }
  const contactBits = [cv.personalDetails.contactLine, cv.personalDetails.linkedin]
    .filter(Boolean)
    .join("   ·   ");
  if (contactBits) {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: contactBits, size: 18, color: MUTED })],
      })
    );
  }

  if (cv.professionalProfile) {
    children.push(heading("Professional Profile"));
    children.push(body(cv.professionalProfile));
  }

  if (cv.coreCompetencies.length) {
    children.push(heading("Core Competencies"));
    cv.coreCompetencies.forEach((c) => children.push(bulletPara(c)));
  }

  if (cv.careerExperience.length) {
    children.push(heading("Professional / Military Experience"));
    cv.careerExperience.forEach((e, idx) => {
      const titleText = [e.appointment, e.rank].filter(Boolean).join(" — ");
      children.push(
        titleWithDates(
          [new TextRun({ text: titleText, bold: true, size: 21, color: "101C2B" })],
          dateRange(e.startDate, e.endDate),
          idx === 0 ? 40 : 160
        )
      );
      const org = [e.organisation, e.formation, e.location].filter(Boolean).join(", ");
      if (org) {
        children.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [new TextRun({ text: org, italics: true, size: 19, color: MUTED })],
          })
        );
      }
      e.responsibilities.filter((r) => r.trim()).forEach((r) => children.push(bulletPara(r)));
      const achievements = e.achievements.filter((a) => a.trim());
      if (achievements.length) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 10 },
            children: [new TextRun({ text: "Key achievements", bold: true, size: 18, color: NAVY })],
          })
        );
        achievements.forEach((a) => children.push(bulletPara(a)));
      }
    });
  }

  if (cv.education.length) {
    children.push(heading("Education"));
    cv.education.forEach((e) => {
      const left = [e.qualification, e.field].filter(Boolean).join(", ");
      const inst = [e.institution, e.location].filter(Boolean).join(", ");
      children.push(
        titleWithDates(
          [
            new TextRun({ text: left, bold: true, size: 20, color: INK }),
            new TextRun({ text: inst ? ` — ${inst}` : "", size: 20, color: INK }),
          ],
          e.year || "",
          40
        )
      );
    });
  }

  const simpleSection = (
    title: string,
    items: { title: string; detail?: string; year?: string }[]
  ) => {
    if (!items.length) return;
    children.push(heading(title));
    items.forEach((it) => {
      const left = [it.title, it.detail].filter(Boolean).join(" — ");
      children.push(
        titleWithDates([new TextRun({ text: left, size: 20, color: INK })], it.year || "", 40)
      );
    });
  };

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
    children.push(heading(title));
    items.forEach((e, idx) => {
      const t = [e.role, e.organisation].filter(Boolean).join(", ");
      children.push(
        titleWithDates(
          [new TextRun({ text: t, bold: true, size: 20, color: "101C2B" })],
          e.dates || "",
          idx === 0 ? 40 : 140
        )
      );
      if (e.location) {
        children.push(
          new Paragraph({
            spacing: { after: 30 },
            children: [new TextRun({ text: e.location, italics: true, size: 19, color: MUTED })],
          })
        );
      }
      e.points.filter((p) => p.trim()).forEach((p) => children.push(bulletPara(p)));
    });
  };

  if (cv.boardExperience.length) {
    children.push(heading("Board & Governance Experience"));
    cv.boardExperience.forEach((e, idx) => {
      children.push(
        titleWithDates(
          [
            new TextRun({
              text: [e.role, e.organisation].filter(Boolean).join(", "),
              bold: true,
              size: 20,
              color: "101C2B",
            }),
          ],
          e.dates || "",
          idx === 0 ? 40 : 140
        )
      );
      e.points.filter((p) => p.trim()).forEach((p) => children.push(bulletPara(p)));
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
    children.push(heading("Languages"));
    children.push(
      body(
        cv.languages
          .map((l) => (l.proficiency ? `${l.language} (${l.proficiency})` : l.language))
          .join("   ·   ")
      )
    );
  }

  const section: ISectionOptions = {
    properties: {
      page: {
        margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 },
      },
    },
    children,
  };

  const doc = new Document({
    creator: "Workforce — AI Assisted CV Drafting",
    title: `${cv.personalDetails.fullName} — CV`,
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20, color: INK },
        },
      },
    },
    sections: [section],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `${safeFileName(cv.personalDetails.fullName)}-CV.docx`);
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
