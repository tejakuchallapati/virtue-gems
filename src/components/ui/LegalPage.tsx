import { Breadcrumb } from "./Breadcrumb";
import { SectionDivider } from "./PageSection";
import { CARD_SURFACE, PAGE_CONTENT_SHELL, PAGE_GRADIENT_SHELL } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

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
        <h1 className="mb-6 text-2xl font-semibold text-dark sm:mb-8 sm:text-3xl">{title}</h1>
        <div className={`${CARD_SURFACE} p-6 sm:p-8`}>
          <div className="prose prose-sm max-w-none space-y-4 text-dark/70 sm:prose-base">
            {children}
          </div>
        </div>
      </div>
      <SectionDivider />
    </div>
  );
}
