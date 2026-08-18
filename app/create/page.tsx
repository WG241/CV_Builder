"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/Brand";
import { ProgressBar } from "@/components/Wizard";
import { Step1About } from "@/components/steps/Step1About";
import { Step2Career } from "@/components/steps/Step2Career";
import { Step3Education } from "@/components/steps/Step3Education";
import { Step4Additional } from "@/components/steps/Step4Additional";
import { Step5Objective } from "@/components/steps/Step5Objective";
import { Step6Review } from "@/components/steps/Step6Review";
import { useCvStore } from "@/lib/store";

const steps = [Step1About, Step2Career, Step3Education, Step4Additional, Step5Objective, Step6Review];
export default function CreatePage() {
  const router = useRouter(); const { form, setForm, setCv, clearAll, hydrated } = useCvStore();
  const [step, setStep] = useState(0); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const Current = steps[step]!;
  function clear() { if (confirm("Delete all information saved on this device?")) { clearAll(); router.push("/"); } }
  async function generate() {
    if (!form.confirmation.accurate || !form.confirmation.noSensitiveInfo) { setError("Please complete both required confirmations."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ workflow: "generate", form, confirmedSuggestionIds: [] }) });
      const body = await response.json(); if (!response.ok) throw new Error(body.error || "Generation failed.");
      setCv(body.cv); router.push("/review");
    } catch (e) { setError(e instanceof Error ? e.message : "We were unable to generate your CV at this time. Your information remains available on this device. Please try again."); }
    finally { setBusy(false); }
  }
  if (!hydrated) return <main className="p-10 text-center">Loading your saved progress…</main>;
  return <div className="flex min-h-screen flex-col"><SiteHeader><button className="btn-ghost text-xs" onClick={clear}>Clear My Information</button></SiteHeader>
    <main className="mx-auto w-full max-w-content flex-1 px-4 py-6 sm:px-6"><ProgressBar step={step} /><Current form={form} setForm={setForm} />
      {error && <p role="alert" className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-8 flex justify-between"><button className="btn-secondary" disabled={step === 0 || busy} onClick={() => setStep((s) => s - 1)}>Back</button>
      {step < 5 ? <button className="btn-primary" disabled={step === 0 && !form.personal.fullName.trim()} onClick={() => setStep((s) => s + 1)}>Continue</button> : <button className="btn-primary" disabled={busy} onClick={generate}>{busy ? "Analysing & drafting…" : "Generate My CV"}</button>}</div>
      <p className="mt-4 text-center text-xs text-ink-muted">Your progress is saved on this device.</p></main><SiteFooter /></div>;
}
