import type { LoyaltyAccount } from "@/types";
import { normalizePhone } from "@/lib/loyalty";
import { backupLoyaltyJson } from "@/lib/db/backup";
import { getDb, withTransaction } from "@/lib/db";

type LoyaltyRow = {
  phone: string;
  name: string | null;
  points: number;
  lifetime_points: number;
  history: string;
  updated_at: string;
};

function rowToAccount(row: LoyaltyRow): LoyaltyAccount {
  return {
    phone: row.phone,
    name: row.name ?? undefined,
    points: row.points,
    lifetimePoints: row.lifetime_points,
    history: JSON.parse(row.history),
  };
}

export function getLoyaltyAccounts(): LoyaltyAccount[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM loyalty_accounts ORDER BY updated_at DESC")
    .all() as LoyaltyRow[];
  return rows.map(rowToAccount);
}

export function getLoyaltyAccount(phone: string): LoyaltyAccount | null {
  const normalized = normalizePhone(phone);
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM loyalty_accounts WHERE phone = ?")
    .get(normalized) as LoyaltyRow | undefined;
  return row ? rowToAccount(row) : null;
}

export function saveLoyaltyAccount(account: LoyaltyAccount): LoyaltyAccount {
  const normalized = normalizePhone(account.phone);
  const updated: LoyaltyAccount = {
    ...account,
    phone: normalized,
    history: (account.history ?? []).slice(0, 20),
  };
  const now = new Date().toISOString();

  withTransaction((db) => {
    db.prepare(`
      INSERT INTO loyalty_accounts (phone, name, points, lifetime_points, history, updated_at)
      VALUES (@phone, @name, @points, @lifetime_points, @history, @updated_at)
      ON CONFLICT(phone) DO UPDATE SET
        name = excluded.name,
        points = excluded.points,
        lifetime_points = excluded.lifetime_points,
        history = excluded.history,
        updated_at = excluded.updated_at
    `).run({
      phone: updated.phone,
      name: updated.name ?? "",
      points: Math.round(updated.points),
      lifetime_points: Math.round(updated.lifetimePoints),
      history: JSON.stringify(updated.history),
      updated_at: now,
    });
  });

  backupLoyaltyJson(getDb());
  return updated;
}

export async function saveLoyaltyAccountSafe(
  account: LoyaltyAccount,
): Promise<LoyaltyAccount> {
  return saveLoyaltyAccount(account);
}
