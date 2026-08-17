"use client";
import { TextArea, TextField } from "@/components/Field";
import { AddButton, RepeatableCard, StepShell } from "@/components/Wizard";
import { newId } from "@/lib/store";
import type { GenericExperienceEntry } from "@/lib/types";
import { addItem, removeItem, updateItem, type StepProps, type SetForm } from "./helpers";

function Disclosure({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="card overflow-hidden">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-light">
        <span className="mr-2 text-ink-muted">▸</span>
        {title}
      </summary>
      <div className="space-y-3 border-t border-line p-4">{children}</div>
    </details>
  );
}

function newGeneric(): GenericExperienceEntry {
  return { id: newId("gen"), organisation: "", role: "", location: "", dates: "", description: "", result: "" };
}

function GenericSection({
  form,
  setForm,
  field,
  addLabel,
}: StepProps & {
  field: "postMilitary" | "consulting" | "internationalAssignments" | "trainingExperience";
  addLabel: string;
}) {
  const items = form[field];
  return (
    <>
      {items.map((e, i) => (
        <RepeatableCard key={e.id} title={`Entry ${i + 1}`} onRemove={() => removeItem(setForm, field, i)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Organisation / client / mission" value={e.organisation} onChange={(v) => updateItem(setForm, field, i, { organisation: v })} />
            <TextField label="Role" value={e.role} onChange={(v) => updateItem(setForm, field, i, { role: v })} />
            <TextField label="Location" optional value={e.location ?? ""} onChange={(v) => updateItem(setForm, field, i, { location: v })} />
            <TextField label="Dates" optional value={e.dates ?? ""} onChange={(v) => updateItem(setForm, field, i, { dates: v })} placeholder="e.g. 2019 – 2022" />
          </div>
          <TextArea label="Description" optional rows={3} value={e.description ?? ""} onChange={(v) => updateItem(setForm, field, i, { description: v })} />
          <TextField label="Result / contribution" optional value={e.result ?? ""} onChange={(v) => updateItem(setForm, field, i, { result: v })} />
        </RepeatableCard>
      ))}
      <AddButton label={addLabel} onClick={() => addItem(setForm as SetForm, field, newGeneric())} />
    </>
  );
}

export function Step4Additional({ form, setForm }: StepProps) {
  return (
    <StepShell
      title="Additional professional information"
      intro="Every section here is optional and only appears in your CV if you add information. Expand the ones that apply to you."
    >
      <Disclosure title="Board & governance experience">
        {form.boardExperience.map((b, i) => (
          <RepeatableCard key={b.id} title={`Board role ${i + 1}`} onRemove={() => removeItem(setForm, "boardExperience", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Organisation" value={b.organisation} onChange={(v) => updateItem(setForm, "boardExperience", i, { organisation: v })} />
              <TextField label="Board / committee role" value={b.role} onChange={(v) => updateItem(setForm, "boardExperience", i, { role: v })} />
              <TextField label="Dates" optional value={b.dates ?? ""} onChange={(v) => updateItem(setForm, "boardExperience", i, { dates: v })} />
            </div>
            <TextArea label="Responsibilities" optional rows={2} value={b.responsibilities ?? ""} onChange={(v) => updateItem(setForm, "boardExperience", i, { responsibilities: v })} />
            <TextArea label="Contributions / achievements" optional rows={2} value={b.achievements ?? ""} onChange={(v) => updateItem(setForm, "boardExperience", i, { achievements: v })} />
          </RepeatableCard>
        ))}
        <AddButton label="Add board role" onClick={() => addItem(setForm, "boardExperience", { id: newId("board"), organisation: "", role: "", dates: "", responsibilities: "", achievements: "" })} />
      </Disclosure>

      <Disclosure title="Post-military employment">
        <GenericSection form={form} setForm={setForm} field="postMilitary" addLabel="Add employment" />
      </Disclosure>

      <Disclosure title="Consulting & advisory experience">
        <GenericSection form={form} setForm={setForm} field="consulting" addLabel="Add assignment" />
      </Disclosure>

      <Disclosure title="International assignments">
        <GenericSection form={form} setForm={setForm} field="internationalAssignments" addLabel="Add assignment" />
      </Disclosure>

      <Disclosure title="Training & instructional experience">
        <GenericSection form={form} setForm={setForm} field="trainingExperience" addLabel="Add entry" />
      </Disclosure>

      <Disclosure title="Major projects & initiatives">
        {form.projects.map((p, i) => (
          <RepeatableCard key={p.id} title={`Project ${i + 1}`} onRemove={() => removeItem(setForm, "projects", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Project title" value={p.title} onChange={(v) => updateItem(setForm, "projects", i, { title: v })} />
              <TextField label="Role" optional value={p.role ?? ""} onChange={(v) => updateItem(setForm, "projects", i, { role: v })} />
              <TextField label="Date" optional value={p.date ?? ""} onChange={(v) => updateItem(setForm, "projects", i, { date: v })} />
            </div>
            <TextArea label="Description" optional rows={2} value={p.description ?? ""} onChange={(v) => updateItem(setForm, "projects", i, { description: v })} />
            <TextField label="Result" optional value={p.result ?? ""} onChange={(v) => updateItem(setForm, "projects", i, { result: v })} />
          </RepeatableCard>
        ))}
        <AddButton label="Add project" onClick={() => addItem(setForm, "projects", { id: newId("proj"), title: "", role: "", date: "", description: "", result: "" })} />
      </Disclosure>

      <Disclosure title="Publications">
        {form.publications.map((p, i) => (
          <RepeatableCard key={p.id} title={`Publication ${i + 1}`} onRemove={() => removeItem(setForm, "publications", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Title" value={p.title} onChange={(v) => updateItem(setForm, "publications", i, { title: v })} />
              <TextField label="Publication / source" optional value={p.source ?? ""} onChange={(v) => updateItem(setForm, "publications", i, { source: v })} />
              <TextField label="Year" optional value={p.year ?? ""} onChange={(v) => updateItem(setForm, "publications", i, { year: v })} />
              <TextField label="URL" optional value={p.url ?? ""} onChange={(v) => updateItem(setForm, "publications", i, { url: v })} />
            </div>
          </RepeatableCard>
        ))}
        <AddButton label="Add publication" onClick={() => addItem(setForm, "publications", { id: newId("pub"), title: "", source: "", year: "", url: "" })} />
      </Disclosure>

      <Disclosure title="Speaking engagements">
        {form.speaking.map((s, i) => (
          <RepeatableCard key={s.id} title={`Engagement ${i + 1}`} onRemove={() => removeItem(setForm, "speaking", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Event" value={s.event} onChange={(v) => updateItem(setForm, "speaking", i, { event: v })} />
              <TextField label="Topic" optional value={s.topic ?? ""} onChange={(v) => updateItem(setForm, "speaking", i, { topic: v })} />
              <TextField label="Organisation" optional value={s.organisation ?? ""} onChange={(v) => updateItem(setForm, "speaking", i, { organisation: v })} />
              <TextField label="Year" optional value={s.year ?? ""} onChange={(v) => updateItem(setForm, "speaking", i, { year: v })} />
            </div>
          </RepeatableCard>
        ))}
        <AddButton label="Add engagement" onClick={() => addItem(setForm, "speaking", { id: newId("spk"), event: "", topic: "", organisation: "", year: "" })} />
      </Disclosure>

      <Disclosure title="Professional memberships">
        {form.memberships.map((m, i) => (
          <RepeatableCard key={m.id} title={`Membership ${i + 1}`} onRemove={() => removeItem(setForm, "memberships", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Organisation" value={m.organisation} onChange={(v) => updateItem(setForm, "memberships", i, { organisation: v })} />
              <TextField label="Membership / status" optional value={m.status ?? ""} onChange={(v) => updateItem(setForm, "memberships", i, { status: v })} />
            </div>
          </RepeatableCard>
        ))}
        <AddButton label="Add membership" onClick={() => addItem(setForm, "memberships", { id: newId("mem"), organisation: "", status: "" })} />
      </Disclosure>

      <Disclosure title="Awards & decorations">
        {form.awards.map((a, i) => (
          <RepeatableCard key={a.id} title={`Award ${i + 1}`} onRemove={() => removeItem(setForm, "awards", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Award / decoration" value={a.award} onChange={(v) => updateItem(setForm, "awards", i, { award: v })} />
              <TextField label="Issuing body" optional value={a.issuer ?? ""} onChange={(v) => updateItem(setForm, "awards", i, { issuer: v })} />
              <TextField label="Year" optional value={a.year ?? ""} onChange={(v) => updateItem(setForm, "awards", i, { year: v })} />
            </div>
          </RepeatableCard>
        ))}
        <AddButton label="Add award" onClick={() => addItem(setForm, "awards", { id: newId("awd"), award: "", issuer: "", year: "" })} />
      </Disclosure>

      <Disclosure title="Languages">
        {form.languages.map((l, i) => (
          <RepeatableCard key={l.id} title={`Language ${i + 1}`} onRemove={() => removeItem(setForm, "languages", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Language" value={l.language} onChange={(v) => updateItem(setForm, "languages", i, { language: v })} />
              <TextField label="Proficiency" optional value={l.proficiency ?? ""} onChange={(v) => updateItem(setForm, "languages", i, { proficiency: v })} placeholder="e.g. Fluent, Working, Basic" />
            </div>
          </RepeatableCard>
        ))}
        <AddButton label="Add language" onClick={() => addItem(setForm, "languages", { id: newId("lang"), language: "", proficiency: "" })} />
      </Disclosure>
    </StepShell>
  );
}
