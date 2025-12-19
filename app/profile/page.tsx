import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/features/ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const userImage = user.user_metadata?.avatar_url;
  const userEmail = user.email;

  return (
    <ProfileClient
      userName={userName}
      userImage={userImage}
      userEmail={userEmail}
    />
  );
}
