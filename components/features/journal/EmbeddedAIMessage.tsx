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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="my-4 p-3 sm:p-4 rounded-xl bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm"
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic wrap-break-word">
            {message}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          {chatModeAvailable && onContinueChat && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onContinueChat}
              className="h-7 px-2 text-xs rounded-full hover:bg-purple-500/20"
              title={chatLabel}
            >
              <MessageSquare className="h-3 w-3 sm:mr-1" />
              <span className="hidden sm:inline">{chatLabel}</span>
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="h-7 w-7 p-0 rounded-full hover:bg-red-500/20"
            title={removeLabel}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
