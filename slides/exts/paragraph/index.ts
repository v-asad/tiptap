import Paragraph from "@tiptap/extension-paragraph";

import { ReactNodeViewRenderer } from "@tiptap/react";

import { CustomParagraph } from "./view";

export const ParagraphExt = Paragraph.extend({
  draggable: false,
  
  addNodeView() {
    return ReactNodeViewRenderer(CustomParagraph);
  },
});
