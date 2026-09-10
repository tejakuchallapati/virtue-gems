import type { AdminRole } from "@/types";

/** Roles that can create/edit/delete catalog products and uploads. */
export const CATALOG_ROLES: AdminRole[] = ["owner", "admin"];

/** Roles that can download full JSON backups. */
export const BACKUP_ROLES: AdminRole[] = ["owner", "admin"];

export function hasAdminRole(
  role: AdminRole | null | undefined,
  allowed: AdminRole[],
): boolean {
  return Boolean(role && allowed.includes(role));
}

export function canManageCatalogRole(role: AdminRole | null | undefined) {
  return hasAdminRole(role, CATALOG_ROLES);
}

/** Friendly label for UI (staff → Manager). */
export function adminRoleLabel(role: AdminRole): string {
  if (role === "staff") return "Manager";
  if (role === "admin") return "Admin";
  return "Owner";
}
