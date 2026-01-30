import { useEditor, type AnyExtension } from "@tiptap/react";

import Text from "@tiptap/extension-text";

import { DocumentExt } from "../exts/document";
import { ParagraphExt } from "../exts/paragraph";
import { HeadingExt } from "../exts/heading";
import { ColumnExt } from "../exts/column";
import { RowExt } from "../exts/row";
import { LinkExt } from "../exts/link";

interface UseTiptapEditorOptions {
  additionalExtensions?: AnyExtension[];
}

export const useTiptapEditor = (options: UseTiptapEditorOptions = {}) => {
  const { additionalExtensions = [] } = options;

  const editor = useEditor({
    extensions: [
      DocumentExt,
      Text,
      ParagraphExt,
      HeadingExt,
      ColumnExt,
      RowExt,
      LinkExt,
      ...additionalExtensions,
    ],
    content: `
      <div>
        <h1>Tiptap Editor Demo</h1>
        <p>
          This editor supports dynamic themes and slash commands. Type <strong>/</strong> to see available commands.
          Visit <a href="https://tiptap.dev">Tiptap</a> for more information.
        </p>

        <row>
          <column>
            <h3>Slash Commands</h3>
            <p>
              Type / at the start of a line to insert headings, links, dates, and more.
            </p>
          </column>
          <column>
            <h2>Themes</h2>
            <p>
              Switch themes from the dropdown to change colors and fonts instantly.
            </p>
            <p>
              Check out <a href="https://fonts.google.com">Google Fonts</a> for more options.
            </p>
          </column>
          <column>
            <h3>Customizable</h3>
            <p>
              Add new commands by editing the commands array.
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

        <p></p>
      </div>
    `,
    immediatelyRender: false,
  });

  return { editor };
};
