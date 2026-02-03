import Heading from "@tiptap/extension-heading";

import { ReactNodeViewRenderer } from "@tiptap/react";

import { CustomHeading } from "./view";
import { NodeName } from "@/slides/slides.utils";

export const HeadingExt = Heading.extend({
  name: NodeName.HEADING,

  content: "inline*",

  group: "block",

  draggable: false,

  atom: false,
  
  selectable: false,

  isolating: false,

  defining: true,

  addAttributes() {
    return {
      level: {
        default: 1,
        parseHTML: (element) => {
          const level = element.tagName.replace("H", "");
          return Number(level) || 1;
        },
        renderHTML: (attrs) => ({
          level: attrs.level,
        }),
      },
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
    return ReactNodeViewRenderer(CustomHeading);
  },
});
