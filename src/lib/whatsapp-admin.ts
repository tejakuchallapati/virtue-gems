import { LOYALTY_ENABLED } from "@/lib/features";
import { getAbsoluteUrl } from "@/lib/site";
import { formatPrice } from "@/lib/utils";
import {
  BANK_DETAILS,
  COD_POLICY,
  UPI_ID,
  UPI_PAYEE_NAME,
} from "@/lib/payments";

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

export function getCustomerWhatsAppUrl(
  customerPhone: string,
  message: string,
): string {
  const digits = customerPhone.replace(/\D/g, "");
  const normalized = digits.length <= 10 ? `91${digits}` : digits;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
