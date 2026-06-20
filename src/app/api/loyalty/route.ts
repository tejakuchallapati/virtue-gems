import { NextResponse } from "next/server";
import { getLoyaltyAccount, saveLoyaltyAccountSafe } from "@/lib/loyalty-store";
import { normalizePhone } from "@/lib/loyalty";
import type { LoyaltyAccount } from "@/types";
import {
  apiFail,
  apiOk,
  checkRateLimit,
  clientIp,
  parseJsonBody,
  requirePhone,
  requireString,
} from "@/lib/api-server";

export async function GET(request: Request) {
  const limited = checkRateLimit(`loyalty-get:${clientIp(request)}`, 60, 60_000);
  if (limited) return limited;

  const phone = new URL(request.url).searchParams.get("phone");
  if (!phone) return apiFail("Phone required.", 400);

  const normalized = normalizePhone(phone);
  if (normalized.length < 10) return apiFail("Valid phone required.", 400);

  try {
    const account = getLoyaltyAccount(normalized);
    return NextResponse.json({ success: true, account });
  } catch (error) {
    console.error("Loyalty GET error:", error);
    return apiFail("Could not load loyalty account.", 500);
  }
}

export async function POST(request: Request) {
  const limited = checkRateLimit(`loyalty-post:${clientIp(request)}`, 30, 60_000);
  if (limited) return limited;

  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const body = parsed.data;
  const phone = requirePhone(body.phone);
  if (!phone) return apiFail("Valid phone required.", 400);

  const name = requireString(body.name, "name", 120) ?? "";
  const points = body.points;
  const lifetimePoints = body.lifetimePoints;
  const history = body.history;

  if (typeof points !== "number" || !Number.isFinite(points) || points < 0 || points > 1_000_000) {
    return apiFail("Invalid points value.", 400);
  }
  if (
    typeof lifetimePoints !== "number" ||
    !Number.isFinite(lifetimePoints) ||
    lifetimePoints < 0
  ) {
    return apiFail("Invalid lifetime points.", 400);
  }
  if (!Array.isArray(history) || history.length > 50) {
    return apiFail("Invalid history.", 400);
  }

  const account: LoyaltyAccount = {
    phone: normalizePhone(phone),
    name,
    points: Math.round(points),
    lifetimePoints: Math.round(lifetimePoints),
    history: history as LoyaltyAccount["history"],
  };

  try {
    const saved = await saveLoyaltyAccountSafe(account);
    return apiOk({ account: saved });
  } catch (error) {
    console.error("Loyalty save error:", error);
    return apiFail("Failed to save loyalty account.", 500);
  }
}
