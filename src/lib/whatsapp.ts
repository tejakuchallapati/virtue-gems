import type { CartItem, CheckoutForm } from "@/types";
import { formatPrice } from "./utils";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210";

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(
  form: CheckoutForm,
  items: CartItem[],
  total: number,
): string {
  const lines = [
    "✨ *Virtue Gems — New Order* ✨",
    "",
    "*Customer Details*",
    `Name: ${form.customerName}`,
    `Phone: ${form.phone}`,
    `Address: ${form.address}`,
    `City: ${form.city}`,
    `State: ${form.state}`,
    `Pincode: ${form.pincode}`,
    "",
    "*Order Items*",
    ...items.map(
      (item, i) =>
        `${i + 1}. ${item.product.name} x${item.quantity} — ${formatPrice(item.product.price * item.quantity)}`,
    ),
    "",
    `*Total: ${formatPrice(total)}*`,
    "",
    "Please confirm availability and delivery timeline. Thank you!",
  ];
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
