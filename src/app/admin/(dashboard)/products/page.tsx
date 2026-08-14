import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllProductsSafe } from "@/lib/products-server";
import { getOrdersSafe } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";

export default async function TopProductsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const [products, orders] = await Promise.all([
    getAllProductsSafe(),
    getOrdersSafe(),
  ]);
  const sales = new Map<string, { quantity: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const current = sales.get(item.productId) ?? { quantity: 0, revenue: 0 };
      current.quantity += item.quantity;
      current.revenue += item.price * item.quantity;
      sales.set(item.productId, current);
    }
  }
  const bestSelling = [...products].sort(
    (a, b) =>
      (sales.get(b.id)?.quantity ?? 0) - (sales.get(a.id)?.quantity ?? 0),
  );
  const mostViewed = [...products].sort((a, b) => b.rating - a.rating);
  const revenueLeaders = [...products].sort(
    (a, b) =>
      (sales.get(b.id)?.revenue ?? 0) - (sales.get(a.id)?.revenue ?? 0),
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Top Products</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            Best Selling
          </h2>
          <ul className="space-y-3">
            {bestSelling.slice(0, 5).map((p, i) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-light/70">
                  {i + 1}. {p.name}
                </span>
                <span className="text-light/50">
                  {sales.get(p.id)?.quantity ?? 0} sold
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            Highest Rated
          </h2>
          <ul className="space-y-3">
            {mostViewed.slice(0, 5).map((p, i) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-light/70">
                  {i + 1}. {p.name}
                </span>
                <span className="text-gold">{p.rating} ★</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            Revenue Leaders
          </h2>
          <ul className="space-y-3">
            {revenueLeaders.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <span className="text-light/70">{p.name}</span>
                <span className="text-gold">
                  {formatPrice(sales.get(p.id)?.revenue ?? 0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
