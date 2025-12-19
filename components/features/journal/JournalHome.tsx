"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Image as ImageIcon, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface JournalEntry {
  id: string;
  content: string;
  createdAt: Date;
}

interface JournalHomeProps {
  entries: JournalEntry[];
}

export function JournalHome({ entries }: JournalHomeProps) {
  // Format date: "Saturday, 20 December"
  const today = new Date();
  const dateString = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Dynamic greeting based on time of day
  const hour = today.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17) greeting = "Good evening";

  return (
    <div className="min-h-screen pb-20 relative">
      <header className="pt-8 pb-6 px-1 space-y-1">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {dateString}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground/90 font-outfit">
          {greeting}, User.
        </h1>
      </header>

      {/* Stats or Quick Prompt (Optional, adds visual interest) */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-secondary/50 to-secondary/10 border border-white/5 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-2">Daily Prompt</h3>
        <p className="text-muted-foreground leading-relaxed">
          What is one small thing that made you smile today?
        </p>
      </div>

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
          {/* TODO: Use real entry cards here */}
          <div className="p-6 rounded-3xl bg-secondary/20 border border-white/5 hover:bg-secondary/30 transition-colors cursor-pointer group">
            <p className="text-muted-foreground text-sm mb-3">10:30 AM</p>
            <p className="line-clamp-3 text-lg leading-relaxed text-foreground/90 group-hover:text-foreground transition-colors">
              Sample entry content would go here. Just verifying the grid layout
              looks good without being "boring".
            </p>
          </div>
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
