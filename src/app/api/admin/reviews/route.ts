import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { apiFail, apiOk, parseJsonBody } from "@/lib/api-server";
import { deleteReview, setReviewProduct, setReviewStatus } from "@/lib/reviews";
import { getProductByIdSafe } from "@/lib/products-server";
import type { StoreReviewStatus } from "@/types";

const STATUSES: StoreReviewStatus[] = ["pending", "approved", "rejected"];

export async function PATCH(request: Request) {
  if (!(await getCurrentAdmin())) return apiFail("Unauthorized.", 401);
  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const id = typeof parsed.data.id === "string" ? parsed.data.id : "";
  const status = parsed.data.status as StoreReviewStatus | undefined;
  const changesProduct = "productId" in parsed.data;
  const rawProductId = parsed.data.productId;
  if (!id || (!changesProduct && !STATUSES.includes(status as StoreReviewStatus))) {
    return apiFail("Review and status are required.", 400);
  }
  if (status !== undefined && !STATUSES.includes(status)) return apiFail("Invalid status.", 400);

  let productId: string | null = null;
  if (changesProduct && rawProductId !== null && rawProductId !== "") {
    if (typeof rawProductId !== "string" || rawProductId.length > 80) {
      return apiFail("Invalid product.", 400);
    }
    const product = await getProductByIdSafe(rawProductId).catch(() => undefined);
    if (!product) return apiFail("That product no longer exists.", 400);
    productId = product.id;
  }

  try {
    if (status) await setReviewStatus(id, status);
    if (changesProduct) await setReviewProduct(id, productId);
    revalidatePath("/");
    revalidatePath("/product/[slug]", "page");
    return apiOk({ id, status, productId });
  } catch (error) {
    console.error("Review status error:", error);
    return apiFail("Could not update the review.", 500);
  }
}

export async function DELETE(request: Request) {
  if (!(await getCurrentAdmin())) return apiFail("Unauthorized.", 401);
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!id) return apiFail("Review id required.", 400);

  try {
    await deleteReview(id);
    revalidatePath("/");
    revalidatePath("/product/[slug]", "page");
    return apiOk({ id });
  } catch (error) {
    console.error("Review delete error:", error);
    return apiFail("Could not delete the review.", 500);
  }
}
