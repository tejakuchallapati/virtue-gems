/**
 * Single source for customer-support details and policy facts confirmed by the owner.
 * Change a POLICY_UPDATED date only when that policy's wording actually changes.
 */

export const SUPPORT_EMAIL = "virtuegems777@gmail.com";
export const SUPPORT_PHONE_DISPLAY = "+91 73961 78039";
export const SUPPORT_PHONE_TEL = "+917396178039";
export const SUPPORT_HOURS = "Monday to Saturday, 10 AM – 8 PM IST";
export const SUPPORT_HOURS_SHORT = "Mon–Sat, 10 AM – 8 PM IST";
export const SUPPORT_RESPONSE = "We usually reply on WhatsApp the same day during support hours.";

export const DAMAGE_CLAIM_DAYS = 7;
export const FREE_CANCELLATION_HOURS = 12;
export const MAX_CANCELLATION_CHARGE = "25%";
export const REFUND_TIMELINE = "7–10 business days";

export const POLICY_UPDATED = {
  refunds: "2026-10-14",
  terms: "2026-10-14",
  privacy: "2026-10-14",
  shipping: "2026-10-14",
} as const;

export function formatPolicyDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(`${isoDate}T00:00:00+05:30`));
}
