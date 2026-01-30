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

      <NodeViewContent className="*:data-node-view-content-react:grid *:data-node-view-content-react:auto-cols-fr *:data-node-view-content-react:grid-flow-col" />
    </DragDropNodeViewProvider>
  );
};
