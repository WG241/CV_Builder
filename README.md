# Workforce — AI Assisted CV Drafting

Turn military experience into a professionally written, credible CV. A frictionless,
transactional web app for serving and retired military professionals: **no registration,
no login, no accounts, no database**. Enter your career information, let AI organise,
strengthen and translate it (without fabricating anything), review and edit, then download
a professional **PDF** and an editable **Word** document.

Built with Next.js (App Router), TypeScript, React, Tailwind CSS and the OpenAI API.
Designed for deployment on Vercel.

---

## 1. Quick start (local)

```bash
npm install
cp .env.example .env.local        # then edit .env.local and add your key
# OPENAI_API_KEY=sk-...
npm run dev                       # http://localhost:3000
```

Production build:

```bash
npm run build && npm run start
```

Quality gates:

```bash
npm run lint          # ESLint (next/core-web-vitals)
npm run typecheck     # tsc --noEmit
npm run build         # production build
npx tsx tests/validate-profiles.mts   # validate the 10 fictional QA profiles
# Optional browser QA (needs Playwright + a running server):
#   npm i -D playwright && npx playwright install chromium
#   QA_BASE=http://localhost:3000 node tests/qa.mjs
# In a pre-provisioned environment, point at the system Chromium instead:
#   QA_CHROMIUM_PATH=/path/to/chrome QA_BASE=... node tests/qa.mjs
```

---

## 2. Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | **Yes** | Server-side only. Read exclusively inside `app/api/*`. Never exposed to the browser, never committed to Git. |
| `OPENAI_MODEL_HEAVY` | No | Override the drafting / quality-review model. Default `gpt-4o`. |
| `OPENAI_MODEL_LIGHT` | No | Override the analysis / audit / edit model. Default `gpt-4o-mini`. |
| `RATE_LIMIT_GENERATIONS_PER_HOUR` | No | Per-IP full-generation cap. Default `8`. |
| `RATE_LIMIT_REQUESTS_PER_MINUTE` | No | Per-IP request cap across AI endpoints. Default `20`. |

Set these in **Vercel → Project → Settings → Environment Variables** for the Production and
Preview environments. Do **not** commit `.env.local`.

---

## 3. Architecture

```
Landing (/)  →  Wizard (/create, 6 steps)  →  Review/Edit (/review)  →  Download PDF / Word
```

- **Frontend** — App Router pages. All CV data lives only in React state and `localStorage`
  (`workforce-cv:*` keys). A "Clear My Information" control wipes everything on the device.
- **API routes** (`app/api/*`, Node runtime, server-only):
  - `analyze` — Stage A career analysis (seniority, themes, facts vs. interpretation vs. missing).
  - `research` — Stage B **controlled** public web research (opt-in only). Returns terminology
    clarifications and *confirm-first* public-source suggestions — never auto-inserted.
  - `generate` — draft → factual audit → quality review → validated structured CV object.
  - `edit` — targeted, **fact-preserving** rewrites (improve / concise / executive / simplify / regenerate).
- **Staged AI pipeline** (`lib/ai/*`): discrete structured OpenAI calls, hybrid model strategy,
  strict JSON output normalised into a type-safe `StructuredCV` that drives preview, editing, PDF
  and DOCX from one source of truth.
- **Exports** (`lib/export/*`): PDF via `pdfmake` (real selectable text, A4, ATS-friendly) and
  DOCX via `docx` (genuinely editable). Both mirror the on-screen template.
- **Security** (`lib/schemas.ts`, `lib/sanitize.ts`, `lib/ratelimit.ts`): Zod validation, max
  input sizes, request sanitisation, per-IP rate limiting, workflow allow-list (the endpoints
  accept only the defined CV workflows — not a general LLM proxy), and security headers.

---

## 4. Deploy to Vercel

1. Push this repository to GitHub.
2. In Vercel, **Add New… → Project** and import the GitHub repo (framework auto-detected as Next.js).
3. Add the `OPENAI_API_KEY` environment variable (and any optional overrides).
4. Deploy a **Preview** first. Test the full fictional journey (landing → wizard → generate →
   edit → PDF → DOCX) and inspect the build & runtime logs.
5. Promote to **Production** only after the preview passes.

### Important: function duration & plan

The `generate` route runs several sequential model calls and sets `maxDuration = 300`.
On **Vercel Hobby**, serverless functions are capped at **60 seconds**, which can be tight for
long careers using the `gpt-4o` drafting model. Options:
- Use a **Vercel Pro** plan (recommended) so the 300s limit applies; or
- Set `OPENAI_MODEL_HEAVY=gpt-4o-mini` to run the whole pipeline on the lighter model, which is
  faster and comfortably fits within 60s (with a modest quality trade-off).

---

## 5. Non-negotiable product rules (enforced in prompts & code)

1. Never fabricate career information.
2. Never silently insert researched individual-specific facts — the user confirms each one.
3. Never encourage entry of classified / restricted / sensitive information.
4. Never expose the OpenAI API key (server-side only).
5. No database or accounts.
6. Substance over decoration.
7. Output suitable for genuine professional use.
8. AI improves how facts are presented, not the facts themselves.
9. Military experience translated intelligently, not stripped of significance.
10. The user is the final authority over their career information.

---

## 6. Privacy & security summary

- Workforce keeps **no** user accounts and **no** database of generated CVs.
- While you work, a draft is stored in your browser's `localStorage` on your device only.
- To generate/refine the CV, submitted information is sent **temporarily** to a third-party AI
  provider (OpenAI) for processing. The app does not claim data never leaves your device.
- Server logs record only error messages, never full CV content.

---

## 7. Testing

- `tests/fixtures/profiles.ts` — 10 entirely fictional profiles (A–J) spanning junior officer
  to retired general, board seekers, poor input and inconsistent dates.
- `tests/validate-profiles.mts` — validates every profile against the production schema.
- `tests/qa.mjs` — Playwright browser QA of the non-AI journey (landing, wizard, preview, edit,
  PDF & DOCX download, mobile), with screenshots to `tests/output/`.
- **Live AI quality** should be verified after deployment (once `OPENAI_API_KEY` is set) by
  running the fictional profiles through the app and inspecting the generated CVs.

---

## 8. Known limitations

- Rate limiting is in-memory (per serverless instance); for hard global limits, back it with a
  shared store (e.g. Vercel KV / Upstash Redis).
- Live AI output was not exercised in the build environment (no key by design); verify post-deploy.
- One primary executive template is provided (by design — one strong template, not several mediocre ones).
- Transitive `sharp`/`libvips` advisories exist via Next's image optimisation; the app processes
  no user images, so this is outside its attack surface.
