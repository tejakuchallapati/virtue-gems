import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { ADMIN_SHELL_BG } from "@/lib/ui-classes";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen min-w-0 overflow-x-clip ${ADMIN_SHELL_BG} text-light`}>
      <a
        href="#admin-main"
        className="fixed left-3 top-3 z-[120] -translate-y-20 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-dark shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to dashboard
      </a>
      <AdminTopNav />
      <main
        id="admin-main"
        tabIndex={-1}
        className="mx-auto w-full min-w-0 max-w-7xl p-4 lg:p-8"
      >
        {children}
      </main>
    </div>
  );
}
