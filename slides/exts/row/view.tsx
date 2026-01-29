import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { DragHandle } from "@/slides/dnd/drag-handle";
import { CollisionPriority } from "@/slides/dnd/dnd.types";

export const RowView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  return (
    <DragDropNodeViewProvider
      className="bg-red-200"
      collisionPriority={CollisionPriority.Low}
      {...props}
    >
      <DropCursor />
      <DragHandle />

      <NodeViewContent className="*:data-node-view-content-react:flex" />
    </DragDropNodeViewProvider>
  );
};
