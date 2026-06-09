import type { Metadata } from "next";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Gem, Award, Heart, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Virtue Gems — premium handcrafted jewellery with hallmarked gold and ethical sourcing.",
};

const values = [
  { icon: Gem, title: "Craftsmanship", desc: "Every piece is handcrafted by master artisans with decades of expertise." },
  { icon: Award, title: "Hallmarked Quality", desc: "916 and 750 hallmarked gold with certified gemstones." },
  { icon: Heart, title: "Ethical Sourcing", desc: "Responsibly sourced materials with transparent supply chains." },
  { icon: Shield, title: "Lifetime Trust", desc: "Buy-back assurance and complimentary cleaning for life." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <div className="relative mb-12 overflow-hidden rounded-3xl bg-dark">
        <Image
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&q=80"
          alt="Jewellery craftsmanship"
          width={1200}
          height={500}
          className="h-48 w-full object-cover opacity-50 sm:h-72"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <ScrollReveal className="text-center">
            <h1 className="text-3xl font-bold text-light sm:text-4xl">Our Story</h1>
            <p className="mt-2 text-sm text-light/70 sm:text-base">
              Where tradition meets timeless elegance
            </p>
          </ScrollReveal>
        </div>
      </div>

      <ScrollReveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-dark/70 sm:text-lg">
            Founded with a passion for exquisite jewellery, <strong>Virtue Gems</strong> brings
            together centuries-old craftsmanship and contemporary design. Each piece in our
            collection is a celebration of beauty, quality, and the moments that matter most.
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <ScrollReveal key={v.title} delay={i * 0.1}>
              <div className="rounded-2xl bg-white p-6 text-center ring-1 ring-light-muted/60">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
                  <Icon className="h-6 w-6 text-gold-dark" />
                </div>
                <h3 className="mt-4 font-semibold text-dark">{v.title}</h3>
                <p className="mt-2 text-sm text-dark/60">{v.desc}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
