#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { createClient } from "@supabase/supabase-js";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const index = line.indexOf("=");
    if (index < 1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(path.join(process.cwd(), ".env.local"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbPath =
  process.env.DATABASE_PATH ||
  path.join(process.cwd(), "data", "virtue-gems.db");
const bucket =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "product-images";

if (!supabaseUrl || !serviceKey) {
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
  );
}
if (!fs.existsSync(dbPath)) {
  throw new Error(`SQLite database not found: ${dbPath}`);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const db = new Database(dbPath, { readonly: true });

function must(error, context) {
  if (error) throw new Error(`${context}: ${error.message}`);
}

async function migrateImage(imagePath) {
  if (!imagePath.startsWith("/")) return imagePath;
  const localPath = path.join(process.cwd(), "public", imagePath);
  if (!fs.existsSync(localPath)) {
    console.warn(`  image missing, keeping path: ${imagePath}`);
    return imagePath;
  }
  const filename = path.basename(localPath).replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `migration/${filename}`;
  const extension = path.extname(filename).toLowerCase();
  const contentType =
    extension === ".png"
      ? "image/png"
      : extension === ".webp"
        ? "image/webp"
        : "image/jpeg";
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, fs.readFileSync(localPath), {
      contentType,
      cacheControl: "31536000",
      upsert: true,
    });
  must(error, `Upload ${filename}`);
  return supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
}

async function migrateProducts() {
  const rows = db.prepare("select * from products order by id").all();
  console.log(`Migrating ${rows.length} products…`);
  for (const row of rows) {
    const sourceImages = JSON.parse(row.images || "[]");
    const images = [];
    for (const image of sourceImages) images.push(await migrateImage(image));
    const { error } = await supabase.from("products").upsert({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      long_description: row.long_description,
      price: row.price,
      original_price: row.original_price,
      images,
      category: row.category,
      tags: JSON.parse(row.tags || "[]"),
      specifications: JSON.parse(row.specifications || "{}"),
      stock: row.stock,
      rating: row.rating,
      review_count: row.review_count,
      reviews: JSON.parse(row.reviews || "[]"),
      active: Boolean(row.active),
      updated_at: row.updated_at,
    });
    must(error, `Product ${row.id}`);
  }
}

async function migrateOrders() {
  const rows = db.prepare("select * from orders order by created_at").all();
  console.log(`Migrating ${rows.length} orders…`);
  const customerStats = new Map();

  for (const row of rows) {
    const current = customerStats.get(row.phone) || {
      phone: row.phone,
      name: row.customer_name,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      total_orders: 0,
      total_spent: 0,
      last_order_at: row.created_at,
    };
    current.name = row.customer_name;
    current.address = row.address;
    current.city = row.city;
    current.state = row.state;
    current.pincode = row.pincode;
    current.total_orders += 1;
    current.total_spent += Number(row.total);
    current.last_order_at = row.created_at;
    customerStats.set(row.phone, current);
  }

  const customerIds = new Map();
  for (const customer of customerStats.values()) {
    const { data, error } = await supabase
      .from("customers")
      .upsert(customer, { onConflict: "phone" })
      .select("id,phone")
      .single();
    must(error, `Customer ${customer.phone}`);
    customerIds.set(data.phone, data.id);
  }

  for (const row of rows) {
    const items = JSON.parse(row.items || "[]");
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );
    const { error } = await supabase.from("orders").upsert({
      id: row.id,
      customer_id: customerIds.get(row.phone),
      customer_name: row.customer_name,
      phone: row.phone,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      subtotal,
      discount: Math.max(0, subtotal - Number(row.total)),
      total: row.total,
      status: row.status,
      source: "whatsapp",
      created_at: row.created_at,
      updated_at: row.created_at,
    });
    must(error, `Order ${row.id}`);

    const { error: deleteError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", row.id);
    must(deleteError, `Clear order items ${row.id}`);
    if (items.length) {
      const { error: itemError } = await supabase.from("order_items").insert(
        items.map((item) => ({
          order_id: row.id,
          product_id: item.productId,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      );
      must(itemError, `Order items ${row.id}`);
    }
    const { data: history } = await supabase
      .from("order_status_history")
      .select("id")
      .eq("order_id", row.id)
      .limit(1);
    if (!history?.length) {
      const { error: historyError } = await supabase
        .from("order_status_history")
        .insert({
          order_id: row.id,
          from_status: null,
          to_status: row.status,
          note: "Imported from local SQLite",
          created_at: row.created_at,
        });
      must(historyError, `Order history ${row.id}`);
    }
  }
}

async function migrateLoyalty() {
  const rows = db.prepare("select * from loyalty_accounts").all();
  if (!rows.length) return;
  const { error } = await supabase.from("loyalty_accounts").upsert(
    rows.map((row) => ({
      phone: row.phone,
      name: row.name,
      points: row.points,
      lifetime_points: row.lifetime_points,
      history: JSON.parse(row.history || "[]"),
      updated_at: row.updated_at,
    })),
  );
  must(error, "Loyalty accounts");
}

async function createInitialOwner() {
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log(
      "Skipping owner creation (set INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD to enable).",
    );
    return;
  }
  const { data: users, error: listError } =
    await supabase.auth.admin.listUsers();
  must(listError, "List auth users");
  let user = users.users.find(
    (candidate) => candidate.email?.toLowerCase() === email.toLowerCase(),
  );
  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    must(error, "Create initial owner");
    user = data.user;
  }
  const { error } = await supabase.from("admin_profiles").upsert({
    id: user.id,
    email: email.toLowerCase(),
    display_name: "Owner",
    role: "owner",
    active: true,
  });
  must(error, "Create owner profile");
}

try {
  await migrateProducts();
  await migrateOrders();
  await migrateLoyalty();
  await createInitialOwner();
  console.log("Migration complete. Verify counts in Supabase before deploying.");
} finally {
  db.close();
}
