import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getLoyaltyAccount } from "@/lib/loyalty-store";
import { calculatePointsEarned } from "@/lib/loyalty";
import { getOrdersSafe } from "@/lib/orders";
import { LOYALTY_ENABLED } from "@/lib/features";
import {
  AdminOrdersClient,
  type AdminOrderRow,
} from "@/components/admin/AdminOrdersClient";

export default async function OrdersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const orders: AdminOrderRow[] = (await getOrdersSafe()).map((o) => ({
    ...o,
    pointsBalance:
      (LOYALTY_ENABLED ? getLoyaltyAccount(o.phone)?.points : undefined) ??
      calculatePointsEarned(o.total),
  }));

  return <AdminOrdersClient initialOrders={orders} />;
}
