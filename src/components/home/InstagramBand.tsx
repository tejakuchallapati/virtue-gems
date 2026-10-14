import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { InstagramFeed } from "@/components/ui/InstagramFeed";
import { PAGE_CONTAINER, SECTION_DIVIDER } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

/** Instagram feed — cream band closing the home page. */
export function InstagramBand() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#faf6ee] via-[#f3ead8] to-[#ebe0c8] py-10 sm:py-14 md:py-16">
      <div className={cn(SECTION_DIVIDER, "absolute inset-x-0 top-0 opacity-60")} aria-hidden />
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-gold/15 blur-[90px]" />
      <div className="pointer-events-none absolute -left-16 bottom-20 h-56 w-56 rounded-full bg-gold/10 blur-[80px]" />

      <div className={PAGE_CONTAINER}>
        <ScrollReveal>
          <InstagramFeed compact />
        </ScrollReveal>
      </div>

      <div className={cn(SECTION_DIVIDER, "absolute inset-x-0 bottom-0 opacity-60")} aria-hidden />
    </section>
  );
}
