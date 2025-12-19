"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface PinSetupProps {
  onComplete: (pin: string) => Promise<void>;
}

export function PinSetup({ onComplete }: PinSetupProps) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 characters");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onComplete(pin);
    } catch (err: any) {
      setError(err.message || "Failed to set up encryption");
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
          <h2 className="text-2xl font-bold font-outfit">Set Your Data PIN</h2>
          <p className="text-muted-foreground text-sm">
            This PIN encrypts your journal.{" "}
            <strong>If you lose it, your data cannot be recovered.</strong>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Enter PIN</label>
            <Input
              type="password"
              placeholder="At least 4 characters"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="text-center text-lg tracking-widest"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Confirm PIN
            </label>
            <Input
              type="password"
              placeholder="Re-enter your PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="text-center text-lg tracking-widest"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || !pin || !confirmPin}
            className="w-full rounded-full py-6 text-base font-semibold"
          >
            {loading ? "Setting up..." : "Continue"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
