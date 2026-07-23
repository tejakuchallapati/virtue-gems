import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionDivider } from "@/components/ui/PageSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { FAQ_ITEMS } from "@/data/faq";
import { DARK_PANEL, PAGE_CONTENT_SHELL, PAGE_GRADIENT_SHELL } from "@/lib/ui-classes";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { whatsAppContactUrl } from "@/lib/whatsapp";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ — Orders, Delivery, Rewards & Returns",
  description:
    "Answers about Virtue Gems WhatsApp orders, AP & Telangana delivery, loyalty rewards, unboxing video returns, and virtual try-on.",
  path: "/faq",
  keywords: ["Virtue Gems FAQ", "jewellery delivery Hyderabad", "jewellery return policy"],
});

function FaqJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function FaqPage() {
  return (
    <div className={PAGE_GRADIENT_SHELL}>
      <FaqJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "FAQ" },
        ]}
      />
      <div className={cn(PAGE_CONTENT_SHELL, "max-w-3xl")}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
        <h1 className="mt-2 text-2xl font-semibold text-dark sm:text-3xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-sm text-dark/60 sm:text-base">
          Quick answers about orders, delivery across AP & Telangana, rewards, and
          returns. Still need help?{" "}
          <Link href="/contact" className="font-medium text-gold-dark underline">
            Contact us
          </Link>
          .
        </p>

        <div className="mt-8">
          <FaqAccordion />
        </div>

        <div className={`mt-10 p-6 text-center text-light sm:p-8 ${DARK_PANEL}`}>
          <p className="text-lg font-semibold">Didn&apos;t find your answer?</p>
          <p className="mt-2 text-sm text-light/65">
            Our team replies on WhatsApp within 2–4 hours.
          </p>
          <a
            href={whatsAppContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1fb855]"
          >
            <MessageCircle className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <SectionDivider />
    </div>
  );
}
