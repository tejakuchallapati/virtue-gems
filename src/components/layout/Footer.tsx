import Link from "next/link";
import { SectionDivider } from "@/components/ui/PageSection";
import { whatsAppContactUrl } from "@/lib/whatsapp";
import { VIRTUAL_TRY_ON_ENABLED, LOYALTY_ENABLED } from "@/lib/features";
import { FooterYear } from "./FooterYear";

const shop = [
  { href: "/shop", label: "All Collections" },
  ...(VIRTUAL_TRY_ON_ENABLED
    ? [{ href: "/try-on", label: "Virtual Try-On" }]
    : []),
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

const mobileQuickLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refunds", label: "Returns" },
];

export function Footer() {
  return (
    <>
      <SectionDivider />
      <footer className="border-t border-gold/20 bg-dark text-light/80 pb-[var(--mobile-nav-offset)] md:pb-0">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Mobile compact */}
          <div className="md:hidden">
            <p className="text-base font-bold tracking-widest text-light">
              VIRTUE <span className="text-gold">GEMS</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-light/60">
              Premium handcrafted jewellery for every occasion.
            </p>
            <a
              href={whatsAppContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-gold"
            >
              WhatsApp us →
            </a>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {mobileQuickLinks.map((l) => (
                <Link key={l.href} href={l.href} className="text-light/70 hover:text-gold">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop columns */}
          <div className="hidden gap-8 sm:grid-cols-2 md:grid lg:grid-cols-4">
            <div>
              <p className="text-lg font-bold tracking-widest text-light">
                VIRTUE <span className="text-gold">GEMS</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-light/60">
                Premium handcrafted jewellery. Timeless elegance for every occasion.
              </p>
              <a
                href={whatsAppContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-gold transition hover:text-gold-light"
              >
                For any enquiries, message us on WhatsApp →
              </a>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
                Shop
              </h3>
              <ul className="space-y-2 text-sm">
                {shop.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition hover:text-gold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
                Company
              </h3>
              <ul className="space-y-2 text-sm">
                {company.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition hover:text-gold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold">
                Legal
              </h3>
              <ul className="space-y-2 text-sm">
                {legal.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition hover:text-gold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-light/10 pt-5 text-center text-xs text-light/40 sm:mt-10 sm:pt-6">
            &copy; <FooterYear /> Virtue Gems. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
