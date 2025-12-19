"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, LogOut, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getRandomMicrocopy } from "@/lib/microcopies";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
  userName: string;
  userImage?: string;
  userEmail?: string;
}

export function ProfileClient({
  userName,
  userImage,
  userEmail,
}: ProfileClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      toast.success(
        "Signed out successfully. Hope to see you back in the quiet space soon."
      );
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(getRandomMicrocopy("error"));
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This will mark your data as inaccessible."
      )
    )
      return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/profile/delete", { method: "POST" });
      if (response.ok) {
        toast.success(getRandomMicrocopy("deleting"));
        router.push("/");
        router.refresh();
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      toast.error(getRandomMicrocopy("error"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col relative overflow-hidden max-w-2xl mx-auto"
    >
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
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-secondary/20 border border-white/5 rounded-3xl p-8 mb-6"
        >
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
        </motion.div>

        {/* Account Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            variant="outline"
            className="w-full rounded-full py-6 text-base font-medium justify-start gap-3 border-white/10 hover:bg-white/5"
          >
            <LogOut className="h-5 w-5" />
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </Button>

          <Button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            variant="destructive"
            className="w-full rounded-full py-6 text-base font-medium justify-start gap-3 opacity-80 hover:opacity-100"
          >
            <Trash2 className="h-5 w-5" />
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 p-6 bg-destructive/5 border border-destructive/10 rounded-3xl"
        >
          <p className="text-sm text-destructive/80 font-nunito leading-relaxed">
            <strong className="text-destructive">Gently Reminder:</strong>{" "}
            Deleting your account will mark it as deleted and sign you out. Your
            thoughts will remain encrypted in the quiet of the database, but you
            will no longer have the key to visit them.
          </p>
        </motion.div>
      </main>
    </motion.div>
  );
}
