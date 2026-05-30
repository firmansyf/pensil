"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImagePlus,
  Loader2,
  Undo,
  Redo,
} from "lucide-react";
import { uploadConfigured, uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg" } }),
    ],
    content: value,
    // Wajib false untuk SSR Next.js agar tidak terjadi hydration mismatch.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn("post-content min-h-[18rem] w-full px-3 py-2 focus:outline-none", "max-w-none"),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return (
      <div className="border-input text-muted-foreground flex h-[22rem] items-center justify-center rounded-md border text-sm">
        Memuat editor…
      </div>
    );
  }

  return (
    <div className="border-input focus-within:ring-ring overflow-hidden rounded-md border focus-within:ring-1">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err) {
      window.alert((err as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="border-input bg-muted/30 flex flex-wrap items-center gap-0.5 border-b p-1">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        label="Tebal"
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        label="Miring"
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        label="Coret"
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        label="Judul 2"
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        label="Judul 3"
      >
        <Heading3 className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        label="Daftar"
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        label="Daftar bernomor"
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
        label="Kutipan"
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        label="Kode"
      >
        <Code className="size-4" />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        onClick={() => setLink(editor)}
        active={editor.isActive("link")}
        label="Tautan"
      >
        <LinkIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || !uploadConfigured}
        label={uploadConfigured ? "Sisipkan gambar" : "Upload belum dikonfigurasi"}
      >
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />

      <Divider />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        label="Urungkan"
      >
        <Undo className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        label="Ulangi"
      >
        <Redo className="size-4" />
      </ToolbarButton>
    </div>
  );
}

function setLink(editor: Editor) {
  const previous = (editor.getAttributes("link").href as string) ?? "";
  const url = window.prompt("URL tautan (kosongkan untuk hapus):", previous);
  if (url === null) return; // batal
  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "hover:bg-muted text-muted-foreground inline-flex size-8 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        active && "bg-muted text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="bg-border mx-1 h-5 w-px" aria-hidden />;
}
