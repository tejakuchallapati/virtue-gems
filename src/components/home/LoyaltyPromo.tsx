"use client";

import Link from "next/link";
import { Gift, ShoppingBag, Sparkles, Star, TrendingUp } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionDivider } from "@/components/ui/PageSection";
import { useLoyalty } from "@/context/LoyaltyProvider";
import { LOYALTY_REWARDS } from "@/lib/loyalty";

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Shop",
    text: "Order any piece you love via WhatsApp checkout",
  },
  {
    icon: Star,
    title: "Earn Points",
    text: "Get 1 point for every ₹100 spent — minimum 5 pts per order",
  },
  {
    icon: Gift,
    title: "Redeem",
    text: "Unlock discounts or free rings & earrings",
  },
] as const;

function nextReward(points: number) {
  return LOYALTY_REWARDS.find((reward) => points < reward.pointsCost);
}

export function LoyaltyPromo() {
  const { points, hydrated } = useLoyalty();
  const upcoming = hydrated ? nextReward(points) : LOYALTY_REWARDS[0];
  const pointsAway = upcoming && hydrated ? upcoming.pointsCost - points : null;

  return (
    <>
      <SectionDivider />
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0a2e] via-[#2d1450] to-[#1a0a2e] py-14 sm:py-20">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gold/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] tracking-[0.25em] text-gold uppercase sm:text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Virtue Gems Rewards
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-light sm:text-4xl">
            Shop More. Earn More. Get Free Jewellery.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-light/70 sm:text-base">
            Every purchase earns loyalty points automatically. Redeem them for up to{" "}
            <span className="font-medium text-gold">50% off</span> or{" "}
            <span className="font-medium text-gold">free earrings</span> on your next order.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm sm:text-left"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold sm:mx-0">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold text-light">{title}</h3>
              <p className="mt-1 text-sm text-light/60">{text}</p>
            </div>
          ))}
        </ScrollReveal>

        {hydrated && points > 0 ? (
          <ScrollReveal delay={0.1} className="mt-8">
            <div className="mx-auto flex max-w-xl flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-5 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-sm font-semibold text-light">
                    You have <span className="text-gold">{points} points</span>
                  </p>
                  {pointsAway !== null && pointsAway > 0 && upcoming && (
                    <p className="text-xs text-light/60">
                      {pointsAway} more pts to unlock {upcoming.title}
                    </p>
                  )}
                </div>
              </div>
              <Link
                href="/rewards"
                className="text-xs font-semibold text-gold underline-offset-2 hover:underline"
              >
                Redeem now →
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={0.1} className="mt-8 text-center">
            <p className="inline-block rounded-full border border-gold/20 bg-white/5 px-5 py-2 text-sm text-light/75">
              Example: a <span className="font-semibold text-gold">₹2,000</span> order earns{" "}
              <span className="font-semibold text-gold">20 points</span> instantly
            </p>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.12} className="mt-10">
          <p className="mb-4 text-center text-xs tracking-[0.2em] text-gold uppercase">
            Unlock These Rewards
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {LOYALTY_REWARDS.map((reward) => {
              const unlocked = hydrated && points >= reward.pointsCost;
              return (
                <div
                  key={reward.id}
                  className={`rounded-2xl border p-4 transition sm:p-5 ${
                    unlocked
                      ? "border-gold/50 bg-gold/10"
                      : "border-gold/20 bg-white/5 hover:border-gold/35"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Gift className="h-5 w-5 shrink-0 text-gold" />
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold">
                      {reward.pointsCost} pts
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-light">{reward.title}</h3>
                  <p className="mt-1 hidden text-xs text-light/55 sm:block">
                    {reward.description}
                  </p>
                  {unlocked && (
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-gold">
                      Ready to redeem
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-semibold text-dark transition hover:bg-gold-light sm:w-auto"
          >
            <ShoppingBag className="h-4 w-4" />
            Start Shopping &amp; Earn Points
          </Link>
          <Link
            href="/rewards"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 px-8 py-3.5 text-sm font-semibold text-gold transition hover:bg-gold/10 sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            View All Rewards
          </Link>
        </ScrollReveal>
      </div>
    </section>
      <SectionDivider />
    </>
  );
}
