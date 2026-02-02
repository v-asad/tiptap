import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";

import { NodeActions } from "@/slides/node-actions";

export const ListItemView = (
  props: ReactNodeViewProps<HTMLLIElement>,
) => {
  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.High}
      className="relative"
      as="li"
      {...props}
    >
      <DropCursor />
      <NodeActions {...props} />

      <NodeViewContent className="outline-none" />
    </DragDropNodeViewProvider>
  );
};
