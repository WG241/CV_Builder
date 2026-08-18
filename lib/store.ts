"use client";
// ---------------------------------------------------------------------------
// Client-side draft store. All CV data lives only in React state and
// localStorage (keys under "workforce-cv:"). There is no server persistence.
// ---------------------------------------------------------------------------

import { useCallback, useEffect, useRef, useState } from "react";
import type { CvFormData, StructuredCV } from "./types";

const FORM_KEY = "workforce-cv:form";
const CV_KEY = "workforce-cv:generated";

export function newId(prefix = "id"): string {
  // Not security-sensitive; only needs to be locally unique for list keys.
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export function emptyForm(): CvFormData {
  return {
    personal: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      linkedin: "",
      militaryStatus: "Serving",
      serviceBranch: "",
      currentOrFinalRank: "",
      yearsOfService: "",
      currentEmployer: "",
      cvPurpose: "General Professional CV",
      targetRole: "",
      targetOrganisation: "",
      targetSector: "",
    },
    appointments: [],
    academic: [],
    militaryCourses: [],
    certifications: [],
    executiveProgrammes: [],
    boardExperience: [],
    postMilitary: [],
    consulting: [],
    internationalAssignments: [],
    projects: [],
    trainingExperience: [],
    publications: [],
    speaking: [],
    memberships: [],
    awards: [],
    languages: [],
    positioning: { bestKnownFor: "", definingProblems: "", pursuingNow: "" },
    confirmation: { accurate: false, noSensitiveInfo: false, allowResearch: false },
  };
}

export function emptyAppointment() {
  return {
    id: newId("appt"),
    organisation: "",
    formation: "",
    appointment: "",
    rank: "",
    location: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    present: false,
    responsibilities: "",
    achievements: "",
    leadershipScope: "",
  };
}

function load<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode / quota); fail silently.
  }
}

export function useCvStore() {
  const [form, setForm] = useState<CvFormData>(emptyForm);
  const [cv, setCvState] = useState<StructuredCV | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    const savedForm = load<CvFormData>(FORM_KEY);
    if (savedForm) setForm({ ...emptyForm(), ...savedForm });
    const savedCv = load<StructuredCV>(CV_KEY);
    if (savedCv) setCvState(savedCv);
    setHydrated(true);
  }, []);

  // Debounced persistence of the form.
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(FORM_KEY, form), 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [form, hydrated]);

  const setCv = useCallback((next: StructuredCV | null) => {
    setCvState(next);
    if (next) save(CV_KEY, next);
    else if (typeof window !== "undefined") window.localStorage.removeItem(CV_KEY);
  }, []);

  const clearAll = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(FORM_KEY);
      window.localStorage.removeItem(CV_KEY);
    }
    setForm(emptyForm());
    setCvState(null);
  }, []);

  return { form, setForm, cv, setCv, clearAll, hydrated };
}
