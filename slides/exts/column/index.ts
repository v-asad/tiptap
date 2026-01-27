import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { ColumnView } from "./view";

export const ColumnExt = Node.create({
  name: "column",

  group: "block",

  atom: true,

  content: "paragraph+",

  draggable: false,

  parseHTML() {
    return [
      {
        tag: "column",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["react-component", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnView);
  },
});
