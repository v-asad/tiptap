import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewWrapper } from "@/slides/dnd/dnd-node-view-wrapper";
import { NodeName } from "@/slides/slides.utils";

export const ColumnView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  return (
    <DragDropNodeViewWrapper
      type={NodeName.COLUMN}
      accept={[NodeName.PARAGRAPH, NodeName.COLUMN]}
      {...props}
    >
      <NodeViewContent className="outline-none" />
    </DragDropNodeViewWrapper>
  );
};
