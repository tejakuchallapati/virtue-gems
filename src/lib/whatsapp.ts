import type { CartItem, CheckoutForm } from "@/types";
import { formatPrice } from "./utils";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917396178039";

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function formatBillDate(date = new Date()): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function padBillLine(label: string, value: string, width = 28): string {
  const gap = Math.max(1, width - label.length);
  return `${label}${" ".repeat(gap)}${value}`;
}

export function buildOrderMessage(
  form: CheckoutForm,
  items: CartItem[],
  total: number,
  orderId?: string,
  invoiceUrl?: string,
): string {
  const billId = orderId ?? `VG-${Date.now()}`;
  const billDate = formatBillDate();
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const itemLines = items.flatMap((item, i) => {
    const lineTotal = item.product.price * item.quantity;
    return [
      `${i + 1}. *${item.product.name}*`,
      padBillLine("   Qty", `${item.quantity}`),
      padBillLine("   Rate", formatPrice(item.product.price)),
      padBillLine("   Amount", formatPrice(lineTotal)),
      "",
    ];
  });

  const lines = [
    "╔══════════════════════════╗",
    "║     *VIRTUE GEMS*        ║",
    "║      ORDER INVOICE       ║",
    "╚══════════════════════════╝",
    "",
    padBillLine("Bill No.", billId),
    padBillLine("Date", billDate),
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "*BILL TO*",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `Name    : ${form.customerName}`,
    `Phone   : ${form.phone}`,
    `Address : ${form.address}`,
    `City    : ${form.city}`,
    `State   : ${form.state}`,
    `Pincode : ${form.pincode}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "*ITEM DETAILS*",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    ...itemLines,
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    padBillLine("Subtotal", formatPrice(subtotal)),
    padBillLine("*GRAND TOTAL*", `*${formatPrice(total)}*`),
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "Payment : To be confirmed on WhatsApp",
    "Status  : *Order Request — Pending*",
    "",
  ];

  if (invoiceUrl) {
    lines.push("📄 *View full bill (PDF style):*", invoiceUrl, "");
  }

  lines.push(
    "Please confirm availability, payment mode, and delivery timeline.",
    "",
    "Thank you for shopping with Virtue Gems!",
  );

  return lines.join("\n");
}

export function buildProductShareMessage(name: string, slug: string): string {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/product/${slug}`
      : `/product/${slug}`;
  return `Check out this beautiful piece from Virtue Gems: *${name}*\n${url}`;
}

export const whatsAppContactUrl = getWhatsAppUrl(
  "Hello Virtue Gems! I'd like to know more about your jewellery collection.",
);
