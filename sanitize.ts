// ---------------------------------------------------------------------------
// Request sanitisation helpers. These strip control characters and cap length
// to protect against oversized / malformed input before it reaches the model.
// ---------------------------------------------------------------------------

// Remove ASCII control characters except tab (\x09), newline (\x0A) and
// carriage-return (\x0D).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

export function cleanText(input: unknown, max = 6_000): string {
  if (typeof input !== "string") return "";
  const stripped = input.replace(CONTROL_CHARS, "").trim();
  return stripped.length > max ? stripped.slice(0, max) : stripped;
}

// Recursively clean every string in an object/array in a copy-safe fashion.
export function deepClean<T>(value: T, max = 6_000): T {
  if (typeof value === "string") {
    return cleanText(value, max) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => deepClean(v, max)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = deepClean(v, max);
    }
    return out as T;
  }
  return value;
}

// A rough character budget for the whole payload. Returns true if the JSON
// serialisation of the value exceeds the limit.
export function exceedsBudget(value: unknown, maxChars: number): boolean {
  try {
    return JSON.stringify(value).length > maxChars;
  } catch {
    return true;
  }
}
