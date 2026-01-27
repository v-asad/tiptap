"use client";

import { EditorContent } from "@tiptap/react";
import { useSlideEditorContext } from "./ctx/use-slide-editor";
import { DnDProvider } from "./ctx/dnd-provider";

export const SlideEditor = () => {
  const { editor } = useSlideEditorContext();

  return (
    <div className="aspect-video max-w-7xl w-full shadow-2xl">
      <DnDProvider>
        <EditorContent editor={editor} />
      </DnDProvider>
    </div>
  );
};
