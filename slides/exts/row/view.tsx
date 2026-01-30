import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";
import { NodeActions } from "@/slides/node-actions";

export const RowView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.Low}
      className="my-4"
      {...props}
    >
      <DropCursor />
      <NodeActions {...props} />

      <NodeViewContent className="*:grid *:auto-cols-fr *:grid-flow-col" />
    </DragDropNodeViewProvider>
  );
};
