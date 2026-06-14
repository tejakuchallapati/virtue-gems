import type { ActiveRedemption, LoyaltyReward } from "@/types";

/** 1 point for every ₹100 spent, minimum 5 points per order */
export function calculatePointsEarned(orderTotal: number): number {
  return Math.max(5, Math.floor(orderTotal / 100));
}

export const LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: "reward-15-off",
    title: "15% Off",
    description: "15% discount on your next order",
    pointsCost: 80,
    type: "percent_off",
    percentOff: 15,
  },
  {
    id: "reward-free-ring",
    title: "Free Simple Ring",
    description: "Choose any simple ring up to ₹599 — on us",
    pointsCost: 160,
    type: "free_item",
    freeItemLabel: "Simple ring (up to ₹599)",
  },
  {
    id: "reward-50-off",
    title: "50% Off",
    description: "50% off on one item (maximum ₹1,000 discount)",
    pointsCost: 280,
    type: "percent_off",
    percentOff: 50,
    maxDiscount: 1000,
  },
  {
    id: "reward-free-earrings",
    title: "Free Earrings",
    description: "Pick any earrings up to ₹799 — completely free",
    pointsCost: 400,
    type: "free_item",
    freeItemLabel: "Earrings (up to ₹799)",
  },
];

export function getRewardById(id: string): LoyaltyReward | undefined {
  return LOYALTY_REWARDS.find((r) => r.id === id);
}

export function redemptionFromReward(reward: LoyaltyReward): ActiveRedemption {
  return {
    rewardId: reward.id,
    title: reward.title,
    type: reward.type,
    percentOff: reward.percentOff,
    freeItemLabel: reward.freeItemLabel,
    maxDiscount: reward.maxDiscount,
    pointsCost: reward.pointsCost,
  };
}

export function calculateDiscount(
  cartTotal: number,
  redemption: ActiveRedemption | null,
): number {
  if (!redemption || redemption.type !== "percent_off" || !redemption.percentOff) {
    return 0;
  }
  const raw = Math.floor((cartTotal * redemption.percentOff) / 100);
  if (redemption.maxDiscount) {
    return Math.min(raw, redemption.maxDiscount);
  }
  return raw;
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}
