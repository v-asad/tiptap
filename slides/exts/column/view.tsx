import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import {
  DragDropNodeViewContent,
  DragDropNodeViewProvider,
} from "@/slides/dnd/dnd-node-view-wrapper";
import { NodeName } from "@/slides/slides.utils";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { DragHandle } from "@/slides/dnd/drag-handle";

export const ColumnView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  return (
    <DragDropNodeViewProvider
      type={NodeName.COLUMN}
      accept={[NodeName.PARAGRAPH, NodeName.COLUMN, NodeName.HEADING]}
      {...props}
    >
      <DragDropNodeViewContent className="bg-yellow-200">
        <DropCursor />
        <DragHandle />

        <NodeViewContent className="outline-none" />
      </DragDropNodeViewContent>
    </DragDropNodeViewProvider>
  );
};
