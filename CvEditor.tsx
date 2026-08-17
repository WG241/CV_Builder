"use client";
import { useState } from "react";
import type { EditAction, EditField, StructuredCV } from "@/lib/types";
import { EDIT_ACTIONS } from "@/lib/types";

const ACTION_LABEL: Record<EditAction, string> = {
  improve: "Improve wording",
  concise: "More concise",
  executive: "More executive",
  simplify: "Simplify",
  regenerate: "Regenerate",
};

async function callEdit(args: {
  action: EditAction;
  field: EditField;
  text: string | string[];
  factContext: string;
}): Promise<{ text?: string; items?: string[] } | null> {
  try {
    const res = await fetch("/api/edit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ workflow: "edit", ...args }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function AiActions({
  field,
  onApply,
  disabled,
}: {
  field: EditField;
  onApply: (action: EditAction) => void;
  disabled: boolean;
}) {
  // Regenerate only makes sense for the profile.
  const actions = EDIT_ACTIONS.filter((a) => a !== "regenerate" || field === "professionalProfile");
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {actions.map((a) => (
        <button
          key={a}
          type="button"
          disabled={disabled}
          onClick={() => onApply(a)}
          className="rounded border border-line bg-white px-2 py-1 text-xs font-medium text-ink-soft hover:bg-brand-light disabled:opacity-50"
        >
          {ACTION_LABEL[a]}
        </button>
      ))}
    </div>
  );
}

function TextBlock({
  label,
  field,
  value,
  factContext,
  onChange,
}: {
  label: string;
  field: EditField;
  value: string;
  factContext: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  async function apply(action: EditAction) {
    setBusy(true);
    const res = await callEdit({ action, field, text: value, factContext });
    if (res?.text !== undefined) onChange(res.text);
    setBusy(false);
  }
  return (
    <div>
      <label className="field-label">{label}</label>
      <textarea className="field-input resize-y" rows={field === "professionalProfile" ? 5 : 2} value={value} onChange={(e) => onChange(e.target.value)} />
      <AiActions field={field} onApply={apply} disabled={busy} />
      {busy && <p className="mt-1 text-xs text-ink-muted">Applying AI edit…</p>}
    </div>
  );
}

function ListBlock({
  label,
  field,
  items,
  factContext,
  onChange,
}: {
  label: string;
  field: EditField;
  items: string[];
  factContext: string;
  onChange: (items: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  async function apply(action: EditAction) {
    setBusy(true);
    const res = await callEdit({ action, field, text: items, factContext });
    if (res?.items) onChange(res.items);
    setBusy(false);
  }
  return (
    <div>
      <label className="field-label">{label}</label>
      <textarea
        className="field-input resize-y font-mono text-xs"
        rows={Math.min(Math.max(items.length, 2), 10)}
        value={items.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n"))}
      />
      <p className="field-hint">One item per line.</p>
      <AiActions field={field} onApply={apply} disabled={busy} />
      {busy && <p className="mt-1 text-xs text-ink-muted">Applying AI edit…</p>}
    </div>
  );
}

export function CvEditor({
  cv,
  onChange,
}: {
  cv: StructuredCV;
  onChange: (cv: StructuredCV) => void;
}) {
  const set = (patch: Partial<StructuredCV>) => onChange({ ...cv, ...patch });

  return (
    <div className="space-y-5">
      <div className="card p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-semibold text-brand">Headline &amp; profile</h3>
        <TextBlock
          label="Professional headline"
          field="professionalHeadline"
          value={cv.professionalHeadline}
          factContext={`Name: ${cv.personalDetails.fullName}`}
          onChange={(v) => set({ professionalHeadline: v })}
        />
        <TextBlock
          label="Professional profile"
          field="professionalProfile"
          value={cv.professionalProfile}
          factContext={`Headline: ${cv.professionalHeadline}. Competencies: ${cv.coreCompetencies.join(", ")}`}
          onChange={(v) => set({ professionalProfile: v })}
        />
      </div>

      <div className="card p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-semibold text-brand">Core competencies</h3>
        <ListBlock
          label="Competencies"
          field="coreCompetencies"
          items={cv.coreCompetencies}
          factContext="Only keep competencies supported by the career experience."
          onChange={(items) => set({ coreCompetencies: items })}
        />
      </div>

      {cv.careerExperience.map((exp, i) => (
        <div key={i} className="card p-4 sm:p-5 space-y-4">
          <h3 className="text-sm font-semibold text-brand">
            {[exp.appointment, exp.organisation].filter(Boolean).join(" — ")}
          </h3>
          <p className="text-xs text-ink-muted">
            Factual fields (organisation, rank, dates) are locked to preserve accuracy. You may edit the wording below.
          </p>
          <ListBlock
            label="Responsibilities"
            field="responsibilities"
            items={exp.responsibilities}
            factContext={`Role: ${exp.appointment} at ${exp.organisation}. Rank: ${exp.rank ?? ""}. Do not change dates, rank or organisation.`}
            onChange={(items) => {
              const next = [...cv.careerExperience];
              next[i] = { ...exp, responsibilities: items };
              set({ careerExperience: next });
            }}
          />
          <ListBlock
            label="Key achievements"
            field="achievements"
            items={exp.achievements}
            factContext={`Role: ${exp.appointment} at ${exp.organisation}. Do not invent outcomes, metrics or awards.`}
            onChange={(items) => {
              const next = [...cv.careerExperience];
              next[i] = { ...exp, achievements: items };
              set({ careerExperience: next });
            }}
          />
        </div>
      ))}
    </div>
  );
}
