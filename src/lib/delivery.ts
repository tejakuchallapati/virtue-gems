export const DELIVERY_STATES = ["Andhra Pradesh", "Telangana"] as const;

export const DELIVERY_REGION_LABEL = "Andhra Pradesh & Telangana";

export const DELIVERY_SHORT = "AP & Telangana only";

export const DELIVERY_NOTICE =
  "We currently deliver only to Andhra Pradesh and Telangana. More regions will be added as production scales.";

export const DELIVERY_TIMELINE = "3–7 business days within AP & Telangana";

/**
 * Delivery is charged after cart + address — not free, not a random flat fee.
 * Exact amount is shown once the delivery address is known.
 */
export const DELIVERY_CHARGES_NOTICE =
  "Delivery charges are added after you select items and enter your address. The exact amount for that address is shown at checkout — there are no random delivery fees.";

export const DELIVERY_HERO_LINE = "Shop · WhatsApp checkout · Delivery by address";

export const DELIVERY_TRUST_LINE = `Delivery by address · ${DELIVERY_SHORT}`;
