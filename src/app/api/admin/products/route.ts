import { NextResponse } from "next/server";
import { isAdminAuthenticated, requireCatalogAdmin } from "@/lib/admin-auth";
import {
  createProductSafe,
  listProductsSafe,
} from "@/lib/product-store-server";
import { validateProductInput } from "@/lib/product-store";
import { apiFail, apiOk, parseJsonBody } from "@/lib/api-server";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return apiFail("Unauthorized.", 401);
  }

  try {
    return NextResponse.json({
      products: await listProductsSafe({ includeInactive: true }),
    });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return apiFail("Failed to load products.", 500);
  }
}

export async function POST(request: Request) {
  if (!(await requireCatalogAdmin())) {
    return apiFail("Admin access required to manage products.", 403);
  }

  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const input = validateProductInput(parsed.data);
  if (typeof input === "string") return apiFail(input, 400);

  try {
    const product = await createProductSafe(input);
    return apiOk({ product }, 201);
  } catch (error) {
    console.error("Admin products POST error:", error);
    return apiFail("Failed to create product.", 500);
  }
}
