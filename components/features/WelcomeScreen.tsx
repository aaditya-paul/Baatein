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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background text-foreground relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center space-y-12 max-w-2xl relative z-10"
      >
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-primary drop-shadow-sm"
          >
            Baatein.
          </motion.h1>

          <div className="space-y-4">
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-lg mx-auto italic">
              "A quiet place to put your thoughts down, where you are heard
              without judgment."
            </p>
            <p className="text-base md:text-lg text-muted-foreground/80 font-nunito leading-relaxed max-w-xl mx-auto">
              Designed for moments of loneliness, stress, or quiet reflection.
              Focusing on <strong>emotional safety</strong>,{" "}
              <strong>privacy</strong>, and{" "}
              <strong>gentle self-understanding</strong>.
            </p>
          </div>

          {/* Feature highlights pitch */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-white/5">
            <div className="space-y-2">
              <span className="text-3xl">🔒</span>
              <h3 className="font-semibold text-foreground/90 font-outfit">
                Client-Side Privacy
              </h3>
              <p className="text-xs text-muted-foreground">
                Your data is yours. Encrypted before it ever leaves your device.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-3xl">🤍</span>
              <h3 className="font-semibold text-foreground/90 font-outfit">
                Safe Reflection
              </h3>
              <p className="text-xs text-muted-foreground">
                No metrics, no pressure. Just a warm space for your experiences.
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-3xl">🕊️</span>
              <h3 className="font-semibold text-foreground/90 font-outfit">
                Gentle AI
              </h3>
              <p className="text-xs text-muted-foreground">
                Responses that listen and reflect, without trying to "fix" you.
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="pt-4"
        >
          <Button
            size="lg"
            onClick={handleStart}
            disabled={loading}
            className="text-lg px-12 py-7 rounded-full shadow-2xl hover:shadow-primary/30 transition-all duration-500 bg-primary text-primary-foreground hover:scale-105"
          >
            {loading ? "Connecting..." : "Enter the Quiet Space"}
          </Button>
        </motion.div>
      </motion.div>

      {/* Legal footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-0 right-0 text-center z-10"
      >
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/60 font-nunito">
          <Link
            href="/privacy-policy"
            className="hover:text-foreground transition-all duration-300 underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          <span className="opacity-20">|</span>
          <Link
            href="/terms"
            className="hover:text-foreground transition-all duration-300 underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>
        </div>
      </motion.div>

      {/* Ambient refined background background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>
    </div>
  );
}
