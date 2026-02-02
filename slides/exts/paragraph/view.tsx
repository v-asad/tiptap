import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";

import { NodeActions } from "@/slides/node-actions";
import { NodePlaceholder } from "@/slides/node-placeholder";
import { cn } from "@/lib/utils";

export const CustomParagraph = (
  props: ReactNodeViewProps<HTMLParagraphElement>,
) => {
  const { textAlign } = props.node.attrs;

  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.High}
      className="px-1 py-1"
      {...props}
    >
      <DropCursor />
      <NodeActions {...props} />

      <NodeViewContent
        contentEditable
        className={cn({
          "text-left": textAlign === "left",
          "text-right": textAlign === "right",
          "text-center": textAlign === "center",
          "text-justify": textAlign === "justify",
        })}
      />

      {props.node.textContent.trim() === "" && <NodePlaceholder />}
    </DragDropNodeViewProvider>
  );
};
