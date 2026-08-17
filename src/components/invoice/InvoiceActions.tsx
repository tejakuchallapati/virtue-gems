"use client";

import { MessageCircle, Printer } from "lucide-react";
import { getAbsoluteUrl } from "@/lib/site";
import { buildOrderFollowUpMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import type { Order } from "@/types";

export function InvoiceActions({ order }: { order: Order }) {
  const invoiceUrl = getAbsoluteUrl(`/invoice/${order.id}`);

  function continueOnWhatsApp() {
    const message = buildOrderFollowUpMessage(order, invoiceUrl);
    window.open(getWhatsAppUrl(message), "_blank");
  }

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 print:hidden">
      <p className="max-w-sm text-center text-sm text-dark/65">
        Next step: send this order on WhatsApp so we can confirm and guide payment.
      </p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
        <button
          type="button"
          onClick={continueOnWhatsApp}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1fb855] sm:w-auto"
        >
          <MessageCircle className="h-4 w-4" />
          Continue on WhatsApp
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dark/15 bg-white px-5 py-2.5 text-sm font-medium text-dark transition hover:border-gold hover:text-gold-dark sm:w-auto"
        >
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
