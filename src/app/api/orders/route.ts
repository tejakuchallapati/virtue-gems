import { saveOrderSafe, validateOrderInput } from "@/lib/orders";
import { apiFail, apiOk, checkRateLimit, clientIp, parseJsonBody } from "@/lib/api-server";

export async function POST(request: Request) {
  const limited = checkRateLimit(`orders:${clientIp(request)}`, 20, 60_000);
  if (limited) return limited;

  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const validated = validateOrderInput(parsed.data);
  if (typeof validated === "string") return apiFail(validated, 400);

  try {
    const order = await saveOrderSafe(validated);
    return apiOk({ order });
  } catch (error) {
    console.error("Order save error:", error);
    return apiFail("Failed to save order. Please try again.", 500);
  }
}
