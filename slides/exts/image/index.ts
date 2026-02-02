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

export const ImageExt = Image.extend({
  name: NodeName.IMAGE,

  group: "block",

  draggable: false,

  atom: true,

  selectable: true,

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
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});
