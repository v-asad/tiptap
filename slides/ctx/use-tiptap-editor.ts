import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import { ParagraphExt } from "../exts/paragraph";

export const useTiptapEditor = () => {
  const editor = useEditor({
    extensions: [Document, Text, ParagraphExt],
    content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
    `,
    immediatelyRender: false,
  });

  return { editor };
};
