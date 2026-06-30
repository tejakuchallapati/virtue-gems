import { Breadcrumb } from "./Breadcrumb";
import { SectionDivider } from "./PageSection";
import { CARD_SURFACE } from "@/lib/ui-classes";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="page-mobile-safe min-h-screen bg-gradient-to-b from-[#faf6ee] via-light to-white">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
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
