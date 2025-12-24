"use client";

import { X, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MICROCOPIES } from "@/lib/microcopies";
import { useState } from "react";

interface EmbeddedAIMessageProps {
  message: string;
  onRemove: () => void;
  onContinueChat?: () => void;
  chatModeAvailable?: boolean;
}

export function EmbeddedAIMessage({
  message,
  onRemove,
  onContinueChat,
  chatModeAvailable,
}: EmbeddedAIMessageProps) {
  const [removeLabel] = useState(() => {
    const labels = MICROCOPIES.aiActions.removeMessage;
    return labels[Math.floor(Math.random() * labels.length)];
  });
  const [chatLabel] = useState(() => {
    const labels = MICROCOPIES.aiActions.continueChat;
    return labels[Math.floor(Math.random() * labels.length)];
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.4, type: "spring" }}
      className="relative my-4 p-4 sm:p-5 pr-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 border-2 border-emerald-400/20 backdrop-blur-sm shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-shadow"
    >
      {/* Magical glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/5 to-teal-400/5 blur-xl -z-10" />

      {/* Cross button on top right corner */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full hover:bg-red-500/20 text-muted-foreground hover:text-red-500 z-10 transition-colors"
        title={removeLabel}
      >
        <X className="h-3.5 w-3.5" />
      </Button>

      <div className="pr-2">
        <div className="flex items-start gap-2 mb-1">
          <span className="text-lg flex-none mt-0.5">✨</span>
          <p className="text-sm sm:text-base text-emerald-900 dark:text-emerald-50 leading-relaxed font-nunito flex-1">
            {message}
          </p>
        </div>
        {chatModeAvailable && onContinueChat && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onContinueChat}
            className="mt-3 h-8 px-3 text-xs rounded-full hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/20 transition-all hover:border-emerald-400/40"
            title={chatLabel}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            <span className="font-medium">{chatLabel}</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
