"use client";

import type { OrderStatus } from "@/types";

export function OrderStatusButtons({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  async function updateStatus(status: OrderStatus) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status }),
    });
    window.location.reload();
  }

  const buttons: { status: OrderStatus; label: string }[] = [
    { status: "pending", label: "Pending" },
    { status: "processing", label: "Processing" },
    { status: "completed", label: "Completed" },
  ];

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {buttons.map((b) => (
        <button
          key={b.status}
          type="button"
          onClick={() => updateStatus(b.status)}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
            currentStatus === b.status
              ? "bg-gold text-dark"
              : "bg-light/10 text-light/60 hover:bg-light/20"
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}
