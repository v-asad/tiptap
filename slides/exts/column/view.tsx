import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { DragHandle } from "@/slides/dnd/drag-handle";
import { CollisionPriority } from "@/slides/dnd/dnd.types";
import { cn } from "@/lib/utils";

export const ColumnView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.Low}
      className={cn("py-2 px-6 border border-transparent group-hover/row:border-border")}
      {...props}
    >
      <DropCursor />
      <DragHandle pos="top" />

      <NodeViewContent className="outline-none" />
    </DragDropNodeViewProvider>
  );
};
