import { cn } from "@/lib/utils";
import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DragHandle } from "@/slides/dnd/drag-handle";
import { DropCursor } from "@/slides/dnd/drop-cursor";

import { NodeName } from "@/slides/slides.utils";
import { Level as HeadingLevel } from "@tiptap/extension-heading";
import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

export const CustomHeading = (
  props: ReactNodeViewProps<HTMLParagraphElement>,
) => {
  const level = props.node.attrs.level as HeadingLevel;

  return (
    <DragDropNodeViewProvider
      type={NodeName.HEADING}
      accept={[NodeName.PARAGRAPH, NodeName.HEADING, NodeName.COLUMN]}
      className={cn("bg-purple-200 font-medium ", {
        "text-5xl": level === 1,
        "text-3xl": level === 2,
        "text-xl": level === 3,
      })}
      {...props}
    >
      <DropCursor />
      <DragHandle />

      <NodeViewContent className="outline-none" />
    </DragDropNodeViewProvider>
  );
};
