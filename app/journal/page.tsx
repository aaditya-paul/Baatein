import { JournalHome } from "@/components/features/journal";
import { createClient } from "@/lib/supabase/server";

export default async function JournalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  const userName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "User";

  const userImage = user?.user_metadata?.avatar_url;

  return (
    <JournalHome
      entries={entries || []}
      userName={userName}
      userImage={userImage}
    />
  );
}
