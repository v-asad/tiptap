import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { RowView } from "./view";
import { NodeName } from "@/slides/slides.utils";
import { rowNormalizationPlugin } from "./row-normalization-plugin";

export const RowExt = Node.create({
  name: NodeName.ROW,

  group: "block",

  atom: false,

  content: `${NodeName.COLUMN}+`,

  draggable: false,

  selectable: false,

  defining: false,

  isolating: true,

  addAttributes() {
    return {
      columnWidths: {
        default: [],
        parseHTML: (element) => {
          const attr = element.getAttribute("columnwidths");
          if (!attr) return [];
          return attr.split(",").map((s) => parseFloat(s));
        },
        renderHTML: (attributes) => {
          if (!attributes.columnWidths || !attributes.columnWidths.length)
            return {};
          return {
            columnwidths: attributes.columnWidths.join(","),
          };
        },
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
    return ["row", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RowView);
  },
});
