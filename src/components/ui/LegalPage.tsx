import { Breadcrumb } from "./Breadcrumb";
import { SectionDivider } from "./PageSection";
import { PAGE_CONTENT_SHELL, PAGE_GRADIENT_SHELL } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export function LegalHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-9 mb-3 border-b border-gold/30 pb-2 text-lg font-extrabold tracking-tight text-dark sm:text-xl"
      style={{ fontWeight: 800 }}
    >
      {children}
    </h2>
  );
}

export function LegalPoints({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="my-3 list-none space-y-2.5 p-0">
      {items.map((item, i) => (
        <li
          key={i}
          className="border-l-[3px] border-[#d4af37] bg-white/70 py-2.5 pr-3 pl-3.5 text-sm font-medium leading-relaxed text-dark/80"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={PAGE_GRADIENT_SHELL}>
      <div className={cn(PAGE_CONTENT_SHELL, "max-w-3xl")}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title }]} />
        <header className="mb-8 border-b border-gold/20 pb-6 sm:mb-10">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-gold-dark uppercase">
            Virtue Gems
          </p>
          <h1
            className="mt-2 text-[clamp(1.75rem,4vw,2.35rem)] font-extrabold tracking-tight text-dark"
            style={{ fontWeight: 800 }}
          >
            {title}
          </h1>
        </header>
        <div className="max-w-none space-y-4 text-[15px] leading-[1.65] font-medium text-dark/70 [&_strong]:font-bold [&_strong]:text-dark">
          {children}
        </div>
      </div>
      <SectionDivider />
    </div>
  );
}
