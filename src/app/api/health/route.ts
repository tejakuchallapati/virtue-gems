import { NextResponse } from "next/server";
import { getDbPath, isDbHealthy } from "@/lib/db";
import { isEmailConfigured } from "@/lib/email";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const usingSupabase = isSupabaseAdminConfigured();
  let dbOk = false;
  if (usingSupabase) {
    try {
      const { error } = await createSupabaseAdminClient()
        .from("products")
        .select("id", { count: "exact", head: true });
      dbOk = !error;
    } catch {
      dbOk = false;
    }
  } else {
    dbOk = isDbHealthy();
  }

  const checks = {
    database: dbOk,
    databaseProvider: usingSupabase ? "supabase" : "sqlite",
    email: isEmailConfigured(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  if (!dbOk) {
    return NextResponse.json(
      { status: "degraded", checks, error: "Database unavailable" },
      { status: 503 },
    );
  }

  return NextResponse.json({
    status: "ok",
    checks,
    databasePath:
      !usingSupabase && process.env.NODE_ENV === "development"
        ? getDbPath()
        : undefined,
  });
}
