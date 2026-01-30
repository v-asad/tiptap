import { useEditor } from "@tiptap/react";

import Text from "@tiptap/extension-text";

import { DocumentExt } from "../exts/document";
import { ParagraphExt } from "../exts/paragraph";
import { HeadingExt } from "../exts/heading";
import { ColumnExt } from "../exts/column";
import { RowExt } from "../exts/row";

export const useTiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      DocumentExt,
      Text,
      ParagraphExt,
      HeadingExt,
      ColumnExt,
      RowExt,
    ],
    content: `
      <div>
        <h1>Heading 1</h1>
        <p>
          This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
        </p>
        
        <row>
          <column>
            <h3>Heading 3</h3>
            <p>
              Paragraph in Col 1
            </p>
          </column>
          <column>
            <h2>Heading 2</h2>
            <p>
              The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
            </p>
            <p>
              Another normal paragraph
            </p>
          </column>
          <column>
            <h3>Heading 3</h3>
            <p>
              Paragraph in Col 2
            </p>
          </column>
          <column>
            <h3>Heading 4</h3>
            <p>
              Paragraph in Col 2
            </p>
          </column>
        </row>

        <row>
          <column>
            <p>
              something xyz
            </p>
          </column>
          <column>
            <p>
              something abc
            </p>
          </column>
        </row>
      </div>
    `,
    immediatelyRender: false,
  });

  return { editor };
};
