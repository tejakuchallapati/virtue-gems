import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PageSection, SectionDivider, SectionHeader } from "@/components/ui/PageSection";
import { HeroLanding } from "@/components/home/HeroLanding";
import { TrendingHighlight } from "@/components/home/TrendingHighlight";
import { ProductCard } from "@/components/ui/ProductCard";
import { CustomerReviews } from "@/components/ui/CustomerReviews";
import { InstagramFeed } from "@/components/ui/InstagramFeed";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { LoyaltyPromo } from "@/components/home/LoyaltyPromo";
import { WebsiteJsonLd } from "@/components/seo/WebsiteJsonLd";
import { PRODUCT_GRID } from "@/lib/ui-classes";
import { buildPageMetadata, DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} | Premium Handcrafted Jewellery Hyderabad`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  keywords: [
    "best jewellery shop Hyderabad",
    "online jewellery AP Telangana",
    "festive jewellery online India",
  ],
});

export default function HomePage() {
  const products = getAllProducts();
  const featured = products.filter((p) => p.tags.includes("bestseller")).slice(0, 4);
  const newArrivals = products.filter((p) => p.tags.includes("new")).slice(0, 4);
  const trending = products.find((p) => p.tags.includes("trending"));
  const bestseller = products.find((p) => p.tags.includes("bestseller"));

  return (
    <>
      <WebsiteJsonLd />
      <HeroLanding />

      <TrendingHighlight trending={trending} bestseller={bestseller} />

      <SectionDivider />
      <LoyaltyPromo />
      <SectionDivider />

      <PageSection tone="white">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Curated"
            title="Best Sellers"
            description="Our most-loved pieces — handcrafted and gift-ready."
            action={
              <Link href="/shop?tag=bestseller" className="text-sm font-medium text-gold hover:underline">
                View all
              </Link>
            }
          />
        </ScrollReveal>
        <div className={PRODUCT_GRID}>
          {featured.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.08}>
              <ProductCard product={p} />
            </ScrollReveal>
          ))}
        </div>
      </PageSection>

      <PageSection tone="cream" dividerTop dividerBottom>
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
      </PageSection>

      <PageSection tone="white" dividerTop>
        <ScrollReveal>
          <SectionHeader
            eyebrow="Testimonials"
            title="Loved by Our Customers"
            align="center"
            className="mb-4"
          />
          <CustomerReviews />
        </ScrollReveal>
      </PageSection>

      <RecentlyViewed />

      <PageSection tone="cream" dividerTop>
        <ScrollReveal>
          <InstagramFeed />
        </ScrollReveal>
      </PageSection>
    </>
  );
}
