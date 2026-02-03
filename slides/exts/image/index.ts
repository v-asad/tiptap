import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { ImageView } from "./view";
import { NodeName } from "@/slides/slides.utils";

export type ImageLayout =
  | "default"
  | "full-top"
  | "full-bottom"
  | "full-left"
  | "full-right";

export const ImageExt = Image.configure({
  resize: {
    enabled: true,
    directions: ["bottom-right"],
    minWidth: 50,
    minHeight: 50,
    alwaysPreserveAspectRatio: false,
  },
}).extend({
  name: NodeName.IMAGE,

  group: "block",

  draggable: false,

  atom: true,

  selectable: false,

  defining: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      layout: {
        default: "default",
      },
      // Size in pixels for full-layout images
      // For full-top/full-bottom: this is the height
      // For full-left/full-right: this is the width percentage (0-100)
      size: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: (element) => {
          const value = element.getAttribute("width");
          return value ? Number.parseFloat(value) : null;
        },
        renderHTML: (attrs) => {
          if (!attrs.width) return {};
          return { width: attrs.width };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const value = element.getAttribute("height");
          return value ? Number.parseFloat(value) : null;
        },
        renderHTML: (attrs) => {
          if (!attrs.height) return {};
          return { height: attrs.height };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});
