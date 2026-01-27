import { ComponentProps } from "react";
import { useSlideEditorContext } from "../ctx/use-slide-editor";
import { useDragDropNodeView } from "./dnd-node-view-wrapper";
import { cn } from "@/lib/utils";

export const DropCursor = ({ className, ...props }: ComponentProps<"div">) => {
  const { isDragging, isDropTarget } = useDragDropNodeView();
  const { dropCursorPos } = useSlideEditorContext();

  if (isDragging) return null;
  if (!isDropTarget) return null;

  return (
    <div
      className={cn(
        "absolute bg-blue-500 transition-opacity duration-100",
        {
          "top-0 left-0 w-full h-px": dropCursorPos === "TOP",
          "bottom-0 right-0 w-px h-full": dropCursorPos === "RIGHT",
          "bottom-0 right-0 w-full h-px": dropCursorPos === "BOTTOM",
          "top-0 left-0 w-px h-full": dropCursorPos === "LEFT",
        },
        className,
      )}
      {...props}
    />
  );
};
