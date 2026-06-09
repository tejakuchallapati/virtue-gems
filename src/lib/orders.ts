import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { Order, OrderStatus } from "@/types";

const ordersPath = path.join(process.cwd(), "src/data/orders.json");

export function getOrders(): Order[] {
  try {
    const raw = readFileSync(ordersPath, "utf-8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function saveOrder(order: Omit<Order, "id" | "createdAt" | "status">): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: `ORD-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  return newOrder;
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx].status = status;
  writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  return orders[idx];
}
