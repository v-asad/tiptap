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

  isolating: false,

  defining: true,

  addNodeView() {
    return ReactNodeViewRenderer(CustomHeading);
  },
});
