import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0a0f1a] text-light">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-4 pt-16 lg:p-8 lg:pt-8">
        {children}
      </div>
    </div>
  );
}
