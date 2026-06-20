import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrders, updateOrderStatusSafe } from "@/lib/orders";
import type { OrderStatus } from "@/types";
import { apiFail, apiOk, parseJsonBody } from "@/lib/api-server";

const VALID_STATUSES: OrderStatus[] = ["pending", "processing", "completed"];

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return apiFail("Unauthorized.", 401);
  }

  try {
    return NextResponse.json(getOrders());
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return apiFail("Failed to load orders.", 500);
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return apiFail("Unauthorized.", 401);
  }

  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const id = typeof parsed.data.id === "string" ? parsed.data.id.trim() : "";
  const status = parsed.data.status;

  if (!id) return apiFail("Order id required.", 400);
  if (typeof status !== "string" || !VALID_STATUSES.includes(status as OrderStatus)) {
    return apiFail("Invalid status.", 400);
  }

  try {
    const order = await updateOrderStatusSafe(id, status as OrderStatus);
    if (!order) return apiFail("Order not found.", 404);
    return apiOk({ order });
  } catch (error) {
    console.error("Admin order PATCH error:", error);
    return apiFail("Failed to update order.", 500);
  }
}
