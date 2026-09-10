import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/otp";
import type { AdminProfile } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { canManageCatalogRole } from "@/lib/admin-roles";

export {
  CATALOG_ROLES,
  BACKUP_ROLES,
  adminRoleLabel,
  canManageCatalogRole,
} from "@/lib/admin-roles";

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

/** Catalog Admin / Owner — product CRUD, bulk upload, inventory. */
export function canManageCatalog(admin: AdminProfile | null | undefined) {
  return canManageCatalogRole(admin?.role);
}

/** Manager (staff) — orders & customers; no catalog edits. */
export function isManagerRole(admin: AdminProfile | null | undefined) {
  return admin?.role === "staff";
}

export async function requireAdmin(): Promise<AdminProfile | null> {
  return getCurrentAdmin();
}

export async function requireCatalogAdmin(): Promise<AdminProfile | null> {
  const admin = await getCurrentAdmin();
  return canManageCatalog(admin) ? admin : null;
}

export async function requireOwner(): Promise<AdminProfile | null> {
  const admin = await getCurrentAdmin();
  return admin?.role === "owner" ? admin : null;
}

export { SESSION_COOKIE as COOKIE_NAME };
