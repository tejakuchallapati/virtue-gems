import { NextResponse } from "next/server";
import { listProducts } from "@/lib/product-store";
import { apiFail } from "@/lib/api-server";

/** Public catalog for cart hydrate / client lookups. */
export async function GET() {
  try {
    const products = listProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Catalog GET error:", error);
    return apiFail("Failed to load catalog.", 500);
  }
}
