"use client";
import { TextArea } from "@/components/Field";
import { StepShell } from "@/components/Wizard";
import type { StepProps } from "./helpers";

export function Step5Objective({ form, setForm }: StepProps) {
  const set = (k: keyof typeof form.positioning, v: string) =>
    setForm((f) => ({ ...f, positioning: { ...f.positioning, [k]: v } }));

  return (
    <StepShell
      title="Career objective & positioning"
      intro="Three short questions to help position your CV. Rough notes are fine — the AI will organise them. Perfect writing is not required."
    >
      <div className="card p-4 sm:p-5 space-y-5">
        <TextArea
          label="What would you say you are best known for professionally?"
          rows={3}
          value={form.positioning.bestKnownFor}
          onChange={(v) => set("bestKnownFor", v)}
          placeholder="A few lines are fine."
        />
        <TextArea
          label="What kinds of problems or responsibilities have defined your career?"
          rows={3}
          value={form.positioning.definingProblems}
          onChange={(v) => set("definingProblems", v)}
        />
        <TextArea
          label="What type of opportunity are you pursuing now?"
          rows={3}
          value={form.positioning.pursuingNow}
          onChange={(v) => set("pursuingNow", v)}
        />
      </div>
    </StepShell>
  );
}
