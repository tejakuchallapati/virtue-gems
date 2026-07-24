import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createProduct,
  validateProductInput,
} from "@/lib/product-store";
import { apiFail, apiOk, parseJsonBody } from "@/lib/api-server";

const MAX_BULK = 50;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return apiFail("Unauthorized.", 401);
  }

  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const rows = parsed.data.products;
  if (!Array.isArray(rows) || rows.length === 0) {
    return apiFail("Add at least one product.", 400);
  }
  if (rows.length > MAX_BULK) {
    return apiFail(`Bulk create supports up to ${MAX_BULK} products at once.`, 400);
  }

  const created: unknown[] = [];
  const errors: { index: number; name?: string; error: string }[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      errors.push({ index: i, error: "Invalid product row." });
      continue;
    }

    const input = validateProductInput(row as Record<string, unknown>);
    if (typeof input === "string") {
      errors.push({
        index: i,
        name: typeof (row as { name?: string }).name === "string"
          ? (row as { name: string }).name
          : undefined,
        error: input,
      });
      continue;
    }

    try {
      created.push(createProduct(input));
    } catch (error) {
      console.error("Bulk product create error:", error);
      errors.push({
        index: i,
        name: input.name,
        error: "Failed to save this product.",
      });
    }
  }

  if (created.length === 0) {
    return apiFail(
      errors[0]?.error || "No products were created.",
      400,
    );
  }

  return apiOk(
    {
      products: created,
      createdCount: created.length,
      errors,
    },
    201,
  );
}
