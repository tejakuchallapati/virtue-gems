import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrders } from "@/lib/orders";
import { getAllProducts } from "@/lib/products";
import { getWeeklyChartData } from "@/lib/admin-analytics";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";

export default async function AdminOverviewPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const orders = getOrders();
  const products = getAllProducts();
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const customers = new Set(orders.map((o) => o.phone)).size;
  const weeklyChart = getWeeklyChartData(orders);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Overview</h1>
      <p className="mt-1 text-sm text-light/50">Dashboard summary</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={formatPrice(totalRevenue)} />
        <StatCard label="Total Orders" value={String(orders.length)} />
        <StatCard label="Total Customers" value={String(customers)} />
        <StatCard label="Products" value={String(products.length)} sub="In inventory" />
      </div>

      <div className="mt-8 rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light/50">
          Revenue Analytics (Last 7 Days)
        </h2>
        <RevenueChart data={weeklyChart} />
      </div>

      <div className="mt-8 rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light/50">
          Recent Orders
        </h2>
        {orders.length === 0 ? (
          <p className="text-sm text-light/40">No orders yet. Orders appear after WhatsApp checkout.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-light/10 text-light/50">
                  <th className="pb-2 pr-4">ID</th>
                  <th className="pb-2 pr-4">Customer</th>
                  <th className="pb-2 pr-4">Total</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-light/5">
                    <td className="py-3 pr-4 text-gold">{o.id}</td>
                    <td className="py-3 pr-4">{o.customerName}</td>
                    <td className="py-3 pr-4">{formatPrice(o.total)}</td>
                    <td className="py-3 text-light/70">
                      {ORDER_STATUS_LABELS[o.status]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
