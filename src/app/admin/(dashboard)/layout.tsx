import { AdminTopNav } from "@/components/admin/AdminTopNav";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-light">
      <AdminTopNav />
      <main className="mx-auto max-w-7xl p-4 lg:p-8">{children}</main>
    </div>
  );
}
