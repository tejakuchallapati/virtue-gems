import productsData from "@/data/products.json";
import type { Product, ProductCategory } from "@/types";

/**
 * Seed catalog used on the client (cart hydrate) and as a build-time fallback.
 * Live shop/admin reads go through SQLite via the server-only helpers below.
 */
const seedProducts = productsData as unknown as Product[];

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  rings: "Rings",
  necklaces: "Necklaces",
  earrings: "Earrings",
  bracelets: "Bracelets",
  pendants: "Pendants",
};

const CATEGORY_ORDER: ProductCategory[] = [
  "rings",
  "necklaces",
  "earrings",
  "bracelets",
  "pendants",
];

function readLiveProducts(): Product[] {
  if (typeof window !== "undefined") {
    return seedProducts;
  }
  try {
    // Lazy require so the client bundle never pulls in better-sqlite3.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { listProducts } = require("@/lib/product-store") as typeof import("@/lib/product-store");
    return listProducts();
  } catch {
    return seedProducts;
  }
}

export function getAllProducts(): Product[] {
  return readLiveProducts();
}

export function getProductBySlug(slug: string): Product | undefined {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getStoredProductBySlug } = require("@/lib/product-store") as typeof import("@/lib/product-store");
      return getStoredProductBySlug(slug);
    } catch {
      /* fall through */
    }
  }
  return seedProducts.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  if (typeof window === "undefined") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getStoredProductById } = require("@/lib/product-store") as typeof import("@/lib/product-store");
      return getStoredProductById(id);
    } catch {
      /* fall through */
    }
  }
  return seedProducts.find((p) => p.id === id);
}

export function getSimilarProducts(product: Product, limit = 4): Product[] {
  return getAllProducts()
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function getCategories(products?: Product[]): {
  value: ProductCategory;
  label: string;
  count: number;
}[] {
  const list = products ?? getAllProducts();
  const counts = new Map<ProductCategory, number>();
  for (const product of list) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }

  return CATEGORY_ORDER.filter((category) => (counts.get(category) ?? 0) > 0).map(
    (category) => ({
      value: category,
      label: CATEGORY_LABELS[category],
      count: counts.get(category) ?? 0,
    }),
  );
}

export function filterProducts(
  options: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    tag?: string;
  },
  products?: Product[],
): Product[] {
  const list = products ?? getAllProducts();
  return list.filter((p) => {
    if (options.search) {
      const q = options.search.toLowerCase();
      if (
        !p.name.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (options.category && p.category !== options.category) return false;
    if (options.minPrice !== undefined && p.price < options.minPrice)
      return false;
    if (options.maxPrice !== undefined && p.price > options.maxPrice)
      return false;
    if (options.tag && !p.tags.includes(options.tag as Product["tags"][0]))
      return false;
    return true;
  });
}

export { CATEGORY_LABELS, CATEGORY_ORDER };
