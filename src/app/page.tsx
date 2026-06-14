import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroLanding } from "@/components/home/HeroLanding";
import { TrendingHighlight } from "@/components/home/TrendingHighlight";
import { ProductCard } from "@/components/ui/ProductCard";
import { CustomerReviews } from "@/components/ui/CustomerReviews";
import { InstagramFeed } from "@/components/ui/InstagramFeed";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { LoyaltyPromo } from "@/components/home/LoyaltyPromo";
import { getAllProducts } from "@/lib/products";

export default function HomePage() {
  const products = getAllProducts();
  const featured = products.filter((p) => p.tags.includes("bestseller")).slice(0, 4);
  const newArrivals = products.filter((p) => p.tags.includes("new")).slice(0, 4);
  const trending = products.find((p) => p.tags.includes("trending"));
  const bestseller = products.find((p) => p.tags.includes("bestseller"));

  return (
    <>
      <HeroLanding />

      <TrendingHighlight trending={trending} bestseller={bestseller} />

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

      <LoyaltyPromo />

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
