import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";

import { NodeActions } from "@/slides/node-actions";
import { NodePlaceholder } from "@/slides/node-placeholder";

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
      <NodeActions {...props} />

      <NodeViewContent contentEditable className="outline-none" />

      {props.node.textContent.trim() === "" && <NodePlaceholder />}
    </DragDropNodeViewProvider>
  );
};
