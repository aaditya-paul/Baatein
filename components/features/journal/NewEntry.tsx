"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  ChevronDown,
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
import { getRandomMicrocopy } from "@/lib/microcopies";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/shared/LoadingScreen";

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

        let error;

        if (initialData?.id) {
          const result = await supabase
            .from("entries")
            .update({
              title: encryptedTitle,
              content: encryptedContent,
              updated_at: new Date().toISOString(),
            })
            .eq("id", initialData.id);
          error = result.error;
        } else {
          const result = await supabase.from("entries").insert({
            user_id: user.id,
            title: encryptedTitle,
            content: encryptedContent,
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
              className={`prose prose-zinc dark:prose-invert ${FONT_SIZES[fontSizeIndex]} max-w-none`}
            >
              <EditorContent editor={editor} />
            </motion.div>
          </>
        )}
      </main>

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
      <div className="flex-none py-4 bg-background/50 backdrop-blur-sm z-50">
        <div className="py-3 px-4 bg-background/80 backdrop-blur-md border border-white/5 rounded-full flex items-center justify-between mx-auto w-full max-w-md shadow-2xl">
          <div className="flex gap-1 items-center">
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
            <div className="w-px h-6 bg-white/10 mx-2" />
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={decreaseFontSize}
                disabled={fontSizeIndex === 0}
                title="Decrease Font"
              >
                <span className="text-xs font-bold">A-</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={increaseFontSize}
                disabled={fontSizeIndex === FONT_SIZES.length - 1}
                title="Increase Font"
              >
                <span className="text-sm font-bold">A+</span>
              </Button>
            </div>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <Button
              variant="ghost"
              size="icon"
              title="Add Image"
              onClick={addImage}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
