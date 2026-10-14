import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listReviewsForAdmin } from "@/lib/reviews";
import { AdminReviews } from "@/components/admin/AdminReviews";
import { getAllProductsSafe } from "@/lib/products-server";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [{ reviews, setupRequired }, products] = await Promise.all([
    listReviewsForAdmin(),
    getAllProductsSafe(),
  ]);
  const productNames = Object.fromEntries(products.map((p) => [p.id, p.name]));
  return (
    <AdminReviews
      initialReviews={reviews}
      setupRequired={setupRequired}
      productNames={productNames}
    />
  );
}
