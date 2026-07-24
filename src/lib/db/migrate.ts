import type Database from "better-sqlite3";
import path from "path";
import { readJsonFile } from "@/lib/json-store";
import type { LoyaltyAccount, Order, Product } from "@/types";

const ordersJsonPath = path.join(process.cwd(), "src/data/orders.json");
const loyaltyJsonPath = path.join(process.cwd(), "src/data/loyalty-accounts.json");
const productsJsonPath = path.join(process.cwd(), "src/data/products.json");

export function migrateFromJsonIfNeeded(db: Database.Database) {
  const migrated = db
    .prepare("SELECT value FROM meta WHERE key = 'json_migrated'")
    .get() as { value: string } | undefined;

  if (migrated?.value === "1") return;

  const orderCount = (
    db.prepare("SELECT COUNT(*) AS c FROM orders").get() as { c: number }
  ).c;

  const loyaltyCount = (
    db.prepare("SELECT COUNT(*) AS c FROM loyalty_accounts").get() as { c: number }
  ).c;

  if (orderCount === 0) {
    const orders = readJsonFile<Order[]>(ordersJsonPath, []);
    if (orders.length > 0) {
      const insert = db.prepare(`
        INSERT OR IGNORE INTO orders
          (id, customer_name, phone, address, city, state, pincode, items, total, status, created_at)
        VALUES
          (@id, @customer_name, @phone, @address, @city, @state, @pincode, @items, @total, @status, @created_at)
      `);

      const migrateOrders = db.transaction((rows: Order[]) => {
        for (const o of rows) {
          insert.run({
            id: o.id,
            customer_name: o.customerName,
            phone: o.phone,
            address: o.address,
            city: o.city,
            state: o.state,
            pincode: o.pincode,
            items: JSON.stringify(o.items),
            total: o.total,
            status: o.status,
            created_at: o.createdAt,
          });
        }
      });
      migrateOrders(orders);
    }
  }

  if (loyaltyCount === 0) {
    const accounts = readJsonFile<LoyaltyAccount[]>(loyaltyJsonPath, []);
    if (accounts.length > 0) {
      const insert = db.prepare(`
        INSERT OR IGNORE INTO loyalty_accounts
          (phone, name, points, lifetime_points, history, updated_at)
        VALUES
          (@phone, @name, @points, @lifetime_points, @history, @updated_at)
      `);

      const now = new Date().toISOString();
      const migrateLoyalty = db.transaction((rows: LoyaltyAccount[]) => {
        for (const a of rows) {
          insert.run({
            phone: a.phone,
            name: a.name ?? "",
            points: a.points,
            lifetime_points: a.lifetimePoints,
            history: JSON.stringify(a.history ?? []),
            updated_at: now,
          });
        }
      });
      migrateLoyalty(accounts);
    }
  }

  db.prepare(
    "INSERT OR REPLACE INTO meta (key, value) VALUES ('json_migrated', '1')",
  ).run();
}

/** Seed catalog from products.json once (admin CRUD then owns the DB rows). */
export function migrateProductsIfNeeded(db: Database.Database) {
  const done = db
    .prepare("SELECT value FROM meta WHERE key = 'products_migrated'")
    .get() as { value: string } | undefined;

  if (done?.value === "1") return;

  const count = (
    db.prepare("SELECT COUNT(*) AS c FROM products").get() as { c: number }
  ).c;

  if (count === 0) {
    const products = readJsonFile<Product[]>(productsJsonPath, []);
    if (products.length > 0) {
      const insert = db.prepare(`
        INSERT OR IGNORE INTO products (
          id, slug, name, description, long_description, price, original_price,
          images, category, tags, specifications, stock, rating, review_count,
          reviews, active, updated_at
        ) VALUES (
          @id, @slug, @name, @description, @long_description, @price, @original_price,
          @images, @category, @tags, @specifications, @stock, @rating, @review_count,
          @reviews, @active, @updated_at
        )
      `);

      const now = new Date().toISOString();
      const migrate = db.transaction((rows: Product[]) => {
        for (const p of rows) {
          insert.run({
            id: p.id,
            slug: p.slug,
            name: p.name,
            description: p.description,
            long_description: p.longDescription,
            price: p.price,
            original_price: p.originalPrice ?? null,
            images: JSON.stringify(p.images ?? []),
            category: p.category,
            tags: JSON.stringify(p.tags ?? []),
            specifications: JSON.stringify(p.specifications ?? {}),
            stock: p.stock,
            rating: p.rating,
            review_count: p.reviewCount,
            reviews: JSON.stringify(p.reviews ?? []),
            active: 1,
            updated_at: now,
          });
        }
      });
      migrate(products);
    }
  }

  db.prepare(
    "INSERT OR REPLACE INTO meta (key, value) VALUES ('products_migrated', '1')",
  ).run();
}

/** One-time: map old status values to the WhatsApp workflow statuses. */
export function migrateLegacyOrderStatuses(db: Database.Database) {
  const done = db
    .prepare("SELECT value FROM meta WHERE key = 'order_status_migrated'")
    .get() as { value: string } | undefined;

  if (done?.value === "1") return;

  db.prepare("UPDATE orders SET status = 'confirmed' WHERE status = 'processing'").run();
  db.prepare("UPDATE orders SET status = 'delivered' WHERE status = 'completed'").run();

  db.prepare(
    "INSERT OR REPLACE INTO meta (key, value) VALUES ('order_status_migrated', '1')",
  ).run();
}
