import { requireOwner } from "@/lib/admin-auth";
import { apiFail, apiOk, parseJsonBody } from "@/lib/api-server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { listAdminProfiles } from "@/lib/supabase/store";
import type { AdminRole } from "@/types";

const ROLES: AdminRole[] = ["owner", "admin", "staff"];

export async function GET() {
  const owner = await requireOwner();
  if (!owner) return apiFail("Owner access required.", 403);
  if (!isSupabaseAdminConfigured()) {
    return apiFail("Connect Supabase to manage team accounts.", 503);
  }
  try {
    return apiOk({ admins: await listAdminProfiles() });
  } catch (error) {
    console.error("Team GET error:", error);
    return apiFail("Failed to load team.", 500);
  }
}

export async function POST(request: Request) {
  const owner = await requireOwner();
  if (!owner) return apiFail("Owner access required.", 403);
  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const email =
    typeof parsed.data.email === "string"
      ? parsed.data.email.trim().toLowerCase()
      : "";
  const password =
    typeof parsed.data.password === "string" ? parsed.data.password : "";
  const displayName =
    typeof parsed.data.displayName === "string"
      ? parsed.data.displayName.trim()
      : "";
  const role = parsed.data.role;
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8 ||
    typeof role !== "string" ||
    !ROLES.includes(role as AdminRole)
  ) {
    return apiFail(
      "Valid email, role and temporary password (8+ characters) are required.",
      400,
    );
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });
    if (error || !data.user) {
      return apiFail(error?.message || "Failed to create user.", 400);
    }
    const { error: profileError } = await supabase
      .from("admin_profiles")
      .insert({
        id: data.user.id,
        email,
        display_name: displayName || null,
        role,
        active: true,
      });
    if (profileError) {
      await supabase.auth.admin.deleteUser(data.user.id);
      throw profileError;
    }
    return apiOk({ created: true }, 201);
  } catch (error) {
    console.error("Team POST error:", error);
    return apiFail("Failed to create admin account.", 500);
  }
}

export async function PATCH(request: Request) {
  const owner = await requireOwner();
  if (!owner) return apiFail("Owner access required.", 403);
  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;
  const id = typeof parsed.data.id === "string" ? parsed.data.id : "";
  const role = parsed.data.role;
  const active = parsed.data.active;
  if (!id || id === owner.id) {
    return apiFail("You cannot change your own owner access here.", 400);
  }

  const patch: { role?: AdminRole; active?: boolean; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };
  if (typeof role === "string" && ROLES.includes(role as AdminRole)) {
    patch.role = role as AdminRole;
  }
  if (typeof active === "boolean") patch.active = active;
  if (patch.role === undefined && patch.active === undefined) {
    return apiFail("No valid team changes supplied.", 400);
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("admin_profiles")
      .update(patch)
      .eq("id", id);
    if (error) throw error;
    return apiOk({ updated: true });
  } catch (error) {
    console.error("Team PATCH error:", error);
    return apiFail("Failed to update admin account.", 500);
  }
}
