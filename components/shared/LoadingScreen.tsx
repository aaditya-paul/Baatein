"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getRandomMicrocopy } from "@/lib/microcopies";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const [displayMessage, setDisplayMessage] = useState(message || "");

  useEffect(() => {
    if (!message) {
      setDisplayMessage(getRandomMicrocopy("loading"));
    }
  }, [message]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl">
      <div className="relative flex items-center justify-center">
        {/* Breathing Circle */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-32 w-32 rounded-full bg-primary/20 blur-2xl"
        />

        {/* Core Pulsing Dot */}
        <motion.div
          animate={{
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute h-4 w-4 rounded-full bg-primary shadow-[0_0_20px_rgba(var(--primary),0.5)]"
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 text-lg font-nunito text-muted-foreground/80 tracking-wide"
      >
        {displayMessage}
      </motion.p>
    </div>
  );
}
