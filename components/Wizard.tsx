"use client";

export const WIZARD_STEPS = [
  "About You",
  "Career History",
  "Education & Training",
  "Additional Experience",
  "Career Objective",
  "Review & Generate",
] as const;

export function ProgressBar({ step }: { step: number }) {
  const total = WIZARD_STEPS.length;
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div className="no-print">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-brand">
          Step {step + 1} of {total} — {WIZARD_STEPS[step]}
        </span>
        <span className="text-ink-muted">{pct}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-light">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-3 hidden flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted sm:flex">
        {WIZARD_STEPS.map((label, i) => (
          <li
            key={label}
            className={i === step ? "font-semibold text-brand" : i < step ? "text-ink-soft" : ""}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function StepShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h1 className="text-xl font-bold text-ink sm:text-2xl">{title}</h1>
      {intro && <p className="mt-1.5 max-w-prose text-sm text-ink-muted">{intro}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export function RepeatableCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand">{title}</h3>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function AddButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-secondary w-full border-dashed"
    >
      + {label}
    </button>
  );
}
