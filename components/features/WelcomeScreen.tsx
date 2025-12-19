"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export function WelcomeScreen() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleStart = async () => {
    setLoading(true);
    console.log("🔍 Checking authentication...");

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("Session:", session ? "Found" : "Not found");

    if (session) {
      // User is authenticated, redirect to journal
      console.log("✅ User authenticated, redirecting to /journal");
      router.push("/journal");
    } else {
      // User not authenticated, trigger Google OAuth
      console.log("🔐 Triggering Google OAuth...");
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        console.log("OAuth response:", { data, error });
        if (error) {
          console.error("❌ OAuth error:", error);
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Auth error:", error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background text-foreground relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center space-y-8 max-w-md relative z-10"
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-sans font-semibold tracking-tight text-primary drop-shadow-sm">
            Baatein.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
            A quiet place to put your thoughts down.
          </p>

          {/* Feature highlights */}
          <div className="text-sm text-muted-foreground space-y-2 mt-6 pt-6 border-t border-white/5">
            <p className="flex items-center justify-center gap-2">
              <span className="text-primary">🔒</span>
              <span>End-to-end encrypted</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-primary">✨</span>
              <span>Rich text editor</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-primary">🎨</span>
              <span>Beautiful & minimal design</span>
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Button
            size="lg"
            onClick={handleStart}
            disabled={loading}
            className="text-lg px-8 rounded-full shadow-lg hover:shadow-primary/20 transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Connecting..." : "Start writing"}
          </Button>
        </motion.div>
      </motion.div>

      {/* Legal footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-0 right-0 text-center z-10"
      >
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Link
            href="/privacy-policy"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </motion.div>

      {/* Ambient background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
