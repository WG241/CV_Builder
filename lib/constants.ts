// ---------------------------------------------------------------------------
// Shared constants — models, limits, workflow allow-list.
// ---------------------------------------------------------------------------

export const MODEL_HEAVY = process.env.OPENAI_MODEL_HEAVY || "gpt-4o";
export const MODEL_LIGHT = process.env.OPENAI_MODEL_LIGHT || "gpt-4o-mini";

// Maximum accepted request body size (characters of JSON), a coarse guard on
// abuse and cost. Applied in the API routes before any model call.
export const MAX_BODY_CHARS = 120_000;

// Per-field input caps enforced by the Zod schema.
export const LIMITS = {
  shortText: 200,
  mediumText: 2_000,
  longText: 6_000,
  maxAppointments: 40,
  maxListItems: 60,
} as const;

// The only workflows the AI endpoints will service. This prevents the API from
// being used as a general LLM proxy.
export const ALLOWED_WORKFLOWS = [
  "analyze",
  "research",
  "generate",
  "edit",
] as const;

export type Workflow = (typeof ALLOWED_WORKFLOWS)[number];

// Rate limiting defaults (overridable via env).
export const RATE_LIMIT_GENERATIONS_PER_HOUR = Number(
  process.env.RATE_LIMIT_GENERATIONS_PER_HOUR || 8
);
export const RATE_LIMIT_REQUESTS_PER_MINUTE = Number(
  process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || 20
);

export const BRAND = {
  name: "Workforce",
  product: "AI Assisted CV Drafting",
} as const;
