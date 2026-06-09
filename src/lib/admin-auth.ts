import { cookies } from "next/headers";

const COOKIE_NAME = "vg-admin-session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "virtuegems2026";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === getAdminPassword();
}

export { COOKIE_NAME };
