import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-dark/60">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
          {item.href ? (
            <Link href={item.href} className="transition hover:text-gold">
              {item.label}
            </Link>
          ) : (
            <span className="text-dark">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
