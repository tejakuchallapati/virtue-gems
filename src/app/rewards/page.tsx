import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionDivider } from "@/components/ui/PageSection";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { RewardsClient } from "@/components/loyalty/RewardsClient";
import { LOYALTY_ENABLED } from "@/lib/features";
import { PAGE_GRADIENT_SHELL } from "@/lib/ui-classes";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Rewards & Loyalty Points",
  description:
    "Earn Virtue Gems loyalty points on every WhatsApp order. Redeem for 15%–50% off, free rings, or free earrings.",
  path: "/rewards",
  keywords: ["jewellery loyalty points", "jewellery rewards India", "Virtue Gems rewards"],
});

export default function RewardsPage() {
  if (!LOYALTY_ENABLED) redirect("/shop");

  return (
    <div className={PAGE_GRADIENT_SHELL}>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Rewards" },
        ]}
      />
      <div className={cn("mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10")}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Rewards" }]} />
        <h1 className="mb-2 text-2xl font-semibold text-dark sm:text-3xl">
          Virtue Gems Rewards
        </h1>
        <p className="mb-8 text-dark/60">
          Shop, earn points, and unlock exclusive rewards like 50% off or free jewellery.
        </p>
        <RewardsClient />
      </div>
      <SectionDivider />
    </div>
  );
}
