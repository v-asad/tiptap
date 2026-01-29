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
      collisionPriority={CollisionPriority.High}
      className="px-1 py-1"
      {...props}
    >
      <DropCursor />
      <DragHandle />

      <NodeViewContent className="outline-none" />
    </DragDropNodeViewProvider>
  );
};
