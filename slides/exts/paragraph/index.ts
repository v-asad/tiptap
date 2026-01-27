import Paragraph from "@tiptap/extension-paragraph";

import { ReactNodeViewRenderer } from "@tiptap/react";

import { CustomParagraph } from "./view";
import { NodeName } from "@/slides/slides.utils";

export const ParagraphExt = Paragraph.extend({
  name: NodeName.PARAGRAPH,

  content: "inline*",

  draggable: false,

  addNodeView() {
    return ReactNodeViewRenderer(CustomParagraph);
  },
});
