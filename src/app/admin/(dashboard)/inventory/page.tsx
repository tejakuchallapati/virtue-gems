import { redirect } from "next/navigation";
import { getCurrentAdmin, canManageCatalog } from "@/lib/admin-auth";
import { listProductsSafe } from "@/lib/product-store-server";
import { AdminCatalogManager } from "@/components/admin/ProductCatalogAdmin";

export default async function InventoryPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (!canManageCatalog(admin)) redirect("/admin/orders");

  const products = await listProductsSafe({ includeInactive: true });

  return <AdminCatalogManager initialProducts={products} />;
}
