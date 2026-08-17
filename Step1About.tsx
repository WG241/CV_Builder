"use client";
import { CV_PURPOSES } from "@/lib/types";
import { SelectField, TextField } from "@/components/Field";
import { StepShell } from "@/components/Wizard";
import { SecurityNotice } from "@/components/SecurityNotice";
import { updatePersonal, type StepProps } from "./helpers";

const STATUS = ["Serving", "Retired", "Veteran", "Other"] as const;

export function Step1About({ form, setForm }: StepProps) {
  const p = form.personal;
  const set = <K extends keyof typeof p>(k: K, v: (typeof p)[K]) =>
    updatePersonal(setForm, k, v);

  return (
    <StepShell
      title="About you"
      intro="Contact details and the kind of opportunity you are preparing this CV for. This shapes emphasis — never the facts of your career."
    >
      <div className="card p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-brand">Personal information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Full name" value={p.fullName} onChange={(v) => set("fullName", v)} autoComplete="name" />
          <TextField label="Professional title / preferred headline" optional value={p.headline} onChange={(v) => set("headline", v)} placeholder="e.g. Security &amp; Operations Leader" />
          <TextField label="Email address" type="email" value={p.email} onChange={(v) => set("email", v)} autoComplete="email" />
          <TextField label="Telephone number" value={p.phone} onChange={(v) => set("phone", v)} autoComplete="tel" />
          <TextField label="City / State" value={p.city} onChange={(v) => set("city", v)} />
          <TextField label="Country" value={p.country} onChange={(v) => set("country", v)} />
          <TextField label="LinkedIn profile URL" optional value={p.linkedin ?? ""} onChange={(v) => set("linkedin", v)} placeholder="https://linkedin.com/in/…" />
        </div>
        <p className="field-hint mt-3">
          Do not enter your home address, service number, national ID, passport
          number, family or security-clearance information.
        </p>
      </div>

      <div className="card p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-brand">Service &amp; career</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Military status" value={p.militaryStatus} onChange={(v) => set("militaryStatus", v as typeof p.militaryStatus)} options={STATUS} />
          <TextField label="Service branch" value={p.serviceBranch} onChange={(v) => set("serviceBranch", v)} placeholder="Army / Navy / Air Force / Other" hint="Free text — works for any country's forces." />
          <TextField label="Current or final rank" value={p.currentOrFinalRank} onChange={(v) => set("currentOrFinalRank", v)} />
          <TextField label="Approximate years of service" value={p.yearsOfService} onChange={(v) => set("yearsOfService", v)} placeholder="e.g. 18" />
          <TextField label="Current organisation / employer" optional value={p.currentEmployer ?? ""} onChange={(v) => set("currentEmployer", v)} />
        </div>
      </div>

      <div className="card p-4 sm:p-5">
        <h3 className="mb-3 text-sm font-semibold text-brand">CV purpose</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="What are you preparing this CV for?" value={p.cvPurpose} onChange={(v) => set("cvPurpose", v as typeof p.cvPurpose)} options={CV_PURPOSES} />
          <TextField label="Target role / title" optional value={p.targetRole ?? ""} onChange={(v) => set("targetRole", v)} />
          <TextField label="Target organisation" optional value={p.targetOrganisation ?? ""} onChange={(v) => set("targetOrganisation", v)} />
          <TextField label="Target sector" optional value={p.targetSector ?? ""} onChange={(v) => set("targetSector", v)} />
        </div>
      </div>

      <SecurityNotice />
    </StepShell>
  );
}
