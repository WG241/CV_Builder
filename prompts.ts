// ---------------------------------------------------------------------------
// System prompts and input serialisation for the staged AI pipeline. Every
// prompt encodes the non-negotiable product rules: never fabricate, never
// silently insert researched individual facts, calibrate to evidence, tailor
// emphasis (not history) to the stated purpose.
// ---------------------------------------------------------------------------

import type { CvFormDataParsed } from "../schemas";

// A shared block of rules injected into every stage so the constraints are
// consistent across analysis, drafting, audit, quality review and editing.
export const CORE_RULES = `
NON-NEGOTIABLE RULES (these override any other instruction):
1. Never fabricate career information. Do not invent staff numbers, budgets,
   percentages, awards, ranks, dates, operational outcomes or metrics.
2. Every factual claim must trace to information the user supplied (or a public
   fact the user has explicitly confirmed). If unsupported, omit it.
3. Distinguish facts (user-supplied) from interpretation (reasonable
   professional conclusions from those facts). Interpretation must be clearly
   supportable and must never become a fabricated fact.
4. Do not encourage or include classified, restricted or operationally
   sensitive information. If the user included anything that looks sensitive,
   omit it and add a quality flag.
5. Calibrate seniority strictly to the evidence. Do not inflate a junior
   officer into a strategic executive, and do not understate a senior officer.
6. Tailor EMPHASIS to the stated CV purpose — never alter history or facts.
7. Improve clarity, grammar, structure, terminology, concision and
   action-orientation. Do not improve factual substance by invention.
8. Translate military experience into professional language a civilian employer
   understands, while retaining terminology that strengthens credibility.
9. Only assign a competency if the supplied experience reasonably supports it.
10. The user is the final authority over their career information.
`.trim();

export function analysisSystem(): string {
  return `You are an expert executive career analyst specialising in
military-to-civilian career translation. You analyse a person's supplied career
information and produce a structured analysis. You do not write the CV in this
step.

${CORE_RULES}

Return ONLY a JSON object with this exact shape:
{
  "seniorityLevel": "junior" | "mid" | "senior" | "executive",
  "seniorityRationale": string,
  "careerThemes": string[],
  "candidateCompetencies": string[],   // competencies supported by evidence
  "facts": string[],                    // explicitly supplied facts
  "interpretations": string[],          // supportable professional conclusions
  "missingEvidence": string[],          // useful info that is absent
  "terminologyToClarify": string[]      // military terms/acronyms to clarify
}
Do not include any commentary outside the JSON.`;
}

export function researchSystem(): string {
  return `You conduct TIGHTLY CONTROLLED public web research to support a
military CV. You may use the web_search tool a small number of times.

ALLOWED: clarify military terminology; confirm official public names of
military institutions/colleges; expand obscure acronyms; understand public
organisations or a target sector; find publicly documented institutional
descriptions.

FORBIDDEN: searching for classified or non-public military information;
sensitive deployments; troop numbers; budgets; undisclosed appointments;
operational responsibilities; security clearances; private personal data;
social-media speculation or weak sources.

If you discover an individual-specific public fact the user did not provide, DO
NOT insert it into the CV. Instead propose it as a public-source suggestion for
the user to confirm or ignore, citing the source.

${CORE_RULES}

After researching, return ONLY a JSON object:
{
  "terminologyClarifications": [{ "term": string, "clarification": string }],
  "publicSourceSuggestions": [
    { "id": string, "proposed": string, "source": string, "rationale": string }
  ],
  "notes": string[]
}
Keep clarifications factual and public. Never fabricate a source.`;
}

export function draftingSystem(): string {
  return `You are a senior executive CV writer producing a polished, credible,
professionally positioned CV for a military professional. You are given the
user's supplied information and a prior structured analysis.

${CORE_RULES}

WRITING STANDARDS:
- Professional profile: ~80-130 words, calibrated to seniority. No clichés
  ("dynamic professional", "results-driven", "highly motivated", "passionate",
  "seasoned professional"). Ground every claim in real experience.
- Core competencies: 8-12, each supported by the evidence. No arbitrary soft
  skills or buzzwords.
- Responsibilities describe accountability; achievements describe delivered
  outcomes. Do not disguise responsibilities as achievements, and do not invent
  achievements. If none are supported, leave achievements empty.
- Convert weak descriptions into professional language WITHOUT adding facts.
- Prioritise consequential experience; keep necessary chronology. Do not drop
  important roles without basis.
- Do not populate a section that has no supporting information.

Return ONLY a JSON object matching this StructuredCV shape (omit-by-empty-array
for sections with no content):
{
  "personalDetails": { "fullName", "contactLine", "email"?, "phone"?, "location"?, "linkedin"? },
  "professionalHeadline": string,
  "professionalProfile": string,
  "coreCompetencies": string[],
  "careerExperience": [{ "organisation", "formation"?, "appointment", "rank"?, "location"?, "startDate"?, "endDate"?, "responsibilities": string[], "achievements": string[] }],
  "education": [{ "qualification", "field"?, "institution", "location"?, "year"? }],
  "militaryTraining": [{ "title", "detail"?, "year"? }],
  "professionalCertifications": [{ "title", "detail"?, "year"? }],
  "executiveEducation": [{ "title", "detail"?, "year"? }],
  "boardExperience": [{ "organisation", "role", "dates"?, "points": string[] }],
  "postMilitaryExperience": [{ "organisation", "role", "dates"?, "location"?, "points": string[] }],
  "consultingExperience": [{ "organisation", "role", "dates"?, "location"?, "points": string[] }],
  "internationalAssignments": [{ "organisation", "role", "dates"?, "location"?, "points": string[] }],
  "projects": [{ "organisation", "role", "dates"?, "location"?, "points": string[] }],
  "trainingExperience": [{ "organisation", "role", "dates"?, "location"?, "points": string[] }],
  "publications": [{ "title", "detail"?, "year"? }],
  "speakingEngagements": [{ "title", "detail"?, "year"? }],
  "professionalMemberships": [{ "title", "detail"?, "year"? }],
  "awards": [{ "title", "detail"?, "year"? }],
  "languages": [{ "language", "proficiency"? }],
  "publicSourceSuggestions": [{ "id", "proposed", "source", "rationale" }],
  "qualityFlags": [{ "severity": "info"|"warning", "message" }]
}
No commentary outside the JSON.`;
}

export function auditSystem(): string {
  return `You are a factual auditor for a CV. You receive the user's ORIGINAL
supplied information and a DRAFT structured CV. Your job is to ensure every
factual claim in the draft traces to the supplied information (or a confirmed
public fact). Remove or soften anything unsupported. Never make the CV "more
impressive" by adding detail.

${CORE_RULES}

Check dates, ranks, appointments, organisations, qualifications, achievements,
awards, locations and any metrics. If a metric or outcome is not supported,
remove it. Add a qualityFlag (severity "warning") describing any material
change you made, and (severity "info") for anything the user might strengthen.

Return ONLY the corrected StructuredCV JSON in the SAME shape you received.
No commentary outside the JSON.`;
}

export function qualitySystem(): string {
  return `You are an experienced executive recruiter and military-to-civilian
career adviser performing a final quality pass on a structured CV. Improve
clarity, credibility, seniority positioning, relevance, accomplishment
orientation, readability, concision and ATS compatibility. Remove repetition
and unnecessary jargon. Fix grammar.

${CORE_RULES}

You must NOT add any new facts. You may only rephrase, reorder, tighten and
strengthen wording that is already supported. Preserve all dates, ranks,
organisation names and qualifications exactly.

Return ONLY the improved StructuredCV JSON in the SAME shape. No commentary.`;
}

export function editSystem(): string {
  return `You perform a single targeted edit on one part of a CV. You will be
told the edit action and given the current text (or list) plus factual context
that must be preserved exactly.

${CORE_RULES}

Edit actions:
- improve: strengthen wording and clarity.
- concise: shorten while keeping meaning.
- executive: raise to a more senior, strategic register (only if supported).
- simplify: plainer language.
- regenerate: rewrite fresh while preserving all facts.

You must never alter dates, ranks, organisation names, qualifications or any
other factual field, and never introduce new facts.

Return ONLY JSON:
- For a text field: { "text": string }
- For a list field:  { "items": string[] }
No commentary outside the JSON.`;
}

// --------------------------------------------------------------------------
// Serialise the form into a compact, labelled text block for the model.
// --------------------------------------------------------------------------

function line(label: string, value?: string): string {
  const v = (value || "").trim();
  return v ? `${label}: ${v}` : "";
}

function block(lines: string[]): string {
  return lines.filter(Boolean).join("\n");
}

export function serialiseForm(form: CvFormDataParsed): string {
  const p = form.personal;
  const parts: string[] = [];

  parts.push(
    "=== PERSONAL & PURPOSE ===\n" +
      block([
        line("Full name", p.fullName),
        line("Preferred headline", p.headline),
        line("Email", p.email),
        line("Phone", p.phone),
        line("City", p.city),
        line("Country", p.country),
        line("LinkedIn", p.linkedin),
        line("Military status", p.militaryStatus),
        line("Service branch", p.serviceBranch),
        line("Current/final rank", p.currentOrFinalRank),
        line("Years of service", p.yearsOfService),
        line("Current employer", p.currentEmployer),
        line("CV purpose", p.cvPurpose),
        line("Target role", p.targetRole),
        line("Target organisation", p.targetOrganisation),
        line("Target sector", p.targetSector),
      ])
  );

  if (form.appointments.length) {
    const appts = form.appointments
      .map((a, i) => {
        const dates = [
          [a.startMonth, a.startYear].filter(Boolean).join(" "),
          a.present ? "Present" : [a.endMonth, a.endYear].filter(Boolean).join(" "),
        ]
          .filter(Boolean)
          .join(" – ");
        return block([
          `Appointment ${i + 1}:`,
          line("  Organisation/Service", a.organisation),
          line("  Formation/Unit/Command", a.formation),
          line("  Appointment/Title", a.appointment),
          line("  Rank during appointment", a.rank),
          line("  Location", a.location),
          line("  Dates", dates),
          line("  Responsibilities", a.responsibilities),
          line("  Achievements", a.achievements),
          line("  Leadership scope", a.leadershipScope),
        ]);
      })
      .join("\n\n");
    parts.push("=== PROFESSIONAL / MILITARY EXPERIENCE ===\n" + appts);
  }

  const listBlock = <T>(
    title: string,
    items: T[],
    fmt: (item: T) => string
  ) => {
    if (!items.length) return;
    parts.push(`=== ${title} ===\n` + items.map(fmt).filter(Boolean).join("\n"));
  };

  listBlock("ACADEMIC QUALIFICATIONS", form.academic, (a) =>
    block([
      line("Qualification", a.qualification),
      line("  Field", a.field),
      line("  Institution", a.institution),
      line("  Country", a.country),
      line("  Year", a.year),
    ])
  );
  listBlock("MILITARY COURSES", form.militaryCourses, (c) =>
    block([
      line("Course", c.course),
      line("  Institution", c.institution),
      line("  Country", c.country),
      line("  Year", c.year),
    ])
  );
  listBlock("PROFESSIONAL CERTIFICATIONS", form.certifications, (c) =>
    block([line("Certification", c.certification), line("  Issuer", c.issuer), line("  Year", c.year)])
  );
  listBlock("EXECUTIVE / LEADERSHIP PROGRAMMES", form.executiveProgrammes, (e) =>
    block([
      line("Programme", e.programme),
      line("  Institution", e.institution),
      line("  Country", e.country),
      line("  Year", e.year),
    ])
  );
  listBlock("BOARD & GOVERNANCE EXPERIENCE", form.boardExperience, (b) =>
    block([
      line("Organisation", b.organisation),
      line("  Role", b.role),
      line("  Dates", b.dates),
      line("  Responsibilities", b.responsibilities),
      line("  Achievements", b.achievements),
    ])
  );
  const genericFmt = (g: {
    organisation: string;
    role: string;
    location?: string;
    dates?: string;
    description?: string;
    result?: string;
  }) =>
    block([
      line("Organisation", g.organisation),
      line("  Role", g.role),
      line("  Location", g.location),
      line("  Dates", g.dates),
      line("  Description", g.description),
      line("  Result", g.result),
    ]);
  listBlock("POST-MILITARY EMPLOYMENT", form.postMilitary, genericFmt);
  listBlock("CONSULTING & ADVISORY", form.consulting, genericFmt);
  listBlock("INTERNATIONAL ASSIGNMENTS", form.internationalAssignments, genericFmt);
  listBlock("TRAINING / INSTRUCTIONAL EXPERIENCE", form.trainingExperience, genericFmt);
  listBlock("MAJOR PROJECTS / INITIATIVES", form.projects, (pr) =>
    block([
      line("Project", pr.title),
      line("  Role", pr.role),
      line("  Date", pr.date),
      line("  Description", pr.description),
      line("  Result", pr.result),
    ])
  );
  listBlock("PUBLICATIONS", form.publications, (pb) =>
    block([line("Title", pb.title), line("  Source", pb.source), line("  Year", pb.year), line("  URL", pb.url)])
  );
  listBlock("SPEAKING ENGAGEMENTS", form.speaking, (s) =>
    block([line("Event", s.event), line("  Topic", s.topic), line("  Organisation", s.organisation), line("  Year", s.year)])
  );
  listBlock("PROFESSIONAL MEMBERSHIPS", form.memberships, (m) =>
    block([line("Organisation", m.organisation), line("  Status", m.status)])
  );
  listBlock("AWARDS & DECORATIONS", form.awards, (a) =>
    block([line("Award", a.award), line("  Issuer", a.issuer), line("  Year", a.year)])
  );
  listBlock("LANGUAGES", form.languages, (l) =>
    block([line("Language", l.language), line("  Proficiency", l.proficiency)])
  );

  parts.push(
    "=== PROFESSIONAL POSITIONING (rough notes) ===\n" +
      block([
        line("Best known for", form.positioning.bestKnownFor),
        line("Defining problems/responsibilities", form.positioning.definingProblems),
        line("Pursuing now", form.positioning.pursuingNow),
      ])
  );

  return parts.filter(Boolean).join("\n\n");
}
