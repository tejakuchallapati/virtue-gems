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
  "Delivery charges are confirmed after you select your items and enter your address. The amount for that address is shown when we process your order.";

export const DELIVERY_HERO_LINE = "Wear your virtue · Shine with grace";

export const DELIVERY_TRUST_LINE = `Delivery by address · ${DELIVERY_SHORT}`;
