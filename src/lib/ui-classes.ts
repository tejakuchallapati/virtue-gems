/** Shared Tailwind class groups for consistent layout and product imagery. */

export const PAGE_CONTAINER = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

/** Standard page shell with safe-area padding and vertical rhythm. */
export const PAGE_SHELL =
  "page-mobile-safe mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8";

/** Narrow centered layout for empty cart, wishlist, and similar states. */
export const EMPTY_STATE_SHELL =
  "page-mobile-safe mx-auto max-w-lg px-4 py-16 text-center sm:py-24";

export const CARD_SURFACE =
  "rounded-2xl bg-white ring-1 ring-light-muted/60 shadow-sm";

/** Dark gradient panel used for CTAs and promo blocks. */
export const DARK_PANEL =
  "rounded-2xl bg-gradient-to-r from-[#1a0a2e] to-[#2d1450] ring-1 ring-gold/20";

export const PRODUCT_IMAGE_BG = "bg-[#1a0a2e]";

export const PRODUCT_IMAGE_FRAME = `relative overflow-hidden ${PRODUCT_IMAGE_BG} ring-1 ring-inset ring-white/10`;

export const PRODUCT_IMAGE_FIT =
  "object-contain p-2 transition duration-500 sm:p-3";

export const PRODUCT_GRID =
  "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4";

export const SECTION_DIVIDER =
  "pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-gold/35 to-transparent";
