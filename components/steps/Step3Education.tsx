"use client";
import { TextField } from "@/components/Field";
import { AddButton, RepeatableCard, StepShell } from "@/components/Wizard";
import { newId } from "@/lib/store";
import { addItem, removeItem, updateItem, type StepProps } from "./helpers";

export function Step3Education({ form, setForm }: StepProps) {
  return (
    <StepShell
      title="Education & professional development"
      intro="The CV will intelligently distinguish academic education from military and professional development. Add whatever applies — every section is optional."
    >
      {/* Academic */}
      <div className="space-y-3">
        <h3 className="section-chip">Academic qualifications</h3>
        {form.academic.map((a, i) => (
          <RepeatableCard key={a.id} title={`Qualification ${i + 1}`} onRemove={() => removeItem(setForm, "academic", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Qualification" value={a.qualification} onChange={(v) => updateItem(setForm, "academic", i, { qualification: v })} placeholder="e.g. BSc, MSc, MBA" />
              <TextField label="Field / discipline" optional value={a.field ?? ""} onChange={(v) => updateItem(setForm, "academic", i, { field: v })} />
              <TextField label="Institution" value={a.institution} onChange={(v) => updateItem(setForm, "academic", i, { institution: v })} />
              <TextField label="Country" optional value={a.country ?? ""} onChange={(v) => updateItem(setForm, "academic", i, { country: v })} />
              <TextField label="Year completed" optional value={a.year ?? ""} onChange={(v) => updateItem(setForm, "academic", i, { year: v })} />
            </div>
          </RepeatableCard>
        ))}
        <AddButton label="Add academic qualification" onClick={() => addItem(setForm, "academic", { id: newId("acad"), qualification: "", field: "", institution: "", country: "", year: "" })} />
      </div>

      {/* Military courses */}
      <div className="space-y-3">
        <h3 className="section-chip">Military courses</h3>
        {form.militaryCourses.map((c, i) => (
          <RepeatableCard key={c.id} title={`Course ${i + 1}`} onRemove={() => removeItem(setForm, "militaryCourses", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Course name" value={c.course} onChange={(v) => updateItem(setForm, "militaryCourses", i, { course: v })} />
              <TextField label="Institution" optional value={c.institution ?? ""} onChange={(v) => updateItem(setForm, "militaryCourses", i, { institution: v })} />
              <TextField label="Country" optional value={c.country ?? ""} onChange={(v) => updateItem(setForm, "militaryCourses", i, { country: v })} />
              <TextField label="Year" optional value={c.year ?? ""} onChange={(v) => updateItem(setForm, "militaryCourses", i, { year: v })} />
            </div>
          </RepeatableCard>
        ))}
        <AddButton label="Add military course" onClick={() => addItem(setForm, "militaryCourses", { id: newId("mil"), course: "", institution: "", country: "", year: "" })} />
      </div>

      {/* Certifications */}
      <div className="space-y-3">
        <h3 className="section-chip">Professional certifications</h3>
        {form.certifications.map((c, i) => (
          <RepeatableCard key={c.id} title={`Certification ${i + 1}`} onRemove={() => removeItem(setForm, "certifications", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Certification" value={c.certification} onChange={(v) => updateItem(setForm, "certifications", i, { certification: v })} />
              <TextField label="Issuing organisation" optional value={c.issuer ?? ""} onChange={(v) => updateItem(setForm, "certifications", i, { issuer: v })} />
              <TextField label="Year" optional value={c.year ?? ""} onChange={(v) => updateItem(setForm, "certifications", i, { year: v })} />
            </div>
          </RepeatableCard>
        ))}
        <AddButton label="Add certification" onClick={() => addItem(setForm, "certifications", { id: newId("cert"), certification: "", issuer: "", year: "" })} />
      </div>

      {/* Executive programmes */}
      <div className="space-y-3">
        <h3 className="section-chip">Executive / leadership programmes</h3>
        {form.executiveProgrammes.map((e, i) => (
          <RepeatableCard key={e.id} title={`Programme ${i + 1}`} onRemove={() => removeItem(setForm, "executiveProgrammes", i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Programme" value={e.programme} onChange={(v) => updateItem(setForm, "executiveProgrammes", i, { programme: v })} />
              <TextField label="Institution" optional value={e.institution ?? ""} onChange={(v) => updateItem(setForm, "executiveProgrammes", i, { institution: v })} />
              <TextField label="Country" optional value={e.country ?? ""} onChange={(v) => updateItem(setForm, "executiveProgrammes", i, { country: v })} />
              <TextField label="Year" optional value={e.year ?? ""} onChange={(v) => updateItem(setForm, "executiveProgrammes", i, { year: v })} />
            </div>
          </RepeatableCard>
        ))}
        <AddButton label="Add programme" onClick={() => addItem(setForm, "executiveProgrammes", { id: newId("exec"), programme: "", institution: "", country: "", year: "" })} />
      </div>
    </StepShell>
  );
}
