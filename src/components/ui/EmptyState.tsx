import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { EMPTY_STATE_SHELL, PAGE_GRADIENT_SHELL } from "@/lib/ui-classes";
import { SectionDivider } from "@/components/ui/PageSection";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className={PAGE_GRADIENT_SHELL}>
      <div className={EMPTY_STATE_SHELL}>
        <Icon className="mx-auto h-12 w-12 text-dark/20" />
        <h1 className="mt-4 text-xl font-semibold text-dark">{title}</h1>
        <p className="mt-2 text-sm text-dark/60">{description}</p>
        <Link
          href={actionHref}
          className="mt-6 inline-block rounded-xl bg-gold px-8 py-3 text-sm font-semibold text-dark transition hover:bg-gold-light"
        >
          {actionLabel}
        </Link>
      </div>
      <SectionDivider />
    </div>
  );
}
