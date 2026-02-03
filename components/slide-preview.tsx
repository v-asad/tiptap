"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent, Content, Editor } from "@tiptap/react";

import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/slides/slides.utils";
import { cn } from "@/lib/utils";

import { debounce } from "lodash";
import { availableExtensions } from "@/slides/exts";

interface SlidePreviewProps {
  content: Content;
  className?: string;
}

/**
 * Read-only Tiptap editor for previewing slide content.
 * Uses the same extensions as the main editor for consistent rendering.
 */
export const SlidePreview: React.FC<SlidePreviewProps> = ({ content }) => {
  const editor = useEditor({
    extensions: availableExtensions,
    content: content as Content,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    const updateContent = debounce((editor: Editor, content: Content) => {
      editor.commands.setContent(content);
    }, 1000);

    if (editor && content) updateContent(editor, content);
  }, [editor, content]);

  return (
    <div className="relative">
      <EditorContent
        editor={editor}
        className={cn(
          "size-full overflow-y-hidden flex items-start justify-start",
          "[&_.ProseMirror]:flex [&_.ProseMirror]:flex-col [&_.ProseMirror]:justify-center [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:h-full [&_.ProseMirror]:p-10",
          "[&_.ProseMirror]:min-h-full [&_.ProseMirror]:w-full",
          "[&_.ProseMirror]:editor-themed [&_.ProseMirror]:bg-(--editor-bg) [&_.ProseMirror]:text-(--editor-text) font-(--editor-body-font)",
          "scale-[0.162] origin-top-left pointer-events-none",
        )}
        style={{ height: `${SLIDE_HEIGHT}px`, width: `${SLIDE_WIDTH}px` }}
      />
    </div>
  );
};
