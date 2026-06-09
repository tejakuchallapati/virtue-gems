import { NextResponse } from "next/server";
import { isEmailConfigured, sendNotificationEmail } from "@/lib/email";
import {
  createOtpPayload,
  generateOtp,
  getAdminEmail,
  OTP_COOKIE,
  OTP_TTL_MS,
} from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const adminEmail = getAdminEmail().toLowerCase();

    if (!email || email.toLowerCase() !== adminEmail) {
      return NextResponse.json(
        { error: "This email is not authorized for admin access." },
        { status: 403 },
      );
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 },
      );
    }

    const otp = generateOtp();
    const payload = createOtpPayload(email, otp);

    await sendNotificationEmail({
      subject: "[Virtue Gems Admin] Your login OTP",
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #8b6914;">Admin Login OTP</h2>
          <p>Your one-time password for Virtue Gems Admin:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #d4af37; text-align: center; padding: 16px; background: #f8f6f0; border-radius: 12px;">
            ${otp}
          </p>
          <p style="color: #888; font-size: 13px;">Valid for 10 minutes. Do not share this code.</p>
        </div>
      `,
      text: `Virtue Gems Admin OTP: ${otp}\nValid for 10 minutes.`,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(OTP_COOKIE, payload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: OTP_TTL_MS / 1000,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
