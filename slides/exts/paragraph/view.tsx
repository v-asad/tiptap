import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewWrapper } from "@/slides/dnd/dnd-node-view-wrapper";

export const CustomParagraph = (
  props: ReactNodeViewProps<HTMLParagraphElement>,
) => {
  return (
    <DragDropNodeViewWrapper {...props}>
      <NodeViewContent className="outline-none" />
    </DragDropNodeViewWrapper>
  );
};
