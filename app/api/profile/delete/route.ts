import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect("/");
  }

  // Soft delete: Update the is_deleted flag
  await supabase
    .from("profiles")
    .update({ is_deleted: true })
    .eq("id", user.id);

  // Sign out the user
  await supabase.auth.signOut();

  redirect("/");
}
