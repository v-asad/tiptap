import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { ColumnView } from "./view";
import { NodeName } from "@/slides/slides.utils";

export const ColumnExt = Node.create({
  name: NodeName.COLUMN,

  group: "block",

  atom: true,

  content: `(${NodeName.PARAGRAPH} | ${NodeName.HEADING})+`,

  draggable: false,

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
