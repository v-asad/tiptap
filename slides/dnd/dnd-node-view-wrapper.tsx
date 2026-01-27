import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import { PropsWithChildren } from "react";
import { useDroppableNode } from "./use-droppable-node";
import { useDraggableNode } from "./use-draggable-node";
import { cn } from "@/lib/utils";

import { GripVerticalIcon } from "lucide-react";

type DragDropNodeViewWrapperProps<T = HTMLElement> = ReactNodeViewProps<T> &
  PropsWithChildren;

export function DragDropNodeViewWrapper<T = HTMLElement>({
  getPos,
  node,
  children,
}: DragDropNodeViewWrapperProps<T>) {
  const { droppableRef, isDropTarget, dropCursorPos } = useDroppableNode({
    getPos: getPos,
    size: node.nodeSize,
  });

  const { draggableRef, handleRef, isDragging } = useDraggableNode({
    getPos: getPos,
    size: node.nodeSize,
  });

  return (
    <NodeViewWrapper ref={droppableRef}>
      <div className="relative p-4 group" ref={draggableRef}>
        {isDragging ||
          (isDropTarget && (
            <div
              className={cn(
                "absolute bg-blue-500 transition-opacity duration-100",
                {
                  "top-0 left-0 w-full h-px": dropCursorPos === "TOP",
                  "bottom-0 right-0 w-px h-full": dropCursorPos === "RIGHT",
                  "bottom-0 right-0 w-full h-px": dropCursorPos === "BOTTOM",
                  "top-0 left-0 w-px h-full": dropCursorPos === "LEFT",
                },
              )}
            />
          ))}

        <GripVerticalIcon
          className={cn(
            "p-1 bg-white shadow rounded absolute top-1/2 -translate-y-1/2 -left-5 cursor-grab size-5",
            {
              inline: isDragging,
              "hidden group-hover:inline": !isDragging,
            },
          )}
          ref={handleRef}
        />

        {children}
      </div>
    </NodeViewWrapper>
  );
}
