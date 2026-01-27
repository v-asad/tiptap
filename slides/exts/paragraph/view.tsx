import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import {
  DragDropNodeViewContent,
  DragDropNodeViewProvider,
} from "@/slides/dnd/dnd-node-view-wrapper";
import { NodeName } from "@/slides/slides.utils";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { DragHandle } from "@/slides/dnd/drag-handle";

export const CustomParagraph = (
  props: ReactNodeViewProps<HTMLParagraphElement>,
) => {
  return (
    <DragDropNodeViewProvider
      type={NodeName.PARAGRAPH}
      accept={[NodeName.PARAGRAPH, NodeName.HEADING]}
      {...props}
    >
      <DragDropNodeViewContent className="bg-green-200">
        <DropCursor />
        <DragHandle />

        <NodeViewContent className="outline-none" />
      </DragDropNodeViewContent>
    </DragDropNodeViewProvider>
  );
};
