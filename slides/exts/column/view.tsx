import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { DragHandle } from "@/slides/dnd/drag-handle";
import { CollisionPriority } from "@/slides/dnd/dnd.types";

export const ColumnView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  return (
    <DragDropNodeViewProvider className="bg-yellow-200" collisionPriority={CollisionPriority.Low} {...props}>
      <DropCursor />
      <DragHandle pos="top" />

      <NodeViewContent className="outline-none" />
    </DragDropNodeViewProvider>
  );
};
