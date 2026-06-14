"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, Sparkles, Star } from "lucide-react";
import { useLoyalty } from "@/context/LoyaltyProvider";
import { LOYALTY_REWARDS } from "@/lib/loyalty";
import { cn } from "@/lib/utils";

export function RewardsClient() {
  const {
    points,
    phone,
    history,
    activeRedemption,
    loadAccount,
    redeemReward,
    clearRedemption,
    hydrated,
  } = useLoyalty();
  const [lookupPhone, setLookupPhone] = useState(phone);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    await loadAccount(lookupPhone);
    setLoading(false);
    setMessage("Account loaded. Your points are updated below.");
  }

  function handleRedeem(rewardId: string, cost: number) {
    if (points < cost) {
      setMessage("Not enough points for this reward yet. Keep shopping!");
      return;
    }
    if (activeRedemption) {
      setMessage("You already have a reward applied. Use it at checkout first.");
      return;
    }
    const ok = redeemReward(rewardId);
    if (ok) {
      setMessage("Reward unlocked! It will apply on your next checkout.");
    }
  }

  if (!hydrated) return null;

  return (
    <div className="space-y-10">
      {/* Points balance */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1a0a2e] to-[#2d1450] p-4 text-light sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-gold uppercase">Virtue Gems Rewards</p>
            <p className="mt-1 text-2xl font-bold text-gold">{points}</p>
            <p className="mt-0.5 text-xs text-light/70">Available points</p>
          </div>
          <Sparkles className="h-6 w-6 text-gold/60" />
        </div>
        <p className="mt-3 text-xs text-light/75">
          Earn points every time you shop. Redeem for discounts or free jewellery.
        </p>
      </div>

      {/* Phone lookup */}
      <form onSubmit={handleLookup} className="rounded-2xl bg-white p-5 ring-1 ring-light-muted/60 sm:p-6">
        <h2 className="text-lg font-semibold text-dark">Check your points</h2>
        <p className="mt-1 text-sm text-dark/60">
          Enter the phone number you use at checkout to view your balance.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="tel"
            value={lookupPhone}
            onChange={(e) => setLookupPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="flex-1 rounded-xl border border-light-muted px-4 py-3 text-base outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-dark px-6 py-3 text-sm font-semibold text-gold transition hover:bg-dark-soft disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load Points"}
          </button>
        </div>
      </form>

      {message && (
        <p className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-dark">
          {message}
        </p>
      )}

      {activeRedemption && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
          <p className="text-sm text-dark">
            <strong>Active reward:</strong> {activeRedemption.title} — use at checkout
          </p>
          <button
            type="button"
            onClick={clearRedemption}
            className="text-xs font-medium text-gold-dark underline"
          >
            Remove
          </button>
        </div>
      )}

      {/* How it works */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Star, title: "Shop & Earn", text: "Get 1 point for every ₹100 spent (min. 5 pts per order)" },
          { icon: Gift, title: "Collect Points", text: "Points add up automatically after each WhatsApp order" },
          { icon: Sparkles, title: "Redeem Rewards", text: "Unlock discounts or free rings & earrings" },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl bg-white p-4 ring-1 ring-light-muted/60">
            <Icon className="h-5 w-5 text-gold" />
            <h3 className="mt-2 font-semibold text-dark">{title}</h3>
            <p className="mt-1 text-sm text-dark/60">{text}</p>
          </div>
        ))}
      </div>

      {/* Rewards grid */}
      <div>
        <h2 className="text-xl font-semibold text-dark sm:text-2xl">Redeem Your Points</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {LOYALTY_REWARDS.map((reward) => {
            const canRedeem = points >= reward.pointsCost && !activeRedemption;
            return (
              <div
                key={reward.id}
                className={cn(
                  "rounded-2xl border p-5 transition",
                  canRedeem
                    ? "border-gold/40 bg-white hover:shadow-md"
                    : "border-light-muted bg-light/50 opacity-90",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-dark">{reward.title}</h3>
                    <p className="mt-1 text-sm text-dark/60">{reward.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-dark">
                    {reward.pointsCost} pts
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!canRedeem}
                  onClick={() => handleRedeem(reward.id, reward.pointsCost)}
                  className="mt-4 w-full rounded-xl bg-dark py-2.5 text-sm font-semibold text-gold transition hover:bg-dark-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {points >= reward.pointsCost ? "Redeem Reward" : `Need ${reward.pointsCost - points} more pts`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-dark">Recent Activity</h2>
          <ul className="mt-3 space-y-2">
            {history.slice(0, 8).map((entry, i) => (
              <li
                key={`${entry.date}-${i}`}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-light-muted/60"
              >
                <span className="text-dark/80">{entry.label}</span>
                <span
                  className={cn(
                    "font-semibold",
                    entry.type === "earn" ? "text-green-700" : "text-gold-dark",
                  )}
                >
                  {entry.type === "earn" ? "+" : "-"}
                  {entry.points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center">
        <Link
          href="/shop"
          className="inline-flex rounded-full bg-gold px-8 py-3 text-sm font-semibold text-dark transition hover:bg-gold-light"
        >
          Start Shopping to Earn Points
        </Link>
      </div>
    </div>
  );
}
