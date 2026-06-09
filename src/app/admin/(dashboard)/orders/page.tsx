import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrders } from "@/lib/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusButtons } from "@/components/admin/OrderStatusButtons";

export default async function OrdersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const orders = getOrders();
  const pending = orders.filter((o) => o.status === "pending");
  const processing = orders.filter((o) => o.status === "processing");
  const completed = orders.filter((o) => o.status === "completed");

  function OrderTable({ title, items }: { title: string; items: typeof orders }) {
    return (
      <div className="rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
          {title} ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-light/40">No orders in this status.</p>
        ) : (
          <div className="space-y-4">
            {items.map((o) => (
              <div key={o.id} className="rounded-xl bg-dark p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gold">{o.id}</p>
                    <p className="text-sm text-light/70">{o.customerName} · {o.phone}</p>
                    <p className="text-xs text-light/40">{formatDate(o.createdAt)}</p>
                  </div>
                  <p className="text-lg font-semibold text-light">{formatPrice(o.total)}</p>
                </div>
                <ul className="mt-2 text-xs text-light/50">
                  {o.items.map((item, i) => (
                    <li key={i}>{item.name} × {item.quantity}</li>
                  ))}
                </ul>
                <OrderStatusButtons orderId={o.id} currentStatus={o.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Order Management</h1>
      <div className="mt-6 space-y-6">
        <OrderTable title="Pending Orders" items={pending} />
        <OrderTable title="Processing Orders" items={processing} />
        <OrderTable title="Completed Orders" items={completed} />
      </div>
    </div>
  );
}
