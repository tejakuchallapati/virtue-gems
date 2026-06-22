import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrders } from "@/lib/orders";
import {
  getDailyWeeklyMonthlyRevenue,
  getMonthlyTrendData,
} from "@/lib/admin-analytics";
import { StatCard } from "@/components/admin/StatCard";
import { SalesLineChart } from "@/components/admin/SalesLineChart";
import { formatPrice } from "@/lib/utils";

export default async function AnalyticsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const orders = getOrders();
  const revenue = getDailyWeeklyMonthlyRevenue(orders);
  const monthlyTrend = getMonthlyTrendData(orders);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Sales Analytics</h1>
      <p className="mt-1 text-sm text-light/50">Based on saved WhatsApp orders</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Daily Sales" value={formatPrice(revenue.daily)} sub="Today" />
        <StatCard label="Weekly Sales" value={formatPrice(revenue.weekly)} sub="Last 7 days" />
        <StatCard label="Monthly Sales" value={formatPrice(revenue.monthly)} sub="This month" />
      </div>
      <div className="mt-8 rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light/50">
          Monthly Revenue Trend
        </h2>
        <SalesLineChart data={monthlyTrend} />
      </div>
    </div>
  );
}
