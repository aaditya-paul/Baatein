"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { motion } from "framer-motion";

// Exported type for use in page.tsx
export interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  created_at: string; // Supabase returns string
}

interface JournalHomeProps {
  entries: JournalEntry[];
  userName?: string;
}

export function JournalHome({ entries, userName = "User" }: JournalHomeProps) {
  // Format date: "Saturday, 20 December"
  const today = new Date();
  const dateString = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Dynamic greeting based on time of day
  const hour = today.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17) greeting = "Good evening";

  // Helper to strip HTML tags for preview
  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return ""; // Server-side safety
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="h-full pb-20 relative">
      <header className="pt-2 pb-6 px-1 flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {dateString}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground/90 font-outfit">
            {greeting}, {userName}.
          </h1>
        </div>
      </header>

      {/* Stats or Quick Prompt */}
      {entries.length > 0 && (
        <div className="mb-8 p-6 rounded-3xl bg-linear-to-br from-secondary/50 to-secondary/10 border border-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-2">Daily Prompt</h3>
          <p className="text-muted-foreground leading-relaxed">
            What is one small thing that made you smile today?
          </p>
        </div>
      )}

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 space-y-6 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
            <span className="text-4xl">✍️</span>
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="text-xl font-semibold">Your journal is empty</h3>
            <p className="text-muted-foreground">
              Capture your thoughts, ideas, and memories. Your space, your
              rules.
            </p>
          </div>
          <Link href="/journal/new">
            <Button className="rounded-full px-8 h-12 text-base font-medium bg-foreground text-background hover:bg-foreground/90 transition-all">
              Start Writing
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-3xl bg-secondary/20 border border-white/5 hover:bg-secondary/30 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  {new Date(entry.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {entry.title && (
                <h3 className="text-xl font-bold mb-2 font-outfit text-foreground/90 group-hover:text-foreground">
                  {entry.title}
                </h3>
              )}

              <p className="line-clamp-4 text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors font-nunito">
                {stripHtml(entry.content)}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/journal/new">
          <Button
            size="icon"
            className="h-16 w-16 rounded-full shadow-2xl shadow-primary/20 bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="h-7 w-7" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
