import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SectionDivider } from "@/components/ui/PageSection";
import { whatsAppContactUrl } from "@/lib/whatsapp";
import { LOYALTY_ENABLED } from "@/lib/features";
import { FooterYear } from "./FooterYear";

const shop = [
  { href: "/shop", label: "All Collections" },
  { href: "/shop?category=rings", label: "Rings" },
  { href: "/shop?category=necklaces", label: "Necklaces" },
  { href: "/shop?category=earrings", label: "Earrings" },
  { href: "/shop?category=bracelets", label: "Bracelets" },
];

const company = [
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  ...(LOYALTY_ENABLED
    ? [{ href: "/rewards", label: "Rewards & Points" }]
    : []),
  { href: "/contact", label: "Contact" },
];

const legal = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refunds", label: "Refund & Return" },
];

const INSTAGRAM_URL = "https://www.instagram.com/virtue_gems/";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function Footer() {
  return (
    <>
      <SectionDivider />
      <footer className="relative overflow-hidden border-t border-gold/20 bg-dark text-light/80 pb-[var(--mobile-nav-offset)] md:pb-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gold/[0.04] blur-[80px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="text-lg font-bold tracking-[0.08em] text-light">
                VIRTUE <span className="text-gold">GEMS</span>
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed tracking-wide text-light/55">
                Premium handcrafted jewellery. Timeless elegance for every
                occasion.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href={whatsAppContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-light/50 transition hover:border-[#25D366]/50 hover:bg-[#25D366]/15 hover:text-[#25D366]"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-light/50 transition hover:border-[#E4405F]/50 hover:bg-[#E4405F]/15 hover:text-[#E4405F]"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-light">
                Shop
              </h3>
              <ul className="space-y-3 text-sm tracking-wide">
                {shop.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-light/55 transition hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-light">
                Company
              </h3>
              <ul className="space-y-3 text-sm tracking-wide">
                {company.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-light/55 transition hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-light">
                Legal
              </h3>
              <ul className="space-y-3 text-sm tracking-wide">
                {legal.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-light/55 transition hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs tracking-wide text-light/40 sm:mt-12 sm:flex-row sm:gap-6">
            <p className="text-center sm:text-left">
              &copy; <FooterYear /> Virtue Gems. All rights reserved.
            </p>
            <nav
              aria-label="Legal"
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-6"
            >
              <Link href="/terms" className="transition hover:text-gold">
                Terms &amp; Conditions
              </Link>
              <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
              <Link href="/privacy" className="transition hover:text-gold">
                Privacy Policy
              </Link>
              <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
              <Link href="/refunds" className="transition hover:text-gold">
                Refund Policy
              </Link>
              <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
              <Link href="/contact" className="transition hover:text-gold">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
