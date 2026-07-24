import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listProducts } from "@/lib/product-store";
import { AdminCatalogManager } from "@/components/admin/ProductCatalogAdmin";

export default async function InventoryPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const products = listProducts({ includeInactive: true });

  return <AdminCatalogManager initialProducts={products} />;
}
