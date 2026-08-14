import { NextResponse } from "next/server";
import { listProductsSafe } from "@/lib/product-store-server";
import { apiFail } from "@/lib/api-server";

/** Public catalog for cart hydrate / client lookups. */
export async function GET() {
  try {
    const products = await listProductsSafe();
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Catalog GET error:", error);
    return apiFail("Failed to load catalog.", 500);
  }
}
