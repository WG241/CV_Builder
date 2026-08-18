"use client";
import type { CvFormData } from "@/lib/types";

export type SetForm = React.Dispatch<React.SetStateAction<CvFormData>>;

export interface StepProps {
  form: CvFormData;
  setForm: SetForm;
}

// Update a single field on form.personal.
export function updatePersonal<K extends keyof CvFormData["personal"]>(
  setForm: SetForm,
  key: K,
  value: CvFormData["personal"][K]
) {
  setForm((f) => ({ ...f, personal: { ...f.personal, [key]: value } }));
}

// Generic list operations for any array field on the form.
type ListKeys = {
  [K in keyof CvFormData]: CvFormData[K] extends Array<infer _> ? K : never;
}[keyof CvFormData];

export function addItem<K extends ListKeys>(
  setForm: SetForm,
  key: K,
  item: CvFormData[K][number]
) {
  setForm((f) => ({ ...f, [key]: [...(f[key] as unknown[]), item] } as CvFormData));
}

export function removeItem<K extends ListKeys>(
  setForm: SetForm,
  key: K,
  index: number
) {
  setForm(
    (f) =>
      ({
        ...f,
        [key]: (f[key] as unknown[]).filter((_, i) => i !== index),
      }) as CvFormData
  );
}

export function updateItem<K extends ListKeys>(
  setForm: SetForm,
  key: K,
  index: number,
  patch: Partial<CvFormData[K][number]>
) {
  setForm(
    (f) =>
      ({
        ...f,
        [key]: (f[key] as unknown[]).map((it, i) =>
          i === index ? { ...(it as object), ...patch } : it
        ),
      }) as CvFormData
  );
}

export function moveItem<K extends ListKeys>(
  setForm: SetForm,
  key: K,
  index: number,
  dir: -1 | 1
) {
  setForm((f) => {
    const arr = [...(f[key] as unknown[])];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return f;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    return { ...f, [key]: arr } as CvFormData;
  });
}
