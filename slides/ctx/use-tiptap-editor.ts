import { Content, useEditor, type AnyExtension } from "@tiptap/react";

import { threeColumnLayout } from "../layouts";
import { availableExtensions } from "../exts";

interface UseTiptapEditorOptions {
  additionalExtensions?: AnyExtension[];
  initialContent?: Content;
}

export const useTiptapEditor = (options: UseTiptapEditorOptions = {}) => {
  const { additionalExtensions = [], initialContent } = options;

  const editor = useEditor({
    extensions: [...availableExtensions, ...additionalExtensions],
    content: initialContent || threeColumnLayout.content,
    immediatelyRender: false,
  });

  return { editor };
};
