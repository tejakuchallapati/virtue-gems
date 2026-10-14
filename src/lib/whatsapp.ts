import type { ActiveRedemption, CartItem, CheckoutForm } from "@/types";
import { LOYALTY_ENABLED } from "./features";
import { formatPrice } from "./utils";
import { getAbsoluteUrl } from "./site";
import {
  BANK_DETAILS,
  COD_POLICY,
  UPI_ID,
  UPI_PAYEE_NAME,
} from "./payments";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917396178039";

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Lets the customer pick any WhatsApp contact — used for sharing, not for messaging the store. */
export function getWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

type OrderSummary = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
};

/**
 * WhatsApp builds its preview card from the first link in a message, so the invoice link
 * goes first — the card then shows the branded invoice image.
 */
function buildOrderSummaryMessage(
  order: OrderSummary,
  invoiceUrl?: string,
  extraLines: string[] = [],
): string {
  const lines = ["🧾 *Virtue Gems — Order Request*"];
  if (invoiceUrl) lines.push(invoiceUrl);

  lines.push(
    "",
    `*Order No:* ${order.id}`,
    `*Name:* ${order.customerName}`,
    `*Phone:* ${order.phone}`,
    `*Deliver to:* ${order.address}, ${order.city}, ${order.state} – ${order.pincode}`,
    "",
    "*Items*",
    ...order.items.map(
      (item, i) =>
        `${i + 1}. ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
    ),
    "",
    ...extraLines,
    `*Total: ${formatPrice(order.total)}* + delivery charge for my address`,
    "",
    "Please confirm availability.",
  );

  return lines.join("\n");
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
  const discount = options?.discount ?? 0;
  const extraLines: string[] = [];

  if (discount > 0) {
    extraLines.push(`Reward discount: -${formatPrice(discount)}`);
  }
  if (options?.redemption?.type === "free_item" && options.redemption.freeItemLabel) {
    extraLines.push(`Free reward: ${options.redemption.freeItemLabel}`);
  }
  if (LOYALTY_ENABLED && options?.pointsEarned !== undefined) {
    extraLines.push(`Points earned: +${options.pointsEarned}`);
  }

  return buildOrderSummaryMessage(
    {
      ...form,
      id: orderId ?? `VG-${Date.now()}`,
      items: items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
    },
    invoiceUrl,
    extraLines,
  );
}

/** Re-open WhatsApp from the invoice page if checkout popup was blocked. */
export function buildOrderFollowUpMessage(order: OrderSummary, invoiceUrl: string): string {
  return buildOrderSummaryMessage(order, invoiceUrl);
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
    ...(UPI_ID
      ? ["💳 *Pay via UPI:*", `UPI ID: *${UPI_ID}*`, `Name: ${UPI_PAYEE_NAME}`]
      : ["💳 We'll share our UPI / bank payment details in this chat."]),
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

export function getCustomerPointsWhatsAppUrl(
  customerPhone: string,
  message: string,
): string {
  const digits = customerPhone.replace(/\D/g, "");
  const normalized = digits.length <= 10 ? `91${digits}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
