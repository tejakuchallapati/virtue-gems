import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { FAQ_ITEMS } from "@/data/faq";
import { whatsAppContactUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Virtue Gems orders, delivery, rewards, returns, and virtual try-on.",
  openGraph: {
    title: "FAQ | Virtue Gems",
    description: "Answers to common questions about shopping at Virtue Gems.",
  },
};

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
    <div className="page-mobile-safe min-h-screen bg-gradient-to-b from-[#faf6ee] via-light to-white">
      <FaqJsonLd />
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
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

        <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#1a0a2e] to-[#2d1450] p-6 text-center text-light sm:p-8">
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
    </div>
  );
}
