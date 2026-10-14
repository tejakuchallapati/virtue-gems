"use client";

import { useEffect, useState } from "react";
import { Download, ImageIcon, MessageCircle, Printer } from "lucide-react";
import { getAbsoluteUrl } from "@/lib/site";
import { buildOrderFollowUpMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import type { Order } from "@/types";

export function InvoiceActions({ order }: { order: Order }) {
  const invoiceUrl = getAbsoluteUrl(`/invoice/${order.id}`);
  const [sharingImage, setSharingImage] = useState(false);

  useEffect(() => {
    document.title = `Virtue-Gems-Invoice-${order.id}`;
  }, [order.id]);

  function continueOnWhatsApp() {
    const message = buildOrderFollowUpMessage(order, invoiceUrl);
    window.open(getWhatsAppUrl(message), "_blank");
  }

  function savePdf() {
    document.title = `Virtue-Gems-Invoice-${order.id}`;
    window.print();
  }

  async function sendInvoicePhoto() {
    setSharingImage(true);
    try {
      const res = await fetch(`/invoice/${encodeURIComponent(order.id)}/opengraph-image`);
      if (!res.ok) throw new Error("Could not create the invoice image.");
      const fileName = `Virtue-Gems-Invoice-${order.id}.png`;
      const file = new File([await res.blob()], fileName, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Virtue Gems order ${order.id}` });
        return;
      }

      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      window.alert(err instanceof Error ? err.message : "Could not share the invoice image.");
    } finally {
      setSharingImage(false);
    }
  }

  return (
    <div className="invoice-actions mx-auto flex max-w-[210mm] flex-col items-center gap-3 print:hidden">
      <p className="max-w-md text-center text-sm text-dark/65">
        Your invoice is ready. Continue on WhatsApp so we can confirm your order, or send the
        invoice photo / PDF for your records.
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
          onClick={sendInvoicePhoto}
          disabled={sharingImage}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1a0a2e] px-5 py-2.5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark disabled:opacity-60 sm:w-auto"
        >
          <ImageIcon className="h-4 w-4" />
          {sharingImage ? "Preparing photo..." : "Send invoice photo"}
        </button>
        <button
          type="button"
          onClick={savePdf}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dark/15 bg-white px-5 py-2.5 text-sm font-medium text-dark transition hover:border-gold hover:text-gold-dark sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Save PDF
        </button>
        <button
          type="button"
          onClick={savePdf}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dark/15 bg-white px-5 py-2.5 text-sm font-medium text-dark transition hover:border-gold hover:text-gold-dark sm:w-auto"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>
      <p className="max-w-sm text-center text-[11px] text-dark/45">
        For a PDF, choose <strong>Save as PDF</strong> as the destination in the print dialog.
      </p>
    </div>
  );
}
