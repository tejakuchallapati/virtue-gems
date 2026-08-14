import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/otp";
import type { AdminProfile } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function isAdminAuthenticated(): Promise<boolean> {
  return Boolean(await getCurrentAdmin());
}

export async function getCurrentAdmin(): Promise<AdminProfile | null> {
  if (isSupabaseConfigured()) {
    try {
      const { createSupabaseServerClient } = await import(
        "@/lib/supabase/server"
      );
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("admin_profiles")
        .select("id,email,display_name,role,active")
        .eq("id", user.id)
        .eq("active", true)
        .maybeSingle();
      if (error || !data) return null;
      return {
        id: data.id,
        email: data.email,
        displayName: data.display_name ?? undefined,
        role: data.role,
        active: data.active,
      };
    } catch {
      return null;
    }
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!verifySessionToken(session?.value)) return null;
  return {
    id: "legacy-owner",
    email: process.env.ADMIN_EMAIL ?? "virtuegems777@gmail.com",
    displayName: "Owner",
    role: "owner",
    active: true,
  };
}

export { SESSION_COOKIE as COOKIE_NAME };
