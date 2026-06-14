import { NextResponse } from "next/server";
import { getLoyaltyAccount, saveLoyaltyAccount } from "@/lib/loyalty-store";
import { normalizePhone } from "@/lib/loyalty";
import type { LoyaltyAccount } from "@/types";

export async function GET(request: Request) {
  const phone = new URL(request.url).searchParams.get("phone");
  if (!phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  const account = getLoyaltyAccount(phone);
  return NextResponse.json({ account });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoyaltyAccount;
    if (!body.phone) {
      return NextResponse.json({ error: "Phone required" }, { status: 400 });
    }

    const account = saveLoyaltyAccount({
      phone: normalizePhone(body.phone),
      name: body.name,
      points: body.points ?? 0,
      lifetimePoints: body.lifetimePoints ?? 0,
      history: body.history ?? [],
    });

    return NextResponse.json({ success: true, account });
  } catch (error) {
    console.error("Loyalty save error:", error);
    return NextResponse.json({ error: "Failed to save loyalty account" }, { status: 500 });
  }
}
