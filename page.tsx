"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/Brand";
import { CvPreview } from "@/components/CvPreview";
import { CvEditor } from "@/components/CvEditor";
import { DownloadButtons } from "@/components/DownloadButtons";
import { useCvStore } from "@/lib/store";

export default function ReviewPage() {
  const router = useRouter();
  const { cv, setCv, clearAll, hydrated } = useCvStore();
  const [mode, setMode] = useState<"preview" | "edit">("preview");

  // If there is no generated CV after hydration, send the user back to build one.
  useEffect(() => {
    if (hydrated && !cv) router.replace("/create");
  }, [hydrated, cv, router]);

  function handleClear() {
    if (typeof window !== "undefined" && !window.confirm("This will delete all information on this device, including this CV. Continue?")) {
      return;
    }
    clearAll();
    router.push("/");
  }

  if (!hydrated || !cv) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 px-4 py-20 text-center text-ink-muted">Loading…</main>
        <SiteFooter />
      </div>
    );
  }

  const warnings = cv.qualityFlags.filter((f) => f.severity === "warning");
  const infos = cv.qualityFlags.filter((f) => f.severity === "info");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader>
        <Link href="/create" className="btn-ghost text-xs">
          Back to form
        </Link>
        <button type="button" onClick={handleClear} className="btn-ghost text-xs">
          Clear My Information
        </button>
      </SiteHeader>

      <main className="mx-auto w-full max-w-content flex-1 px-4 py-6 sm:px-6">
        <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-ink sm:text-2xl">Your CV</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Review, edit if you wish, then download. Every AI edit preserves your facts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border border-line bg-white p-0.5">
              <button
                type="button"
                onClick={() => setMode("preview")}
                className={`rounded px-3 py-1.5 text-sm font-medium ${mode === "preview" ? "bg-brand text-white" : "text-ink-soft"}`}
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setMode("edit")}
                className={`rounded px-3 py-1.5 text-sm font-medium ${mode === "edit" ? "bg-brand text-white" : "text-ink-soft"}`}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        <div className="no-print mt-4">
          <DownloadButtons cv={cv} />
        </div>

        {(warnings.length > 0 || infos.length > 0) && (
          <div className="no-print mt-4 space-y-2">
            {warnings.map((f, i) => (
              <p key={`w${i}`} className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                <strong>Review:</strong> {f.message}
              </p>
            ))}
            {infos.map((f, i) => (
              <p key={`i${i}`} className="rounded-lg border border-line bg-brand-light px-3 py-2 text-xs text-ink-soft">
                <strong>Tip:</strong> {f.message}
              </p>
            ))}
          </div>
        )}

        {cv.publicSourceSuggestions.length > 0 && (
          <div className="no-print mt-4 rounded-lg border border-line bg-white p-4">
            <h2 className="text-sm font-semibold text-brand">Public-source suggestions</h2>
            <p className="mt-1 text-xs text-ink-muted">
              These were found in public sources and are shown for your awareness only. They are not inserted into your CV.
            </p>
            <ul className="mt-2 space-y-2">
              {cv.publicSourceSuggestions.map((s) => (
                <li key={s.id} className="text-xs text-ink-soft">
                  <span className="font-medium">{s.proposed}</span> — {s.rationale}{" "}
                  <span className="text-ink-muted">({s.source})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          {mode === "preview" ? (
            <CvPreview cv={cv} />
          ) : (
            <CvEditor cv={cv} onChange={setCv} />
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
