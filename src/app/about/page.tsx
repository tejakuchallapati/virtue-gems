import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  Gem,
  Gift,
  Heart,
  IndianRupee,
  MapPin,
  MessageCircle,
  PackageCheck,
  Shield,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionDivider } from "@/components/ui/PageSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CARD_SURFACE, PAGE_CONTENT_SHELL, PAGE_GRADIENT_SHELL } from "@/lib/ui-classes";
import { buildPageMetadata } from "@/lib/seo";
import {
  DELIVERY_CHARGES_NOTICE,
  DELIVERY_NOTICE,
  DELIVERY_REGION_LABEL,
  DELIVERY_TIMELINE,
  DISPATCH_TIMELINE,
} from "@/lib/delivery";
import {
  CHECKOUT_PAYMENT_NOTICE,
  COD_POLICY,
  PAYMENT_METHODS_SUMMARY,
} from "@/lib/payments";
import { whatsAppContactUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "About Virtue Gems — Vision, Orders & Delivery",
  description:
    "Learn about Virtue Gems: our vision, WhatsApp order flow, AP & Telangana delivery charges by location, and payment options.",
  path: "/about",
  keywords: [
    "about Virtue Gems",
    "jewellery delivery AP Telangana",
    "WhatsApp jewellery orders",
  ],
});

const HERO_PANEL =
  "relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0a2e] via-[#24103f] to-[#2d1450] ring-1 ring-gold/20";

const highlights = [
  { icon: MapPin, label: "Based in Hyderabad" },
  { icon: Truck, label: "Delivery across AP & Telangana" },
  { icon: MessageCircle, label: "Order & support on WhatsApp" },
];

const values = [
  {
    icon: Gem,
    title: "Handpicked Pieces",
    desc: "Every design is chosen for festive and everyday wear.",
  },
  {
    icon: Award,
    title: "Honest Details",
    desc: "Clear prices, and your total confirmed on WhatsApp before you pay.",
  },
  {
    icon: Heart,
    title: "Thoughtful Design",
    desc: "Traditional and trendy designs chosen for AP & Telangana styles.",
  },
  {
    icon: Shield,
    title: "Customer Care",
    desc: "WhatsApp support from order to delivery, and help if anything arrives damaged.",
  },
];

const visionPoints = [
  { title: "Designs", text: "suited to AP & Telangana festive and daily wear" },
  { title: "Clear pricing", text: "careful packing, and gift-ready presentation" },
  { title: "Honest support", text: "on WhatsApp from order to delivery feedback" },
];

const orderSteps = [
  {
    icon: ShoppingBag,
    title: "Browse & add to cart",
    text: "Pick jewellery from the shop. Check photos, price, and stock on each product page.",
  },
  {
    icon: MessageCircle,
    title: "Checkout on WhatsApp",
    text: "Place your order on the website — WhatsApp opens with your bill and order details.",
  },
  {
    icon: CheckCircle2,
    title: "We confirm availability",
    text: "We reply on WhatsApp (usually the same day) to confirm stock, the delivery charge for your address, and your total.",
  },
  {
    icon: PackageCheck,
    title: "Pay & we ship",
    text: "Pay via UPI or bank transfer and share the payment screenshot. Once we verify it, your order is confirmed and we dispatch it.",
  },
];

const deliveryInfo = [
  { icon: MapPin, title: "Service area", text: DELIVERY_NOTICE },
  { icon: IndianRupee, title: "Delivery charges", text: DELIVERY_CHARGES_NOTICE },
  {
    icon: Clock,
    title: "Timeline",
    text: `We dispatch within ${DISPATCH_TIMELINE}; delivery is ${DELIVERY_TIMELINE}. We share tracking on WhatsApp when the courier provides it.`,
  },
  {
    icon: Gift,
    title: "Packaging",
    text: "Orders are packed carefully and gift-ready — ready to open and share special moments.",
  },
];

const infoNav = [
  { href: "#values", label: "Our values" },
  { href: "#vision", label: "Vision" },
  { href: "#orders", label: "How to order" },
  { href: "#delivery", label: "Delivery" },
];

function SectionHeading({
  icon: Icon,
  label,
  title,
  intro,
  center = false,
}: {
  icon: typeof Eye;
  label: string;
  title: string;
  intro?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <div className={cn("mb-3 flex items-center gap-2", center && "justify-center")}>
        <Icon className="h-4 w-4 text-gold-dark" />
        <p className="text-[11px] font-semibold tracking-[0.22em] text-gold-dark uppercase">
          {label}
        </p>
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight text-dark sm:text-3xl">{title}</h2>
      {intro && (
        <p className="mt-3 text-sm leading-relaxed text-dark/65 sm:text-base">{intro}</p>
      )}
    </div>
  );
}

function IconBadge({ icon: Icon }: { icon: typeof Eye }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/12 ring-1 ring-gold/30 sm:h-11 sm:w-11">
      <Icon className="h-[18px] w-[18px] text-gold-dark sm:h-5 sm:w-5" />
    </span>
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

        {/* Hero */}
        <section className={cn(HERO_PANEL, "mb-8 sm:mb-10")}>
          <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gold/15 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#7b3fe4]/20 blur-[90px]" />

          <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:p-12">
            <ScrollReveal>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-gold uppercase sm:text-xs">
                Our Story
              </p>
              <h1 className="mt-3 text-3xl leading-tight font-bold text-light sm:text-4xl lg:text-[2.75rem]">
                Jewellery made to be worn, gifted &amp; remembered
              </h1>
              <p className="mt-3 text-sm font-semibold tracking-wide text-gold italic sm:text-base">
                Wear your virtue. Shine with grace.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-light/75 sm:text-base">
                <strong className="text-light">Virtue Gems</strong>{" "}
                brings you handpicked fashion jewellery — necklaces, earrings and bracelets for
                festive moments, everyday elegance, and gifting across Andhra Pradesh &amp; Telangana.
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {highlights.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-light/85 sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    <Icon className="h-3.5 w-3.5 text-gold" />
                    {label}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-dark shadow-lg shadow-gold/20 transition hover:-translate-y-0.5 hover:bg-gold-light"
                >
                  Shop collections
                </Link>
                <a
                  href={whatsAppContactUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/40 px-7 text-sm font-semibold text-gold transition hover:bg-gold/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="grid h-[300px] grid-cols-[1.15fr_1fr] gap-3 sm:h-[420px] sm:gap-4">
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-gold/25">
                  <Image
                    src="/products/upload-mrxf30uz-ea0z3.jpg"
                    alt="Antique bridal temple necklace set on a display bust"
                    fill
                    sizes="(max-width: 1024px) 55vw, 320px"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="grid grid-rows-2 gap-3 sm:gap-4">
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-gold/25">
                    <Image
                      src="/about/styled-choker.jpg"
                      alt="Ruby floral choker set styled with a silk saree"
                      fill
                      sizes="(max-width: 1024px) 45vw, 260px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-gold/25">
                    <Image
                      src="/about/gold-necklace-set.jpg"
                      alt="Gold necklace set with matching earrings"
                      fill
                      sizes="(max-width: 1024px) 45vw, 260px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <nav
          aria-label="About page sections"
          className="mb-12 flex flex-wrap justify-center gap-2 sm:mb-14"
        >
          {infoNav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-gold/30 bg-white px-4 py-2 text-sm font-semibold text-gold-dark shadow-sm transition hover:border-gold hover:bg-gold/10"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Values */}
        <section id="values" className="scroll-mt-24">
          <ScrollReveal>
            <SectionHeading
              icon={Sparkles}
              label="What we stand for"
              title="Our values"
              center
            />
          </ScrollReveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.05} className="h-full">
                <div
                  className={cn(
                    CARD_SURFACE,
                    "h-full p-4 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-gold/30 sm:p-6",
                  )}
                >
                  <IconBadge icon={v.icon} />
                  <h3 className="mt-3 text-sm font-bold text-dark sm:mt-4 sm:text-base">{v.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-dark/65 sm:mt-1.5 sm:text-sm">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section id="vision" className="scroll-mt-24 mt-16 sm:mt-20">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <ScrollReveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-gold/20 shadow-lg shadow-[#1a0a2e]/10">
                <Image
                  src="/hero-velvet-bust.jpg"
                  alt="Virtue Gems necklace, jhumkas and bangle on a velvet display"
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.06}>
              <SectionHeading
                icon={Eye}
                label="Vision"
                title="Jewellery that feels personal"
                intro="Our vision is to make beautiful, gift-ready jewellery easy to discover and order — without complicated website payments. We sell through a WhatsApp-first experience so you can ask questions, confirm sizing, and feel confident before you pay."
              />
              <ul className="mt-6 space-y-3">
                {visionPoints.map((point) => (
                  <li key={point.title} className="flex items-start gap-3 text-sm text-dark/70 sm:text-base">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
                    <span>
                      <strong className="text-dark">{point.title}</strong> {point.text}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        {/* Orders */}
        <section id="orders" className="scroll-mt-24 mt-16 sm:mt-20">
          <ScrollReveal>
            <SectionHeading
              icon={ShoppingBag}
              label="Orders"
              title="How ordering works"
              intro="No card payment on the website yet. Your order is saved on Virtue Gems, then confirmed and paid on WhatsApp."
              center
            />
          </ScrollReveal>

          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orderSteps.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.05} className="h-full">
                <li className={cn(CARD_SURFACE, "relative h-full p-5 pt-7 sm:p-6 sm:pt-7")}>
                  <span className="absolute -top-3 left-6 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#1a0a2e] px-2 text-xs font-bold text-gold ring-2 ring-light">
                    Step {i + 1}
                  </span>
                  <IconBadge icon={item.icon} />
                  <h3 className="mt-4 text-base font-bold text-dark">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-dark/65">{item.text}</p>
                </li>
              </ScrollReveal>
            ))}
          </ol>

          <ScrollReveal delay={0.08}>
            <div className="mt-6 grid gap-5 rounded-2xl bg-[#25D366]/[0.07] p-6 ring-1 ring-[#25D366]/25 sm:p-7 md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex gap-4">
                <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 sm:flex">
                  <CreditCard className="h-5 w-5 text-[#128C7E]" />
                </span>
                <div>
                  <p className="font-bold text-dark">Payment after confirmation</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-dark/70">{CHECKOUT_PAYMENT_NOTICE}</p>
                  <p className="mt-1.5 text-sm text-dark/65">{PAYMENT_METHODS_SUMMARY}</p>
                  <p className="mt-1 text-sm text-dark/55">{COD_POLICY}</p>
                </div>
              </div>
              <a
                href={whatsAppContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe5a]"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </section>

        {/* Delivery */}
        <section id="delivery" className="scroll-mt-24 mt-16 sm:mt-20">
          <ScrollReveal>
            <SectionHeading
              icon={Truck}
              label="Delivery"
              title={`Shipping across ${DELIVERY_REGION_LABEL}`}
              center
            />
          </ScrollReveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {deliveryInfo.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.05} className="h-full">
                <div className={cn(CARD_SURFACE, "flex h-full gap-4 p-5 sm:p-6")}>
                  <IconBadge icon={item.icon} />
                  <div className="min-w-0">
                    <h3 className="font-bold text-dark">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-dark/65">{item.text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <ScrollReveal>
          <div className={cn(HERO_PANEL, "mt-16 px-6 py-12 text-center sm:mt-20 sm:px-10 sm:py-14")}>
            <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gold/15 blur-[80px]" />
            <p className="relative text-[11px] font-semibold tracking-[0.22em] text-gold uppercase sm:text-xs">
              Ready to shine
            </p>
            <h2 className="relative mt-3 text-[clamp(1.75rem,5vw,2.75rem)] leading-[1.1] font-black tracking-[-0.02em] text-light">
              Explore the collection
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm leading-relaxed text-light/70 sm:text-base">
              Necklaces, earrings and bracelets — handpicked, gift-ready, and delivered across{" "}
              {DELIVERY_REGION_LABEL}.
            </p>
            <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/shop"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gold px-8 text-sm font-semibold text-dark shadow-lg shadow-gold/25 transition hover:-translate-y-0.5 hover:bg-gold-light sm:w-auto"
              >
                Shop collections
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-gold/40 px-8 text-sm font-semibold text-gold transition hover:bg-gold/10 sm:w-auto"
              >
                Contact us
              </Link>
            </div>
            <p className="relative mt-6 text-xs text-light/50">
              Need returns or delivery info? See our{" "}
              <Link href="/refunds" className="font-semibold text-gold hover:underline">
                Refund &amp; Return Policy
              </Link>{" "}
              and{" "}
              <Link href="/shipping" className="font-semibold text-gold hover:underline">
                Shipping &amp; Delivery Policy
              </Link>
              .
            </p>
          </div>
        </ScrollReveal>
      </div>
      <SectionDivider />
    </div>
  );
}
