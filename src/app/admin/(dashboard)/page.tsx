import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquareQuote } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrdersSafe } from "@/lib/orders";
import { getAllProductsSafe } from "@/lib/products-server";
import { countPendingReviews } from "@/lib/reviews";
import { getWeeklyChartData } from "@/lib/admin-analytics";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";

export default async function AdminOverviewPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [orders, products, pendingReviews] = await Promise.all([
    getOrdersSafe(),
    getAllProductsSafe(),
    countPendingReviews(),
  ]);
  const revenueOrders = orders.filter((order) =>
    ["paid", "shipped", "delivered"].includes(order.status),
  );
  const totalRevenue = revenueOrders.reduce((s, o) => s + o.total, 0);
  const customers = new Set(orders.map((o) => o.phone)).size;
  const weeklyChart = getWeeklyChartData(revenueOrders);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Overview</h1>
      <p className="mt-1 text-sm text-light/50">Dashboard summary</p>

      <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-xs leading-relaxed text-light/70">
        <p className="font-medium text-gold">Admin order flow</p>
        <p className="mt-1">
          Pending → Confirmed → Paid → Shipped → Delivered. Copy the payment reply after
          confirming; send the thank-you + review WhatsApp only when status is{" "}
          <span className="text-gold">Delivered</span>.
        </p>
      </div>

      {pendingReviews > 0 && (
        <Link
          href="/admin/reviews"
          className="mt-4 flex min-h-12 items-center justify-between gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 transition hover:bg-emerald-400/15"
        >
          <span className="flex items-center gap-2">
            <MessageSquareQuote className="h-4 w-4 shrink-0" />
            {pendingReviews} customer review{pendingReviews === 1 ? "" : "s"} waiting for approval
          </span>
          <span className="shrink-0 font-medium">Review →</span>
        </Link>
      )}

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
          <>
            <ul className="space-y-3 md:hidden">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="rounded-xl bg-dark p-3">
                  <p className="break-all text-sm font-medium text-gold">{o.id}</p>
                  <p className="mt-1 text-sm text-light/70">{o.customerName}</p>
                  <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                    <span className="text-light/50">{ORDER_STATUS_LABELS[o.status]}</span>
                    <span className="shrink-0 font-medium text-light">
                      {formatPrice(o.total)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto md:block">
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
          </>
        )}
      </div>
    </div>
  );
}
