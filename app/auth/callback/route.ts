import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/supabase/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const baseUrl = getURL();
  const code = requestUrl.searchParams.get("code");

  console.log("🔄 Auth callback hit:", {
    code: code ? "present" : "missing",
    baseUrl,
  });

  if (code) {
    const supabase = await createClient();
    console.log("🔐 Exchanging code for session...");

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("❌ Exchange error:", error);
      return NextResponse.redirect(
        `${baseUrl}?error=auth_failed&details=${error.message}`
      );
    }

    console.log("✅ Session created successfully");
    const redirectUrl = baseUrl.endsWith("/")
      ? `${baseUrl}journal`
      : `${baseUrl}/journal`;
    return NextResponse.redirect(redirectUrl);
  }

  console.warn("⚠️ No code provided in callback");
  return NextResponse.redirect(`${baseUrl}?error=no_code`);
}
