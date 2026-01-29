import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";
import { NodeName } from "@/slides/slides.utils";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { DragHandle } from "@/slides/dnd/drag-handle";

export const RowView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  return (
    <DragDropNodeViewProvider
      type={NodeName.ROW}
      accept={[NodeName.ROW, NodeName.COLUMN]}
      className="bg-red-200"
      {...props}
    >
      <DropCursor />
      <DragHandle />

      <NodeViewContent className="*:data-node-view-content-react:flex" />
    </DragDropNodeViewProvider>
  );
};
