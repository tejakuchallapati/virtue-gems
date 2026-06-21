import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { initSchema } from "./schema";
import { migrateFromJsonIfNeeded, migrateLegacyOrderStatuses } from "./migrate";

const DB_DIR = process.env.DATABASE_DIR ?? path.join(process.cwd(), "data");
const DB_PATH = process.env.DATABASE_PATH ?? path.join(DB_DIR, "virtue-gems.db");

let db: Database.Database | null = null;
let initError: Error | null = null;

export function getDb(): Database.Database {
  if (initError) throw initError;

  if (!db) {
    try {
      fs.mkdirSync(DB_DIR, { recursive: true });
      db = new Database(DB_PATH);
      db.pragma("journal_mode = WAL");
      db.pragma("busy_timeout = 5000");
      db.pragma("synchronous = NORMAL");
      db.pragma("foreign_keys = ON");
      initSchema(db);
      migrateFromJsonIfNeeded(db);
      migrateLegacyOrderStatuses(db);
    } catch (err) {
      initError = err instanceof Error ? err : new Error(String(err));
      throw initError;
    }
  }

  return db;
}

export function isDbHealthy(): boolean {
  try {
    getDb().prepare("SELECT 1 AS ok").get();
    return true;
  } catch {
    return false;
  }
}

export function getDbPath() {
  return DB_PATH;
}

/** Run work inside a SQLite transaction — safe for concurrent requests. */
export function withTransaction<T>(fn: (database: Database.Database) => T): T {
  const database = getDb();
  const run = database.transaction(() => fn(database));
  return run();
}
