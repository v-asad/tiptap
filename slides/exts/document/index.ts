import { NodeName } from "@/slides/slides.utils";
import { Document } from "@tiptap/extension-document";

export const DocumentExt = Document.extend({
  content: `(${NodeName.ROW} | ${NodeName.PARAGRAPH} | ${NodeName.HEADING} | ${NodeName.IMAGE} | ${NodeName.BULLET_LIST} | ${NodeName.ORDERED_LIST})+`,
});
