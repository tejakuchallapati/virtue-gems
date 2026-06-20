import { mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";

let writeChain = Promise.resolve();

function pauseSync(ms: number) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    /* wait for concurrent write to finish */
  }
}

/** Serialize JSON file writes so concurrent requests don't corrupt data. */
export function withJsonWriteLock<T>(fn: () => T | Promise<T>): Promise<T> {
  const run = writeChain.then(() => fn());
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function readJsonFile<T>(filePath: string, fallback: T): T {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const raw = readFileSync(filePath, "utf-8");
      if (!raw.trim()) return fallback;
      return JSON.parse(raw) as T;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOENT") return fallback;
      if (attempt < 2) {
        pauseSync(20);
        continue;
      }
      console.error(`readJsonFile failed: ${filePath}`, err);
      return fallback;
    }
  }
  return fallback;
}

export function writeJsonFileAtomic(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath);
  mkdirSync(dir, { recursive: true });
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  const payload = JSON.stringify(data, null, 2);
  writeFileSync(tmp, payload, "utf-8");
  renameSync(tmp, filePath);
}

function uniqueId(prefix: string) {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

export { uniqueId };
