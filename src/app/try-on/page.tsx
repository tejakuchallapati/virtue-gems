import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionDivider } from "@/components/ui/PageSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { TryOnSection } from "@/components/try-on/TryOnSection";
import { VIRTUAL_TRY_ON_ENABLED } from "@/lib/features";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { PAGE_GRADIENT_SHELL } from "@/lib/ui-classes";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Virtual Try-On Jewellery Online",
  description:
    "Try Virtue Gems rings, earrings and necklaces on your photo before you buy. Free virtual try-on with WhatsApp ordering.",
  path: "/try-on",
  keywords: [
    "virtual try on jewellery",
    "try jewellery online",
    "AR jewellery try on India",
  ],
});

type Props = {
  searchParams: Promise<{ product?: string }>;
};

export default async function TryOnPage({ searchParams }: Props) {
  if (!VIRTUAL_TRY_ON_ENABLED) redirect("/shop");

  const { product: slug } = await searchParams;
  const products = getAllProducts();
  const selected = slug ? getProductBySlug(slug) : products[0];

  return (
    <div className={PAGE_GRADIENT_SHELL}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: "Virtual Try-On" },
        ]}
      />
      <section className="bg-gradient-to-br from-[#1a0a2e] via-[#2d1450] to-[#1a0a2e] px-4 py-8 pb-24 sm:px-6 md:pb-8 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="[&_a]:text-light/60 [&_a:hover]:text-gold [&_span]:text-light/80">
            <Breadcrumb
              className="mb-0 text-light/55"
              items={[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "Virtual Try-On" },
              ]}
            />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-light sm:text-3xl">
            Virtual Try-On
          </h1>
          <p className="mt-2 text-sm text-light/65">
            Upload your photo, place the jewellery, and see if it suits you before
            ordering on WhatsApp.
          </p>
        </div>
      </section>

      <div className={cn("mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8")}>
        <div className="mb-6">
          <label htmlFor="try-on-product" className="mb-2 block text-sm font-medium text-dark">
            Choose a piece to try
          </label>
          <div className="flex flex-wrap gap-2">
            {products.slice(0, 12).map((p) => (
              <Link
                key={p.id}
                href={`/try-on?product=${p.slug}`}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                  selected?.id === p.id
                    ? "bg-dark text-gold"
                    : "bg-white text-dark/70 ring-1 ring-light-muted hover:ring-gold/40"
                }`}
              >
                {p.name}
              </Link>
            ))}
            <Link
              href="/shop"
              className="rounded-full px-3 py-1.5 text-xs font-medium text-gold-dark underline sm:text-sm"
            >
              View all →
            </Link>
          </div>
        </div>

        {selected ? (
          <TryOnSection product={selected} />
        ) : (
          <p className="text-center text-dark/50">Select a product from the shop to try on.</p>
        )}
      </div>
      <SectionDivider />
    </div>
  );
}
