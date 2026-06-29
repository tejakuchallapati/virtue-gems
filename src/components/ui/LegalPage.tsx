import { Breadcrumb } from "./Breadcrumb";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="page-mobile-safe mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: title }]} />
      <h1 className="mb-8 text-2xl font-semibold text-dark sm:text-3xl">{title}</h1>
      <div className="prose prose-sm max-w-none space-y-4 text-dark/70 sm:prose-base">
        {children}
      </div>
    </div>
  );
}
