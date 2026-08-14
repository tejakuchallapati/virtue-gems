import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { AdminTeam } from "@/components/admin/AdminTeam";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { listAdminProfiles } from "@/lib/supabase/store";

export default async function AdminTeamPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  if (admin.role !== "owner") redirect("/admin");

  const admins = isSupabaseAdminConfigured()
    ? await listAdminProfiles()
    : [admin];

  return <AdminTeam initialAdmins={admins} />;
}
