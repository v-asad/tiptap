import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { ImageView } from "./view";
import { NodeName } from "@/slides/slides.utils";

export const ImageExt = Image.extend({
  name: NodeName.IMAGE,

  group: "block",

  draggable: false,

  atom: true,

  selectable: true,

  defining: true,

  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});
