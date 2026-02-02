import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { ColumnView } from "./view";
import { NodeName } from "@/slides/slides.utils";

export const ColumnExt = Node.create({
  name: NodeName.COLUMN,

  group: "block",

  atom: true,

  content: `block+`,

  draggable: false,

  selectable: false,

  isolating: true,

  defining: false,

  parseHTML() {
    return [
      {
        tag: "column",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["column", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnView, { className: "grow" });
  },
});
