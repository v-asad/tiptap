import { Content, useEditor, type AnyExtension } from "@tiptap/react";

import Text from "@tiptap/extension-text";
import Focus from "@tiptap/extension-focus";

import { TextStyleKit } from "@tiptap/extension-text-style";

import { DocumentExt } from "../exts/document";
import { ParagraphExt } from "../exts/paragraph";
import { HeadingExt } from "../exts/heading";
import { ColumnExt } from "../exts/column";
import { RowExt } from "../exts/row";
import { LinkExt } from "../exts/link";
import { ImageExt } from "../exts/image";
import { BulletListExt } from "../exts/bullet-list";
import { OrderedListExt } from "../exts/ordered-list";
import { ListItemExt } from "../exts/list-item";
import { threeColumnLayout } from "../layouts";

interface UseTiptapEditorOptions {
  additionalExtensions?: AnyExtension[];
  initialContent?: Content;
}

export const useTiptapEditor = (options: UseTiptapEditorOptions = {}) => {
  const { additionalExtensions = [], initialContent } = options;

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
      ...additionalExtensions,
    ],
    content: initialContent || {
      type: "doc",
      content: threeColumnLayout.content,
    },
    immediatelyRender: false,
  });

  return { editor };
};
