import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewWrapper } from "@/slides/dnd/dnd-node-view-wrapper";
import { NodeName } from "@/slides/slides.utils";

export const CustomParagraph = (
  props: ReactNodeViewProps<HTMLParagraphElement>,
) => {
  return (
    <DragDropNodeViewWrapper
      type={NodeName.PARAGRAPH}
      accept={[NodeName.PARAGRAPH, NodeName.HEADING]}
      className="bg-green-200"
      {...props}
    >
      <NodeViewContent className="outline-none" />
    </DragDropNodeViewWrapper>
  );
};
