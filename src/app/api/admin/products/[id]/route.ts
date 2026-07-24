import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  restoreProduct,
  softDeleteProduct,
  updateProduct,
  validateProductInput,
} from "@/lib/product-store";
import { apiFail, apiOk, parseJsonBody } from "@/lib/api-server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return apiFail("Unauthorized.", 401);
  }

  const { id } = await context.params;
  if (!id) return apiFail("Product id required.", 400);

  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const keys = Object.keys(parsed.data);
  if (keys.length === 1 && keys[0] === "active" && parsed.data.active === true) {
    try {
      const product = restoreProduct(id);
      if (!product) return apiFail("Product not found.", 404);
      return apiOk({ product });
    } catch (error) {
      console.error("Admin products restore error:", error);
      return apiFail("Failed to restore product.", 500);
    }
  }

  const input = validateProductInput(parsed.data, { partial: true });
  if (typeof input === "string") return apiFail(input, 400);

  try {
    const product = updateProduct(id, input);
    if (!product) return apiFail("Product not found.", 404);
    return apiOk({ product });
  } catch (error) {
    console.error("Admin products PATCH error:", error);
    return apiFail("Failed to update product.", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return apiFail("Unauthorized.", 401);
  }

  const { id } = await context.params;
  if (!id) return apiFail("Product id required.", 400);

  try {
    const ok = softDeleteProduct(id);
    if (!ok) return apiFail("Product not found.", 404);
    return apiOk({ deleted: true });
  } catch (error) {
    console.error("Admin products DELETE error:", error);
    return apiFail("Failed to delete product.", 500);
  }
}
