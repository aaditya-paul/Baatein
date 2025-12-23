"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface PinEntryProps {
  onUnlock: (pin: string) => Promise<void>;
}

export function PinEntry({ onUnlock }: PinEntryProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!pin) {
      setError("Please enter your PIN");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onUnlock(pin);
    } catch (err: any) {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-secondary/20 border border-white/10 rounded-3xl p-8 max-w-md w-full space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-outfit">Welcome Back</h2>
          <p className="text-muted-foreground text-sm">
            Enter your PIN to unlock your journal
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="text-center text-lg tracking-widest"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || !pin || pin.length !== 4}
            className="w-full rounded-full py-6 text-base font-semibold"
          >
            {loading ? "Unlocking..." : "Unlock"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
