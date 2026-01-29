import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import { ComponentProps, createContext, useContext } from "react";
import { useDroppableNode } from "./use-droppable-node";
import { useDraggableNode } from "./use-draggable-node";
import { cn } from "@/lib/utils";

import { NodeName } from "../slides.utils";
import { useAcceptedNodes } from "./use-accepted-nodes";
import { CollisionPriority } from "./dnd.types";

type DragDropViewWrapperContext = {
  type?: NodeName;
  isDragging: boolean;
  isDropTarget: boolean;
  handleRef: (element: Element | null) => void;
};

const dragDropViewContext = createContext<
  DragDropViewWrapperContext | undefined
>(undefined);

type DragDropNodeViewProviderProps<T = HTMLElement> = Omit<
  ReactNodeViewProps<T>,
  "ref"
> &
  Pick<ComponentProps<"div">, "className" | "children"> & {
    collisionPriority?: CollisionPriority;
  };

export function DragDropNodeViewProvider<T = HTMLElement>({
  getPos,
  node,
  children,
  className,
  editor,
  collisionPriority,
}: DragDropNodeViewProviderProps<T>) {
  const type = node.type.name as NodeName;

  const { acceptedNodes } = useAcceptedNodes({ editor, getPos, node });

  const getNodeInfo = () => {
    if (!editor) return null;

    const pos = getPos();
    if (pos === undefined || pos === null) return null;

    const { doc } = editor.state;
    const $pos = doc.resolve(pos);

    const parent = $pos.parent;

    return {
      pos,
      name: node.type.name as NodeName,
      size: node.nodeSize,
      parentName: parent.type.name as NodeName,
    };
  };

  const { droppableRef, isDropTarget } = useDroppableNode({
    getNodeInfo,
    accept: acceptedNodes,
    collisionPriority,
  });

  const { draggableRef, handleRef, isDragging } = useDraggableNode({
    getNodeInfo,
    type,
  });

  const setRefs = (el: HTMLElement | null) => {
    droppableRef(el);
    draggableRef(el);
  };

  return (
    <dragDropViewContext.Provider
      value={{
        type,
        isDragging,
        isDropTarget,
        handleRef,
      }}
    >
      <NodeViewWrapper
        className={cn(
          "relative h-full",
          // we use this identifier for drag handles
          type ? `group/${type}` : "group",
          className,
        )}
        ref={setRefs}
      >
        {children}
      </NodeViewWrapper>
    </dragDropViewContext.Provider>
  );
}

export const useDragDropNodeView = () => {
  const ctx = useContext(dragDropViewContext);
  if (!ctx)
    throw new Error(
      "useDragDropNodeView should always be used within DragDropNodeViewProvider",
    );

  return ctx;
};
