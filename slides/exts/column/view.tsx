import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewWrapper } from "@/slides/dnd/dnd-node-view-wrapper";
import { NodeName } from "@/slides/slides.utils";

export const ColumnView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  return (
    <DragDropNodeViewWrapper
      type={NodeName.COLUMN}
      accept={[NodeName.PARAGRAPH, NodeName.COLUMN, NodeName.HEADING]}
      className="bg-yellow-200"
      {...props}
    >
      <NodeViewContent className="outline-none" />
    </DragDropNodeViewWrapper>
  );
};
