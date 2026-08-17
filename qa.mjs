// ---------------------------------------------------------------------------
// Browser QA of the non-AI journey (landing -> wizard -> review gating -> clear).
// Requires a running server (default http://localhost:3100, override with
// QA_BASE) and Playwright installed (npm i -D playwright, or use the system
// Chromium). AI generation is NOT exercised here (no key by design); verify
// live AI output manually after deployment.
//
// Run: QA_BASE=http://localhost:3000 node tests/qa.mjs
// ---------------------------------------------------------------------------

import { mkdir } from "node:fs/promises";

const BASE = process.env.QA_BASE || "http://localhost:3100";
const OUT = new URL("./output/", import.meta.url);

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error(
    "Playwright is not installed. Install it with `npm i -D playwright` " +
      "(Chromium is pre-provided in the web environment). Skipping browser QA."
  );
  process.exit(0);
}

await mkdir(OUT, { recursive: true });

const launchOpts = {};
// Allow pointing at a pre-installed Chromium (e.g. in CI / the web environment)
// to avoid a version-pinned browser download.
if (process.env.QA_CHROMIUM_PATH) {
  launchOpts.executablePath = process.env.QA_CHROMIUM_PATH;
}

const browser = await chromium.launch(launchOpts);
let failures = 0;

async function check(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failures++;
    console.error(`  ✗ ${name}: ${err.message}`);
  }
}

async function run(viewport, tag) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();

  await check(`[${tag}] landing loads with primary CTA`, async () => {
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.getByText("AI Assisted CV Drafting").first().waitFor({ timeout: 10000 });
    await page.getByRole("link", { name: "Start My CV" }).first().waitFor();
    await page.screenshot({ path: new URL(`landing-${tag}.png`, OUT).pathname, fullPage: true });
  });

  await check(`[${tag}] wizard step 1 renders`, async () => {
    await page.getByRole("link", { name: "Start My CV" }).first().click();
    await page.waitForURL("**/create");
    await page.getByText("About you").first().waitFor({ timeout: 10000 });
  });

  await check(`[${tag}] can enter name and advance`, async () => {
    await page.getByLabel("Full name").fill("Test Fictional Officer");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByText("Career history").first().waitFor({ timeout: 10000 });
  });

  await check(`[${tag}] draft persists across reload`, async () => {
    // The store persists on a short debounce; wait for it to flush.
    await page.waitForFunction(
      () => {
        const v = window.localStorage.getItem("workforce-cv:form");
        return !!v && v.includes("Test Fictional Officer");
      },
      { timeout: 5000 }
    );
    await page.reload({ waitUntil: "networkidle" });
    // Navigate back to step 1 to confirm the name survived localStorage.
    // (Reload keeps us on /create; the store rehydrates the saved name.)
    const stored = await page.evaluate(() => window.localStorage.getItem("workforce-cv:form"));
    if (!stored || !stored.includes("Test Fictional Officer")) {
      throw new Error("form draft was not persisted to localStorage");
    }
  });

  await check(`[${tag}] review redirects to create when no CV`, async () => {
    await page.goto(`${BASE}/review`, { waitUntil: "networkidle" });
    await page.waitForURL("**/create", { timeout: 10000 });
  });

  await check(`[${tag}] clear information empties the draft`, async () => {
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "Clear My Information" }).click();
    await page.waitForTimeout(300);
    const stored = await page.evaluate(() => window.localStorage.getItem("workforce-cv:form"));
    if (stored && stored.includes("Test Fictional Officer")) {
      throw new Error("draft was not cleared");
    }
  });

  await context.close();
}

console.log(`Running browser QA against ${BASE}`);
await run({ width: 1280, height: 900 }, "desktop");
await run({ width: 390, height: 844 }, "mobile");

await browser.close();

console.log("");
if (failures === 0) {
  console.log("Browser QA passed. Screenshots saved to tests/output/.");
  process.exit(0);
} else {
  console.error(`${failures} browser QA check(s) failed.`);
  process.exit(1);
}
