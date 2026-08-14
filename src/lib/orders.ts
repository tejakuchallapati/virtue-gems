import type { Order, OrderStatus } from "@/types";
import { DELIVERY_STATES } from "@/lib/delivery";
import { normalizeOrderStatus } from "@/lib/order-status";
import { getProductById } from "@/lib/products";
import { getProductByIdSafe } from "@/lib/products-server";
import { backupOrdersJson, backupProductsJson } from "@/lib/db/backup";
import { getDb, withTransaction } from "@/lib/db";
import { uniqueId } from "@/lib/json-store";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export type OrderInput = Omit<Order, "id" | "createdAt" | "status">;

type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: string;
  total: number;
  status: string;
  created_at: string;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    items: JSON.parse(row.items),
    total: row.total,
    status: normalizeOrderStatus(row.status),
    createdAt: row.created_at,
  };
}

export function validateOrderInput(body: Record<string, unknown>): OrderInput | string {
  const customerName =
    typeof body.customerName === "string" ? body.customerName.trim() : "";
  const phone =
    typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const state = typeof body.state === "string" ? body.state.trim() : "";
  const pincode = typeof body.pincode === "string" ? body.pincode.trim() : "";
  const total = body.total;
  const items = body.items;

  if (!customerName || customerName.length > 120) return "Valid customer name is required.";
  if (phone.length < 10 || phone.length > 15) return "Valid phone number is required.";
  if (!address || address.length > 500) return "Valid address is required.";
  if (!city || city.length > 100) return "Valid city is required.";
  if (!state || !DELIVERY_STATES.includes(state as (typeof DELIVERY_STATES)[number])) {
    return "Delivery is available in Andhra Pradesh and Telangana only.";
  }
  if (!pincode || !/^\d{6}$/.test(pincode)) return "Valid 6-digit pincode is required.";
  if (typeof total !== "number" || !Number.isFinite(total) || total < 0 || total > 1_000_000) {
    return "Invalid order total.";
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return "Order must include at least one item.";
  }

  const parsedItems: OrderInput["items"] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") return "Invalid order item.";
    const row = item as Record<string, unknown>;
    const productId = typeof row.productId === "string" ? row.productId.trim() : "";
    const name = typeof row.name === "string" ? row.name.trim() : "";
    const quantity = row.quantity;
    const price = row.price;

    if (!productId || !name) return "Invalid order item details.";
    const catalogProduct = getProductById(productId);
    if (!catalogProduct) return "Unknown product in order.";
    if (catalogProduct.price !== price) return "Invalid item price.";
    if (name !== catalogProduct.name) return "Invalid item name.";
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return "Invalid item quantity.";
    }
    if (catalogProduct.stock < quantity) {
      return `"${catalogProduct.name}" only has ${catalogProduct.stock} in stock.`;
    }
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0 || price > 100_000) {
      return "Invalid item price.";
    }

    parsedItems.push({ productId, name: catalogProduct.name, quantity, price });
  }

  const subtotal = parsedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (Math.abs(total - subtotal) > 0.01) {
    return "Order total does not match the live catalog.";
  }

  return {
    customerName,
    phone,
    address,
    city,
    state,
    pincode,
    items: parsedItems,
    total,
  };
}

export function getOrders(): Order[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all() as OrderRow[];
  return rows.map(rowToOrder);
}

export function getOrderById(id: string): Order | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
  return row ? rowToOrder(row) : null;
}

export function saveOrder(order: OrderInput): Order {
  const newOrder: Order = {
    ...order,
    id: uniqueId("ORD"),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  withTransaction((db) => {
    for (const item of newOrder.items) {
      const result = db
        .prepare(
          `UPDATE products
           SET stock = stock - ?, updated_at = ?
           WHERE id = ? AND active = 1 AND stock >= ?`,
        )
        .run(item.quantity, new Date().toISOString(), item.productId, item.quantity);
      if (result.changes === 0) {
        throw new Error(
          `"${item.name}" is out of stock or no longer available.`,
        );
      }
    }

    db.prepare(`
      INSERT INTO orders
        (id, customer_name, phone, address, city, state, pincode, items, total, status, created_at)
      VALUES
        (@id, @customer_name, @phone, @address, @city, @state, @pincode, @items, @total, @status, @created_at)
    `).run({
      id: newOrder.id,
      customer_name: newOrder.customerName,
      phone: newOrder.phone,
      address: newOrder.address,
      city: newOrder.city,
      state: newOrder.state,
      pincode: newOrder.pincode,
      items: JSON.stringify(newOrder.items),
      total: newOrder.total,
      status: newOrder.status,
      created_at: newOrder.createdAt,
    });
  });

  backupOrdersJson(getDb());
  backupProductsJson(getDb());
  return newOrder;
}

export async function saveOrderSafe(order: OrderInput): Promise<Order> {
  if (isSupabaseAdminConfigured()) {
    const { placeSupabaseOrder } = await import("@/lib/supabase/store");
    return placeSupabaseOrder(order, 0);
  }
  return saveOrder(order);
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  let updated: Order | null = null;

  withTransaction((db) => {
    const result = db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
    if (result.changes === 0) return;

    const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
    if (row) updated = rowToOrder(row);
  });

  if (updated) backupOrdersJson(getDb());
  return updated;
}

export async function updateOrderStatusSafe(
  id: string,
  status: OrderStatus,
  changedBy?: string,
): Promise<Order | null> {
  if (isSupabaseAdminConfigured()) {
    const { updateSupabaseOrderStatus } = await import("@/lib/supabase/store");
    return updateSupabaseOrderStatus(id, status, changedBy);
  }
  return updateOrderStatus(id, status);
}

export async function getOrdersSafe(): Promise<Order[]> {
  if (!isSupabaseAdminConfigured()) return getOrders();
  const { listSupabaseOrders } = await import("@/lib/supabase/store");
  return listSupabaseOrders();
}

export async function getOrderByIdSafe(id: string): Promise<Order | null> {
  if (!isSupabaseAdminConfigured()) return getOrderById(id);
  const { getSupabaseOrder } = await import("@/lib/supabase/store");
  return getSupabaseOrder(id);
}

/** Validates against the live Supabase catalog when production storage is enabled. */
export async function validateOrderInputSafe(
  body: Record<string, unknown>,
): Promise<OrderInput | string> {
  if (!isSupabaseAdminConfigured()) return validateOrderInput(body);

  const customerName =
    typeof body.customerName === "string" ? body.customerName.trim() : "";
  const phone =
    typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const state = typeof body.state === "string" ? body.state.trim() : "";
  const pincode = typeof body.pincode === "string" ? body.pincode.trim() : "";
  const total = body.total;
  const items = body.items;

  if (!customerName || customerName.length > 120)
    return "Valid customer name is required.";
  if (phone.length < 10 || phone.length > 15)
    return "Valid phone number is required.";
  if (!address || address.length > 500) return "Valid address is required.";
  if (!city || city.length > 100) return "Valid city is required.";
  if (
    !state ||
    !DELIVERY_STATES.includes(state as (typeof DELIVERY_STATES)[number])
  ) {
    return "Delivery is available in Andhra Pradesh and Telangana only.";
  }
  if (!/^\d{6}$/.test(pincode)) return "Valid 6-digit pincode is required.";
  if (
    typeof total !== "number" ||
    !Number.isFinite(total) ||
    total < 0 ||
    total > 1_000_000
  ) {
    return "Invalid order total.";
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return "Order must include at least one item.";
  }

  const parsedItems: OrderInput["items"] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") return "Invalid order item.";
    const row = item as Record<string, unknown>;
    const productId =
      typeof row.productId === "string" ? row.productId.trim() : "";
    const quantity = row.quantity;
    if (
      !productId ||
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return "Invalid order item details.";
    }
    const product = await getProductByIdSafe(productId);
    if (!product) return "A product is no longer available.";
    if (product.stock < quantity) {
      return `"${product.name}" only has ${product.stock} in stock.`;
    }
    parsedItems.push({
      productId,
      name: product.name,
      quantity,
      price: product.price,
    });
  }

  const subtotal = parsedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  if (Math.abs(total - subtotal) > 0.01) {
    return "Order total does not match the live catalog.";
  }

  return {
    customerName,
    phone,
    address,
    city,
    state,
    pincode,
    items: parsedItems,
    total,
  };
}
