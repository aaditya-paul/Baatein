import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  console.log("🔄 Auth callback hit:", {
    code: code ? "present" : "missing",
    origin,
  });

  if (code) {
    const supabase = await createClient();
    console.log("🔐 Exchanging code for session...");

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("❌ Exchange error:", error);
      return NextResponse.redirect(
        `${origin}/?error=auth_failed&details=${error.message}`
      );
    }

    console.log("✅ Session created successfully");
    return NextResponse.redirect(`${origin}/journal`);
  }

  console.warn("⚠️ No code provided in callback");
  return NextResponse.redirect(`${origin}/?error=no_code`);
}
