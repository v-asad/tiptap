import Heading from "@tiptap/extension-heading";

import { ReactNodeViewRenderer } from "@tiptap/react";

import { CustomHeading } from "./view";
import { NodeName } from "@/slides/slides.utils";

export const HeadingExt = Heading.extend({
  name: NodeName.HEADING,

  content: "inline*",

  draggable: false,

  addNodeView() {
    return ReactNodeViewRenderer(CustomHeading);
  },
});
