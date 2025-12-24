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
      initial={{ opacity: 0, scale: 0.98, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -5 }}
      transition={{ duration: 0.2 }}
      className="relative p-3 pr-9 rounded-xl bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 border border-emerald-400/20 backdrop-blur-sm"
    >
      {/* Cross button on top right corner */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 h-6 w-6 p-0 rounded-full hover:bg-red-500/20 text-muted-foreground/60 hover:text-red-500 z-10 transition-colors"
        title={removeLabel}
      >
        <X className="h-3 w-3" />
      </Button>

      <div className="pr-1">
        <div className="flex items-start gap-2">
          <span className="text-sm flex-none mt-0.5">✨</span>
          <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-100 leading-snug flex-1">
            {message}
          </p>
        </div>
        {chatModeAvailable && onContinueChat && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onContinueChat}
            className="mt-2 h-6 px-2 text-[10px] rounded-full hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-all"
            title={chatLabel}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            <span className="font-medium">{chatLabel}</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
