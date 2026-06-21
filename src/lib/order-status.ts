import type { OrderStatus } from "@/types";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "paid",
  "shipped",
  "delivered",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
};

const LEGACY_STATUS_MAP: Record<string, OrderStatus> = {
  processing: "confirmed",
  completed: "delivered",
};

export function normalizeOrderStatus(status: string): OrderStatus {
  if (ORDER_STATUSES.includes(status as OrderStatus)) {
    return status as OrderStatus;
  }
  return LEGACY_STATUS_MAP[status] ?? "pending";
}

export function isValidOrderStatus(status: string): status is OrderStatus {
  return ORDER_STATUSES.includes(status as OrderStatus);
}
