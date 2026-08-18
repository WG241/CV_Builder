"use client";
import { CheckboxField, TextArea, TextField } from "@/components/Field";
import { AddButton, RepeatableCard, StepShell } from "@/components/Wizard";
import { emptyAppointment } from "@/lib/store";
import { addItem, removeItem, updateItem, moveItem, type StepProps } from "./helpers";

const RESP_HINT =
  "Consider: leadership, operations, administration, strategy, planning, training, personnel, logistics, risk, security, stakeholder coordination, policy, projects, resources.";
const ACH_HINT =
  "Responsibilities describe what you were accountable for. Achievements describe what happened because of your contribution — e.g. programme delivered, standards improved, capability developed, process improved. If you cannot identify one, leave it blank.";

export function Step2Career({ form, setForm }: StepProps) {
  return (
    <StepShell
      title="Career history"
      intro="Add each appointment you want considered. You can add as many as you like and reorder them. The AI prioritises the most consequential experience when drafting."
    >
      {form.appointments.length === 0 && (
        <p className="rounded-lg border border-dashed border-line bg-white px-4 py-6 text-center text-sm text-ink-muted">
          No appointments yet. Add your first role below.
        </p>
      )}

      {form.appointments.map((a, i) => (
        <RepeatableCard
          key={a.id}
          title={`Appointment ${i + 1}`}
          onRemove={() => removeItem(setForm, "appointments", i)}
        >
          <div className="flex gap-2">
            <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => moveItem(setForm, "appointments", i, -1)} disabled={i === 0}>
              ↑ Move up
            </button>
            <button type="button" className="btn-ghost px-2 py-1 text-xs" onClick={() => moveItem(setForm, "appointments", i, 1)} disabled={i === form.appointments.length - 1}>
              ↓ Move down
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Organisation / Military Service" value={a.organisation} onChange={(v) => updateItem(setForm, "appointments", i, { organisation: v })} />
            <TextField label="Formation / Unit / Command" optional value={a.formation ?? ""} onChange={(v) => updateItem(setForm, "appointments", i, { formation: v })} />
            <TextField label="Appointment / Job title" value={a.appointment} onChange={(v) => updateItem(setForm, "appointments", i, { appointment: v })} />
            <TextField label="Rank during appointment" optional value={a.rank ?? ""} onChange={(v) => updateItem(setForm, "appointments", i, { rank: v })} />
            <TextField label="Location" optional value={a.location ?? ""} onChange={(v) => updateItem(setForm, "appointments", i, { location: v })} />
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <TextField label="Start month" optional value={a.startMonth ?? ""} onChange={(v) => updateItem(setForm, "appointments", i, { startMonth: v })} placeholder="e.g. Jan" />
            <TextField label="Start year" optional value={a.startYear ?? ""} onChange={(v) => updateItem(setForm, "appointments", i, { startYear: v })} placeholder="e.g. 2015" />
            <TextField label="End month" optional value={a.endMonth ?? ""} onChange={(v) => updateItem(setForm, "appointments", i, { endMonth: v })} />
            <TextField label="End year" optional value={a.endYear ?? ""} onChange={(v) => updateItem(setForm, "appointments", i, { endYear: v })} />
          </div>
          <CheckboxField label="I currently hold this appointment" checked={a.present} onChange={(v) => updateItem(setForm, "appointments", i, { present: v })} />

          <TextArea label="Main responsibilities" hint={RESP_HINT} rows={4} value={a.responsibilities} onChange={(v) => updateItem(setForm, "appointments", i, { responsibilities: v })} placeholder="What were you responsible for in this role?" />
          <TextArea label="Major achievements" optional hint={ACH_HINT} rows={4} value={a.achievements} onChange={(v) => updateItem(setForm, "appointments", i, { achievements: v })} placeholder="What did you accomplish, improve, deliver or change?" />
          <TextArea label="Leadership scope" optional hint="If appropriate and non-sensitive: team size, geographic coverage, type of organisation, operational scope, or budget responsibility. Only include what you are comfortable putting in a public CV." rows={2} value={a.leadershipScope ?? ""} onChange={(v) => updateItem(setForm, "appointments", i, { leadershipScope: v })} />
        </RepeatableCard>
      ))}

      <AddButton label="Add an appointment" onClick={() => addItem(setForm, "appointments", emptyAppointment())} />
    </StepShell>
  );
}
