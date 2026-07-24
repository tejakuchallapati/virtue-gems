"use client";

import { useMemo, useState } from "react";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-status";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusButtons } from "@/components/admin/OrderStatusButtons";
import type { Order, OrderStatus } from "@/types";

export type AdminOrderRow = Order & { pointsBalance: number };

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function AdminOrdersClient({
  initialOrders,
}: {
  initialOrders: AdminOrderRow[];
}) {
  const [phoneQuery, setPhoneQuery] = useState("");

  const filtered = useMemo(() => {
    const q = digitsOnly(phoneQuery.trim());
    if (!q) return initialOrders;
    return initialOrders.filter((o) => digitsOnly(o.phone).includes(q));
  }, [initialOrders, phoneQuery]);

  const grouped = useMemo(() => {
    return ORDER_STATUSES.reduce(
      (acc, status) => {
        acc[status] = filtered.filter((o) => o.status === status);
        return acc;
      },
      {} as Record<OrderStatus, AdminOrderRow[]>,
    );
  }, [filtered]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-light">Order Management</h1>
      <p className="mt-1 text-sm text-light/50">
        WhatsApp workflow: pending → confirmed → paid → shipped → delivered
      </p>

      <div className="mt-4">
        <input
          value={phoneQuery}
          onChange={(e) => setPhoneQuery(e.target.value)}
          placeholder="Search by phone number…"
          inputMode="tel"
          className="w-full max-w-md rounded-xl border border-light/10 bg-dark px-4 py-2.5 text-sm text-light outline-none focus:border-gold/40"
        />
        {phoneQuery.trim() && (
          <p className="mt-2 text-xs text-light/45">
            Showing {filtered.length} order
            {filtered.length === 1 ? "" : "s"} matching “{phoneQuery.trim()}”
          </p>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {ORDER_STATUSES.map((status) => (
          <OrderTable
            key={status}
            title={`${ORDER_STATUS_LABELS[status]} Orders`}
            items={grouped[status]}
            emptyHint={
              phoneQuery.trim()
                ? "No matching orders in this status."
                : "No orders in this status."
            }
          />
        ))}
      </div>
    </div>
  );
}

function OrderTable({
  title,
  items,
  emptyHint,
}: {
  title: string;
  items: AdminOrderRow[];
  emptyHint: string;
}) {
  return (
    <div className="rounded-2xl bg-dark-soft p-5 ring-1 ring-light/10">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
        {title} ({items.length})
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-light/40">{emptyHint}</p>
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
                <p className="text-lg font-semibold text-light">
                  {formatPrice(o.total)}
                </p>
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
                customerPhone={o.phone}
                total={o.total}
                currentStatus={o.status}
                pointsBalance={o.pointsBalance}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
