// ---------------------------------------------------------------------------
// In-memory, per-IP rate limiting. Suitable for a single serverless instance;
// for hard global limits back this with a shared store (e.g. Vercel KV /
// Upstash). Two independent windows are enforced:
//   - a per-minute request cap across all AI endpoints;
//   - a per-hour cap on full generations (the expensive workflow).
// ---------------------------------------------------------------------------

import {
  RATE_LIMIT_GENERATIONS_PER_HOUR,
  RATE_LIMIT_REQUESTS_PER_MINUTE,
} from "./constants";

interface Window {
  count: number;
  resetAt: number;
}

const requestWindows = new Map<string, Window>();
const generationWindows = new Map<string, Window>();

const MINUTE = 60_000;
const HOUR = 3_600_000;

function hit(
  store: Map<string, Window>,
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const existing = store.get(key);
  if (!existing || now >= existing.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  existing.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

// Opportunistic cleanup so the maps don't grow unbounded on a long-lived
// instance. Cheap and only runs on access.
function sweep(store: Map<string, Window>) {
  if (store.size < 5_000) return;
  const now = Date.now();
  for (const [k, w] of store) {
    if (now >= w.resetAt) store.delete(k);
  }
}

export function checkRequestLimit(ip: string) {
  sweep(requestWindows);
  return hit(requestWindows, ip, RATE_LIMIT_REQUESTS_PER_MINUTE, MINUTE);
}

export function checkGenerationLimit(ip: string) {
  sweep(generationWindows);
  return hit(generationWindows, ip, RATE_LIMIT_GENERATIONS_PER_HOUR, HOUR);
}

// Best-effort client IP extraction from standard proxy headers.
export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") || "unknown";
}
