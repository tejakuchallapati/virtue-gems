import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Eye,
  Gem,
  Heart,
  MessageCircle,
  Package,
  Shield,
  ShoppingBag,
  Truck,
  Video,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionDivider } from "@/components/ui/PageSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import {
  CARD_SURFACE,
  PAGE_CONTENT_SHELL,
  PAGE_GRADIENT_SHELL,
} from "@/lib/ui-classes";
import { buildPageMetadata } from "@/lib/seo";
import {
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
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "About Virtue Gems — Vision, Orders, Delivery & Returns",
  description:
    "Learn about Virtue Gems: our vision, WhatsApp order flow, AP & Telangana delivery, payment options, and refund policy with mandatory unboxing video.",
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
    text: "We reply on WhatsApp (usually within 2–4 hours) to confirm stock and delivery details.",
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

        {/* Hero — brand story */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-dark ring-1 ring-gold/20 sm:mb-12">
          <Image
            src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&q=90"
            alt="Virtue Gems jewellery craftsmanship"
            width={1600}
            height={700}
            quality={90}
            sizes="(max-width: 768px) 100vw, 1200px"
            className="h-52 w-full object-cover opacity-50 sm:h-72"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <ScrollReveal className="text-center">
              <p className="text-[10px] tracking-[0.28em] text-gold uppercase sm:text-xs">
                Virtue Gems
              </p>
              <h1 className="mt-2 text-3xl font-bold text-light sm:text-4xl">Our Story</h1>
              <p className="mt-2 text-sm text-light/70 sm:text-base">
                Where tradition meets timeless elegance
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Jump links — useful on mobile for long page */}
        <nav
          aria-label="About page sections"
          className="mb-10 -mx-4 flex gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 no-scrollbar sm:mx-0 sm:justify-center sm:px-0"
        >
          {infoNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-full border border-gold/30 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold-dark transition hover:bg-gold hover:text-dark"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base leading-relaxed text-dark/70 sm:text-lg">
              Founded with a passion for exquisite jewellery, <strong>Virtue Gems</strong> brings
              together craftsmanship and contemporary design. Each piece is made for festive
              moments, everyday elegance, and gifting across Andhra Pradesh &amp; Telangana.
            </p>
          </div>
        </ScrollReveal>

        {/* Values */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <ScrollReveal key={v.title} delay={i * 0.06}>
                <div className={`${CARD_SURFACE} h-full p-5 text-center sm:p-6`}>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
                    <Icon className="h-6 w-6 text-gold-dark" />
                  </div>
                  <h2 className="mt-4 text-base font-semibold text-dark">{v.title}</h2>
                  <p className="mt-2 text-sm text-dark/60">{v.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Vision */}
        <section id="vision" className="scroll-mt-24 mt-14 sm:mt-16">
          <ScrollReveal>
            <div className={cn(CARD_SURFACE, "overflow-hidden")}>
              <div className="grid gap-0 lg:grid-cols-5">
                <div className="bg-gradient-to-br from-[#1a0a2e] to-[#2d1450] px-6 py-8 text-light sm:px-8 lg:col-span-2 lg:py-10">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Eye className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-[10px] tracking-[0.25em] text-gold uppercase">Vision</p>
                  <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                    Jewellery that feels personal
                  </h2>
                </div>
                <div className="px-6 py-8 sm:px-8 lg:col-span-3 lg:py-10">
                  <p className="text-sm leading-relaxed text-dark/70 sm:text-base">
                    Our vision is to make beautiful, gift-ready jewellery easy to discover and order
                    — without complicated website payments. We sell through a WhatsApp-first
                    experience so you can ask questions, confirm sizing, and feel confident before
                    you pay.
                  </p>
                  <ul className="mt-5 space-y-2.5 text-sm text-dark/70">
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      Designs suited to AP &amp; Telangana festive and daily wear
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      Clear pricing, careful packing, and letter-packed gifting
                    </li>
                    <li className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      Honest support on WhatsApp from order to delivery feedback
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Orders */}
        <section id="orders" className="scroll-mt-24 mt-14 sm:mt-16">
          <ScrollReveal>
            <div className="mb-6 flex items-start gap-3 sm:mb-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] tracking-[0.25em] text-gold-dark uppercase">Orders</p>
                <h2 className="mt-1 text-2xl font-semibold text-dark sm:text-3xl">
                  How ordering works
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-dark/60 sm:text-base">
                  No card payment on the website yet. Your order is saved on Virtue Gems, then
                  confirmed and paid on WhatsApp.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {orderSteps.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.05}>
                <div className={`${CARD_SURFACE} h-full p-5 sm:p-6`}>
                  <p className="text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">
                    Step {item.step}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-dark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark/65">{item.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.1}>
            <div className="mt-4 rounded-2xl border border-[#25D366]/25 bg-[#25D366]/5 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#25D366]" />
                  <div>
                    <p className="font-semibold text-dark">Payment after confirmation</p>
                    <p className="mt-1 text-sm text-dark/65">{CHECKOUT_PAYMENT_NOTICE}</p>
                    <p className="mt-2 text-sm text-dark/65">{PAYMENT_METHODS_SUMMARY}</p>
                    <p className="mt-1 text-sm text-dark/55">{COD_POLICY}</p>
                  </div>
                </div>
                <a
                  href={whatsAppContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white transition hover:bg-[#1fb855]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Delivery */}
        <section id="delivery" className="scroll-mt-24 mt-14 sm:mt-16">
          <ScrollReveal>
            <div className="mb-6 flex items-start gap-3 sm:mb-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] tracking-[0.25em] text-gold-dark uppercase">Delivery</p>
                <h2 className="mt-1 text-2xl font-semibold text-dark sm:text-3xl">
                  Shipping across {DELIVERY_REGION_LABEL}
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 lg:grid-cols-3">
            <ScrollReveal>
              <div className={`${CARD_SURFACE} h-full p-5 sm:p-6`}>
                <Package className="h-5 w-5 text-gold-dark" />
                <h3 className="mt-3 font-semibold text-dark">Service area</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark/65">{DELIVERY_NOTICE}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <div className={`${CARD_SURFACE} h-full p-5 sm:p-6`}>
                <Truck className="h-5 w-5 text-gold-dark" />
                <h3 className="mt-3 font-semibold text-dark">Timeline</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark/65">
                  Typical delivery: <strong className="text-dark">{DELIVERY_TIMELINE}</strong>. We
                  share tracking on WhatsApp after dispatch.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className={`${CARD_SURFACE} h-full p-5 sm:p-6`}>
                <Heart className="h-5 w-5 text-gold-dark" />
                <h3 className="mt-3 font-semibold text-dark">Packaging</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark/65">
                  Orders are packed carefully and letter-packed for gifting — ready to open and
                  share special moments.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Refunds */}
        <section id="refunds" className="scroll-mt-24 mt-14 sm:mt-16">
          <ScrollReveal>
            <div className="mb-6 flex items-start gap-3 sm:mb-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] tracking-[0.25em] text-gold-dark uppercase">
                  Refunds &amp; returns
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-dark sm:text-3xl">
                  Our return policy at a glance
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-dark/60 sm:text-base">
                  We want you to love your jewellery. Returns are possible with clear rules —
                  especially the mandatory unboxing video.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="rounded-2xl border-2 border-gold/35 bg-gold/10 p-5 sm:p-6">
              <div className="flex gap-3">
                <Video className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
                <div>
                  <p className="font-semibold text-dark">Mandatory unboxing video</p>
                  <p className="mt-2 text-sm leading-relaxed text-dark/75">
                    Record a continuous video while opening your parcel. Start before the outer seal
                    is broken, show the label, and keep recording through the full unboxing.{" "}
                    <strong>Without this video, no return or refund is accepted</strong> — including
                    for damaged items.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <ScrollReveal delay={0.05}>
              <div className={`${CARD_SURFACE} h-full p-5 sm:p-6`}>
                <h3 className="font-semibold text-dark">Eligibility</h3>
                <ul className="mt-3 space-y-2 text-sm text-dark/65">
                  <li>· Returns within 7 days of delivery</li>
                  <li>· Unused items in original packaging with invoice</li>
                  <li>· Custom or engraved pieces are non-returnable</li>
                  <li>· Size exchanges on rings/bracelets within 15 days (stock permitting)</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className={`${CARD_SURFACE} h-full p-5 sm:p-6`}>
                <h3 className="font-semibold text-dark">Damaged items &amp; refunds</h3>
                <ul className="mt-3 space-y-2 text-sm text-dark/65">
                  <li>· Report damage within 48 hours on WhatsApp</li>
                  <li>· Share order ID, photos, and the unboxing video</li>
                  <li>· Approved refunds: 7–10 business days via UPI/bank</li>
                  <li>· Full policy details are on our Refunds page</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/refunds"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-dark px-5 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark"
            >
              Read full refund policy
            </Link>
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-gold/40 bg-white/80 px-5 text-sm font-medium text-gold-dark transition hover:bg-gold hover:text-dark"
            >
              View FAQ
            </Link>
          </div>
        </section>

        {/* CTA */}
        <ScrollReveal>
          <div className="mt-14 rounded-3xl bg-gradient-to-br from-[#1a0a2e] via-[#2d1450] to-[#1a0a2e] px-6 py-10 text-center sm:mt-16 sm:px-10 sm:py-12">
            <p className="text-[10px] tracking-[0.28em] text-gold uppercase">Ready to shine</p>
            <h2 className="mt-3 text-2xl font-semibold text-light sm:text-3xl">
              Explore the collection
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-light/65">
              Browse jewellery under ₹2,000, order on WhatsApp, and get free delivery in{" "}
              {DELIVERY_REGION_LABEL}.
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
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-gold/40 px-6 text-sm font-medium text-gold transition hover:bg-gold/10 sm:w-auto"
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
