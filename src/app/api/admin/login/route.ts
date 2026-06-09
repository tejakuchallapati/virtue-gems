import { NextResponse } from "next/server";
import { OTP_COOKIE, SESSION_COOKIE } from "@/lib/otp";

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(OTP_COOKIE);
  return response;
}
