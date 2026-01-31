import { useEditor, type AnyExtension } from "@tiptap/react";

import Text from "@tiptap/extension-text";
import Focus from "@tiptap/extension-focus";

import { DocumentExt } from "../exts/document";
import { ParagraphExt } from "../exts/paragraph";
import { HeadingExt } from "../exts/heading";
import { ColumnExt } from "../exts/column";
import { RowExt } from "../exts/row";
import { LinkExt } from "../exts/link";
import { ImageExt } from "../exts/image";
import { threeColumnLayout } from "../layouts";

interface UseTiptapEditorOptions {
  additionalExtensions?: AnyExtension[];
}

export const useTiptapEditor = (options: UseTiptapEditorOptions = {}) => {
  const { additionalExtensions = [] } = options;

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
      ...additionalExtensions,
    ],
    content: {
      type: "doc",
      content: threeColumnLayout.content,
    },
    immediatelyRender: false,
  });

  return { editor };
};
