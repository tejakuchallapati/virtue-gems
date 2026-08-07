import Link from "next/link";
import { MessageCircle, Package, ShoppingBag, Star } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PageSection, SectionHeader } from "@/components/ui/PageSection";

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Shop",
    text: "Pick jewellery you love",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    text: "Checkout opens your bill on WhatsApp",
  },
  {
    icon: Package,
    title: "Pay & ship",
    text: "Confirm → pay UPI → we deliver free in AP & TG",
  },
  {
    icon: Star,
    title: "Feedback",
    text: "After delivery, share a short review",
  },
] as const;

export function OrderJourney() {
  return (
    <PageSection tone="cream" dividerBottom>
      <ScrollReveal>
        <SectionHeader
          eyebrow="Simple"
          title="From browse to feedback"
          description="Clear steps for every order — no card payment on the website."
          align="center"
        />
      </ScrollReveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <ScrollReveal key={step.title} delay={i * 0.06}>
              <div className="flex h-full flex-col items-center rounded-2xl bg-white/80 px-4 py-5 text-center ring-1 ring-gold/15">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wider text-gold-dark">
                  {i + 1}. {step.title}
                </p>
                <p className="mt-1.5 text-sm text-dark/70">{step.text}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-gold/40 bg-white/70 px-6 text-sm font-medium text-gold-dark transition hover:bg-gold hover:text-dark"
        >
          Start shopping
        </Link>
      </div>
    </PageSection>
  );
}
