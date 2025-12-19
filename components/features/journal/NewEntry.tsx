"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic, Image as ImageIcon, Paperclip } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const PROMPTS = [
  "Write what's on your mind.",
  "You don't have to make sense here.",
  "Say it the way it comes out.",
  "What's been heavy lately?",
  "Capture the moment.",
];

export function NewEntry() {
  const [content, setContent] = useState("");
  const [placeholder] = useState(
    () => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
  );
  const router = useRouter();

  const handleSave = async () => {
    // TODO: Implement save logic
    console.log("Saving:", content);
    router.push("/journal");
  };

  const handleAttachMedia = () => {
    // TODO: Trigger file input
    console.log("Attach media clicked");
    // In a real app, you'd verify proper bucket config in Supabase
    console.log("Media upload placeholder triggered");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[calc(100vh-2rem)] max-w-3xl mx-auto"
    >
      <header className="flex items-center justify-between py-6">
        <Link href="/journal">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-secondary/50"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground mr-2 font-medium">
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </span>
          <Button
            onClick={handleSave}
            disabled={!content.trim()}
            className="rounded-full px-8 font-semibold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
          >
            Save
          </Button>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col">
        <textarea
          className="w-full h-full bg-transparent resize-none border-none outline-none text-xl md:text-2xl leading-relaxed placeholder:text-muted-foreground/40 font-nunito p-2"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />

        {/* Bottom Toolbar for Media */}
        <div className="sticky bottom-4 py-4 px-4 bg-background/80 backdrop-blur-md border border-white/5 rounded-full flex items-center justify-between mt-auto mb-4">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10"
              onClick={handleAttachMedia}
              title="Add Image"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10"
              title="Attach File"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10"
              title="Record Audio"
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground font-medium px-2">
            {content.length} chars
          </div>
        </div>
      </main>
    </motion.div>
  );
}
