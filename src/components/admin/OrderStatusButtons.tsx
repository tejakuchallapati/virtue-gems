"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api-client";
import type { OrderStatus } from "@/types";

export function OrderStatusButtons({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(status: OrderStatus) {
    setUpdating(status);
    setError(null);

    const res = await apiFetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status }),
    });

    if (!res.ok) {
      setError(res.error);
      setUpdating(null);
      return;
    }

    window.location.reload();
  }

  const buttons: { status: OrderStatus; label: string }[] = [
    { status: "pending", label: "Pending" },
    { status: "processing", label: "Processing" },
    { status: "completed", label: "Completed" },
  ];

  return (
    <div>
      <div className="mt-3 flex flex-wrap gap-2">
        {buttons.map((b) => (
          <button
            key={b.status}
            type="button"
            disabled={updating !== null}
            onClick={() => updateStatus(b.status)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
              currentStatus === b.status
                ? "bg-gold text-dark"
                : "bg-light/10 text-light/60 hover:bg-light/20"
            }`}
          >
            {updating === b.status ? "Updating…" : b.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
