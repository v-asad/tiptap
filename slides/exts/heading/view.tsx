import { cn } from "@/lib/utils";
import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";

import { Level as HeadingLevel } from "@tiptap/extension-heading";
import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";
import { NodeActions } from "@/slides/node-actions";

export const CustomHeading = (
  props: ReactNodeViewProps<HTMLParagraphElement>,
) => {
  const level = props.node.attrs.level as HeadingLevel;

  return (
    <DragDropNodeViewProvider
      className={cn("font-medium px-1 py-1", {
        "text-5xl": level === 1,
        "text-3xl": level === 2,
        "text-xl": level === 3,
      })}
      collisionPriority={CollisionPriority.High}
      {...props}
    >
      <DropCursor />
      <NodeActions {...props} />

      <NodeViewContent contentEditable className="outline-none" />
    </DragDropNodeViewProvider>
  );
};
