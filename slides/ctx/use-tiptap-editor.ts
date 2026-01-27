import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";

import { ParagraphExt } from "../exts/paragraph";
import { ColumnExt } from "../exts/column";

export const useTiptapEditor = () => {
  const editor = useEditor({
    extensions: [Document, Text, ParagraphExt, ColumnExt],
    content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <column>
        <p>
          The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
        </p>
        <p>
          Another normal paragraph
        </p>
      </column>
      <column>
        <p>
          Paragraph something
        </p>
        <p>
          2- Another normal paragraph
        </p>
      </column>
    `,
    immediatelyRender: false,
  });

  return { editor };
};
