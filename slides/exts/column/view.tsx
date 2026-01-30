import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";
import { cn } from "@/lib/utils";
import { NodeActions } from "@/slides/node-actions";

export const ColumnView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.Low}
      className={cn(
        "py-2 px-6 border border-transparent group-hover/row:border-border",
      )}
      {...props}
    >
      <DropCursor />
      <NodeActions dragHandleProps={{ pos: "top" }} {...props} />

      <NodeViewContent className="outline-none" contentEditable={false} />

      <div
        contentEditable={false}
        className="group/col-control w-4 flex items-center justify-center h-full absolute left-0 top-0 z-2 -translate-x-1/2"
      >
        <div
          contentEditable={false}
          id="resize-handle"
          className="hidden group-hover/col-control:flex h-full w-0 group-hover/col-control:w-1 cursor-col-resize bg-blue-400 rounded"
        />
      </div>
    </DragDropNodeViewProvider>
  );
};
