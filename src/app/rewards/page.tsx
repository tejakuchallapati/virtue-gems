import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionDivider } from "@/components/ui/PageSection";
import { RewardsClient } from "@/components/loyalty/RewardsClient";
import { PAGE_GRADIENT_SHELL } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rewards & Points",
  description: "Earn Virtue Gems loyalty points on every purchase and redeem for discounts and free jewellery.",
};

export default function RewardsPage() {
  return (
    <div className={PAGE_GRADIENT_SHELL}>
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
