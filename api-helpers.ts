// Shared helpers for API route handlers: JSON responses, body-size guarding,
// rate limiting and consistent error mapping. Server-only.
import "server-only";
import { NextResponse } from "next/server";
import { MAX_BODY_CHARS } from "./constants";
import { checkRequestLimit, checkGenerationLimit, clientIp } from "./ratelimit";
import { AiConfigError, AiOutputError } from "./ai/client";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400, extra?: object) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

// Reads and size-guards the request body. Returns parsed JSON or an error
// response (never throws for oversize/malformed input).
export async function readBody(
  req: Request
): Promise<{ ok: true; body: unknown } | { ok: false; res: NextResponse }> {
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return { ok: false, res: errorResponse("Could not read request body.", 400) };
  }
  if (raw.length > MAX_BODY_CHARS) {
    return {
      ok: false,
      res: errorResponse(
        "Your submission is too large. Please shorten some entries and try again.",
        413
      ),
    };
  }
  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, res: errorResponse("Invalid request format.", 400) };
  }
}

export function enforceRequestLimit(
  req: Request
): NextResponse | null {
  const ip = clientIp(req.headers);
  const { ok, retryAfterSec } = checkRequestLimit(ip);
  if (!ok) {
    return errorResponse(
      "You are sending requests too quickly. Please wait a moment and try again.",
      429,
      { retryAfterSec }
    );
  }
  return null;
}

export function enforceGenerationLimit(req: Request): NextResponse | null {
  const ip = clientIp(req.headers);
  const { ok, retryAfterSec } = checkGenerationLimit(ip);
  if (!ok) {
    return errorResponse(
      "You have reached the generation limit for now. Your information remains on this device — please try again later.",
      429,
      { retryAfterSec }
    );
  }
  return null;
}

// Maps thrown errors to safe, professional messages. Never leaks internals.
export function mapError(err: unknown): NextResponse {
  if (err instanceof AiConfigError) {
    return errorResponse(
      "The AI service is not configured. Please contact the site administrator.",
      503
    );
  }
  if (err instanceof AiOutputError) {
    return errorResponse(
      "We were unable to generate a clean result this time. Your information remains on this device. Please try again.",
      502
    );
  }
  // OpenAI SDK errors expose a numeric status; surface a generic message.
  const status = (err as { status?: number })?.status;
  if (status === 429) {
    return errorResponse(
      "The AI service is busy right now. Please try again shortly.",
      503
    );
  }
  return errorResponse(
    "We were unable to complete this request at this time. Your information remains on this device. Please try again.",
    502
  );
}
