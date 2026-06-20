import { cookies } from "next/headers";
import {
  apiFail,
  apiOk,
  checkRateLimit,
  clientIp,
  parseJsonBody,
  requireString,
} from "@/lib/api-server";
import {
  createSessionToken,
  getAdminEmail,
  OTP_COOKIE,
  SESSION_COOKIE,
  verifyOtpPayload,
} from "@/lib/otp";

export async function POST(request: Request) {
  const limited = checkRateLimit(`otp-verify:${clientIp(request)}`, 10, 15 * 60_000);
  if (limited) return limited;

  try {
    const parsed = await parseJsonBody<Record<string, unknown>>(request);
    if ("error" in parsed) return parsed.error;

    const email = requireString(parsed.data.email, "email", 200);
    const otp = requireString(parsed.data.otp, "otp", 6);
    const adminEmail = getAdminEmail().toLowerCase();

    if (!email || email.toLowerCase() !== adminEmail) {
      return apiFail("Unauthorized email.", 403);
    }

    if (!otp || otp.length !== 6) {
      return apiFail("Enter a valid 6-digit OTP.", 400);
    }

    const cookieStore = await cookies();
    const challenge = cookieStore.get(OTP_COOKIE);

    if (!challenge?.value) {
      return apiFail("OTP expired. Please request a new code.", 400);
    }

    const valid = verifyOtpPayload(challenge.value, email, otp);
    if (!valid) {
      return apiFail("Invalid OTP. Please try again.", 401);
    }

    const sessionToken = createSessionToken(email);
    const response = apiOk({});
    response.cookies.delete(OTP_COOKIE);
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OTP verify error:", error);
    return apiFail("Verification failed.", 500);
  }
}
