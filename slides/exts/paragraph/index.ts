import Paragraph from "@tiptap/extension-paragraph";

import { ReactNodeViewRenderer } from "@tiptap/react";

import { CustomParagraph } from "./view";
import { NodeName } from "@/slides/slides.utils";

export const ParagraphExt = Paragraph.extend({
  name: NodeName.PARAGRAPH,

  content: "inline*",

  group: "block",

  draggable: false,

  atom: false,

  isolating: false,

  defining: true,

  addAttributes() {
    return {
      textAlign: {
        default: "left",
        parseHTML: (element) => {
          const attr = element.getAttribute("textAlign");
          return attr ?? "left";
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomParagraph);
  },
});
