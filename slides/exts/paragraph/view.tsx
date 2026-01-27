import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewWrapper } from "@/slides/dnd/dnd-node-view-wrapper";
import { NodeName } from "@/slides/slides.utils";

export const CustomParagraph = (
  props: ReactNodeViewProps<HTMLParagraphElement>,
) => {
  return (
    <DragDropNodeViewWrapper
      type={NodeName.PARAGRAPH}
      accept={NodeName.PARAGRAPH}
      {...props}
    >
      <NodeViewContent className="outline-none" />
    </DragDropNodeViewWrapper>
  );
};
