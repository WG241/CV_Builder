export function SecurityNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className={`rounded-lg border border-amber-300 bg-amber-50 text-amber-900 ${
        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
      }`}
    >
      <strong className="font-semibold">Security notice:</strong> Do not enter
      classified, restricted, confidential or operationally sensitive
      information. Only provide information appropriate for inclusion in a public
      professional CV.
    </div>
  );
}
