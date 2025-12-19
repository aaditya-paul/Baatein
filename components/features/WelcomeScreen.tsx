"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

import { getRandomMicrocopy } from "@/lib/microcopies";
import { toast } from "sonner";

export function WelcomeScreen() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleStart = async () => {
    setLoading(true);

    try {
      // Check if user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/journal");
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          toast.error(getRandomMicrocopy("error"));
          console.error("❌ OAuth error:", error);
          setLoading(false);
        }
      }
    } catch (error) {
      toast.error(getRandomMicrocopy("error"));
      console.error("❌ Auth error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background text-foreground relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center space-y-12 max-w-xl relative z-10"
      >
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-6xl md:text-8xl font-sans font-bold tracking-tighter text-primary drop-shadow-sm select-none"
          >
            Baatein.
          </motion.h1>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl text-foreground font-medium tracking-tight">
              Your thoughts, safely held.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground/80 font-nunito leading-relaxed max-w-md mx-auto">
              A private, judgment-free space designed for quiet reflection and
              gentle self-understanding.
            </p>
          </motion.div>

          {/* Minimal Feature Row */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-12 text-sm text-muted-foreground/60 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="flex items-center gap-2">
              <span className="text-primary/50">✦</span> E2E Encrypted
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary/50">✦</span> Safe Space
            </span>
            <span className="flex items-center gap-2">
              <span className="text-primary/50">✦</span> Gentle AI
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Button
            size="lg"
            onClick={handleStart}
            disabled={loading}
            className="text-lg px-12 py-7 rounded-full shadow-2xl transition-all duration-300 bg-primary text-primary-foreground hover:scale-105 active:scale-95"
          >
            {loading ? "Connecting..." : "Enter the Quiet Space"}
          </Button>
        </motion.div>
      </motion.div>

      {/* Legal footer - more subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-0 right-0 text-center z-10"
      >
        <div className="flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-muted-foreground/30 font-nunito">
          <Link
            href="/privacy-policy"
            className="hover:text-muted-foreground transition-all duration-300"
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link
            href="/terms"
            className="hover:text-muted-foreground transition-all duration-300"
          >
            Terms of Service
          </Link>
        </div>
      </motion.div>

      {/* Re-designed ambient glow for a more minimal feel */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/2 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-secondary/3 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
