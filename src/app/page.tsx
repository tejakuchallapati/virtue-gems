import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PageSection, SectionDivider, SectionHeader } from "@/components/ui/PageSection";
import { HeroLanding } from "@/components/home/HeroLanding";
import { TrendingHighlight } from "@/components/home/TrendingHighlight";
import { ProductCard } from "@/components/ui/ProductCard";
import { CustomerReviews } from "@/components/ui/CustomerReviews";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { LoyaltyPromo } from "@/components/home/LoyaltyPromo";
import { InstagramBand } from "@/components/home/InstagramBand";
import { WebsiteJsonLd } from "@/components/seo/WebsiteJsonLd";
import { PRODUCT_GRID } from "@/lib/ui-classes";
import { LOYALTY_ENABLED } from "@/lib/features";
import { buildPageMetadata, DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { getAllProductsSafe } from "@/lib/products-server";
import { listApprovedReviews } from "@/lib/reviews";
import type { ProductTag } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} | Premium Fashion Jewellery Hyderabad`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  keywords: [
    "best jewellery shop Hyderabad",
    "online jewellery AP Telangana",
    "festive jewellery online India",
    "necklaces earrings bracelets online",
  ],
});

export default async function HomePage() {
  const [products, approvedReviews] = await Promise.all([
    getAllProductsSafe(),
    listApprovedReviews(),
  ]);
  // Each home section takes the next unseen products so nothing repeats down the page
  const shown = new Set<string>();
  const pick = (tag: ProductTag, count: number) => {
    const picked = products.filter((p) => p.tags.includes(tag) && !shown.has(p.id)).slice(0, count);
    picked.forEach((p) => shown.add(p.id));
    return picked;
  };
  const trendingPicks = pick("trending", 2);
  if (trendingPicks.length < 2) trendingPicks.push(...pick("bestseller", 2 - trendingPicks.length));
  const featured = pick("bestseller", 4);
  const newArrivals = pick("new", 4);

  return (
    <>
      <WebsiteJsonLd />
      <HeroLanding />

      <TrendingHighlight picks={trendingPicks} />

      {LOYALTY_ENABLED && (
        <>
          <SectionDivider />
          <LoyaltyPromo />
          <SectionDivider />
        </>
      )}

      <PageSection id="bestsellers" tone="white">
        <ScrollReveal>
          <SectionHeader
            title="Best Sellers"
            description="Our most-loved pieces — gift-ready and festive."
            align="center"
            action={
              <Link href="/shop?tag=bestseller" className="text-sm font-medium text-gold hover:underline">
                View all
              </Link>
            }
          />
        </ScrollReveal>
        <div className={PRODUCT_GRID}>
          {featured.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.06}>
              <ProductCard product={p} />
            </ScrollReveal>
          ))}
        </div>
      </PageSection>

      <PageSection id="new-arrivals" tone="cream" dividerTop dividerBottom>
        <ScrollReveal>
          <SectionHeader
            eyebrow="Just In"
            title="New Arrivals"
            description="Fresh designs added to the collection."
            align="center"
          />
        </ScrollReveal>
        <div className={PRODUCT_GRID}>
          {newArrivals.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.06}>
              <ProductCard product={p} />
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link href="/shop?tag=new" className="text-sm font-medium text-gold hover:underline">
            View all new arrivals
          </Link>
        </div>
      </PageSection>

      {/* Recently viewed sits where testimonials used to be */}
      <RecentlyViewed />

      <PageSection id="reviews" tone="white" dividerTop>
        <ScrollReveal>
          {approvedReviews.length > 0 ? (
            <SectionHeader
              eyebrow="Testimonials"
              title="Loved by Our Customers"
              align="center"
              className="mb-4"
            />
          ) : (
            <SectionHeader
              eyebrow="Reviews"
              title="Bought from Virtue Gems?"
              description="Share a photo and a few words — it helps other shoppers choose."
              align="center"
              className="mb-4"
            />
          )}
          <CustomerReviews
            reviews={approvedReviews}
            products={products.map(({ id, name, slug }) => ({ id, name, slug }))}
          />
        </ScrollReveal>
      </PageSection>

      <InstagramBand />
    </>
  );
}
