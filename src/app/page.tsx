import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroLanding } from "@/components/home/HeroLanding";
import { ProductCard } from "@/components/ui/ProductCard";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { CustomerReviews } from "@/components/ui/CustomerReviews";
import { InstagramFeed } from "@/components/ui/InstagramFeed";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { getAllProducts } from "@/lib/products";

export default function HomePage() {
  const products = getAllProducts();
  const featured = products.filter((p) => p.tags.includes("bestseller")).slice(0, 4);
  const newArrivals = products.filter((p) => p.tags.includes("new")).slice(0, 4);

  return (
    <>
      <HeroLanding />

      {/* Sale countdown */}
      <section id="collections" className="bg-dark-soft py-10 sm:py-14">
        <ScrollReveal className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-sm tracking-[0.2em] text-gold uppercase">
            Limited Time Offer
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-light sm:text-3xl">
            Festive Collection Sale
          </h2>
          <p className="mt-2 text-sm text-light/60">Up to 15% off selected pieces</p>
          <div className="mt-6">
            <CountdownTimer />
          </div>
        </ScrollReveal>
      </section>

      {/* Best sellers */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm tracking-[0.2em] text-gold uppercase">Curated</p>
              <h2 className="mt-1 text-2xl font-semibold text-dark sm:text-3xl">
                Best Sellers
              </h2>
            </div>
            <Link href="/shop?tag=bestseller" className="text-sm font-medium text-gold hover:underline">
              View all
            </Link>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 0.08}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="glass-dark mx-4 rounded-3xl px-6 py-12 text-center sm:mx-auto sm:max-w-4xl sm:px-12">
          <ScrollReveal>
            <h2 className="text-2xl font-semibold text-light sm:text-3xl">
              Crafted with <span className="text-gold">Passion</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-light/70 sm:text-base">
              Every piece at Virtue Gems is hallmarked, ethically sourced, and
              designed to become a cherished heirloom.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-medium text-gold underline-offset-4 hover:underline"
            >
              Learn about our craftsmanship
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* New arrivals */}
      <section className="bg-light py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-8 text-center">
            <p className="text-sm tracking-[0.2em] text-gold uppercase">Just In</p>
            <h2 className="mt-1 text-2xl font-semibold text-dark sm:text-3xl">
              New Arrivals
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {newArrivals.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 0.08}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/shop?tag=new" className="text-sm font-medium text-gold hover:underline">
              View all new arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 sm:py-16">
        <ScrollReveal className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-sm tracking-[0.2em] text-gold uppercase">Testimonials</p>
          <h2 className="mt-1 mb-8 text-2xl font-semibold text-dark sm:text-3xl">
            Loved by Our Customers
          </h2>
          <CustomerReviews />
        </ScrollReveal>
      </section>

      <RecentlyViewed />

      {/* Instagram */}
      <section className="bg-light py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <InstagramFeed />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
