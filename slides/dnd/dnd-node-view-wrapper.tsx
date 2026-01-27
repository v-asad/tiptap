import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import { ComponentProps } from "react";
import { useDroppableNode } from "./use-droppable-node";
import { useDraggableNode } from "./use-draggable-node";
import { cn } from "@/lib/utils";

import { GripVerticalIcon } from "lucide-react";
import { useSlideEditorContext } from "../ctx/use-slide-editor";
import { NodeName } from "../slides.utils";

type DragDropNodeViewWrapperProps<T = HTMLElement> = Omit<
  ReactNodeViewProps<T>,
  "ref"
> &
  Pick<ComponentProps<"div">, "className" | "children"> & {
    type?: NodeName;
    accept?: NodeName | NodeName[];
  };

export function DragDropNodeViewWrapper<T = HTMLElement>({
  getPos,
  node,
  children,
  className,
  type,
  accept,
}: DragDropNodeViewWrapperProps<T>) {
  const getNodeInfo = () => {
    if (!editor) return null;

    const pos = getPos();
    if (pos === undefined || pos === null) return null;

    const { doc } = editor.state;
    const $pos = doc.resolve(pos);

    const parent = $pos.parent;

    return {
      pos,
      name: node.type.name,
      size: node.nodeSize,
      parentName: parent.type.name,
    };
  };

  const { droppableRef, isDropTarget, dropCursorPos } = useDroppableNode({
    getNodeInfo,
    accept,
  });

  const { draggableRef, handleRef, isDragging } = useDraggableNode({
    getNodeInfo,
    type,
  });

  const { editor } = useSlideEditorContext();

  return (
    <NodeViewWrapper ref={droppableRef}>
      <div className={cn("relative p-4 group", className)} ref={draggableRef}>
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
