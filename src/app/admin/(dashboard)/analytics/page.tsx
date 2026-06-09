import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { StatCard } from "@/components/admin/StatCard";
import { SalesLineChart } from "@/components/admin/SalesLineChart";
import { formatPrice } from "@/lib/utils";

export default async function AnalyticsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Sales Analytics</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Daily Sales" value={formatPrice(45000)} sub="Today" />
        <StatCard label="Weekly Sales" value={formatPrice(312000)} sub="This week" />
        <StatCard label="Monthly Sales" value={formatPrice(1245000)} sub="This month" />
      </div>
      <div className="mt-8 rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light/50">
          Monthly Revenue Trend
        </h2>
        <SalesLineChart />
      </div>
    </div>
  );
}
