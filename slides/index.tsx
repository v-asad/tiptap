"use client";

import { EditorContent } from "@tiptap/react";
import { useSlideEditorContext } from "./ctx/use-slide-editor";
import { DnDProvider } from "./ctx/dnd-provider";
import { ThemeDropdown } from "@/components/theme-dropdown";

export const SlideEditor = () => {
  const { editor } = useSlideEditorContext();

  return (
    <div className="flex w-full max-w-7xl flex-col gap-4">
      <div className="flex items-center justify-end">
        <ThemeDropdown />
      </div>

      <div className="editor-themed aspect-video w-full rounded-lg shadow-2xl">
        <DnDProvider>
          <EditorContent editor={editor} className="h-full p-6" />
        </DnDProvider>
      </div>
    </div>
  );
};
