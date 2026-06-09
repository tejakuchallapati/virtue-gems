import productsData from "@/data/products.json";
import type { Product, ProductCategory } from "@/types";

const products = productsData as unknown as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getSimilarProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function getCategories(): { value: ProductCategory; label: string }[] {
  return [
    { value: "rings", label: "Rings" },
    { value: "necklaces", label: "Necklaces" },
    { value: "earrings", label: "Earrings" },
    { value: "bracelets", label: "Bracelets" },
    { value: "pendants", label: "Pendants" },
  ];
}

export function filterProducts(options: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tag?: string;
}): Product[] {
  return products.filter((p) => {
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
