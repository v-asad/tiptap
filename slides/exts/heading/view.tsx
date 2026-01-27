import { cn } from "@/lib/utils";
import { DragDropNodeViewWrapper } from "@/slides/dnd/dnd-node-view-wrapper";
import { NodeName } from "@/slides/slides.utils";
import { Level as HeadingLevel } from "@tiptap/extension-heading";
import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

export const CustomHeading = ({
  node,
  ...props
}: ReactNodeViewProps<HTMLParagraphElement>) => {
  const level = node.attrs.level as HeadingLevel;

  return (
    <DragDropNodeViewWrapper
      type={NodeName.HEADING}
      accept={[NodeName.PARAGRAPH, NodeName.HEADING, NodeName.COLUMN]}
      className={cn("bg-purple-200 font-medium ", {
        "text-5xl": level === 1,
        "text-3xl": level === 2,
        "text-xl": level === 3,
      })}
      node={node}
      {...props}
    >
      <NodeViewContent className="outline-none" />
    </DragDropNodeViewWrapper>
  );
};
