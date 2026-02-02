"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent, Content, Editor } from "@tiptap/react";

import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/slides/slides.utils";
import { cn } from "@/lib/utils";

import { debounce } from "lodash";
import { availableExtensions } from "@/slides/exts";

interface SlidePreviewProps {
  contentJSON: Content;
  className?: string;
}

/**
 * Read-only Tiptap editor for previewing slide content.
 * Uses the same extensions as the main editor for consistent rendering.
 */
export const SlidePreview: React.FC<SlidePreviewProps> = ({ contentJSON }) => {
  const editor = useEditor({
    extensions: availableExtensions,
    content: contentJSON as Content,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    const updateContent = debounce((editor: Editor, contentJSON: Content) => {
      editor.commands.setContent(contentJSON);
    }, 1000);

    if (editor && contentJSON) updateContent(editor, contentJSON);
  }, [editor, contentJSON]);

  return (
    <div className="relative size-full bg-yellow-200 pointer-events-none">
      <div
        className="scale-[0.162] origin-top-left"
        style={{ height: `${SLIDE_HEIGHT}px`, width: `${SLIDE_WIDTH}px` }}
      >
        <EditorContent
          editor={editor}
          className={cn(
            "editor-themed size-full",
            "*:flex *:flex-col *:justify-center *:focus:outline-none *:h-full *:p-6",
          )}
        />
      </div>
    </div>
  );
};
