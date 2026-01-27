import { GripVerticalIcon } from "lucide-react";
import { useDragDropNodeView } from "./dnd-node-node-view";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export const DragHandle = ({
  className,
  ...props
}: Omit<ComponentProps<typeof GripVerticalIcon>, "ref">) => {
  const { isDragging, handleRef } = useDragDropNodeView();

  return (
    <GripVerticalIcon
      className={cn(
        "p-1 bg-white shadow rounded absolute top-1/2 -translate-y-1/2 -left-5 cursor-grab size-5",
        {
          inline: isDragging,
          "hidden group-hover:inline": !isDragging,
        },
        className,
      )}
      ref={handleRef}
      {...props}
    />
  );
};
