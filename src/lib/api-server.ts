import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 64 * 1024;

type RateBucket = { count: number; resetAt: number };

const rateLimits = new Map<string, RateBucket>();

/** Simple in-process rate limiter — protects APIs from burst abuse. */
export function checkRateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000,
): NextResponse | null {
  const now = Date.now();
  const bucket = rateLimits.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (bucket.count >= limit) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  bucket.count += 1;
  return null;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function parseJsonBody<T extends Record<string, unknown>>(
  request: Request,
): Promise<{ data: T } | { error: NextResponse }> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) {
    return {
      error: NextResponse.json({ error: "Request body too large." }, { status: 413 }),
    };
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      error: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }),
    };
  }

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {
      error: NextResponse.json({ error: "Invalid request body." }, { status: 400 }),
    };
  }

  return { data: raw as T };
}

export function apiOk<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function apiFail(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function requireString(value: unknown, field: string, maxLen = 500): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLen) return null;
  return trimmed;
}

export function requirePhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}
