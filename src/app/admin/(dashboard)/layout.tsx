import { AdminTopNav } from "@/components/admin/AdminTopNav";
import { ADMIN_SHELL_BG } from "@/lib/ui-classes";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen ${ADMIN_SHELL_BG} text-light`}>
      <AdminTopNav />
      <main className="mx-auto max-w-7xl p-4 lg:p-8">{children}</main>
    </div>
  );
}
