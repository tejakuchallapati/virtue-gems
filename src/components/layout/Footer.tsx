import Link from "next/link";
import { whatsAppContactUrl } from "@/lib/whatsapp";
import { FooterYear } from "./FooterYear";

const shop = [
  { href: "/shop", label: "All Collections" },
  { href: "/try-on", label: "Virtual Try-On" },
  { href: "/shop?category=rings", label: "Rings" },
  { href: "/shop?category=necklaces", label: "Necklaces" },
  { href: "/shop?category=earrings", label: "Earrings" },
  { href: "/shop?category=bracelets", label: "Bracelets" },
];

const company = [
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/rewards", label: "Rewards & Points" },
  { href: "/contact", label: "Contact" },
];

const legal = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/refunds", label: "Refund & Return" },
];

export function Footer() {
  return (
    <footer className="safe-bottom border-t border-gold/20 bg-dark text-light/80 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mt-10 border-t border-light/10 pt-6 text-center text-xs text-light/40">
          &copy; <FooterYear /> Virtue Gems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
