import type { ActiveRedemption, CartItem, CheckoutForm } from "@/types";
import { LOYALTY_ENABLED } from "./features";
import { formatPrice } from "./utils";
import { getAbsoluteUrl } from "./site";
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
    "5. After delivery, reply with a short review — we love your feedback!",
    "",
    `Accepted: ${PAYMENT_METHODS_SUMMARY}`,
    COD_POLICY,
    "",
  );

  if (LOYALTY_ENABLED && options?.redemption) {
    lines.push(
      "🎁 *Loyalty Reward Applied:*",
      options.redemption.title,
      "",
    );
  }

  if (LOYALTY_ENABLED && options?.pointsEarned !== undefined) {
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

/** Re-open WhatsApp from the invoice page if checkout popup was blocked. */
export function buildOrderFollowUpMessage(
  order: {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
  },
  invoiceUrl: string,
): string {
  const itemLines = order.items.flatMap((item, i) => {
    const lineTotal = item.price * item.quantity;
    return [
      `${i + 1}. *${item.name}*`,
      padBillLine("   Qty", `${item.quantity}`),
      padBillLine("   Amount", formatPrice(lineTotal)),
      "",
    ];
  });

  return [
    "╔══════════════════════════╗",
    "║     *VIRTUE GEMS*        ║",
    "║      ORDER REQUEST       ║",
    "╚══════════════════════════╝",
    "",
    padBillLine("Order No.", order.id),
    `Name    : ${order.customerName}`,
    `Phone   : ${order.phone}`,
    `Address : ${order.address}, ${order.city}, ${order.state} ${order.pincode}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "*ITEMS*",
    "",
    ...itemLines,
    padBillLine("*TOTAL*", `*${formatPrice(order.total)}*`),
    "━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "📋 *WHAT HAPPENS NEXT*",
    "1. Confirm availability",
    "2. Pay via UPI / bank transfer",
    "3. Send payment screenshot",
    "4. We ship + share tracking",
    "5. After delivery — leave a short review",
    "",
    `Accepted: ${PAYMENT_METHODS_SUMMARY}`,
    COD_POLICY,
    "",
    "📄 Full bill:",
    invoiceUrl,
    "",
    "Please confirm this order. Thank you!",
  ].join("\n");
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
  const url = getAbsoluteUrl(`/product/${slug}`);
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

/** Post-delivery thank-you + review request (admin opens to customer). */
export function buildDeliveryThankYouMessage(options: {
  customerName: string;
  orderId: string;
  pointsEarned?: number;
  pointsBalance?: number;
  rewardsUrl?: string;
  shopUrl?: string;
  instagramUrl?: string;
}): string {
  const rewardsUrl = options.rewardsUrl ?? getAbsoluteUrl("/rewards");
  const shopUrl = options.shopUrl ?? getAbsoluteUrl("/shop");
  const instagramUrl =
    options.instagramUrl ?? "https://www.instagram.com/virtue_gems/";

  const pointsLines =
    LOYALTY_ENABLED &&
    options.pointsEarned !== undefined &&
    options.pointsBalance !== undefined
      ? [
          `⭐ Points from this order: *+${options.pointsEarned}*`,
          `💎 Your points balance: *${options.pointsBalance}*`,
          `Redeem rewards: ${rewardsUrl}`,
          "",
        ]
      : [];

  return [
    `Hi ${options.customerName}! ✨`,
    "",
    "Thank you for choosing *Virtue Gems*.",
    `Your order *${options.orderId}* is delivered — we hope you love your jewellery!`,
    "",
    ...pointsLines,
    "💬 *We'd love your feedback*",
    "1. Reply here with a short review (and a photo if you like)",
    "2. Tag us on Instagram @virtue_gems",
    `3. Shop again anytime: ${shopUrl}`,
    "",
    `Instagram: ${instagramUrl}`,
    "",
    "Thank you for supporting our small business 💛",
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
