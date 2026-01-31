import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { RowView } from "./view";
import { NodeName } from "@/slides/slides.utils";
import { rowNormalizationPlugin } from "./row-normalization-plugin";

export const RowExt = Node.create({
  name: NodeName.ROW,

  group: "block",

  atom: true,

  content: `${NodeName.COLUMN}+`,

  draggable: false,

  selectable: false,

  defining: false,

  addAttributes() {
    return {
      columnWidths: {
        default: [],
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "row",
      },
    ];
  },

  addProseMirrorPlugins() {
    return [rowNormalizationPlugin];
  },

  renderHTML({ HTMLAttributes }) {
    return ["row", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RowView);
  },
});
