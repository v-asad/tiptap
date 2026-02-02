import { ReactNodeViewProps } from "@tiptap/react";

export enum NodeName {
  DOC = "doc",
  COLUMN = "column",
  ROW = "row",
  PARAGRAPH = "paragraph",
  HEADING = "heading",
  IMAGE = "image",
  BULLET_LIST = "bulletList",
  ORDERED_LIST = "orderedList",
  LIST_ITEM = "listItem",
}

export const getNodeAttributes = <T>({
  getPos,
  editor,
}: Pick<ReactNodeViewProps<T>, "getPos" | "editor">) => {
  const pos = getPos();
  if (pos === null || pos === undefined) return null;

  return editor.state.doc.resolve(pos);
};
