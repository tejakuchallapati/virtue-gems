import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listProductsSafe } from "@/lib/product-store-server";
import { AdminCatalogManager } from "@/components/admin/ProductCatalogAdmin";

export default async function InventoryPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const products = await listProductsSafe({ includeInactive: true });

  return <AdminCatalogManager initialProducts={products} />;
}
