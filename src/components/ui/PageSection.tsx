import { cn } from "@/lib/utils";
import { PAGE_CONTAINER, SECTION_DIVIDER } from "@/lib/ui-classes";

type PageSectionProps = {
  children: React.ReactNode;
  id?: string;
  tone?: "white" | "cream" | "transparent";
  dividerTop?: boolean;
  dividerBottom?: boolean;
  className?: string;
  containerClassName?: string;
};

const toneClasses = {
  white: "bg-white",
  cream: "bg-light",
  transparent: "",
};

export function PageSection({
  children,
  id,
  tone = "transparent",
  dividerTop,
  dividerBottom,
  className,
  containerClassName,
}: PageSectionProps) {
  return (
    <section
      id={id}
      className={cn("relative py-12 sm:py-16", toneClasses[tone], className)}
    >
      {dividerTop && (
        <div className={cn(SECTION_DIVIDER, "absolute inset-x-0 top-0")} aria-hidden />
      )}
      <div className={cn(PAGE_CONTAINER, containerClassName)}>{children}</div>
      {dividerBottom && (
        <div className={cn(SECTION_DIVIDER, "absolute inset-x-0 bottom-0")} aria-hidden />
      )}
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-8",
        centered ? "text-center" : "flex flex-wrap items-end justify-between gap-4",
        className,
      )}
    >
      <div className={centered ? undefined : "min-w-0 flex-1"}>
        <p className="text-sm tracking-[0.2em] text-gold uppercase">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-semibold text-dark sm:text-3xl">{title}</h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-dark/60 sm:text-base">{description}</p>
        )}
      </div>
      {action && <div className={centered ? "mt-4" : "shrink-0"}>{action}</div>}
    </div>
  );
}
