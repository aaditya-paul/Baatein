"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MICROCOPIES } from "@/lib/microcopies";

interface Message {
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

interface AIChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  entryContext: string;
  onSendMessage: (message: string) => Promise<string>;
}

export function AIChatSidebar({
  isOpen,
  onClose,
  entryContext,
  onSendMessage,
}: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatLabel] = useState(() => {
    const labels = MICROCOPIES.aiModes.chat;
    return labels[Math.floor(Math.random() * labels.length)];
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await onSendMessage(input);
      const aiMessage: Message = {
        role: "ai",
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 lg:w-md bg-background border-l border-white/10 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                <h2 className="font-semibold text-sm sm:text-base">
                  {chatLabel}
                </h2>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-xs sm:text-sm mt-8">
                  <p>Let&apos;s talk about what you&apos;ve written.</p>
                  <p className="mt-2 text-xs opacity-70">
                    I have context of your entry to help reflect.
                  </p>
                  {entryContext && (
                    <p className="text-xs text-muted-foreground/40 mt-3 italic max-w-xs mx-auto">
                      &quot;{entryContext.slice(0, 100)}
                      {entryContext.length > 100 ? "..." : ""}&quot;
                    </p>
                  )}
                </div>
              )}

              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 sm:px-4 sm:py-2 ${
                      msg.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-secondary/50 text-foreground border border-white/10"
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed wrap-break-word">
                      {msg.content}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary/50 rounded-2xl px-4 py-2 border border-white/10">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your thoughts..."
                  className="flex-1 bg-secondary/50 border-white/10 rounded-full text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="rounded-full bg-purple-500 hover:bg-purple-600 h-9 w-9 sm:h-10 sm:w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
