"use client";

import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import {
  buildCustomerPointsMessage,
  getCustomerPointsWhatsAppUrl,
} from "@/lib/whatsapp";

type Props = {
  customerName: string;
  customerPhone: string;
  pointsEarned: number;
  pointsBalance: number;
};

export function PointsEarnedBanner({
  customerName,
  customerPhone,
  pointsEarned,
  pointsBalance,
}: Props) {
  const rewardsUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/rewards`
      : "/rewards";

  const pointsMessage = buildCustomerPointsMessage(
    customerName,
    pointsEarned,
    pointsBalance,
    rewardsUrl,
  );

  const whatsAppUrl = getCustomerPointsWhatsAppUrl(customerPhone, pointsMessage);

  return (
    <div className="mx-auto mb-6 max-w-[560px] rounded-xl border border-gold/35 bg-gold/10 p-4 text-center print:hidden">
      <div className="flex items-center justify-center gap-2 text-gold-dark">
        <Sparkles className="h-4 w-4" />
        <p className="text-sm font-semibold text-dark">Points added to your account!</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-dark">+{pointsEarned} pts</p>
      <p className="mt-1 text-xs text-dark/65">
        New balance: <strong>{pointsBalance} points</strong>
      </p>
      <p className="mt-2 text-[11px] text-dark/55">
        Your points confirmation was sent on WhatsApp. Tap below if you missed it.
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1fb855]"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Open points message
        </a>
        <Link
          href="/rewards"
          className="inline-flex items-center rounded-full border border-gold/40 px-4 py-2 text-xs font-medium text-gold-dark transition hover:bg-gold/10"
        >
          View rewards
        </Link>
      </div>
    </div>
  );
}
