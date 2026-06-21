/** WhatsApp-first payment settings — configure in .env.local */

export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID ?? "virtuegems@upi";

export const UPI_PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "Virtue Gems";

export const BANK_DETAILS = process.env.NEXT_PUBLIC_BANK_DETAILS ?? "";

/** Set NEXT_PUBLIC_COD_ENABLED=true to allow cash on delivery */
export const COD_ENABLED = process.env.NEXT_PUBLIC_COD_ENABLED === "true";

export const COD_POLICY = COD_ENABLED
  ? "Cash on delivery is available for select pincodes in Andhra Pradesh & Telangana. Ask us on WhatsApp."
  : "We currently do not offer cash on delivery. Pay via UPI or bank transfer after we confirm your order.";

export const PAYMENT_METHODS_SUMMARY =
  "UPI (GPay / PhonePe / Paytm) and bank transfer via WhatsApp after order confirmation.";

export const ONLINE_PAYMENT_COMING_SOON =
  "Online payment on the website is coming soon. For now, pay via WhatsApp after we confirm your order.";

export const CHECKOUT_PAYMENT_NOTICE =
  "No online payment on the website yet — pay via WhatsApp after we confirm availability. Online checkout payment is coming soon.";
