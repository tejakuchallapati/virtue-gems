import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/otp";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return verifySessionToken(session?.value);
}

export { SESSION_COOKIE as COOKIE_NAME };
