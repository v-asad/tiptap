import { cn } from "@/lib/utils";
import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";

import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";
import { NodeActions } from "@/slides/node-actions";
import { NodePlaceholder } from "@/slides/node-placeholder";

export const CustomHeading = (
  props: ReactNodeViewProps<HTMLParagraphElement>,
) => {
  const { textAlign, level } = props.node.attrs;

  return (
    <DragDropNodeViewProvider
      className={cn("font-medium px-1 py-1", {
        "text-7xl": level === 1,
        "text-5xl": level === 2,
        "text-3xl": level === 3,
        "text-2xl": level === 4,
        "text-xl": level === 5,
        "text-lg": level === 6,
      })}
      collisionPriority={CollisionPriority.High}
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
