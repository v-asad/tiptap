import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { DragHandle } from "@/slides/dnd/drag-handle";
import { CollisionPriority } from "@/slides/dnd/dnd.types";

export const CustomParagraph = (
  props: ReactNodeViewProps<HTMLParagraphElement>,
) => {
  return (
    <DragDropNodeViewProvider
      className="bg-green-200"
      collisionPriority={CollisionPriority.High}
      {...props}
    >
      <DropCursor />
      <DragHandle />

      <NodeViewContent className="outline-none" />
    </DragDropNodeViewProvider>
  );
};
