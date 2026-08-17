// Validates every fictional profile against the production form schema.
// Run: npx tsx tests/validate-profiles.mts
import { cvFormDataSchema } from "../lib/schemas";
import { ALL_PROFILES } from "./fixtures/profiles";

let failures = 0;

for (const { key, label, data } of ALL_PROFILES) {
  const result = cvFormDataSchema.safeParse(data);
  if (result.success) {
    console.log(`  ✓ Profile ${key} — ${label}`);
  } else {
    failures++;
    console.error(`  ✗ Profile ${key} — ${label}`);
    for (const issue of result.error.issues) {
      console.error(`      ${issue.path.join(".")}: ${issue.message}`);
    }
  }
}

console.log("");
if (failures === 0) {
  console.log(`All ${ALL_PROFILES.length} profiles are valid against the production schema.`);
  process.exit(0);
} else {
  console.error(`${failures} profile(s) failed validation.`);
  process.exit(1);
}
