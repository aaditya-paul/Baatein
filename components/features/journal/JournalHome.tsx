"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEncryption } from "@/components/features/EncryptionProvider";
import { decryptContent } from "@/lib/crypto";

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
  userImage?: string;
}

export function JournalHome({
  entries,
  userName = "User",
  userImage,
}: JournalHomeProps) {
  const { dek } = useEncryption();
  const [decryptedEntries, setDecryptedEntries] = useState<JournalEntry[]>([]);
  const [isDecrypting, setIsDecrypting] = useState(entries.length > 0);
  const router = useRouter();
  const supabase = createClient();

  // Decrypt entries when they change or dek becomes available
  useEffect(() => {
    const decryptAll = async () => {
      if (!dek || entries.length === 0) {
        setDecryptedEntries([]);
        setIsDecrypting(false);
        return;
      }

      setIsDecrypting(true);
      try {
        const results = await Promise.all(
          entries.map(async (entry) => {
            try {
              let decryptedTitle = null;
              if (entry.title) {
                decryptedTitle = await decryptContent(entry.title, dek);
              }
              const decryptedContent = await decryptContent(entry.content, dek);
              return {
                ...entry,
                title: decryptedTitle,
                content: decryptedContent,
              };
            } catch (err) {
              console.error(`Failed to decrypt entry ${entry.id}:`, err);
              return { ...entry, title: "🔒 Error decrypting", content: "" };
            }
          })
        );
        setDecryptedEntries(results);
      } catch (err) {
        console.error("Critical decryption error:", err);
      } finally {
        setIsDecrypting(false);
      }
    };

    decryptAll();
  }, [entries, dek]);

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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      // For soft delete as requested: just update the is_deleted flag
      const { error } = await supabase
        .from("entries")
        .update({ is_deleted: true })
        .eq("id", id);

      if (error) throw error;
      router.refresh();
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete entry");
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Fixed Header Section */}
      <header className="flex-none pt-2 pb-6 px-1 flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {dateString}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground/90 font-outfit">
            {greeting}, {userName}.
          </h1>
        </div>

        {/* User Profile Picture */}
        <Link href="/profile" className="flex-none">
          {userImage ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              src={userImage}
              alt={userName}
              className="w-12 h-12 rounded-full border-2 border-white/10 shadow-lg object-cover hover:border-primary/30 transition-colors cursor-pointer"
            />
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-white/5 bg-secondary/30 flex items-center justify-center text-muted-foreground font-bold hover:border-primary/30 transition-colors cursor-pointer">
              {userName[0]}
            </div>
          )}
        </Link>
      </header>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-24 px-1 custom-scrollbar">
        {isDecrypting ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground animate-pulse font-nunito">
              Decrypting your memories...
            </p>
          </div>
        ) : (
          <>
            {/* Stats or Quick Prompt */}
            {decryptedEntries.length > 0 && (
              <div className="mb-8 p-6 rounded-3xl bg-linear-to-br from-secondary/50 to-secondary/10 border border-white/5 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2 font-outfit">
                  Daily Prompt
                </h3>
                <p className="text-muted-foreground leading-relaxed font-nunito">
                  What is one small thing that made you smile today?
                </p>
              </div>
            )}

            {decryptedEntries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 space-y-6 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                  <span className="text-4xl">✍️</span>
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-xl font-semibold font-outfit">
                    Your journal is empty
                  </h3>
                  <p className="text-muted-foreground font-nunito">
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
                {decryptedEntries.map((entry) => (
                  <Link href={`/journal/${entry.id}`} key={entry.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-3xl bg-secondary/20 border border-white/5 hover:bg-secondary/30 transition-all cursor-pointer group flex flex-col h-full relative"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider font-nunito">
                          {new Date(entry.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        {/* Delete Button - Visible on Group Hover */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity -mt-2 -mr-2"
                          onClick={(e) => handleDelete(e, entry.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

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
