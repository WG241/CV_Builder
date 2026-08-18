// ---------------------------------------------------------------------------
// Workforce — AI Assisted CV Drafting
// Central type definitions. These types are the single source of truth shared
// by the form (input), the AI pipeline, the preview/editor, and the PDF/DOCX
// exporters.
// ---------------------------------------------------------------------------

// ---------- Form input types (what the user enters) ------------------------

export type MilitaryStatus = "Serving" | "Retired" | "Veteran" | "Other";

export const CV_PURPOSES = [
  "General Professional CV",
  "Corporate Employment",
  "Executive Leadership",
  "Board Appointment",
  "Government / Public Sector Appointment",
  "Defence / Security Role",
  "Consulting / Advisory",
  "International Organisation",
  "NGO / Development Sector",
  "Academic / Training Role",
  "Other",
] as const;

export type CvPurpose = (typeof CV_PURPOSES)[number];

export interface PersonalInfo {
  fullName: string;
  headline: string; // professional title / preferred headline
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedin?: string;

  militaryStatus: MilitaryStatus;
  serviceBranch: string; // Army / Navy / Air Force / Other — free text to stay country-neutral
  currentOrFinalRank: string;
  yearsOfService: string;
  currentEmployer?: string;

  cvPurpose: CvPurpose;
  targetRole?: string;
  targetOrganisation?: string;
  targetSector?: string;
}

export interface Appointment {
  id: string;
  organisation: string;
  formation?: string; // unit / command
  appointment: string; // job title
  rank?: string;
  location?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  present: boolean;
  responsibilities: string; // free text
  achievements: string; // free text
  leadershipScope?: string; // optional, non-sensitive
}

export interface AcademicQualification {
  id: string;
  qualification: string;
  field?: string;
  institution: string;
  country?: string;
  year?: string;
}

export interface MilitaryCourse {
  id: string;
  course: string;
  institution?: string;
  country?: string;
  year?: string;
}

export interface Certification {
  id: string;
  certification: string;
  issuer?: string;
  year?: string;
}

export interface ExecutiveProgramme {
  id: string;
  programme: string;
  institution?: string;
  country?: string;
  year?: string;
}

export interface BoardExperienceEntry {
  id: string;
  organisation: string;
  role: string;
  dates?: string;
  responsibilities?: string;
  achievements?: string;
}

export interface GenericExperienceEntry {
  id: string;
  organisation: string;
  role: string;
  location?: string;
  dates?: string;
  description?: string;
  result?: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  role?: string;
  date?: string;
  description?: string;
  result?: string;
}

export interface PublicationEntry {
  id: string;
  title: string;
  source?: string;
  year?: string;
  url?: string;
}

export interface SpeakingEntry {
  id: string;
  event: string;
  topic?: string;
  organisation?: string;
  year?: string;
}

export interface MembershipEntry {
  id: string;
  organisation: string;
  status?: string;
}

export interface AwardEntry {
  id: string;
  award: string;
  issuer?: string;
  year?: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency?: string;
}

export interface PositioningInput {
  bestKnownFor: string;
  definingProblems: string;
  pursuingNow: string;
}

export interface ConfirmationInput {
  accurate: boolean;
  noSensitiveInfo: boolean;
  allowResearch: boolean;
}

export interface CvFormData {
  personal: PersonalInfo;
  appointments: Appointment[];
  academic: AcademicQualification[];
  militaryCourses: MilitaryCourse[];
  certifications: Certification[];
  executiveProgrammes: ExecutiveProgramme[];

  // Step 4 — additional, all optional
  boardExperience: BoardExperienceEntry[];
  postMilitary: GenericExperienceEntry[];
  consulting: GenericExperienceEntry[];
  internationalAssignments: GenericExperienceEntry[];
  projects: ProjectEntry[];
  trainingExperience: GenericExperienceEntry[];
  publications: PublicationEntry[];
  speaking: SpeakingEntry[];
  memberships: MembershipEntry[];
  awards: AwardEntry[];
  languages: LanguageEntry[];

  positioning: PositioningInput;
  confirmation: ConfirmationInput;
}

// ---------- Structured CV output (what the AI produces) --------------------

export interface CvPersonalDetails {
  fullName: string;
  contactLine: string; // "email · phone · city, country"
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
}

export interface CvExperienceItem {
  organisation: string;
  formation?: string;
  appointment: string;
  rank?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  responsibilities: string[];
  achievements: string[];
}

export interface CvEducationItem {
  qualification: string;
  field?: string;
  institution: string;
  location?: string;
  year?: string;
}

export interface CvSimpleEntry {
  title: string;
  detail?: string;
  year?: string;
}

export interface CvBoardItem {
  organisation: string;
  role: string;
  dates?: string;
  points: string[];
}

export interface CvGenericItem {
  organisation: string;
  role: string;
  dates?: string;
  location?: string;
  points: string[];
}

export interface CvLanguageItem {
  language: string;
  proficiency?: string;
}

export interface PublicSourceSuggestion {
  id: string;
  proposed: string;
  source: string;
  rationale: string;
}

export interface QualityFlag {
  severity: "info" | "warning";
  message: string;
}

export interface StructuredCV {
  personalDetails: CvPersonalDetails;
  professionalHeadline: string;
  professionalProfile: string;
  coreCompetencies: string[];
  careerExperience: CvExperienceItem[];
  education: CvEducationItem[];
  militaryTraining: CvSimpleEntry[];
  professionalCertifications: CvSimpleEntry[];
  executiveEducation: CvSimpleEntry[];
  boardExperience: CvBoardItem[];
  postMilitaryExperience: CvGenericItem[];
  consultingExperience: CvGenericItem[];
  internationalAssignments: CvGenericItem[];
  projects: CvGenericItem[];
  trainingExperience: CvGenericItem[];
  publications: CvSimpleEntry[];
  speakingEngagements: CvSimpleEntry[];
  professionalMemberships: CvSimpleEntry[];
  awards: CvSimpleEntry[];
  languages: CvLanguageItem[];
  publicSourceSuggestions: PublicSourceSuggestion[];
  qualityFlags: QualityFlag[];
}

// ---------- Stage A analysis output ----------------------------------------

export interface CareerAnalysis {
  seniorityLevel: "junior" | "mid" | "senior" | "executive";
  seniorityRationale: string;
  careerThemes: string[];
  candidateCompetencies: string[];
  facts: string[];
  interpretations: string[];
  missingEvidence: string[];
  terminologyToClarify: string[];
}

// ---------- Stage B research output ----------------------------------------

export interface ResearchResult {
  terminologyClarifications: { term: string; clarification: string }[];
  publicSourceSuggestions: PublicSourceSuggestion[];
  notes: string[];
}

// ---------- Editing --------------------------------------------------------

export const EDIT_ACTIONS = [
  "improve",
  "concise",
  "executive",
  "simplify",
  "regenerate",
] as const;

export type EditAction = (typeof EDIT_ACTIONS)[number];

export const EDIT_FIELDS = [
  "professionalHeadline",
  "professionalProfile",
  "coreCompetencies",
  "responsibilities",
  "achievements",
] as const;

export type EditField = (typeof EDIT_FIELDS)[number];
