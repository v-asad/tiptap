"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent, Content, Editor } from "@tiptap/react";
import Text from "@tiptap/extension-text";
import Focus from "@tiptap/extension-focus";

import { DocumentExt } from "@/slides/exts/document";
import { ParagraphExt } from "@/slides/exts/paragraph";
import { HeadingExt } from "@/slides/exts/heading";
import { ColumnExt } from "@/slides/exts/column";
import { RowExt } from "@/slides/exts/row";
import { LinkExt } from "@/slides/exts/link";
import { ImageExt } from "@/slides/exts/image";
import { BulletListExt } from "@/slides/exts/bullet-list";
import { OrderedListExt } from "@/slides/exts/ordered-list";
import { ListItemExt } from "@/slides/exts/list-item";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/slides/slides.utils";
import { cn } from "@/lib/utils";

import { debounce } from "lodash";
import { TextStyleKit } from "@tiptap/extension-text-style";

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
    extensions: [
      DocumentExt,
      Text,
      Focus,
      ParagraphExt,
      HeadingExt,
      ImageExt,
      ColumnExt,
      RowExt,
      LinkExt,
      BulletListExt,
      OrderedListExt,
      ListItemExt,
      TextStyleKit,
    ],
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
    <div className="relative size-full bg-yellow-200">
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
