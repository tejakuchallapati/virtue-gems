import { NextResponse } from "next/server";
import { getProductByIdSafe } from "@/lib/products-server";

/** Short link sent after delivery — opens the review form on the product the customer bought. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const product =
    productId.length <= 80 ? await getProductByIdSafe(productId).catch(() => undefined) : undefined;
  const target = product ? `/product/${product.slug}?review=1#reviews` : "/#reviews";
  return NextResponse.redirect(new URL(target, request.url), 307);
}
