"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  ChevronDown,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExtension from "@tiptap/extension-image";
import { createClient } from "@/lib/supabase/client";
import { useEncryption } from "@/components/features/EncryptionProvider";
import { encryptContent, decryptContent } from "@/lib/crypto";
import { getRandomMicrocopy, MICROCOPIES } from "@/lib/microcopies";
import { loadPreferences, updatePreference } from "@/lib/supabase/preferences";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { EmbeddedAIMessage } from "./EmbeddedAIMessage";
import { AIChatSidebar } from "./AIChatSidebar";

const FONT_SIZES = [
  "prose-sm",
  "prose-base",
  "prose-lg",
  "prose-xl",
  "prose-2xl",
];

interface EditorProps {
  initialData?: {
    id: string;
    title: string | null;
    content: string;
  };
}

export function NewEntry({ initialData }: EditorProps) {
  const { dek } = useEncryption();
  const [title, setTitle] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(!!initialData);
  const [fontSizeIndex, setFontSizeIndex] = useState(2); // Default to prose-lg
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // AI Companion state
  const [aiEnabled, setAiEnabled] = useState(true); // Default enabled
  const [aiMode, setAiMode] = useState<"minimal" | "embedded" | "chat">(
    "minimal"
  );
  const [aiPresence, setAiPresence] = useState<string>("");
  const [aiSuggestion, setAiSuggestion] = useState<string>("");
  const [aiReflection, setAiReflection] = useState<string>("");
  const [showReflectionOffer, setShowReflectionOffer] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [lastWordCount, setLastWordCount] = useState(0);
  const [typingPaused, setTypingPaused] = useState(false);
  const [aiInteractions, setAiInteractions] = useState<
    Array<{ mode: string; response: string; timestamp: string }>
  >([]);
  const [embeddedMessages, setEmbeddedMessages] = useState<
    Array<{ id: string; message: string; timestamp: string }>
  >([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "ai"; content: string }>
  >([]);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  // const [modeLabels] = useState(() => ({
  //   minimal:
  //     MICROCOPIES.aiModes.minimal[
  //       Math.floor(Math.random() * MICROCOPIES.aiModes.minimal.length)
  //     ],
  //   embedded:
  //     MICROCOPIES.aiModes.embedded[
  //       Math.floor(Math.random() * MICROCOPIES.aiModes.embedded.length)
  //     ],
  //   chat: MICROCOPIES.aiModes.chat[
  //     Math.floor(Math.random() * MICROCOPIES.aiModes.chat.length)
  //   ],
  // }));
  const [modeLabels] = useState(() => ({
    minimal: "Minimal Response",
    embedded: "Embedded Response",
    chat: "Chat Mode",
  }));

  const modeConfig = {
    minimal: {
      label: "Minimal",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      borderColor: "border-blue-400/30",
      emoji: "💭",
    },
    embedded: {
      label: "Embedded",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      borderColor: "border-purple-400/30",
      emoji: "✨",
    },
    chat: {
      label: "Chat",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-400/30",
      emoji: "💬",
    },
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write what's on your mind...",
        emptyEditorClass:
          "is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground/40 before:float-left before:h-0 before:pointer-events-none",
      }),
      ImageExtension,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none max-w-none min-h-[300px]",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty);
      checkScroll();
      handleTypingActivity();
    },
  });

  // Check scroll position to show/hide the "Scroll to Bottom" button
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    // Show if there is content to scroll and we're not at the bottom (with some threshold)
    const isLongContent = scrollHeight > clientHeight + 50;
    const isNotAtBottom = scrollTop + clientHeight < scrollHeight - 100;

    setShowScrollBottom(isLongContent && isNotAtBottom);
  };

  // Load AI companion preference on mount
  useEffect(() => {
    const loadAIPreference = async () => {
      const prefs = await loadPreferences();
      setAiEnabled(prefs.aiCompanionEnabled ?? true);
      setAiMode(prefs.aiMode ?? "minimal");
      if (prefs.aiCompanionEnabled ?? true) {
        // Show presence signal when loading if enabled
        fetchAIResponse("presence");
      }
    };
    loadAIPreference();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      // Run once to initialize
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scrollToBottom = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Decrypt and load initialData
  useEffect(() => {
    const loadAndDecrypt = async () => {
      if (!initialData || !dek || !editor) return;

      try {
        setIsDecrypting(true);

        let decryptedTitle = "";
        if (initialData.title) {
          decryptedTitle = await decryptContent(initialData.title, dek);
        }

        const decryptedContent = await decryptContent(initialData.content, dek);

        setTitle(decryptedTitle);
        editor.commands.setContent(decryptedContent);
        setIsEditorEmpty(editor.isEmpty);

        // Load AI interactions if they exist
        if ((initialData as any).ai_interactions) {
          try {
            const encryptedInteractions = (initialData as any).ai_interactions;
            const decryptedInteractions = await decryptContent(
              encryptedInteractions,
              dek
            );
            setAiInteractions(JSON.parse(decryptedInteractions));
          } catch (err) {
            console.error("Failed to decrypt AI interactions:", err);
          }
        }

        // Brief delay to allow content to render before checking scroll
        setTimeout(checkScroll, 100);
      } catch (err) {
        console.error("Failed to decrypt entry:", err);
        toast.error(getRandomMicrocopy("error"));
      } finally {
        setIsDecrypting(false);
      }
    };

    loadAndDecrypt();
  }, [initialData, dek, editor]);

  const handleSave = async () => {
    if (!editor || isSaving || !dek) return;

    setIsSaving(true);
    const content = editor.getHTML();
    const plainText = editor.getText();

    if (!plainText.trim() && !title.trim()) {
      setIsSaving(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // ENCRYPT CONTENT BEFORE SAVING
        const encryptedTitle = await encryptContent(
          title.trim() || "Untitled",
          dek
        );
        const encryptedContent = await encryptContent(content, dek);

        // ENCRYPT AI INTERACTIONS
        let encryptedAiInteractions = null;
        if (aiInteractions.length > 0) {
          const aiData = JSON.stringify(aiInteractions);
          encryptedAiInteractions = await encryptContent(aiData, dek);
        }

        let error;

        if (initialData?.id) {
          const result = await supabase
            .from("entries")
            .update({
              title: encryptedTitle,
              content: encryptedContent,
              ai_interactions: encryptedAiInteractions,
              updated_at: new Date().toISOString(),
            })
            .eq("id", initialData.id);
          error = result.error;
        } else {
          const result = await supabase.from("entries").insert({
            user_id: user.id,
            title: encryptedTitle,
            content: encryptedContent,
            ai_interactions: encryptedAiInteractions,
          });
          error = result.error;
        }

        if (error) {
          console.error("Supabase Error:", JSON.stringify(error, null, 2));
          throw error;
        }

        toast.success(getRandomMicrocopy("saving"));
        router.push("/journal");
        router.refresh();
      } else {
        toast.error("You need to be logged in to save.");
      }
    } catch (error: any) {
      console.error("Error saving entry:", error);
      toast.error(getRandomMicrocopy("error"));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleList = () => editor?.chain().focus().toggleBulletList().run();

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const increaseFontSize = () => {
    setFontSizeIndex((prev) => Math.min(prev + 1, FONT_SIZES.length - 1));
    setTimeout(checkScroll, 0); // Check scroll after font change
  };

  const decreaseFontSize = () => {
    setFontSizeIndex((prev) => Math.max(prev - 1, 0));
    setTimeout(checkScroll, 0); // Check scroll after font change
  };

  // AI Companion Logic
  const analyzeEmotionalWeight = useCallback(
    (text: string): "light" | "moderate" | "heavy" => {
      const heavyWords = [
        "anxious",
        "scared",
        "depressed",
        "hopeless",
        "alone",
        "can't",
        "struggling",
        "overwhelmed",
        "heavy",
        "tired",
        "exhausted",
      ];
      const lowerText = text.toLowerCase();
      const heavyCount = heavyWords.filter((word) =>
        lowerText.includes(word)
      ).length;

      if (heavyCount >= 3) return "heavy";
      if (heavyCount >= 1) return "moderate";
      return "light";
    },
    []
  );

  const fetchAIResponse = useCallback(
    async (
      mode: "presence" | "acknowledgment" | "reflection",
      content?: string
    ) => {
      if (!aiEnabled || isAiLoading) return;

      console.log(
        `[AI Companion] Fetching ${mode} response with displayMode: ${aiMode}`
      );

      try {
        setIsAiLoading(true);
        const plainText = editor?.getText() || "";
        const wordCount = plainText.split(/\s+/).filter(Boolean).length;
        const emotionalWeight = analyzeEmotionalWeight(plainText);

        const requestBody = {
          mode,
          content: content || plainText,
          wordCount,
          emotionalWeight,
          displayMode: aiMode,
        };

        console.log("[AI Companion] Request body:", requestBody);

        const response = await fetch("/api/ai/companion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        console.log("[AI Companion] Response status:", response.status);

        if (mode === "presence") {
          const data = await response.json();
          console.log("[AI Companion] Presence response:", data.response);
          setAiPresence(data.response);
        } else if (mode === "acknowledgment") {
          const text = await response.text();
          console.log("[AI Companion] Acknowledgment response:", text);
          console.log("[AI Companion] Current aiMode:", aiMode);

          // Handle based on current AI mode
          if (aiMode === "embedded") {
            console.log("[AI Companion] Adding to embedded messages");
            // Add to embedded messages
            setEmbeddedMessages((prev) => {
              const newMessages = [
                ...prev,
                {
                  id: Date.now().toString(),
                  message: text,
                  timestamp: new Date().toISOString(),
                },
              ];
              console.log(
                "[AI Companion] Embedded messages updated:",
                newMessages
              );
              return newMessages;
            });
          } else {
            console.log("[AI Companion] Setting minimal mode suggestion");
            // Minimal mode: show modal
            setAiSuggestion(text);
          }

          // Store interaction
          setAiInteractions((prev) => [
            ...prev,
            { mode, response: text, timestamp: new Date().toISOString() },
          ]);
        } else if (mode === "reflection") {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let accumulatedText = "";

          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              accumulatedText += chunk;

              // Update based on current AI mode
              if (aiMode === "embedded") {
                // For embedded mode, insert inline (for streaming, we'll update in place)
                if (editor && accumulatedText) {
                  // Simple approach: just show in modal for reflection streaming
                  // Full inline streaming would require custom TipTap extension
                  setAiReflection(accumulatedText);
                }
              } else {
                // Minimal mode: show in modal
                setAiReflection(accumulatedText);
              }
            }
            // Store interaction when complete
            setAiInteractions((prev) => [
              ...prev,
              {
                mode,
                response: accumulatedText,
                timestamp: new Date().toISOString(),
              },
            ]);
          }
        }
      } catch (error) {
        console.error("AI companion error:", error);
      } finally {
        setIsAiLoading(false);
      }
    },
    [aiEnabled, editor, isAiLoading, analyzeEmotionalWeight, aiMode]
  );

  const handlePauseDetected = useCallback(() => {
    if (!editor || !aiEnabled) return;

    const plainText = editor.getText();
    const currentContent = plainText.trim();
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;

    console.log("[AI Companion] Pause detected. Word count:", wordCount);

    // Don't trigger if content hasn't changed or is too short
    if (currentContent === lastContentRef.current || wordCount < 20) {
      console.log("[AI Companion] Skipping - content unchanged or too short");
      return;
    }
    lastContentRef.current = currentContent;

    const emotionalWeight = analyzeEmotionalWeight(plainText);
    console.log("[AI Companion] Emotional weight:", emotionalWeight);

    // Show acknowledgment after pause (prioritize if heavy emotional weight)
    if (!aiSuggestion && !showReflectionOffer && !aiReflection) {
      console.log(
        "[AI Companion] Triggering acknowledgment with mode:",
        aiMode
      );
      // Trigger acknowledgment after any meaningful pause
      fetchAIResponse("acknowledgment");
    } else {
      console.log("[AI Companion] Skipping - already have AI content showing");
    }

    // Offer reflection if there's substantial content and multiple pauses
    if (
      wordCount > lastWordCount + 50 &&
      !showReflectionOffer &&
      !aiReflection
    ) {
      setShowReflectionOffer(true);
    }

    setLastWordCount(wordCount);
  }, [
    editor,
    aiEnabled,
    aiSuggestion,
    showReflectionOffer,
    aiReflection,
    lastWordCount,
    fetchAIResponse,
    analyzeEmotionalWeight,
    aiMode,
  ]);

  const handleTypingActivity = useCallback(() => {
    if (!aiEnabled || !editor) return;

    // Clear previous timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    setTypingPaused(false);

    // Set new pause detection timer (3 seconds)
    typingTimerRef.current = setTimeout(() => {
      setTypingPaused(true);
      handlePauseDetected();
    }, 3000);
  }, [aiEnabled, editor, handlePauseDetected]);

  const requestReflection = useCallback(() => {
    setShowReflectionOffer(false);
    fetchAIResponse("reflection");
  }, [fetchAIResponse]);

  const dismissSuggestion = useCallback(() => {
    setAiSuggestion("");
  }, []);

  const dismissReflectionOffer = useCallback(() => {
    setShowReflectionOffer(false);
  }, []);

  const toggleAI = useCallback(async () => {
    const newState = !aiEnabled;
    setAiEnabled(newState);

    // Save preference
    await updatePreference("aiCompanionEnabled", newState);

    if (newState) {
      // Show presence signal when enabling
      fetchAIResponse("presence");
    } else {
      // Clear all AI state when disabling
      setAiPresence("");
      setAiSuggestion("");
      setAiReflection("");
      setShowReflectionOffer(false);
      setEmbeddedMessages([]);
      setIsChatOpen(false);
      setChatHistory([]);
    }
  }, [aiEnabled, fetchAIResponse]);

  // Cleanup typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isModeDropdownOpen && !target.closest(".relative")) {
        setIsModeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModeDropdownOpen]);

  return (
    <div className="h-full flex flex-col relative max-w-3xl mx-auto overflow-hidden">
      {/* Fixed Header */}
      <header className="flex-none flex items-center justify-between py-6 bg-background/50 backdrop-blur-sm z-50">
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
            {initialData
              ? "Editing"
              : new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
          </span>
          <Button
            onClick={handleSave}
            disabled={isSaving || (isEditorEmpty && !title)}
            className="rounded-full px-8 font-semibold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-1 pt-2 pb-32 relative custom-scrollbar"
      >
        {isDecrypting ? (
          <LoadingScreen />
        ) : (
          <>
            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              type="text"
              placeholder="Title (optional)"
              className="w-full bg-transparent border-none outline-none text-4xl font-bold font-outfit placeholder:text-muted-foreground/30 mb-6"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={`prose prose-zinc dark:prose-invert ${FONT_SIZES[fontSizeIndex]} max-w-none relative`}
            >
              <EditorContent editor={editor} />

              {/* Embedded AI Messages - rendered inline within editor container */}
              {(() => {
                console.log(
                  "[AI Companion] Render check - aiEnabled:",
                  aiEnabled
                );
                console.log("[AI Companion] Render check - aiMode:", aiMode);
                console.log(
                  "[AI Companion] Render check - embeddedMessages:",
                  embeddedMessages
                );
                console.log(
                  "[AI Companion] Render check - should show?",
                  aiEnabled &&
                    aiMode === "embedded" &&
                    embeddedMessages.length > 0
                );
                return null;
              })()}
              {aiEnabled &&
                aiMode === "embedded" &&
                embeddedMessages.length > 0 && (
                  <div className="space-y-4 mt-4">
                    {embeddedMessages.map((msg) => (
                      <EmbeddedAIMessage
                        key={msg.id}
                        message={msg.message}
                        onRemove={() => {
                          setEmbeddedMessages((prev) =>
                            prev.filter((m) => m.id !== msg.id)
                          );
                        }}
                        onContinueChat={() => {
                          setAiMode("chat");
                          updatePreference("aiMode", "chat");
                          setIsChatOpen(true);
                          setChatHistory((prev) => [
                            ...prev,
                            { role: "ai", content: msg.message },
                          ]);
                        }}
                        chatModeAvailable={true}
                      />
                    ))}
                  </div>
                )}
            </motion.div>
          </>
        )}
      </main>

      {/* AI Chat Sidebar (for chat mode) */}
      {aiEnabled && (
        <AIChatSidebar
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          entryContext={editor?.getText() || ""}
          onSendMessage={async (message) => {
            try {
              // Add user message to history
              setChatHistory((prev) => [
                ...prev,
                { role: "user", content: message },
              ]);

              const response = await fetch("/api/ai/companion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  mode: "chat",
                  content: editor?.getText() || "",
                  chatHistory,
                  userMessage: message,
                }),
              });

              const data = await response.json();

              // Add AI response to history
              setChatHistory((prev) => [
                ...prev,
                { role: "ai", content: data.response },
              ]);

              // Store interaction
              setAiInteractions((prev) => [
                ...prev,
                {
                  mode: "chat",
                  response: data.response,
                  timestamp: new Date().toISOString(),
                },
              ]);

              return data.response;
            } catch (error) {
              console.error("Chat error:", error);
              return "I'm having trouble responding right now. Please try again.";
            }
          }}
        />
      )}

      {/* AI Presence Indicator */}
      <AnimatePresence>
        {aiEnabled && aiPresence && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute top-24 right-6 z-40"
          >
            <div className="text-2xl animate-pulse">{aiPresence}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Acknowledgment Suggestion */}
      <AnimatePresence>
        {aiEnabled && aiSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 max-w-md"
          >
            <div className="bg-background/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
              <p className="text-sm text-muted-foreground italic">
                {aiSuggestion}
              </p>
              <button
                onClick={dismissSuggestion}
                className="mt-2 text-xs text-muted-foreground/60 hover:text-muted-foreground"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Reflection Offer */}
      <AnimatePresence>
        {aiEnabled && showReflectionOffer && !aiReflection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 max-w-md"
          >
            <div className="bg-background/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
              <p className="text-sm text-muted-foreground mb-3">
                Would you like me to reflect on what you've shared?
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={requestReflection}
                  className="rounded-full text-xs"
                >
                  Yes, please
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={dismissReflectionOffer}
                  className="rounded-full text-xs"
                >
                  Not now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Reflection Panel */}
      <AnimatePresence>
        {aiEnabled && aiReflection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 max-w-lg"
          >
            <div className="bg-background/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-start gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-muted-foreground mt-1" />
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  {aiReflection}
                </p>
              </div>
              <button
                onClick={() => setAiReflection("")}
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollBottom && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-28 right-4 z-50"
          >
            <Button
              size="icon"
              className="h-10 w-10 rounded-full shadow-lg bg-secondary/80 backdrop-blur-md border border-white/10 hover:bg-secondary text-foreground"
              onClick={scrollToBottom}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Toolbar */}
      <div className="flex-none py-3 sm:py-4 bg-background/50 backdrop-blur-sm z-50">
        <div className="py-2 sm:py-3 px-2 sm:px-4 bg-background/80 backdrop-blur-md border border-white/5 rounded-full flex items-center gap-1 sm:gap-2 justify-center mx-auto w-[95%] max-w-2xl shadow-2xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleBold}
            className={editor?.isActive("bold") ? "bg-white/10" : ""}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleItalic}
            className={editor?.isActive("italic") ? "bg-white/10" : ""}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleList}
            className={editor?.isActive("bulletList") ? "bg-white/10" : ""}
            title="List"
          >
            <List className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-white/10 mx-1 sm:mx-2 hidden sm:block" />
          <Button
            variant="ghost"
            size="icon"
            onClick={decreaseFontSize}
            disabled={fontSizeIndex === 0}
            title="Decrease Font"
            className="hidden sm:flex"
          >
            <span className="text-xs font-bold">A-</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={increaseFontSize}
            disabled={fontSizeIndex === FONT_SIZES.length - 1}
            title="Increase Font"
            className="hidden sm:flex"
          >
            <span className="text-sm font-bold">A+</span>
          </Button>
          <div className="w-px h-5 bg-white/10 mx-1 sm:mx-2 hidden sm:block" />
          <Button
            variant="ghost"
            size="icon"
            title="Add Image"
            onClick={addImage}
            className="hidden sm:flex"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-white/10 mx-1 sm:mx-2 hidden sm:block" />
          {/* AI Mode Selector - Custom Dropdown */}
          {aiEnabled && (
            <div className="relative shrink-0 z-50">
              <button
                onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-all ${modeConfig[aiMode].bgColor} ${modeConfig[aiMode].borderColor} hover:scale-105 active:scale-95`}
                title="AI Interaction Mode"
              >
                <span className="text-sm sm:text-base">
                  {modeConfig[aiMode].emoji}
                </span>
                <span
                  className={`text-[10px] sm:text-xs font-medium ${modeConfig[aiMode].textColor} hidden sm:inline`}
                >
                  {modeConfig[aiMode].label}
                </span>
                <ChevronDown
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                    modeConfig[aiMode].textColor
                  } transition-transform ${
                    isModeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isModeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full mb-2 right-0 w-48 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {(
                      Object.keys(modeConfig) as Array<keyof typeof modeConfig>
                    ).map((mode) => (
                      <button
                        key={mode}
                        onClick={async () => {
                          setAiMode(mode);
                          await updatePreference("aiMode", mode);
                          if (mode === "chat") {
                            setIsChatOpen(true);
                          }
                          setIsModeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                          aiMode === mode ? modeConfig[mode].bgColor : ""
                        }`}
                      >
                        <span className="text-xl">
                          {modeConfig[mode].emoji}
                        </span>
                        <div className="flex-1 text-left">
                          <div
                            className={`text-sm font-semibold ${modeConfig[mode].textColor}`}
                          >
                            {modeConfig[mode].label}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {modeLabels[mode]}
                          </div>
                        </div>
                        {aiMode === mode && (
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${modeConfig[mode].color}`}
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <div className="w-px h-5 bg-white/10 mx-1 sm:mx-2 hidden sm:block" />
          <Button
            variant="ghost"
            size="icon"
            title={aiEnabled ? "Disable AI Companion" : "Enable AI Companion"}
            onClick={toggleAI}
            className={`shrink-0 ${aiEnabled ? "bg-white/10" : ""}`}
          >
            <Sparkles
              className={`h-4 w-4 ${aiEnabled ? "text-purple-400" : ""}`}
            />
          </Button>
          {/* Chat Sidebar Toggle (when chat mode active) */}
          {aiEnabled && aiMode === "chat" && (
            <Button
              variant="ghost"
              size="icon"
              title={isChatOpen ? "Close Chat" : "Open Chat"}
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`shrink-0 ${isChatOpen ? "bg-white/10" : ""}`}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
