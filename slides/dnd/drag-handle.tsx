import { GripVerticalIcon } from "lucide-react";
import { useDragDropNodeView } from "./dnd-node-view";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { NodeName } from "../slides.utils";

const hoverClassMap: Record<NodeName, string> = {
  [NodeName.PARAGRAPH]: "group-hover/paragraph:inline",
  [NodeName.HEADING]: "group-hover/heading:inline",
  [NodeName.COLUMN]: "group-hover/column:inline",
  [NodeName.ROW]: "group-hover/row:inline",

  // no drag handle for these nodes
  [NodeName.DOC]: "",
};

export const DragHandle = ({
  className,
  ...props
}: Omit<ComponentProps<typeof GripVerticalIcon>, "ref">) => {
  const { isDragging, handleRef, type } = useDragDropNodeView();

  if (!type) return null;

  return (
    <GripVerticalIcon
      className={cn(
        "p-1 bg-white shadow rounded absolute top-1/2 -translate-y-1/2 -left-5 cursor-grab size-5",
        {
          inline: isDragging,
          hidden: !isDragging,
          [hoverClassMap[type]]: !isDragging && hoverClassMap[type],
        },
        className,
      )}
      ref={handleRef}
      {...props}
    />
  );
};
