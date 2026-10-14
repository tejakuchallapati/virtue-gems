import Link from "next/link";
import { cn } from "@/lib/utils";
import { DAMAGE_CLAIM_DAYS } from "@/lib/policies";

type UnboxingVideoNoticeProps = {
  className?: string;
  compact?: boolean;
};

export function UnboxingVideoNotice({ className, compact = false }: UnboxingVideoNoticeProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gold/30 bg-gold/10 text-dark",
        compact ? "p-3 text-xs" : "p-4 text-sm",
        className,
      )}
    >
      <p className="font-semibold text-dark">
        Record a video while opening your parcel
      </p>
      <p className={cn("text-dark/75", compact ? "mt-1 leading-relaxed" : "mt-2 leading-relaxed")}>
        If your order arrives damaged, report it within {DAMAGE_CLAIM_DAYS} days of delivery. An
        unboxing video is the quickest way for us to approve your claim — photos and other evidence
        are also accepted.
      </p>
      <Link
        href="/refunds"
        className={cn(
          "inline-block font-medium text-gold-dark underline",
          compact ? "mt-1 text-[11px]" : "mt-2 text-xs",
        )}
      >
        Read the Refund &amp; Return Policy
      </Link>
    </div>
  );
}
