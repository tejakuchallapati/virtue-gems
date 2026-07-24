import type {
  Product,
  ProductCategory,
  ProductTag,
  Review,
} from "@/types";
import { backupProductsJson } from "@/lib/db/backup";
import { getDb, withTransaction } from "@/lib/db";
import { uniqueId } from "@/lib/json-store";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
} from "@/lib/product-constants";

export { PRODUCT_CATEGORIES, PRODUCT_TAGS } from "@/lib/product-constants";
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
  updated_at: string;
};

export type ProductInput = {
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number | null;
  images: string[];
  category: ProductCategory;
  tags: ProductTag[];
  specifications?: Record<string, string>;
  stock: number;
  slug?: string;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  active?: boolean;
};

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.long_description,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    images: JSON.parse(row.images) as string[],
    category: row.category as ProductCategory,
    tags: JSON.parse(row.tags) as ProductTag[],
    specifications: JSON.parse(row.specifications) as Record<string, string>,
    stock: row.stock,
    rating: row.rating,
    reviewCount: row.review_count,
    reviews: JSON.parse(row.reviews) as Review[],
  };
}

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function ensureUniqueSlug(base: string, excludeId?: string): string {
  const db = getDb();
  let slug = base || `product-${Date.now()}`;
  let n = 2;
  for (;;) {
    const row = db
      .prepare("SELECT id FROM products WHERE slug = ?")
      .get(slug) as { id: string } | undefined;
    if (!row || (excludeId && row.id === excludeId)) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

export function listProducts(options?: { includeInactive?: boolean }): (Product & { active?: boolean })[] {
  const db = getDb();
  const rows = (
    options?.includeInactive
      ? db.prepare("SELECT * FROM products ORDER BY name ASC").all()
      : db
          .prepare("SELECT * FROM products WHERE active = 1 ORDER BY name ASC")
          .all()
  ) as ProductRow[];
  return rows.map((row) =>
    options?.includeInactive
      ? { ...rowToProduct(row), active: row.active === 1 }
      : rowToProduct(row),
  );
}

export function getStoredProductById(id: string): Product | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ? AND active = 1").get(id) as
    | ProductRow
    | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function getStoredProductBySlug(slug: string): Product | undefined {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM products WHERE slug = ? AND active = 1")
    .get(slug) as ProductRow | undefined;
  return row ? rowToProduct(row) : undefined;
}

export function getStoredProductByIdAdmin(id: string): (Product & { active: boolean }) | undefined {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as
    | ProductRow
    | undefined;
  if (!row) return undefined;
  return { ...rowToProduct(row), active: row.active === 1 };
}

const DEFAULT_SPECS: Record<string, string> = {
  Material: "Gold-plated alloy",
  Finish: "Anti-tarnish polish",
  Style: "Contemporary Indian",
  Care: "Store in dry pouch",
};

export function validateProductInput(
  body: Record<string, unknown>,
  options?: { partial?: boolean },
): ProductInput | string {
  const partial = options?.partial === true;

  const name =
    typeof body.name === "string" ? body.name.trim() : partial ? undefined : "";
  if (!partial && (!name || name.length > 160)) return "Valid product name is required.";
  if (partial && name !== undefined && (!name || name.length > 160)) {
    return "Valid product name is required.";
  }

  const description =
    typeof body.description === "string"
      ? body.description.trim()
      : partial
        ? undefined
        : "";
  if (!partial && (!description || description.length > 500)) {
    return "Short description is required (max 500 chars).";
  }

  const longDescription =
    typeof body.longDescription === "string"
      ? body.longDescription.trim()
      : undefined;

  const price = body.price;
  if (!partial && (typeof price !== "number" || !Number.isFinite(price) || price < 0)) {
    return "Valid price is required.";
  }
  if (
    partial &&
    price !== undefined &&
    (typeof price !== "number" || !Number.isFinite(price) || price < 0)
  ) {
    return "Valid price is required.";
  }

  let originalPrice: number | null | undefined = undefined;
  if (body.originalPrice === null || body.originalPrice === "") {
    originalPrice = null;
  } else if (typeof body.originalPrice === "number") {
    if (!Number.isFinite(body.originalPrice) || body.originalPrice < 0) {
      return "Invalid original price.";
    }
    originalPrice = body.originalPrice;
  } else if (!partial && body.originalPrice !== undefined) {
    return "Invalid original price.";
  }

  let images: string[] | undefined;
  if (Array.isArray(body.images)) {
    images = body.images
      .filter((img): img is string => typeof img === "string")
      .map((img) => img.trim())
      .filter(Boolean);
  } else if (typeof body.images === "string") {
    images = body.images
      .split(/[\n,]/)
      .map((img) => img.trim())
      .filter(Boolean);
  } else if (!partial) {
    images = [];
  }
  if (!partial && (!images || images.length === 0)) {
    return "At least one image path is required (e.g. /products/vg-001.jpg).";
  }

  const category = body.category;
  if (
    !partial &&
    (typeof category !== "string" ||
      !PRODUCT_CATEGORIES.includes(category as ProductCategory))
  ) {
    return "Valid category is required.";
  }
  if (
    partial &&
    category !== undefined &&
    (typeof category !== "string" ||
      !PRODUCT_CATEGORIES.includes(category as ProductCategory))
  ) {
    return "Valid category is required.";
  }

  let tags: ProductTag[] | undefined;
  if (Array.isArray(body.tags)) {
    tags = body.tags.filter(
      (t): t is ProductTag =>
        typeof t === "string" && PRODUCT_TAGS.includes(t as ProductTag),
    );
  } else if (!partial) {
    tags = [];
  }

  const stock = body.stock;
  if (
    !partial &&
    (typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      stock > 100_000)
  ) {
    return "Valid stock quantity is required.";
  }
  if (
    partial &&
    stock !== undefined &&
    (typeof stock !== "number" ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      stock > 100_000)
  ) {
    return "Valid stock quantity is required.";
  }

  const slug =
    typeof body.slug === "string" && body.slug.trim()
      ? slugifyName(body.slug)
      : undefined;

  const active =
    typeof body.active === "boolean"
      ? body.active
      : body.active === 0 || body.active === 1
        ? Boolean(body.active)
        : undefined;

  const specifications =
    body.specifications &&
    typeof body.specifications === "object" &&
    !Array.isArray(body.specifications)
      ? (body.specifications as Record<string, string>)
      : undefined;

  if (partial) {
    return {
      name: name ?? "",
      description: description ?? "",
      longDescription,
      price: typeof price === "number" ? price : 0,
      originalPrice,
      images: images ?? [],
      category: (category as ProductCategory) ?? "necklaces",
      tags: tags ?? [],
      specifications,
      stock: typeof stock === "number" ? stock : 0,
      slug,
      active,
    };
  }

  return {
    name: name!,
    description: description!,
    longDescription:
      longDescription ||
      `${description}. Handpicked from the Virtue Gems collection — crafted for everyday elegance and festive occasions.`,
    price: price as number,
    originalPrice: originalPrice ?? null,
    images: images!,
    category: category as ProductCategory,
    tags: tags ?? [],
    specifications: specifications ?? DEFAULT_SPECS,
    stock: stock as number,
    slug,
    rating: 0,
    reviewCount: 0,
    reviews: [],
    active: active ?? true,
  };
}

export function createProduct(input: ProductInput): Product {
  const id = uniqueId("vg");
  const baseSlug = input.slug || slugifyName(input.name);
  const slug = ensureUniqueSlug(baseSlug);
  const now = new Date().toISOString();

  withTransaction((db) => {
    db.prepare(`
      INSERT INTO products (
        id, slug, name, description, long_description, price, original_price,
        images, category, tags, specifications, stock, rating, review_count,
        reviews, active, updated_at
      ) VALUES (
        @id, @slug, @name, @description, @long_description, @price, @original_price,
        @images, @category, @tags, @specifications, @stock, @rating, @review_count,
        @reviews, @active, @updated_at
      )
    `).run({
      id,
      slug,
      name: input.name,
      description: input.description,
      long_description:
        input.longDescription ||
        `${input.description}. Handpicked from the Virtue Gems collection.`,
      price: input.price,
      original_price: input.originalPrice ?? null,
      images: JSON.stringify(input.images),
      category: input.category,
      tags: JSON.stringify(input.tags),
      specifications: JSON.stringify(input.specifications ?? DEFAULT_SPECS),
      stock: input.stock,
      rating: input.rating ?? 0,
      review_count: input.reviewCount ?? 0,
      reviews: JSON.stringify(input.reviews ?? []),
      active: input.active === false ? 0 : 1,
      updated_at: now,
    });
  });

  backupProductsJson(getDb());
  return getStoredProductByIdAdmin(id)!;
}

export function updateProduct(
  id: string,
  patch: Partial<ProductInput>,
): Product | null {
  const existing = getStoredProductByIdAdmin(id);
  if (!existing) return null;

  const next: Product = {
    ...existing,
    name: patch.name?.trim() || existing.name,
    description: patch.description?.trim() || existing.description,
    longDescription:
      patch.longDescription?.trim() ||
      existing.longDescription,
    price: patch.price ?? existing.price,
    originalPrice:
      patch.originalPrice === null
        ? undefined
        : (patch.originalPrice ?? existing.originalPrice),
    images: patch.images && patch.images.length > 0 ? patch.images : existing.images,
    category: patch.category ?? existing.category,
    tags: patch.tags ?? existing.tags,
    specifications: patch.specifications ?? existing.specifications,
    stock: patch.stock ?? existing.stock,
  };

  const slug = ensureUniqueSlug(
    patch.slug || slugifyName(next.name),
    id,
  );
  next.slug = slug;

  const active =
    patch.active === undefined
      ? existing.active
        ? 1
        : 0
      : patch.active
        ? 1
        : 0;

  const now = new Date().toISOString();

  withTransaction((db) => {
    db.prepare(`
      UPDATE products SET
        slug = @slug,
        name = @name,
        description = @description,
        long_description = @long_description,
        price = @price,
        original_price = @original_price,
        images = @images,
        category = @category,
        tags = @tags,
        specifications = @specifications,
        stock = @stock,
        active = @active,
        updated_at = @updated_at
      WHERE id = @id
    `).run({
      id,
      slug: next.slug,
      name: next.name,
      description: next.description,
      long_description: next.longDescription,
      price: next.price,
      original_price: next.originalPrice ?? null,
      images: JSON.stringify(next.images),
      category: next.category,
      tags: JSON.stringify(next.tags),
      specifications: JSON.stringify(next.specifications),
      stock: next.stock,
      active,
      updated_at: now,
    });
  });

  backupProductsJson(getDb());
  return getStoredProductByIdAdmin(id) ?? null;
}

/** Soft-delete — hides from shop but keeps order history valid. */
export function softDeleteProduct(id: string): boolean {
  const existing = getStoredProductByIdAdmin(id);
  if (!existing) return false;

  withTransaction((db) => {
    db.prepare(
      "UPDATE products SET active = 0, updated_at = ? WHERE id = ?",
    ).run(new Date().toISOString(), id);
  });

  backupProductsJson(getDb());
  return true;
}

/** Restore a soft-deleted product back to the live shop catalog. */
export function restoreProduct(id: string): (Product & { active: boolean }) | null {
  const existing = getStoredProductByIdAdmin(id);
  if (!existing) return null;

  withTransaction((db) => {
    db.prepare(
      "UPDATE products SET active = 1, updated_at = ? WHERE id = ?",
    ).run(new Date().toISOString(), id);
  });

  backupProductsJson(getDb());
  return getStoredProductByIdAdmin(id) ?? null;
}
