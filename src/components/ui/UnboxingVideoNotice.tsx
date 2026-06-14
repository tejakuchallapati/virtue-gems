import Link from "next/link";
import { cn } from "@/lib/utils";

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
        Returns and refunds are accepted only with a continuous unboxing video recorded while
        opening the package. Without video proof, no return or refund will be processed — even for
        damaged items.
      </p>
      {!compact && (
        <Link href="/refunds" className="mt-2 inline-block text-xs font-medium text-gold-dark underline">
          Read full refund policy
        </Link>
      )}
    </div>
  );
}
