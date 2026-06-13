"use client";

import { MessageCircle, Printer } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

export function InvoiceActions({ order }: { order: Order }) {
  const invoiceUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/invoice/${order.id}`
      : `/invoice/${order.id}`;

  function shareOnWhatsApp() {
    const itemList = order.items
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} ×${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
      )
      .join("\n");

    const message = [
      "✨ *Virtue Gems — Order Invoice* ✨",
      "",
      `Invoice#: ${order.id}`,
      `Date: ${formatDate(order.createdAt)}`,
      "",
      `Customer: ${order.customerName}`,
      `Phone: ${order.phone}`,
      "",
      "*Items*",
      itemList,
      "",
      `*Total: ${formatPrice(order.total)}*`,
      "",
      "📄 View full bill:",
      invoiceUrl,
    ].join("\n");

    window.open(getWhatsAppUrl(message), "_blank");
  }

  return (
    <div className="mx-auto flex max-w-[560px] flex-wrap justify-center gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-xl border border-dark/15 bg-white px-5 py-2.5 text-sm font-medium text-dark transition hover:border-gold hover:text-gold-dark"
      >
        <Printer className="h-4 w-4" />
        Print / Save PDF
      </button>
      <button
        type="button"
        onClick={shareOnWhatsApp}
        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1fb855]"
      >
        <MessageCircle className="h-4 w-4" />
        Share on WhatsApp
      </button>
    </div>
  );
}
