import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { LoyaltyAccount } from "@/types";
import { normalizePhone } from "@/lib/loyalty";

const accountsPath = path.join(process.cwd(), "src/data/loyalty-accounts.json");

export function getLoyaltyAccounts(): LoyaltyAccount[] {
  try {
    const raw = readFileSync(accountsPath, "utf-8");
    return JSON.parse(raw) as LoyaltyAccount[];
  } catch {
    return [];
  }
}

export function getLoyaltyAccount(phone: string): LoyaltyAccount | null {
  const normalized = normalizePhone(phone);
  return getLoyaltyAccounts().find((a) => a.phone === normalized) ?? null;
}

export function saveLoyaltyAccount(account: LoyaltyAccount): LoyaltyAccount {
  const accounts = getLoyaltyAccounts();
  const normalized = normalizePhone(account.phone);
  const updated: LoyaltyAccount = { ...account, phone: normalized };
  const idx = accounts.findIndex((a) => a.phone === normalized);

  if (idx === -1) {
    accounts.unshift(updated);
  } else {
    accounts[idx] = updated;
  }

  writeFileSync(accountsPath, JSON.stringify(accounts, null, 2));
  return updated;
}
