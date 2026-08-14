import { NextResponse } from "next/server";
import { OTP_COOKIE, SESSION_COOKIE } from "@/lib/otp";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function DELETE() {
  if (isSupabaseConfigured()) {
    const { createSupabaseServerClient } = await import(
      "@/lib/supabase/server"
    );
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(OTP_COOKIE);
  return response;
}
