/** Shared Tailwind class groups for consistent layout and product imagery. */

export const PAGE_CONTAINER = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

/** Cream gradient page backdrop (bottom-nav clearance comes from SiteShell). */
export const PAGE_GRADIENT_SHELL =
  "min-h-screen bg-gradient-to-b from-[#faf6ee] via-light to-white";

/** Inner content width and vertical rhythm (pair with PAGE_GRADIENT_SHELL). */
export const PAGE_CONTENT_SHELL =
  "mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-10 lg:px-8";

/** Narrow centered layout for empty cart, wishlist, and similar states. */
export const EMPTY_STATE_SHELL =
  "mx-auto max-w-lg px-4 py-14 text-center sm:py-24";

export const CARD_SURFACE =
  "rounded-2xl bg-white ring-1 ring-light-muted/60 shadow-sm";

/** Dark gradient panel used for CTAs and promo blocks. */
export const DARK_PANEL =
  "rounded-2xl bg-gradient-to-r from-[#1a0a2e] to-[#2d1450] ring-1 ring-gold/20";

export const PRODUCT_IMAGE_BG = "bg-[#1a0a2e]";

/** Dark square frame for product photos — always includes `relative` for next/image `fill`. */
export const PRODUCT_IMAGE_FRAME = `relative overflow-hidden ${PRODUCT_IMAGE_BG} ring-1 ring-inset ring-white/10`;

export const PRODUCT_IMAGE_FIT =
  "object-contain p-2 transition duration-500 sm:p-3";

/** Edge-to-edge cover fit for Instagram / lifestyle tiles (no product padding). */
export const PRODUCT_IMAGE_COVER =
  "object-cover transition duration-500";

export const PRODUCT_GRID =
  "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4";

export const SECTION_DIVIDER =
  "pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-gold/35 to-transparent";

/** Shared admin chrome background (dashboard + login). */
export const ADMIN_SHELL_BG = "bg-[#0a0f1a]";

/** Sticky admin top nav with translucency. */
export const ADMIN_NAV_BG = "bg-[#0a0f1a]/95";

/** Shared admin text field styling. */
export const ADMIN_INPUT =
  "w-full rounded-xl border border-light/10 bg-[#0f0a1a] px-3.5 py-2.5 text-sm text-light outline-none focus:border-gold/40";

/** Shared admin search field. */
export const ADMIN_SEARCH =
  "w-full max-w-md rounded-xl border border-light/10 bg-dark px-4 py-2.5 text-sm text-light outline-none focus:border-gold/40";
