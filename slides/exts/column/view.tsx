import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-node-view";
import { NodeName } from "@/slides/slides.utils";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { DragHandle } from "@/slides/dnd/drag-handle";

export const ColumnView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  return (
    <DragDropNodeViewProvider
      type={NodeName.COLUMN}
      accept={[NodeName.PARAGRAPH, NodeName.COLUMN, NodeName.HEADING]}
      className="bg-yellow-200"
      {...props}
    >
      <DropCursor />
      <DragHandle />

      <NodeViewContent className="outline-none" />
    </DragDropNodeViewProvider>
  );
};
