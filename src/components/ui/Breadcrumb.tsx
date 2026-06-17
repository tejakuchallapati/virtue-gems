import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

export function Breadcrumb({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-6 flex flex-wrap items-center gap-1 text-sm text-dark/60",
        className,
      )}
    >
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />}
          {item.href ? (
            <Link href={item.href} className="transition hover:text-gold">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium opacity-90">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
