import Link from "next/link";
import { Gift, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LOYALTY_REWARDS } from "@/lib/loyalty";

export function LoyaltyPromo() {
  const topReward = LOYALTY_REWARDS[LOYALTY_REWARDS.length - 1];

  return (
    <section className="bg-gradient-to-br from-[#1a0a2e] via-[#2d1450] to-[#1a0a2e] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center">
          <p className="text-sm tracking-[0.2em] text-gold uppercase">Rewards Club</p>
          <h2 className="mt-2 text-2xl font-semibold text-light sm:text-3xl">
            Earn Points. Unlock Free Jewellery.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-light/70 sm:text-base">
            Every purchase earns points. Redeem for 15% off, 50% discount, free simple rings,
            or free earrings.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {LOYALTY_REWARDS.map((reward) => (
            <div
              key={reward.id}
              className="rounded-xl border border-gold/20 bg-white/5 p-4 text-center backdrop-blur-sm"
            >
              <Gift className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-2 text-xs font-semibold text-light sm:text-sm">{reward.title}</p>
              <p className="mt-1 text-[10px] text-gold sm:text-xs">{reward.pointsCost} points</p>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/rewards"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-dark transition hover:bg-gold-light"
          >
            <Sparkles className="h-4 w-4" />
            View Rewards
          </Link>
          <p className="text-xs text-light/50">
            Top reward: {topReward.title} at {topReward.pointsCost} points
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
