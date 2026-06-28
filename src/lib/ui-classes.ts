/** Shared Tailwind class groups for consistent layout and product imagery. */

export const PAGE_CONTAINER = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export const CARD_SURFACE =
  "rounded-2xl bg-white ring-1 ring-light-muted/60 shadow-sm";

export const PRODUCT_IMAGE_BG = "bg-[#1a0a2e]";

export const PRODUCT_IMAGE_FRAME = `relative overflow-hidden ${PRODUCT_IMAGE_BG} ring-1 ring-inset ring-white/10`;

export const PRODUCT_IMAGE_FIT =
  "object-contain p-2 transition duration-500 sm:p-3";

export const PRODUCT_GRID =
  "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4";

export const SECTION_DIVIDER =
  "pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-gold/35 to-transparent";
