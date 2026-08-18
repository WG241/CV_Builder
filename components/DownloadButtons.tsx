"use client";
import { useState } from "react";
import type { StructuredCV } from "@/lib/types";

export function DownloadButtons({ cv }: { cv: StructuredCV }) {
  const [busy, setBusy] = useState<null | "pdf" | "docx">(null);
  const [error, setError] = useState<string | null>(null);

  async function doPdf() {
    setError(null);
    setBusy("pdf");
    try {
      const { downloadPdf } = await import("@/lib/export/pdf");
      await downloadPdf(cv);
    } catch {
      setError("We could not create the PDF just now. Please try again — your CV is unchanged.");
    } finally {
      setBusy(null);
    }
  }

  async function doDocx() {
    setError(null);
    setBusy("docx");
    try {
      const { downloadDocx } = await import("@/lib/export/docx");
      await downloadDocx(cv);
    } catch {
      setError("We could not create the Word document just now. Please try again — your CV is unchanged.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="no-print">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={doPdf} disabled={busy !== null} className="btn-primary">
          {busy === "pdf" ? "Preparing PDF…" : "Download PDF"}
        </button>
        <button type="button" onClick={doDocx} disabled={busy !== null} className="btn-secondary">
          {busy === "docx" ? "Preparing Word…" : "Download Word (.docx)"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
