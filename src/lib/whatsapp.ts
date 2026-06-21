import type { ActiveRedemption, CartItem, CheckoutForm } from "@/types";
import { formatPrice } from "./utils";
import { DELIVERY_REGION_LABEL } from "./delivery";
import {
  BANK_DETAILS,
  COD_POLICY,
  PAYMENT_METHODS_SUMMARY,
  UPI_ID,
  UPI_PAYEE_NAME,
} from "./payments";

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
  options?: {
    discount?: number;
    redemption?: ActiveRedemption | null;
    pointsEarned?: number;
    pointsBalance?: number;
  },
): string {
  const billId = orderId ?? `VG-${Date.now()}`;
  const billDate = formatBillDate();
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const discount = options?.discount ?? 0;

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
  ];

  if (discount > 0) {
    lines.push(padBillLine("Reward Discount", `-${formatPrice(discount)}`));
  }

  if (options?.redemption?.type === "free_item" && options.redemption.freeItemLabel) {
    lines.push(padBillLine("Free Reward", options.redemption.freeItemLabel));
  }

  lines.push(
    padBillLine("*GRAND TOTAL*", `*${formatPrice(total)}*`),
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "Payment : *Via WhatsApp after confirmation*",
    "Status  : *Order Request — Pending*",
    `Delivery: *${DELIVERY_REGION_LABEL} only*`,
    "",
    "📋 *WHAT HAPPENS NEXT*",
    "1. We confirm item availability on WhatsApp",
    "2. You pay via UPI or bank transfer",
    "3. Send payment screenshot on WhatsApp",
    "4. We ship and share tracking details",
    "",
    `Accepted: ${PAYMENT_METHODS_SUMMARY}`,
    COD_POLICY,
    "",
  );

  if (options?.redemption) {
    lines.push(
      "🎁 *Loyalty Reward Applied:*",
      options.redemption.title,
      "",
    );
  }

  if (options?.pointsEarned !== undefined) {
    lines.push(
      "⭐ *Virtue Gems Rewards:*",
      `Points earned this order: +${options.pointsEarned}`,
    );
    if (options.pointsBalance !== undefined) {
      lines.push(`Total points balance: ${options.pointsBalance}`);
    }
    lines.push("");
  }

  if (invoiceUrl) {
    lines.push("📄 *View full bill (PDF style):*", invoiceUrl, "");
  }

  lines.push(
    "⚠️ *Return / Refund Policy:*",
    "Record a video while opening your parcel.",
    "Without unboxing video proof, no return or refund will be accepted.",
    "",
    "Please confirm availability, payment mode, and delivery timeline.",
    "",
    "Thank you for shopping with Virtue Gems!",
  );

  return lines.join("\n");
}

/** Admin copy-paste reply after confirming an order on WhatsApp. */
export function buildPaymentReplyMessage(
  customerName: string,
  orderId: string,
  total: number,
): string {
  const lines = [
    `Hi ${customerName}! 👋`,
    "",
    `Your order *${orderId}* is confirmed ✅`,
    `Amount to pay: *${formatPrice(total)}*`,
    "",
    "💳 *Pay via UPI:*",
    `UPI ID: *${UPI_ID}*`,
    `Name: ${UPI_PAYEE_NAME}`,
  ];

  if (BANK_DETAILS) {
    lines.push("", "🏦 *Or bank transfer:*", BANK_DETAILS);
  }

  lines.push(
    "",
    "📸 Please send a *payment screenshot* on WhatsApp after paying.",
    "",
    COD_POLICY,
    "",
    "We'll dispatch your order once payment is verified. Thank you! 🙏",
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

export const WHATSAPP_ENQUIRY_MESSAGE =
  "Hello Virtue Gems! I have an enquiry about your jewellery.";

export const whatsAppContactUrl = getWhatsAppUrl(WHATSAPP_ENQUIRY_MESSAGE);

export function buildCustomerPointsMessage(
  customerName: string,
  pointsEarned: number,
  pointsBalance: number,
  rewardsUrl: string,
): string {
  return [
    "✨ *Virtue Gems — Points Added* ✨",
    "",
    `Hi ${customerName}! Thank you for your order.`,
    "",
    `⭐ Points added: *+${pointsEarned}*`,
    `💎 Your total balance: *${pointsBalance} points*`,
    "",
    "Redeem for discounts & free jewellery:",
    rewardsUrl,
    "",
    "Keep shopping to unlock more rewards!",
  ].join("\n");
}

export function getCustomerPointsWhatsAppUrl(
  customerPhone: string,
  message: string,
): string {
  const digits = customerPhone.replace(/\D/g, "");
  const normalized = digits.length <= 10 ? `91${digits}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
