"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getStorage, setStorage, STORAGE_KEYS } from "@/lib/storage";
import {
  calculatePointsEarned,
  getRewardById,
  normalizePhone,
  redemptionFromReward,
} from "@/lib/loyalty";
import type { ActiveRedemption, LoyaltyAccount, LoyaltyHistoryEntry } from "@/types";

type LoyaltyContextValue = {
  points: number;
  phone: string;
  name: string;
  history: LoyaltyHistoryEntry[];
  activeRedemption: ActiveRedemption | null;
  hydrated: boolean;
  setPhone: (phone: string) => void;
  setName: (name: string) => void;
  loadAccount: (phone: string) => Promise<void>;
  redeemReward: (rewardId: string) => boolean;
  clearRedemption: () => void;
  completeOrder: (
    phone: string,
    name: string,
    orderTotal: number,
  ) => Promise<{ earned: number; balanceAfter: number }>;
};

const LoyaltyContext = createContext<LoyaltyContextValue | null>(null);

const emptyAccount = (): Omit<LoyaltyAccount, "phone"> => ({
  name: "",
  points: 0,
  lifetimePoints: 0,
  history: [],
});

export function LoyaltyProvider({ children }: { children: React.ReactNode }) {
  const [phone, setPhoneState] = useState("");
  const [name, setNameState] = useState("");
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<LoyaltyHistoryEntry[]>([]);
  const [lifetimePoints, setLifetimePoints] = useState(0);
  const [activeRedemption, setActiveRedemption] = useState<ActiveRedemption | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = getStorage<LoyaltyAccount | null>(STORAGE_KEYS.loyalty, null);
    const storedRedemption = getStorage<ActiveRedemption | null>(
      STORAGE_KEYS.activeRedemption,
      null,
    );

    if (stored) {
      setPhoneState(stored.phone);
      setNameState(stored.name ?? "");
      setPoints(stored.points);
      setLifetimePoints(stored.lifetimePoints);
      setHistory(stored.history ?? []);
    }
    setActiveRedemption(storedRedemption);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStorage(STORAGE_KEYS.activeRedemption, activeRedemption);
  }, [activeRedemption, hydrated]);

  const applyAccount = useCallback((account: LoyaltyAccount) => {
    setPhoneState(account.phone);
    setNameState(account.name ?? "");
    setPoints(account.points);
    setLifetimePoints(account.lifetimePoints);
    setHistory(account.history ?? []);
    setStorage(STORAGE_KEYS.loyalty, account);
  }, []);

  const loadAccount = useCallback(
    async (rawPhone: string) => {
      const normalized = normalizePhone(rawPhone);
      if (normalized.length < 10) return;

      try {
        const res = await fetch(`/api/loyalty?phone=${normalized}`);
        const data = await res.json();
        if (data.account) {
          applyAccount(data.account);
          return;
        }
      } catch {
        // fall back to local
      }

      const local = getStorage<LoyaltyAccount | null>(STORAGE_KEYS.loyalty, null);
      if (local?.phone === normalized) {
        applyAccount(local);
      } else {
        applyAccount({
          phone: normalized,
          ...emptyAccount(),
        });
      }
    },
    [applyAccount],
  );

  const setPhone = useCallback((value: string) => {
    setPhoneState(normalizePhone(value));
  }, []);

  const setName = useCallback((value: string) => {
    setNameState(value);
  }, []);

  const redeemReward = useCallback(
    (rewardId: string) => {
      const reward = getRewardById(rewardId);
      if (!reward || points < reward.pointsCost) return false;

      setActiveRedemption(redemptionFromReward(reward));
      return true;
    },
    [points],
  );

  const clearRedemption = useCallback(() => {
    setActiveRedemption(null);
  }, []);

  const syncAccount = useCallback(async (account: LoyaltyAccount) => {
    applyAccount(account);
    try {
      await fetch("/api/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });
    } catch {
      // local state already updated
    }
  }, [applyAccount]);

  const completeOrder = useCallback(
    async (orderPhone: string, orderName: string, orderTotal: number) => {
      const normalized = normalizePhone(orderPhone);
      const earned = calculatePointsEarned(orderTotal);
      const now = new Date().toISOString();

      let currentPoints = points;
      let currentLifetime = lifetimePoints;
      let currentHistory = [...history];
      let currentPhone = phone;
      let currentName = name;

      if (currentPhone !== normalized) {
        try {
          const res = await fetch(`/api/loyalty?phone=${normalized}`);
          const data = await res.json();
          if (data.account) {
            currentPoints = data.account.points;
            currentLifetime = data.account.lifetimePoints;
            currentHistory = data.account.history ?? [];
          } else {
            currentPoints = 0;
            currentLifetime = 0;
            currentHistory = [];
          }
        } catch {
          currentPoints = 0;
          currentLifetime = 0;
          currentHistory = [];
        }
        currentPhone = normalized;
      }

      currentName = orderName || currentName;

      if (activeRedemption) {
        currentPoints = Math.max(0, currentPoints - activeRedemption.pointsCost);
        currentHistory.unshift({
          type: "redeem",
          points: activeRedemption.pointsCost,
          label: `Redeemed: ${activeRedemption.title}`,
          date: now,
        });
        setActiveRedemption(null);
      }

      currentPoints += earned;
      currentLifetime += earned;
      currentHistory.unshift({
        type: "earn",
        points: earned,
        label: `Order — earned ${earned} points`,
        date: now,
      });

      const account: LoyaltyAccount = {
        phone: currentPhone,
        name: currentName,
        points: currentPoints,
        lifetimePoints: currentLifetime,
        history: currentHistory.slice(0, 20),
      };

      await syncAccount(account);
      return { earned, balanceAfter: currentPoints };
    },
    [phone, name, points, lifetimePoints, history, activeRedemption, syncAccount],
  );

  const value = useMemo(
    () => ({
      points,
      phone,
      name,
      history,
      activeRedemption,
      hydrated,
      setPhone,
      setName,
      loadAccount,
      redeemReward,
      clearRedemption,
      completeOrder,
    }),
    [
      points,
      phone,
      name,
      history,
      activeRedemption,
      hydrated,
      setPhone,
      setName,
      loadAccount,
      redeemReward,
      clearRedemption,
      completeOrder,
    ],
  );

  return (
    <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const ctx = useContext(LoyaltyContext);
  if (!ctx) throw new Error("useLoyalty must be used within LoyaltyProvider");
  return ctx;
}
