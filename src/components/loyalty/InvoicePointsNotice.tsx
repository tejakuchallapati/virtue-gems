"use client";

import { useSearchParams } from "next/navigation";
import { PointsEarnedBanner } from "@/components/loyalty/PointsEarnedBanner";

export function InvoicePointsNotice({
  customerName,
  customerPhone,
}: {
  customerName: string;
  customerPhone: string;
}) {
  const searchParams = useSearchParams();
  const earned = Number(searchParams.get("earned") ?? 0);
  const balance = Number(searchParams.get("balance") ?? 0);

  if (!earned || !balance) return null;

  return (
    <PointsEarnedBanner
      customerName={customerName}
      customerPhone={customerPhone}
      pointsEarned={earned}
      pointsBalance={balance}
    />
  );
}
