import { GripHorizontalIcon, GripVerticalIcon } from "lucide-react";
import { useDragDropNodeView } from "./dnd-node-view";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { NodeName } from "../slides.utils";
import { Button } from "@/components/ui/button";

const hoverClassMap: Record<NodeName, string> = {
  [NodeName.PARAGRAPH]: "group-hover/paragraph:flex",
  [NodeName.HEADING]: "group-hover/heading:flex",
  [NodeName.COLUMN]: "group-hover/column:flex",
  [NodeName.ROW]: "group-hover/row:flex",

  // no drag handle for these nodes
  [NodeName.DOC]: "",
};

type DragHandlePos = "top" | "left";

type DragHandleProps = Omit<ComponentProps<typeof Button>, "ref"> & {
  pos?: DragHandlePos;
  verticalAlign?: "center" | "start";
};

export const DragHandle = ({
  className,
  pos = "left",
  ...props
}: DragHandleProps) => {
  const { isDragging, handleRef, type } = useDragDropNodeView();

  if (!type) return null;

  return (
    <Button
      variant="outline"
      size="icon-xs"
      className={cn(
        "cursor-grab inline-flex items-center justify-center bg-background",
        {
          "absolute top-1 -left-5 w-5": pos === "left",
          "absolute left-1/2 -translate-x-1/2 -top-2.5 h-5": pos === "top",
        },
        {
          flex: isDragging,
          hidden: !isDragging,
          [hoverClassMap[type]]: !isDragging && hoverClassMap[type],
        },
        className,
      )}
      ref={handleRef}
      {...props}
    >
      {pos === "left" ? <GripVerticalIcon /> : <GripHorizontalIcon />}
    </Button>
  );
};
