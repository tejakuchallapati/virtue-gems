import "server-only";

import { randomUUID } from "crypto";
import type {
  AdminProfile,
  Customer,
  CustomerNote,
  FollowUpReminder,
  Order,
  OrderStatus,
  OrderStatusEvent,
  Product,
} from "@/types";
import type { OrderInput } from "@/lib/orders";
import type { ProductInput } from "@/lib/product-store";
import { createSupabaseAdminClient } from "./admin";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  price: number | string;
  original_price: number | string | null;
  images: Product["images"];
  category: Product["category"];
  tags: Product["tags"];
  specifications: Product["specifications"];
  stock: number;
  rating: number | string;
  review_count: number;
  reviews: Product["reviews"];
  active: boolean;
};

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function productFromRow(row: ProductRow): Product & { active?: boolean } {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.long_description,
    price: Number(row.price),
    originalPrice:
      row.original_price === null ? undefined : Number(row.original_price),
    images: row.images ?? [],
    category: row.category,
    tags: row.tags ?? [],
    specifications: row.specifications ?? {},
    stock: row.stock,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    reviews: row.reviews ?? [],
    active: row.active,
  };
}

function productToRow(input: ProductInput, id: string, slug: string) {
  return {
    id,
    slug,
    name: input.name,
    description: input.description,
    long_description:
      input.longDescription ||
      `${input.description}. Handpicked from the Virtue Gems collection.`,
    price: input.price,
    original_price: input.originalPrice ?? null,
    images: input.images,
    category: input.category,
    tags: input.tags,
    specifications: input.specifications ?? {},
    stock: input.stock,
    rating: input.rating ?? 0,
    review_count: input.reviewCount ?? 0,
    reviews: input.reviews ?? [],
    active: input.active ?? true,
    updated_at: new Date().toISOString(),
  };
}

async function uniqueSlug(nameOrSlug: string, excludeId?: string) {
  const supabase = createSupabaseAdminClient();
  const base = slugifyName(nameOrSlug) || `product-${Date.now()}`;
  let slug = base;
  let suffix = 2;
  for (;;) {
    let query = supabase.from("products").select("id").eq("slug", slug);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query.maybeSingle();
    throwIfError(error);
    if (!data) return slug;
    slug = `${base}-${suffix++}`;
  }
}

export async function listSupabaseProducts(options?: {
  includeInactive?: boolean;
}): Promise<(Product & { active?: boolean })[]> {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from("products").select("*").order("name");
  if (!options?.includeInactive) query = query.eq("active", true);
  const { data, error } = await query;
  throwIfError(error);
  return ((data ?? []) as ProductRow[]).map(productFromRow);
}

export async function getSupabaseProductBySlug(slug: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  throwIfError(error);
  return data ? productFromRow(data as ProductRow) : undefined;
}

export async function getSupabaseProductById(
  id: string,
  includeInactive = false,
) {
  const supabase = createSupabaseAdminClient();
  let query = supabase.from("products").select("*").eq("id", id);
  if (!includeInactive) query = query.eq("active", true);
  const { data, error } = await query.maybeSingle();
  throwIfError(error);
  return data ? productFromRow(data as ProductRow) : undefined;
}

export async function createSupabaseProduct(input: ProductInput) {
  const supabase = createSupabaseAdminClient();
  const id = `vg-${Date.now()}-${randomUUID().slice(0, 6)}`;
  const slug = await uniqueSlug(input.slug || input.name);
  const { data, error } = await supabase
    .from("products")
    .insert(productToRow(input, id, slug))
    .select("*")
    .single();
  throwIfError(error);
  return productFromRow(data as ProductRow);
}

export async function updateSupabaseProduct(
  id: string,
  patch: Partial<ProductInput>,
) {
  const existing = await getSupabaseProductById(id, true);
  if (!existing) return null;
  const next: ProductInput = {
    name: patch.name?.trim() || existing.name,
    description: patch.description?.trim() || existing.description,
    longDescription:
      patch.longDescription?.trim() || existing.longDescription,
    price: patch.price ?? existing.price,
    originalPrice:
      patch.originalPrice === null
        ? null
        : (patch.originalPrice ?? existing.originalPrice),
    images: patch.images?.length ? patch.images : existing.images,
    category: patch.category ?? existing.category,
    tags: patch.tags ?? existing.tags,
    specifications: patch.specifications ?? existing.specifications,
    stock: patch.stock ?? existing.stock,
    rating: existing.rating,
    reviewCount: existing.reviewCount,
    reviews: existing.reviews,
    active: patch.active ?? existing.active,
  };
  const slug = await uniqueSlug(patch.slug || next.name, id);
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update(productToRow(next, id, slug))
    .eq("id", id)
    .select("*")
    .single();
  throwIfError(error);
  return productFromRow(data as ProductRow);
}

export async function setSupabaseProductActive(id: string, active: boolean) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  throwIfError(error);
  return Boolean(data);
}

type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total: number | string;
  status: OrderStatus;
  created_at: string;
  order_items?: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number | string;
  }[];
  order_status_history?: {
    id: string;
    order_id: string;
    from_status: OrderStatus | null;
    to_status: OrderStatus;
    note: string | null;
    changed_by: string | null;
    created_at: string;
  }[];
};

function orderFromRow(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map((item) => ({
      productId: item.product_id,
      name: item.product_name,
      quantity: item.quantity,
      price: Number(item.unit_price),
    })),
    statusHistory: (row.order_status_history ?? [])
      .map((event) => ({
        id: event.id,
        orderId: event.order_id,
        fromStatus: event.from_status ?? undefined,
        toStatus: event.to_status,
        note: event.note ?? undefined,
        changedBy: event.changed_by ?? undefined,
        createdAt: event.created_at,
      }))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
  };
}

const ORDER_SELECT =
  "id,customer_name,phone,address,city,state,pincode,total,status,created_at,order_items(product_id,product_name,quantity,unit_price),order_status_history(id,order_id,from_status,to_status,note,changed_by,created_at)";

export async function listSupabaseOrders(): Promise<Order[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });
  throwIfError(error);
  return ((data ?? []) as unknown as OrderRow[]).map(orderFromRow);
}

export async function getSupabaseOrder(id: string): Promise<Order | null> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", id)
    .maybeSingle();
  throwIfError(error);
  return data ? orderFromRow(data as unknown as OrderRow) : null;
}

export async function placeSupabaseOrder(
  input: OrderInput,
  discount = 0,
): Promise<Order> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc("place_whatsapp_order", {
    p_customer_name: input.customerName,
    p_phone: input.phone,
    p_address: input.address,
    p_city: input.city,
    p_state: input.state,
    p_pincode: input.pincode,
    p_items: input.items,
    p_discount: discount,
  });
  throwIfError(error);
  return data as Order;
}

export async function updateSupabaseOrderStatus(
  id: string,
  status: OrderStatus,
  changedBy?: string,
) {
  const supabase = createSupabaseAdminClient();
  const existing = await getSupabaseOrder(id);
  if (!existing) return null;
  const { data, error } = await supabase.rpc("change_order_status", {
    p_order_id: id,
    p_status: status,
    p_changed_by: changedBy ?? null,
  });
  throwIfError(error);
  if (!data) return null;
  return { ...existing, status };
}

type CustomerRow = {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  total_orders: number;
  total_spent: number | string;
  last_order_at: string | null;
  created_at: string;
};

function customerFromRow(row: CustomerRow): Customer {
  return {
    id: row.id,
    phone: row.phone,
    name: row.name,
    email: row.email ?? undefined,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    state: row.state ?? undefined,
    pincode: row.pincode ?? undefined,
    totalOrders: row.total_orders,
    totalSpent: Number(row.total_spent),
    lastOrderAt: row.last_order_at ?? undefined,
    createdAt: row.created_at,
  };
}

export async function listSupabaseCustomers(): Promise<Customer[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("last_order_at", { ascending: false, nullsFirst: false });
  throwIfError(error);
  return ((data ?? []) as CustomerRow[]).map(customerFromRow);
}

export async function listCustomerNotes(
  customerId: string,
): Promise<CustomerNote[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("customer_notes")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  throwIfError(error);
  return (data ?? []).map((row) => ({
    id: row.id,
    customerId: row.customer_id,
    note: row.note,
    createdBy: row.created_by ?? undefined,
    createdAt: row.created_at,
  }));
}

export async function addCustomerNote(
  customerId: string,
  note: string,
  createdBy?: string,
) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("customer_notes")
    .insert({
      customer_id: customerId,
      note,
      created_by: createdBy ?? null,
    })
    .select("*")
    .single();
  throwIfError(error);
  return {
    id: data.id,
    customerId: data.customer_id,
    note: data.note,
    createdBy: data.created_by ?? undefined,
    createdAt: data.created_at,
  } satisfies CustomerNote;
}

export async function listReminders(): Promise<FollowUpReminder[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("follow_up_reminders")
    .select("*")
    .order("due_at");
  throwIfError(error);
  return (data ?? []).map((row) => ({
    id: row.id,
    customerId: row.customer_id ?? undefined,
    orderId: row.order_id ?? undefined,
    title: row.title,
    details: row.details ?? undefined,
    dueAt: row.due_at,
    completedAt: row.completed_at ?? undefined,
    assignedTo: row.assigned_to ?? undefined,
    createdAt: row.created_at,
  }));
}

export async function addReminder(input: {
  customerId?: string;
  orderId?: string;
  title: string;
  details?: string;
  dueAt: string;
  userId?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("follow_up_reminders")
    .insert({
      customer_id: input.customerId ?? null,
      order_id: input.orderId ?? null,
      title: input.title,
      details: input.details ?? null,
      due_at: input.dueAt,
      assigned_to: input.userId ?? null,
      created_by: input.userId ?? null,
    })
    .select("*")
    .single();
  throwIfError(error);
  return {
    id: data.id,
    customerId: data.customer_id ?? undefined,
    orderId: data.order_id ?? undefined,
    title: data.title,
    details: data.details ?? undefined,
    dueAt: data.due_at,
    completedAt: data.completed_at ?? undefined,
    assignedTo: data.assigned_to ?? undefined,
    createdAt: data.created_at,
  } satisfies FollowUpReminder;
}

export async function completeReminder(id: string) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("follow_up_reminders")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", id);
  throwIfError(error);
}

export async function listOrderStatusHistory(
  orderId: string,
): Promise<OrderStatusEvent[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("order_status_history")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at");
  throwIfError(error);
  return (data ?? []).map((row) => ({
    id: row.id,
    orderId: row.order_id,
    fromStatus: row.from_status ?? undefined,
    toStatus: row.to_status,
    note: row.note ?? undefined,
    changedBy: row.changed_by ?? undefined,
    createdAt: row.created_at,
  }));
}

export async function listAdminProfiles(): Promise<AdminProfile[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .order("created_at");
  throwIfError(error);
  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    displayName: row.display_name ?? undefined,
    role: row.role,
    active: row.active,
  }));
}
