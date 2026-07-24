import type Database from "better-sqlite3";
import path from "path";
import { writeJsonFileAtomic } from "@/lib/json-store";
import type { LoyaltyAccount, Order, Product } from "@/types";

const ordersJsonPath = path.join(process.cwd(), "src/data/orders.json");
const loyaltyJsonPath = path.join(process.cwd(), "src/data/loyalty-accounts.json");
const productsJsonPath = path.join(process.cwd(), "src/data/products.json");

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

type LoyaltyRow = {
  phone: string;
  name: string | null;
  points: number;
  lifetime_points: number;
  history: string;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string;
  price: number;
  original_price: number | null;
  images: string;
  category: string;
  tags: string;
  specifications: string;
  stock: number;
  rating: number;
  review_count: number;
  reviews: string;
  active: number;
};

export function backupOrdersJson(db: Database.Database) {
  try {
    const rows = db
      .prepare("SELECT * FROM orders ORDER BY created_at DESC")
      .all() as OrderRow[];

    const orders: Order[] = rows.map((r) => ({
      id: r.id,
      customerName: r.customer_name,
      phone: r.phone,
      address: r.address,
      city: r.city,
      state: r.state,
      pincode: r.pincode,
      items: JSON.parse(r.items),
      total: r.total,
      status: r.status as Order["status"],
      createdAt: r.created_at,
    }));

    writeJsonFileAtomic(ordersJsonPath, orders);
  } catch (err) {
    console.error("Orders JSON backup failed:", err);
  }
}

export function backupLoyaltyJson(db: Database.Database) {
  try {
    const rows = db
      .prepare("SELECT * FROM loyalty_accounts ORDER BY updated_at DESC")
      .all() as LoyaltyRow[];

    const accounts: LoyaltyAccount[] = rows.map((r) => ({
      phone: r.phone,
      name: r.name ?? undefined,
      points: r.points,
      lifetimePoints: r.lifetime_points,
      history: JSON.parse(r.history),
    }));

    writeJsonFileAtomic(loyaltyJsonPath, accounts);
  } catch (err) {
    console.error("Loyalty JSON backup failed:", err);
  }
}

export function backupProductsJson(db: Database.Database) {
  try {
    const rows = db
      .prepare("SELECT * FROM products WHERE active = 1 ORDER BY name ASC")
      .all() as ProductRow[];

    const products: Product[] = rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      description: r.description,
      longDescription: r.long_description,
      price: r.price,
      originalPrice: r.original_price ?? undefined,
      images: JSON.parse(r.images),
      category: r.category as Product["category"],
      tags: JSON.parse(r.tags),
      specifications: JSON.parse(r.specifications),
      stock: r.stock,
      rating: r.rating,
      reviewCount: r.review_count,
      reviews: JSON.parse(r.reviews),
    }));

    writeJsonFileAtomic(productsJsonPath, products);
  } catch (err) {
    console.error("Products JSON backup failed:", err);
  }
}
