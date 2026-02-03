import { ReactNodeViewProps } from "@tiptap/react";

export enum NodeName {
  DOC = "doc",
  COLUMN = "column",
  ROW = "row",
  PARAGRAPH = "paragraph",
  HEADING = "heading",
  IMAGE = "image",
  CHART = "chart",
  BULLET_LIST = "bulletList",
  ORDERED_LIST = "orderedList",
  LIST_ITEM = "listItem",
}

export const SLIDE_HEIGHT = 720;
export const SLIDE_WIDTH = 1280;

export const getNodeAttributes = <T>({
  getPos,
  editor,
}: Pick<ReactNodeViewProps<T>, "getPos" | "editor">) => {
  const pos = getPos();
  if (pos === null || pos === undefined) return null;

  return editor.state.doc.resolve(pos);
};
