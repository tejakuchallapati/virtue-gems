import type { Metadata } from "next";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { ProductJsonLd } from "@/components/product/ProductJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { absoluteAssetUrl, buildPageMetadata } from "@/lib/seo";
import { getAllProducts, getProductBySlug, getSimilarProducts } from "@/lib/products";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found", robots: { index: false } };

  const categoryLabel = product.category.replace(/-/g, " ");
  const description = `${product.description} Buy ${product.name} online at Virtue Gems — ${categoryLabel} jewellery with WhatsApp checkout and delivery in Hyderabad, AP & Telangana.`;

  return {
    ...buildPageMetadata({
      title: `${product.name} | ${categoryLabel} jewellery`,
      description,
      path: `/product/${product.slug}`,
      keywords: [
        product.name,
        categoryLabel,
        `${categoryLabel} online India`,
        `buy ${categoryLabel} Hyderabad`,
        ...product.tags,
      ],
      image: product.images[0],
    }),
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/product/${product.slug}`,
      images: [
        {
          url: absoluteAssetUrl(product.images[0]),
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const similar = getSimilarProducts(product);
  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.name },
        ]}
      />
      <ProductDetailClient product={product} similar={similar} />
    </>
  );
}
