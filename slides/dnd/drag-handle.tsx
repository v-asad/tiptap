import { EllipsisIcon, EllipsisVerticalIcon } from "lucide-react";
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
  shouldStayVisible?: boolean;
};

export const DragHandle = ({
  className,
  pos = "left",
  shouldStayVisible = false,
  ...props
}: DragHandleProps) => {
  const { handleRef, type } = useDragDropNodeView();

  if (!type) return null;

  return (
    <span
      contentEditable={false}
      className={cn(
        "cursor-grab inline-flex items-center justify-center bg-background text-foreground rounded border",
        {
          "absolute top-1 -left-5 w-5 py-1": pos === "left",
          "absolute left-1/2 -translate-x-1/2 -top-2.5 h-5 px-1": pos === "top",
        },
        {
          hidden: true,
          [hoverClassMap[type]]: hoverClassMap[type],
          flex: shouldStayVisible,
        },
        className,
      )}
      ref={handleRef}
      {...props}
    >
      {pos === "left" ? (
        <EllipsisVerticalIcon className="size-4" />
      ) : (
        <EllipsisIcon className="size-4" />
      )}
    </span>
  );
};
