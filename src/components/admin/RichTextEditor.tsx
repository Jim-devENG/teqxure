"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  LinkIcon,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  name: string;
  label: string;
  defaultValue?: string;
}

export function RichTextEditor({ name, label, defaultValue = "" }: RichTextEditorProps) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false, autolink: true })],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-editor min-h-[180px] px-3 py-2.5 text-sm text-graphite outline-none",
      },
    },
  });

  if (!editor) {
    return (
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">{label}</span>
        <div className="mt-2 h-[220px] animate-pulse rounded-lg border border-light-gray bg-soft-white" />
      </div>
    );
  }

  function toolbarButton(active: boolean) {
    return cn(
      "rounded-md p-1.5 text-slate transition-colors hover:bg-soft-white hover:text-graphite cursor-pointer",
      active && "bg-blue/10 text-blue",
    );
  }

  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">{label}</span>
      <div className="mt-2 overflow-hidden rounded-lg border border-light-gray bg-white focus-within:border-blue">
        <div className="flex flex-wrap items-center gap-0.5 border-b border-light-gray px-2 py-1.5">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={toolbarButton(editor.isActive("bold"))} aria-label="Bold">
            <Bold className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={toolbarButton(editor.isActive("italic"))} aria-label="Italic">
            <Italic className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={toolbarButton(editor.isActive("heading", { level: 2 }))} aria-label="Heading 2">
            <Heading2 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={toolbarButton(editor.isActive("heading", { level: 3 }))} aria-label="Heading 3">
            <Heading3 className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={toolbarButton(editor.isActive("bulletList"))} aria-label="Bullet list">
            <List className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={toolbarButton(editor.isActive("orderedList"))} aria-label="Numbered list">
            <ListOrdered className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("Link URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className={toolbarButton(editor.isActive("link"))}
            aria-label="Link"
          >
            <LinkIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <div className="mx-1 h-4 w-px bg-light-gray" />
          <button type="button" onClick={() => editor.chain().focus().undo().run()} className={toolbarButton(false)} aria-label="Undo">
            <Undo className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} className={toolbarButton(false)} aria-label="Redo">
            <Redo className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html} readOnly />
    </div>
  );
}
