import { useEditor } from "@tiptap/react";

import Text from "@tiptap/extension-text";

import { DocumentExt } from "../exts/document";
import { ParagraphExt } from "../exts/paragraph";
import { HeadingExt } from "../exts/heading";
import { ColumnExt } from "../exts/column";
import { RowExt } from "../exts/row";
import { LinkExt } from "../exts/link";

export const useTiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      DocumentExt,
      Text,
      ParagraphExt,
      HeadingExt,
      ColumnExt,
      RowExt,
      LinkExt,
    ],
    content: `
      <div>
        <h1>Theme System Demo</h1>
        <p>
          This editor supports dynamic themes. Try selecting different themes from the dropdown above.
          Visit <a href="https://tiptap.dev">Tiptap</a> for more information.
        </p>

        <row>
          <column>
            <h3>Features</h3>
            <p>
              Themes change background, text colors, and <a href="https://example.com">link styles</a> in real-time.
            </p>
          </column>
          <column>
            <h2>Fonts</h2>
            <p>
              Each theme can have different title and body fonts. The fonts are applied using CSS variables.
            </p>
            <p>
              Check out <a href="https://fonts.google.com">Google Fonts</a> for more options.
            </p>
          </column>
          <column>
            <h3>Customizable</h3>
            <p>
              Add more themes by editing the themes array.
            </p>
          </column>
          <column>
            <h3>Backend Ready</h3>
            <p>
              Replace the array with an API call when ready.
            </p>
          </column>
        </row>

        <row>
          <column>
            <p>
              CSS variables make theming simple and performant.
            </p>
          </column>
          <column>
            <p>
              Works with all <a href="https://tiptap.dev/docs/editor/extensions">Tiptap extensions</a>.
            </p>
          </column>
        </row>
      </div>
    `,
    immediatelyRender: false,
  });

  return { editor };
};
