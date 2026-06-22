import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrders } from "@/lib/orders";
import { getAllProducts } from "@/lib/products";

export default async function CustomersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const orders = getOrders();
  const products = getAllProducts();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Customer Activity</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light/50">
            Recent Orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-sm text-light/40">No customer orders yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex justify-between border-b border-light/5 pb-2">
                  <span className="text-light/70">{o.customerName}</span>
                  <span className="text-light/40">{o.phone}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light/50">
            Popular Best Sellers
          </h2>
          <ul className="space-y-3 text-sm">
            {products.filter((p) => p.tags.includes("bestseller")).map((p) => (
              <li key={p.id} className="text-light/70">{p.name}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-light/50">
            Recent Reviews
          </h2>
          <ul className="space-y-3">
            {products.flatMap((p) => p.reviews).slice(0, 5).map((r) => (
              <li key={r.id} className="rounded-lg bg-dark p-3 text-sm">
                <p className="font-medium text-gold">{r.author}</p>
                <p className="mt-1 text-light/60">{r.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
