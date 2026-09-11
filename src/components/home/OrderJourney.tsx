import Link from "next/link";
import { MessageCircle, Package, ShoppingBag, Star } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { InstagramFeed } from "@/components/ui/InstagramFeed";
import { PAGE_CONTAINER, SECTION_DIVIDER } from "@/lib/ui-classes";
import { DELIVERY_SHORT } from "@/lib/delivery";
import { cn } from "@/lib/utils";

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
    text: `Confirm → pay UPI → we deliver across ${DELIVERY_SHORT}`,
  },
  {
    icon: Star,
    title: "Feedback",
    text: "After delivery, share a short review",
  },
] as const;

/** Order steps + Instagram — purple band, large cards matching trending size. */
export function OrderJourney() {
  return (
    <section className="relative overflow-hidden bg-[#1a0a2e] py-10 sm:py-14 md:py-16">
      <div className={cn(SECTION_DIVIDER, "absolute inset-x-0 top-0 opacity-60")} aria-hidden />
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-gold/10 blur-[90px]" />
      <div className="pointer-events-none absolute -left-16 bottom-20 h-56 w-56 rounded-full bg-gold/5 blur-[80px]" />

      <div className={PAGE_CONTAINER}>
        <ScrollReveal className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-gold uppercase sm:text-xs">
            Simple
          </p>
          <h2 className="mt-2 font-sans text-[clamp(1.5rem,4vw,2.25rem)] font-black tracking-[-0.03em] text-light">
            From browse to feedback
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-light/60 sm:text-base">
            Clear steps for every order — no card payment on the website.
          </p>
        </ScrollReveal>

        <div className="mt-8 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.title} delay={i * 0.05} className="h-full">
                <div className="flex h-full min-h-[11rem] flex-col items-center justify-center rounded-2xl bg-[#241536] px-5 py-7 text-center ring-1 ring-gold/25 transition hover:ring-gold/45 sm:min-h-[12rem] sm:px-6 sm:py-8">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">
                    {i + 1}. {step.title}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-light/70">{step.text}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-7 text-center">
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-gold/45 bg-gold/10 px-7 text-sm font-semibold text-gold transition hover:bg-gold hover:text-dark"
          >
            Start shopping
          </Link>
        </div>

        <div className="mt-12 border-t border-gold/20 pt-10 sm:mt-14 sm:pt-12">
          <ScrollReveal>
            <InstagramFeed compact onDark />
          </ScrollReveal>
        </div>
      </div>

      <div className={cn(SECTION_DIVIDER, "absolute inset-x-0 bottom-0 opacity-60")} aria-hidden />
    </section>
  );
}
