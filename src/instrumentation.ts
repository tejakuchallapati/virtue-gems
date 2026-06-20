export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getDb } = await import("@/lib/db");
    try {
      getDb();
    } catch (err) {
      console.error("[Virtue Gems] Database init failed on startup:", err);
    }
  }
}
