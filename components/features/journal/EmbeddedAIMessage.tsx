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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative my-3 p-3 sm:p-4 pr-10 rounded-xl bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 border border-emerald-500/30 backdrop-blur-sm shadow-lg shadow-emerald-500/5"
    >
      {/* Cross button on top right corner */}
      <Button
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full hover:bg-red-500/20 z-10"
        title={removeLabel}
      >
        <X className="h-3 w-3" />
      </Button>

      <div className="pr-2">
        <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed italic wrap-break-word">
          ✨ {message}
        </p>
        {chatModeAvailable && onContinueChat && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onContinueChat}
            className="mt-2 h-7 px-2 text-xs rounded-full hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
            title={chatLabel}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            <span>{chatLabel}</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
