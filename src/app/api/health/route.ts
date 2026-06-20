import { NextResponse } from "next/server";
import { getDbPath, isDbHealthy } from "@/lib/db";
import { isEmailConfigured } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbOk = isDbHealthy();

  const checks = {
    database: dbOk,
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
    databasePath: process.env.NODE_ENV === "development" ? getDbPath() : undefined,
  });
}
