import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, LogOut, Trash2 } from "lucide-react";

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
    <div className="h-full flex flex-col relative overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex-none pt-6 pb-4 px-1 flex items-center justify-between">
        <Link href="/journal">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-secondary/50"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold font-outfit">Profile</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {/* Profile Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-8">
        {/* Profile Card */}
        <div className="bg-secondary/20 border border-white/5 rounded-3xl p-8 mb-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-24 h-24 rounded-full border-2 border-white/10 shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-white/5 bg-secondary/30 flex items-center justify-center text-4xl font-bold text-muted-foreground">
                {userName[0]}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold font-outfit">{userName}</h2>
              <p className="text-muted-foreground text-sm">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <form action="/api/auth/signout" method="POST">
            <Button
              type="submit"
              variant="outline"
              className="w-full rounded-full py-6 text-base font-medium justify-start gap-3"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </form>

          <form action="/api/profile/delete" method="POST">
            <Button
              type="submit"
              variant="destructive"
              className="w-full rounded-full py-6 text-base font-medium justify-start gap-3 opacity-80 hover:opacity-100"
            >
              <Trash2 className="h-5 w-5" />
              Delete Account
            </Button>
          </form>
        </div>

        {/* Warning */}
        <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl">
          <p className="text-sm text-destructive-foreground">
            <strong>Warning:</strong> Deleting your account will mark it as
            deleted and sign you out. Your data will remain encrypted in the
            database but you will not be able to access it.
          </p>
        </div>
      </main>
    </div>
  );
}
