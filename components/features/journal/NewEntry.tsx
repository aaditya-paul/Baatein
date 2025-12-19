"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExtension from "@tiptap/extension-image";
import { createClient } from "@/lib/supabase/client";

const FONT_SIZES = [
  "prose-sm",
  "prose-base",
  "prose-lg",
  "prose-xl",
  "prose-2xl",
];

export function NewEntry() {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(2); // Default to prose-lg (index 2)
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

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
    editorProps: {
      attributes: {
        class: "focus:outline-none max-w-none min-h-[300px]",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setIsEditorEmpty(editor.isEmpty);
    },
  });

  const handleSave = async () => {
    if (!editor || isSaving) return;

    setIsSaving(true);
    const content = editor.getHTML(); // Get HTML content
    const plainText = editor.getText(); // Get plain text for validation

    if (!plainText.trim() && !title.trim()) {
      setIsSaving(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("entries").insert({
          user_id: user.id,
          title: title.trim() || "Untitled",
          content: content,
        });

        if (error) {
          console.error(
            "Supabase Insert Error:",
            JSON.stringify(error, null, 2)
          );
          throw error;
        }

        router.push("/journal");
        router.refresh();
      } else {
        console.error("No authenticated user found while saving.");
      }
    } catch (error: any) {
      console.error("Error saving entry:", error);
      alert(`Error saving: ${error.message || JSON.stringify(error)}`);
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
  };

  const decreaseFontSize = () => {
    setFontSizeIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full max-w-3xl mx-auto"
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

      <main className="flex-1 relative flex flex-col overflow-y-auto px-1 pb-20">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Title (optional)"
          className="w-full bg-transparent border-none outline-none text-4xl font-bold font-outfit placeholder:text-muted-foreground/30 mb-6"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Tiptap Editor */}
        <div
          className={`flex-1 prose prose-zinc dark:prose-invert ${FONT_SIZES[fontSizeIndex]} max-w-none`}
        >
          <EditorContent editor={editor} />
        </div>

        {/* Bottom Toolbar */}
        <div className="sticky bottom-4 py-3 px-4 bg-background/80 backdrop-blur-md border border-white/5 rounded-full flex items-center justify-between mt-auto mb-4 mx-auto w-full max-w-md shadow-2xl z-50">
          <div className="flex gap-1 items-center">
            {/* Formatting Tools */}
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

            {/* Font Size Tools */}
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

            {/* Media Tools */}
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
      </main>
    </motion.div>
  );
}
