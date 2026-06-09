import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createSessionToken,
  getAdminEmail,
  OTP_COOKIE,
  SESSION_COOKIE,
  verifyOtpPayload,
} from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    const adminEmail = getAdminEmail().toLowerCase();

    if (!email || email.toLowerCase() !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized email." }, { status: 403 });
    }

    if (!otp || String(otp).length !== 6) {
      return NextResponse.json({ error: "Enter a valid 6-digit OTP." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const challenge = cookieStore.get(OTP_COOKIE);

    if (!challenge?.value) {
      return NextResponse.json(
        { error: "OTP expired. Please request a new code." },
        { status: 400 },
      );
    }

    const valid = verifyOtpPayload(challenge.value, email, String(otp));
    if (!valid) {
      return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 401 });
    }

    const sessionToken = createSessionToken(email);
    const response = NextResponse.json({ success: true });
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
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
