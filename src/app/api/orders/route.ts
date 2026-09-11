import { saveOrderSafe, validateOrderInputSafe } from "@/lib/orders";
import { apiFail, apiOk, checkRateLimit, clientIp, parseJsonBody } from "@/lib/api-server";

export async function POST(request: Request) {
  const limited = checkRateLimit(`orders:${clientIp(request)}`, 20, 60_000);
  if (limited) return limited;

  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const validated = await validateOrderInputSafe(parsed.data);
  if (typeof validated === "string") return apiFail(validated, 400);

  try {
    const order = await saveOrderSafe(validated);
    return apiOk({ order });
  } catch (error) {
    console.error("Order save error:", error);
    if (error instanceof Error && /stock|available/i.test(error.message)) {
      return apiFail(error.message, 409);
    }
    const detail =
      error instanceof Error ? error.message : "Unknown database error";
    // Surface actionable guidance — Vercel needs Supabase for durable orders.
    if (/ENOENT|readonly|EACCES|better-sqlite|database|supabase|rpc/i.test(detail)) {
      return apiFail(
        "We could not save your order on the server right now. Please continue on WhatsApp and we will confirm it manually.",
        503,
      );
    }
    return apiFail(
      "Failed to save order. Please try again, or continue on WhatsApp if the issue persists.",
      500,
    );
  }
}
