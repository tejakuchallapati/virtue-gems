import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getLoyaltyAccount } from "@/lib/loyalty-store";
import { calculatePointsEarned } from "@/lib/loyalty";
import { getOrders } from "@/lib/orders";
import {
  AdminOrdersClient,
  type AdminOrderRow,
} from "@/components/admin/AdminOrdersClient";

export default async function OrdersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const orders: AdminOrderRow[] = getOrders().map((o) => ({
    ...o,
    pointsBalance:
      getLoyaltyAccount(o.phone)?.points ?? calculatePointsEarned(o.total),
  }));

  return <AdminOrdersClient initialOrders={orders} />;
}
