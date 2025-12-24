"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Calendar, Trash2, LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEncryption } from "@/components/features/EncryptionProvider";
import { decryptContent } from "@/lib/crypto";
import { getRandomMicrocopy } from "@/lib/microcopies";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { AnimatePresence } from "framer-motion";
import { loadPreferences, updatePreference } from "@/lib/supabase/preferences";
import Image from "next/image";

// Exported type for use in page.tsx
export interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  created_at: string; // Supabase returns string
  is_deleted?: boolean;
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
  const [viewMode, setViewMode] = useState<"grid" | "list" | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(entries.length > 0);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Load user preferences on mount
  useEffect(() => {
    const loadUserPreferences = async () => {
      const preferences = await loadPreferences();
      setViewMode(preferences.viewMode || "grid");
      setIsLoadingPreferences(false);
    };
    loadUserPreferences();
  }, []);

  // Save view mode preference when it changes
  const handleViewModeChange = async (mode: "grid" | "list") => {
    setViewMode(mode);
    await updatePreference("viewMode", mode);
  };

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
          entries
            .filter((e) => !e.is_deleted) // Filter out deleted entries immediately
            .map(async (entry) => {
              try {
                let decryptedTitle = null;
                if (entry.title) {
                  decryptedTitle = await decryptContent(entry.title, dek);
                }
                const decryptedContent = await decryptContent(
                  entry.content,
                  dek
                );
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
    e.preventDefault();
    e.stopPropagation();

    // Show a confirmation toast with action buttons
    toast("Are you sure you want to let go of this moment?", {
      duration: 10000,
      action: {
        label: "Yes, let go",
        onClick: async () => {
          // Perform the delete
          const deleteToastId = toast.loading(getRandomMicrocopy("loading"));

          try {
            const { error } = await supabase
              .from("entries")
              .update({ is_deleted: true })
              .eq("id", id);

            if (error) {
              console.error("Delete error:", JSON.stringify(error, null, 2));
              toast.error(getRandomMicrocopy("error"), { id: deleteToastId });
              return;
            }

            toast.success(getRandomMicrocopy("deleting"), {
              id: deleteToastId,
            });
            // Update local state to make it disappear instantly
            setDecryptedEntries((prev) => prev.filter((e) => e.id !== id));
            router.refresh();
          } catch (err: any) {
            console.error("Delete error:", JSON.stringify(err, null, 2));
            toast.error(getRandomMicrocopy("error"), { id: deleteToastId });
          }
        },
      },
      cancel: {
        label: "Keep it",
        onClick: () => {
          // Do nothing, just dismiss
        },
      },
    });
  };

  // Show loading screen while preferences are being loaded
  if (isLoadingPreferences) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Fixed Header Section */}
      <header className="flex-none pt-2 pb-4 sm:pb-6 px-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-muted-foreground text-xs sm:text-sm font-medium uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{dateString}</span>
            <span className="sm:hidden">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground/90 font-outfit">
            {greeting}, {userName}.
          </h1>
          <h1 className="text-base sm:text-lg md:text-xl font-normal tracking-tight text-foreground/40 font-outfit">
            {getRandomMicrocopy("welcome")}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex bg-secondary/20 p-1 rounded-full border border-white/5 mr-1 sm:mr-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-all ${
                viewMode === "grid"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleViewModeChange("grid")}
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-all ${
                viewMode === "list"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => handleViewModeChange("list")}
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
          <Link href="/profile" className="flex-none">
            {userImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Image
                  src={userImage}
                  alt={userName}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/10 shadow-lg object-cover hover:border-primary/30 transition-colors cursor-pointer"
                />
              </motion.div>
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/5 bg-secondary/30 flex items-center justify-center text-sm sm:text-base text-muted-foreground font-bold hover:border-primary/30 transition-colors cursor-pointer">
                {userName[0]}
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-20 sm:pb-24 px-1 custom-scrollbar">
        {isDecrypting ? (
          <LoadingScreen />
        ) : (
          <>
            {/* Stats or Quick Prompt */}
            {decryptedEntries.length > 0 && (
              <div className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-linear-to-br from-secondary/50 to-secondary/10 border border-white/5 backdrop-blur-sm">
                <h3 className="text-base sm:text-lg font-semibold mb-2 font-outfit text-foreground/80">
                  Daily Prompt
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-nunito italic">
                  "{getRandomMicrocopy("prompts")}"
                </p>
              </div>
            )}

            {decryptedEntries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4 sm:space-y-6 text-center px-4"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-secondary/30 flex items-center justify-center mb-2 sm:mb-4">
                  <span className="text-3xl sm:text-4xl">✍️</span>
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-lg sm:text-xl font-semibold font-outfit">
                    Your journal is empty
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-nunito">
                    Capture your thoughts, ideas, and memories. Your space, your
                    rules.
                  </p>
                </div>
                <Link href="/journal/new">
                  <Button className="rounded-full px-6 sm:px-8 h-11 sm:h-12 text-sm sm:text-base font-medium bg-foreground text-background hover:bg-foreground/90 transition-all">
                    Start Writing
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2"
                    : "flex flex-col gap-2 sm:gap-3"
                }
              >
                <AnimatePresence mode="popLayout">
                  {decryptedEntries.map((entry, index) => (
                    <Link href={`/journal/${entry.id}`} key={entry.id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          duration: 0.3,
                          delay: viewMode === "grid" ? index * 0.05 : 0,
                        }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`${
                          viewMode === "grid"
                            ? "p-4 sm:p-6 rounded-2xl sm:rounded-3xl"
                            : "p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4"
                        } bg-secondary/20 border border-white/5 hover:bg-secondary/30 transition-all cursor-pointer group relative`}
                      >
                        {viewMode === "grid" ? (
                          <>
                            <div className="flex justify-between items-start mb-2 sm:mb-3">
                              <p className="text-muted-foreground text-[10px] sm:text-xs font-medium uppercase tracking-wider font-nunito">
                                {new Date(entry.created_at).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 sm:group-hover:opacity-100 transition-opacity -mt-1 sm:-mt-2 -mr-1 sm:-mr-2"
                                onClick={(e) => handleDelete(e, entry.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </div>

                            {entry.title && (
                              <h3 className="text-lg sm:text-xl font-bold mb-2 font-outfit text-foreground/90 group-hover:text-foreground">
                                {entry.title}
                              </h3>
                            )}

                            <p className="line-clamp-3 sm:line-clamp-4 text-sm sm:text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors font-nunito">
                              {stripHtml(entry.content)}
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-muted-foreground text-[9px] sm:text-[10px] font-medium uppercase tracking-tighter font-nunito flex-none">
                                  {new Date(
                                    entry.created_at
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                {entry.title && (
                                  <h3 className="text-sm sm:text-base font-bold font-outfit text-foreground/90 truncate">
                                    {entry.title}
                                  </h3>
                                )}
                              </div>
                              <p className="line-clamp-1 text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors font-nunito">
                                {stripHtml(entry.content)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 sm:group-hover:opacity-100 transition-opacity flex-none"
                              onClick={(e) => handleDelete(e, entry.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                          </>
                        )}
                      </motion.div>
                    </Link>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href="/journal/new">
          <Button
            size="icon"
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl shadow-primary/20 bg-foreground text-background hover:bg-foreground/90"
          >
            <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
