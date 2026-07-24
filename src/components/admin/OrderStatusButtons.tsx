"use client";

import { useMemo, useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { calculatePointsEarned } from "@/lib/loyalty";
import { getAbsoluteUrl } from "@/lib/site";
import {
  buildDeliveryThankYouMessage,
  buildPaymentReplyMessage,
  getCustomerWhatsAppUrl,
} from "@/lib/whatsapp-admin";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-status";
import type { OrderStatus } from "@/types";

export function OrderStatusButtons({
  orderId,
  customerName,
  customerPhone,
  total,
  currentStatus,
  pointsBalance,
}: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  total: number;
  currentStatus: OrderStatus;
  /** Known loyalty balance after this order (optional). */
  pointsBalance?: number;
}) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const pointsEarned = calculatePointsEarned(total);
  const balance = pointsBalance ?? pointsEarned;
  const showThankYou =
    currentStatus === "delivered" || currentStatus === "shipped";

  const thankYouUrl = useMemo(() => {
    if (!showThankYou) return null;
    const message = buildDeliveryThankYouMessage({
      customerName,
      orderId,
      pointsEarned,
      pointsBalance: balance,
      rewardsUrl: getAbsoluteUrl("/rewards"),
      shopUrl: getAbsoluteUrl("/shop"),
    });
    return getCustomerWhatsAppUrl(customerPhone, message);
  }, [
    showThankYou,
    customerName,
    customerPhone,
    orderId,
    pointsEarned,
    balance,
  ]);

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

  async function copyPaymentReply() {
    const message = buildPaymentReplyMessage(customerName, orderId, total);
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  return (
    <div>
      <div className="mt-3 flex flex-wrap gap-2">
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            disabled={updating !== null}
            onClick={() => updateStatus(status)}
            className={`rounded-lg px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
              currentStatus === status
                ? "bg-gold text-dark"
                : "bg-light/10 text-light/60 hover:bg-light/20"
            }`}
          >
            {updating === status ? "Updating…" : ORDER_STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyPaymentReply}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/15 px-3 py-1.5 text-xs font-medium text-[#25D366] transition hover:bg-[#25D366]/25"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy payment reply
            </>
          )}
        </button>

        {thankYouUrl && (
          <a
            href={thankYouUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold/15 px-3 py-1.5 text-xs font-medium text-gold transition hover:bg-gold/25"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {currentStatus === "delivered"
              ? "Send thank-you + review WhatsApp"
              : "Preview thank-you WhatsApp"}
          </a>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
