// ---------------------------------------------------------------------------
// Zod validation schemas. Used by the API routes to validate inbound payloads
// and by the tests to validate that the structured CV object is well formed.
// ---------------------------------------------------------------------------

import { z } from "zod";
import { CV_PURPOSES, EDIT_ACTIONS, EDIT_FIELDS } from "./types";
import { LIMITS } from "./constants";

const short = z.string().max(LIMITS.shortText);
const medium = z.string().max(LIMITS.mediumText);
const long = z.string().max(LIMITS.longText);

// ---------- Form input ------------------------------------------------------

export const personalSchema = z.object({
  fullName: short.min(1),
  headline: short.optional().default(""),
  email: short.optional().default(""),
  phone: short.optional().default(""),
  city: short.optional().default(""),
  country: short.optional().default(""),
  linkedin: short.optional().default(""),
  militaryStatus: z.enum(["Serving", "Retired", "Veteran", "Other"]),
  serviceBranch: short.optional().default(""),
  currentOrFinalRank: short.optional().default(""),
  yearsOfService: short.optional().default(""),
  currentEmployer: short.optional().default(""),
  cvPurpose: z.enum(CV_PURPOSES),
  targetRole: short.optional().default(""),
  targetOrganisation: short.optional().default(""),
  targetSector: short.optional().default(""),
});

export const appointmentSchema = z.object({
  id: short,
  organisation: short.optional().default(""),
  formation: short.optional().default(""),
  appointment: short.optional().default(""),
  rank: short.optional().default(""),
  location: short.optional().default(""),
  startMonth: short.optional().default(""),
  startYear: short.optional().default(""),
  endMonth: short.optional().default(""),
  endYear: short.optional().default(""),
  present: z.boolean().default(false),
  responsibilities: long.optional().default(""),
  achievements: long.optional().default(""),
  leadershipScope: medium.optional().default(""),
});

const academicSchema = z.object({
  id: short,
  qualification: short.optional().default(""),
  field: short.optional().default(""),
  institution: short.optional().default(""),
  country: short.optional().default(""),
  year: short.optional().default(""),
});

const courseSchema = z.object({
  id: short,
  course: short.optional().default(""),
  institution: short.optional().default(""),
  country: short.optional().default(""),
  year: short.optional().default(""),
});

const certSchema = z.object({
  id: short,
  certification: short.optional().default(""),
  issuer: short.optional().default(""),
  year: short.optional().default(""),
});

const execProgSchema = z.object({
  id: short,
  programme: short.optional().default(""),
  institution: short.optional().default(""),
  country: short.optional().default(""),
  year: short.optional().default(""),
});

const boardSchema = z.object({
  id: short,
  organisation: short.optional().default(""),
  role: short.optional().default(""),
  dates: short.optional().default(""),
  responsibilities: long.optional().default(""),
  achievements: long.optional().default(""),
});

const genericExpSchema = z.object({
  id: short,
  organisation: short.optional().default(""),
  role: short.optional().default(""),
  location: short.optional().default(""),
  dates: short.optional().default(""),
  description: long.optional().default(""),
  result: medium.optional().default(""),
});

const projectSchema = z.object({
  id: short,
  title: short.optional().default(""),
  role: short.optional().default(""),
  date: short.optional().default(""),
  description: long.optional().default(""),
  result: medium.optional().default(""),
});

const publicationSchema = z.object({
  id: short,
  title: short.optional().default(""),
  source: short.optional().default(""),
  year: short.optional().default(""),
  url: short.optional().default(""),
});

const speakingSchema = z.object({
  id: short,
  event: short.optional().default(""),
  topic: short.optional().default(""),
  organisation: short.optional().default(""),
  year: short.optional().default(""),
});

const membershipSchema = z.object({
  id: short,
  organisation: short.optional().default(""),
  status: short.optional().default(""),
});

const awardSchema = z.object({
  id: short,
  award: short.optional().default(""),
  issuer: short.optional().default(""),
  year: short.optional().default(""),
});

const languageSchema = z.object({
  id: short,
  language: short.optional().default(""),
  proficiency: short.optional().default(""),
});

const positioningSchema = z.object({
  bestKnownFor: medium.optional().default(""),
  definingProblems: medium.optional().default(""),
  pursuingNow: medium.optional().default(""),
});

const confirmationSchema = z.object({
  accurate: z.boolean().default(false),
  noSensitiveInfo: z.boolean().default(false),
  allowResearch: z.boolean().default(false),
});

const cap = <T extends z.ZodTypeAny>(schema: T, max: number) =>
  z.array(schema).max(max).default([]);

export const cvFormDataSchema = z.object({
  personal: personalSchema,
  appointments: cap(appointmentSchema, LIMITS.maxAppointments),
  academic: cap(academicSchema, LIMITS.maxListItems),
  militaryCourses: cap(courseSchema, LIMITS.maxListItems),
  certifications: cap(certSchema, LIMITS.maxListItems),
  executiveProgrammes: cap(execProgSchema, LIMITS.maxListItems),
  boardExperience: cap(boardSchema, LIMITS.maxListItems),
  postMilitary: cap(genericExpSchema, LIMITS.maxListItems),
  consulting: cap(genericExpSchema, LIMITS.maxListItems),
  internationalAssignments: cap(genericExpSchema, LIMITS.maxListItems),
  projects: cap(projectSchema, LIMITS.maxListItems),
  trainingExperience: cap(genericExpSchema, LIMITS.maxListItems),
  publications: cap(publicationSchema, LIMITS.maxListItems),
  speaking: cap(speakingSchema, LIMITS.maxListItems),
  memberships: cap(membershipSchema, LIMITS.maxListItems),
  awards: cap(awardSchema, LIMITS.maxListItems),
  languages: cap(languageSchema, LIMITS.maxListItems),
  positioning: positioningSchema,
  confirmation: confirmationSchema,
});

// ---------- Request payloads ------------------------------------------------

export const analyzeRequestSchema = z.object({
  workflow: z.literal("analyze"),
  form: cvFormDataSchema,
});

export const researchRequestSchema = z.object({
  workflow: z.literal("research"),
  form: cvFormDataSchema,
});

export const generateRequestSchema = z.object({
  workflow: z.literal("generate"),
  form: cvFormDataSchema,
  confirmedSuggestionIds: z.array(short).max(50).default([]),
});

export const editRequestSchema = z.object({
  workflow: z.literal("edit"),
  action: z.enum(EDIT_ACTIONS),
  field: z.enum(EDIT_FIELDS),
  // The current text (or list) to be rewritten.
  text: z.union([long, z.array(medium).max(30)]),
  // Non-editable factual context the model must preserve (never alter).
  factContext: medium.optional().default(""),
});

// ---------- Structured CV (output validation) -------------------------------

const cvExperienceItemSchema = z.object({
  organisation: z.string(),
  formation: z.string().optional(),
  appointment: z.string(),
  rank: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
});

const simpleEntrySchema = z.object({
  title: z.string(),
  detail: z.string().optional(),
  year: z.string().optional(),
});

const boardItemSchema = z.object({
  organisation: z.string(),
  role: z.string(),
  dates: z.string().optional(),
  points: z.array(z.string()).default([]),
});

const genericItemSchema = z.object({
  organisation: z.string(),
  role: z.string(),
  dates: z.string().optional(),
  location: z.string().optional(),
  points: z.array(z.string()).default([]),
});

export const structuredCvSchema = z.object({
  personalDetails: z.object({
    fullName: z.string(),
    contactLine: z.string().default(""),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
  }),
  professionalHeadline: z.string().default(""),
  professionalProfile: z.string().default(""),
  coreCompetencies: z.array(z.string()).default([]),
  careerExperience: z.array(cvExperienceItemSchema).default([]),
  education: z
    .array(
      z.object({
        qualification: z.string(),
        field: z.string().optional(),
        institution: z.string(),
        location: z.string().optional(),
        year: z.string().optional(),
      })
    )
    .default([]),
  militaryTraining: z.array(simpleEntrySchema).default([]),
  professionalCertifications: z.array(simpleEntrySchema).default([]),
  executiveEducation: z.array(simpleEntrySchema).default([]),
  boardExperience: z.array(boardItemSchema).default([]),
  postMilitaryExperience: z.array(genericItemSchema).default([]),
  consultingExperience: z.array(genericItemSchema).default([]),
  internationalAssignments: z.array(genericItemSchema).default([]),
  projects: z.array(genericItemSchema).default([]),
  trainingExperience: z.array(genericItemSchema).default([]),
  publications: z.array(simpleEntrySchema).default([]),
  speakingEngagements: z.array(simpleEntrySchema).default([]),
  professionalMemberships: z.array(simpleEntrySchema).default([]),
  awards: z.array(simpleEntrySchema).default([]),
  languages: z
    .array(z.object({ language: z.string(), proficiency: z.string().optional() }))
    .default([]),
  publicSourceSuggestions: z
    .array(
      z.object({
        id: z.string(),
        proposed: z.string(),
        source: z.string(),
        rationale: z.string(),
      })
    )
    .default([]),
  qualityFlags: z
    .array(
      z.object({
        severity: z.enum(["info", "warning"]),
        message: z.string(),
      })
    )
    .default([]),
});

// ---------- Stage A analysis (output validation) ----------------------------

export const careerAnalysisSchema = z.object({
  seniorityLevel: z.enum(["junior", "mid", "senior", "executive"]),
  seniorityRationale: z.string().default(""),
  careerThemes: z.array(z.string()).default([]),
  candidateCompetencies: z.array(z.string()).default([]),
  facts: z.array(z.string()).default([]),
  interpretations: z.array(z.string()).default([]),
  missingEvidence: z.array(z.string()).default([]),
  terminologyToClarify: z.array(z.string()).default([]),
});

export const researchResultSchema = z.object({
  terminologyClarifications: z
    .array(z.object({ term: z.string(), clarification: z.string() }))
    .default([]),
  publicSourceSuggestions: z
    .array(
      z.object({
        id: z.string(),
        proposed: z.string(),
        source: z.string(),
        rationale: z.string(),
      })
    )
    .default([]),
  notes: z.array(z.string()).default([]),
});

export type CvFormDataParsed = z.infer<typeof cvFormDataSchema>;
