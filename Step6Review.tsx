"use client";
import { CheckboxField } from "@/components/Field";
import { StepShell } from "@/components/Wizard";
import { SecurityNotice } from "@/components/SecurityNotice";
import type { StepProps } from "./helpers";

function Summary({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}

export function Step6Review({ form, setForm }: StepProps) {
  const p = form.personal;
  const set = (k: keyof typeof form.confirmation, v: boolean) =>
    setForm((f) => ({ ...f, confirmation: { ...f.confirmation, [k]: v } }));

  const counts: [string, number][] = [
    ["Appointments", form.appointments.length],
    ["Academic qualifications", form.academic.length],
    ["Military courses", form.militaryCourses.length],
    ["Certifications", form.certifications.length],
    ["Executive programmes", form.executiveProgrammes.length],
    ["Board roles", form.boardExperience.length],
    ["Post-military roles", form.postMilitary.length],
    ["Consulting", form.consulting.length],
    ["International assignments", form.internationalAssignments.length],
    ["Projects", form.projects.length],
    ["Training experience", form.trainingExperience.length],
    ["Publications", form.publications.length],
    ["Speaking", form.speaking.length],
    ["Memberships", form.memberships.length],
    ["Awards", form.awards.length],
    ["Languages", form.languages.length],
  ];

  return (
    <StepShell
      title="Review & generate"
      intro="Check your information below. You can go back to any step to edit, add, remove or reorder. Nothing is sent for generation until you confirm."
    >
      <div className="card p-4 sm:p-5">
        <h3 className="mb-2 text-sm font-semibold text-brand">About you</h3>
        <Summary label="Full name" value={p.fullName} />
        <Summary label="Headline" value={p.headline} />
        <Summary label="Email" value={p.email} />
        <Summary label="Phone" value={p.phone} />
        <Summary label="Location" value={[p.city, p.country].filter(Boolean).join(", ")} />
        <Summary label="Status" value={p.militaryStatus} />
        <Summary label="Branch" value={p.serviceBranch} />
        <Summary label="Rank" value={p.currentOrFinalRank} />
        <Summary label="Years of service" value={p.yearsOfService} />
        <Summary label="CV purpose" value={p.cvPurpose} />
        <Summary label="Target role" value={p.targetRole ?? ""} />
      </div>

      <div className="card p-4 sm:p-5">
        <h3 className="mb-2 text-sm font-semibold text-brand">What you have added</h3>
        <div className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
          {counts
            .filter(([, n]) => n > 0)
            .map(([label, n]) => (
              <div key={label} className="flex justify-between py-1 text-sm">
                <span className="text-ink-muted">{label}</span>
                <span className="font-semibold text-brand">{n}</span>
              </div>
            ))}
        </div>
        {counts.every(([, n]) => n === 0) && (
          <p className="text-sm text-ink-muted">
            You have not added any career sections yet. Go back and add at least
            your career history for a meaningful CV.
          </p>
        )}
      </div>

      <SecurityNotice />

      <div className="card space-y-4 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-brand">Confirm before generating</h3>
        <CheckboxField
          label="I confirm that the information provided is accurate to the best of my knowledge."
          checked={form.confirmation.accurate}
          onChange={(v) => set("accurate", v)}
        />
        <CheckboxField
          label="I confirm that I have not entered classified, restricted or operationally sensitive information."
          checked={form.confirmation.noSensitiveInfo}
          onChange={(v) => set("noSensitiveInfo", v)}
        />
        <CheckboxField
          label="Allow AI to use public web research where necessary to clarify terminology or publicly available professional context."
          hint="Optional. Research never inserts individual facts about you automatically — you confirm each suggestion."
          checked={form.confirmation.allowResearch}
          onChange={(v) => set("allowResearch", v)}
        />
      </div>
    </StepShell>
  );
}
