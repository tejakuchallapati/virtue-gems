import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Eye,
  Gem,
  Heart,
  MessageCircle,
  Shield,
  ShoppingBag,
  Truck,
  Video,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionDivider } from "@/components/ui/PageSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { PAGE_CONTENT_SHELL, PAGE_GRADIENT_SHELL } from "@/lib/ui-classes";
import { buildPageMetadata } from "@/lib/seo";
import {
  DELIVERY_CHARGES_NOTICE,
  DELIVERY_NOTICE,
  DELIVERY_REGION_LABEL,
  DELIVERY_TIMELINE,
} from "@/lib/delivery";
import {
  CHECKOUT_PAYMENT_NOTICE,
  COD_POLICY,
  PAYMENT_METHODS_SUMMARY,
} from "@/lib/payments";
import { whatsAppContactUrl } from "@/lib/whatsapp";

export const metadata: Metadata = buildPageMetadata({
  title: "About Virtue Gems — Vision, Orders, Delivery & Returns",
  description:
    "Learn about Virtue Gems: our vision, WhatsApp order flow, AP & Telangana delivery charges by location, payment options, and refund policy with mandatory unboxing video.",
  path: "/about",
  keywords: [
    "about Virtue Gems",
    "jewellery delivery AP Telangana",
    "WhatsApp jewellery orders",
    "jewellery refund policy Hyderabad",
  ],
});

const values = [
  {
    icon: Gem,
    title: "Craftsmanship",
    desc: "Every piece is carefully finished for festive and everyday wear.",
  },
  {
    icon: Award,
    title: "Quality Finish",
    desc: "Premium gold-plated fashion jewellery with lasting shine.",
  },
  {
    icon: Heart,
    title: "Thoughtful Design",
    desc: "Traditional and trendy designs chosen for AP & Telangana styles.",
  },
  {
    icon: Shield,
    title: "Customer Care",
    desc: "WhatsApp support, unboxing guidance, and easy reorders.",
  },
];

const orderSteps = [
  {
    step: "1",
    title: "Browse & add to cart",
    text: "Pick jewellery from the shop. Check photos, price, and stock on each product page.",
  },
  {
    step: "2",
    title: "Checkout on WhatsApp",
    text: "Place your order on the website — WhatsApp opens with your bill and order details.",
  },
  {
    step: "3",
    title: "We confirm availability",
    text: "We reply on WhatsApp (usually within 2–4 hours) to confirm stock, delivery location, and charges.",
  },
  {
    step: "4",
    title: "Pay & we ship",
    text: "Pay via UPI or bank transfer, share the payment screenshot, then we pack and ship with tracking.",
  },
];

const infoNav = [
  { href: "#vision", label: "Vision" },
  { href: "#orders", label: "Orders" },
  { href: "#delivery", label: "Delivery" },
  { href: "#refunds", label: "Refunds" },
];

function SectionLabel({
  icon: Icon,
  label,
}: {
  icon: typeof Eye;
  label: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className="h-4 w-4 text-gold-dark" />
      <p className="text-[10px] font-semibold tracking-[0.22em] text-gold-dark uppercase">
        {label}
      </p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className={PAGE_GRADIENT_SHELL}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About Us" },
        ]}
      />
      <div className={PAGE_CONTENT_SHELL}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

        <div className="relative mb-8 overflow-hidden sm:mb-10">
          <Image
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&q=90"
            alt="Virtue Gems jewellery craftsmanship"
            width={1600}
            height={700}
            quality={90}
            sizes="(max-width: 768px) 100vw, 1200px"
            className="h-48 w-full object-cover opacity-90 sm:h-64"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a2e]/85 via-[#1a0a2e]/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-1 pb-6 sm:pb-8">
            <ScrollReveal>
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase sm:text-xs">
                Virtue Gems
              </p>
              <h1 className="mt-2 text-3xl font-bold text-light sm:text-4xl">Our Story</h1>
              <p className="mt-2 text-sm text-light/75 sm:text-base">
                Where tradition meets timeless elegance
              </p>
            </ScrollReveal>
          </div>
        </div>

        <nav
          aria-label="About page sections"
          className="mb-10 flex flex-wrap gap-x-5 gap-y-2 border-b border-gold/20 pb-4 text-sm"
        >
          {infoNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-semibold text-gold-dark transition hover:text-dark"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <ScrollReveal>
          <p className="max-w-3xl text-base leading-relaxed text-dark/70 sm:text-lg">
            Founded with a passion for exquisite jewellery, <strong>Virtue Gems</strong> brings
            together craftsmanship and contemporary design. Each piece is made for festive moments,
            everyday elegance, and gifting across Andhra Pradesh &amp; Telangana.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <ScrollReveal key={v.title} delay={i * 0.05}>
                <div className="min-w-0">
                  <Icon className="h-5 w-5 text-gold-dark" />
                  <h2 className="mt-3 text-base font-bold text-dark">{v.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-dark/65">{v.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <section id="vision" className="scroll-mt-24 mt-14 border-t border-gold/15 pt-12 sm:mt-16">
          <ScrollReveal>
            <SectionLabel icon={Eye} label="Vision" />
            <h2 className="text-2xl font-bold text-dark sm:text-3xl">
              Jewellery that feels personal
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-dark/70 sm:text-base">
              Our vision is to make beautiful, gift-ready jewellery easy to discover and order —
              without complicated website payments. We sell through a WhatsApp-first experience so
              you can ask questions, confirm sizing, and feel confident before you pay.
            </p>
            <ul className="mt-5 max-w-3xl space-y-2.5 text-sm text-dark/70 sm:text-base">
              <li>
                <strong className="text-dark">Designs</strong> suited to AP &amp; Telangana festive
                and daily wear
              </li>
              <li>
                <strong className="text-dark">Clear pricing</strong>, careful packing, and
                letter-packed gifting
              </li>
              <li>
                <strong className="text-dark">Honest support</strong> on WhatsApp from order to
                delivery feedback
              </li>
            </ul>
          </ScrollReveal>
        </section>

        <section id="orders" className="scroll-mt-24 mt-14 border-t border-gold/15 pt-12 sm:mt-16">
          <ScrollReveal>
            <SectionLabel icon={ShoppingBag} label="Orders" />
            <h2 className="text-2xl font-bold text-dark sm:text-3xl">How ordering works</h2>
            <p className="mt-3 max-w-2xl text-sm text-dark/65 sm:text-base">
              No card payment on the website yet. Your order is saved on Virtue Gems, then confirmed
              and paid on WhatsApp.
            </p>
          </ScrollReveal>

          <ol className="mt-8 max-w-3xl space-y-6">
            {orderSteps.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.04}>
                <li className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                  <span className="pt-0.5 text-sm font-bold tracking-wider text-gold-dark">
                    {item.step}.
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-dark sm:text-lg">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-dark/65">{item.text}</p>
                  </div>
                </li>
              </ScrollReveal>
            ))}
          </ol>

          <ScrollReveal delay={0.08}>
            <div className="mt-8 max-w-3xl border-l-2 border-[#25D366]/50 pl-4 sm:pl-5">
              <p className="font-bold text-dark">Payment after confirmation</p>
              <p className="mt-2 text-sm leading-relaxed text-dark/70">{CHECKOUT_PAYMENT_NOTICE}</p>
              <p className="mt-2 text-sm text-dark/65">{PAYMENT_METHODS_SUMMARY}</p>
              <p className="mt-1 text-sm text-dark/55">{COD_POLICY}</p>
              <a
                href={whatsAppContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#128C7E] hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </section>

        <section id="delivery" className="scroll-mt-24 mt-14 border-t border-gold/15 pt-12 sm:mt-16">
          <ScrollReveal>
            <SectionLabel icon={Truck} label="Delivery" />
            <h2 className="text-2xl font-bold text-dark sm:text-3xl">
              Shipping across {DELIVERY_REGION_LABEL}
            </h2>
          </ScrollReveal>

          <dl className="mt-8 max-w-3xl space-y-6">
            <ScrollReveal>
              <div>
                <dt className="font-bold text-dark">Service area</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-dark/65 sm:text-base">
                  {DELIVERY_NOTICE}
                </dd>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.04}>
              <div>
                <dt className="font-bold text-dark">Delivery charges</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-dark/65 sm:text-base">
                  {DELIVERY_CHARGES_NOTICE}
                </dd>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <div>
                <dt className="font-bold text-dark">Timeline</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-dark/65 sm:text-base">
                  Typical delivery: <strong className="text-dark">{DELIVERY_TIMELINE}</strong>. We
                  share tracking on WhatsApp after dispatch.
                </dd>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.12}>
              <div>
                <dt className="font-bold text-dark">Packaging</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-dark/65 sm:text-base">
                  Orders are packed carefully and letter-packed for gifting — ready to open and
                  share special moments.
                </dd>
              </div>
            </ScrollReveal>
          </dl>
        </section>

        <section id="refunds" className="scroll-mt-24 mt-14 border-t border-gold/15 pt-12 sm:mt-16">
          <ScrollReveal>
            <SectionLabel icon={Shield} label="Refunds & returns" />
            <h2 className="text-2xl font-bold text-dark sm:text-3xl">
              Our return policy at a glance
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-dark/65 sm:text-base">
              We want you to love your jewellery. Returns are possible with clear rules — especially
              the mandatory unboxing video.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-8 max-w-3xl border-l-2 border-gold/50 pl-4 sm:pl-5">
              <p className="flex items-center gap-2 font-bold text-dark">
                <Video className="h-4 w-4 text-gold-dark" />
                Mandatory unboxing video
              </p>
              <p className="mt-2 text-sm leading-relaxed text-dark/70 sm:text-base">
                Record a continuous video while opening your parcel. Start before the outer seal is
                broken, show the label, and keep recording through the full unboxing.{" "}
                <strong>Without this video, no return or refund is accepted</strong> — including for
                damaged items.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid max-w-4xl gap-10 sm:grid-cols-2">
            <ScrollReveal delay={0.04}>
              <h3 className="font-bold text-dark">Eligibility</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-dark/65">
                <li>Returns within 7 days of delivery</li>
                <li>Unused items in original packaging with invoice</li>
                <li>Custom or engraved pieces are non-returnable</li>
                <li>Size exchanges on rings/bracelets within 15 days (stock permitting)</li>
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={0.08}>
              <h3 className="font-bold text-dark">Damaged items &amp; refunds</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-dark/65">
                <li>Report damage within 48 hours on WhatsApp</li>
                <li>Share order ID, photos, and the unboxing video</li>
                <li>Approved refunds: 7–10 business days via UPI/bank</li>
                <li>
                  Full policy details are on our{" "}
                  <Link href="/refunds" className="font-semibold text-gold-dark hover:underline">
                    Refunds page
                  </Link>
                </li>
              </ul>
            </ScrollReveal>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            <Link
              href="/refunds"
              className="inline-flex min-h-11 items-center text-sm font-bold text-dark underline-offset-4 hover:underline"
            >
              Read full refund policy
            </Link>
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-gold-dark underline-offset-4 hover:underline"
            >
              View FAQ
            </Link>
          </div>
        </section>

        <ScrollReveal>
          <div className="mt-14 border-t border-gold/15 pt-12 text-center sm:mt-16">
            <p className="text-[10px] tracking-[0.28em] text-gold-dark uppercase">Ready to shine</p>
            <h2 className="mt-3 text-2xl font-bold text-dark sm:text-3xl">
              Explore the collection
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-dark/65">
              Browse jewellery under ₹2,000, order on WhatsApp. {DELIVERY_CHARGES_NOTICE}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-dark transition hover:bg-gold-light sm:w-auto"
              >
                Shop collections
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 w-full items-center justify-center text-sm font-bold text-gold-dark underline-offset-4 hover:underline sm:w-auto"
              >
                Contact us
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
      <SectionDivider />
    </div>
  );
}
