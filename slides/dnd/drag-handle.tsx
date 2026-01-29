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

type DragHandlePos = "top" | "left";

type DragHandleProps = Omit<ComponentProps<typeof GripVerticalIcon>, "ref"> & {
  pos?: DragHandlePos;
};

export const DragHandle = ({
  className,
  pos = "left",
  ...props
}: DragHandleProps) => {
  const { isDragging, handleRef, type } = useDragDropNodeView();

  if (!type) return null;

  return (
    <GripVerticalIcon
      className={cn(
        "p-1 bg-white shadow rounded cursor-grab size-5",
        // Position configuration
        {
          "absolute top-1/2 -translate-y-1/2 -left-5": pos === "left",
          "absolute left-1/2 -translate-x-1/2 -top-5": pos === "top",
        },
        // Visibility Configuration
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
