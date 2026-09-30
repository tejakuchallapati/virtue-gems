import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listReviewsForAdmin } from "@/lib/reviews";
import { AdminReviews } from "@/components/admin/AdminReviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { reviews, setupRequired } = await listReviewsForAdmin();
  return <AdminReviews initialReviews={reviews} setupRequired={setupRequired} />;
}
