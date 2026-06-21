import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrders } from "@/lib/orders";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-status";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusButtons } from "@/components/admin/OrderStatusButtons";
import type { Order, OrderStatus } from "@/types";

export default async function OrdersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const orders = getOrders();

  const grouped = ORDER_STATUSES.reduce(
    (acc, status) => {
      acc[status] = orders.filter((o) => o.status === status);
      return acc;
    },
    {} as Record<OrderStatus, Order[]>,
  );

  function OrderTable({ title, items }: { title: string; items: Order[] }) {
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
                    <p className="text-sm text-light/70">
                      {o.customerName} · {o.phone}
                    </p>
                    <p className="text-xs text-light/40">
                      {o.city}, {o.state} · {o.pincode}
                    </p>
                    <p className="text-xs text-light/40">{formatDate(o.createdAt)}</p>
                  </div>
                  <p className="text-lg font-semibold text-light">{formatPrice(o.total)}</p>
                </div>
                <ul className="mt-2 text-xs text-light/50">
                  {o.items.map((item, i) => (
                    <li key={i}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
                <OrderStatusButtons
                  orderId={o.id}
                  customerName={o.customerName}
                  total={o.total}
                  currentStatus={o.status}
                />
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
      <p className="mt-1 text-sm text-light/50">
        WhatsApp workflow: pending → confirmed → paid → shipped → delivered
      </p>
      <div className="mt-6 space-y-6">
        {ORDER_STATUSES.map((status) => (
          <OrderTable
            key={status}
            title={`${ORDER_STATUS_LABELS[status]} Orders`}
            items={grouped[status]}
          />
        ))}
      </div>
    </div>
  );
}
