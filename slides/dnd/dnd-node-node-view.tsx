import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";
import { ComponentProps, createContext, useContext } from "react";
import { useDroppableNode } from "./use-droppable-node";
import { useDraggableNode } from "./use-draggable-node";
import { cn } from "@/lib/utils";

import { useSlideEditorContext } from "../ctx/use-slide-editor";
import { NodeName } from "../slides.utils";

type DragDropViewWrapperContext = {
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
  Omit<ComponentProps<"div">, "ref"> & {
    type?: NodeName;
    accept?: NodeName | NodeName[];
  };

export function DragDropNodeViewProvider<T = HTMLElement>({
  getPos,
  node,
  type,
  accept,
  children,
  className,

  ...props
}: DragDropNodeViewProviderProps<T>) {
  const { editor } = useSlideEditorContext();

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

  const { droppableRef, isDropTarget } = useDroppableNode({
    getNodeInfo,
    accept,
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
        isDragging,
        isDropTarget,
        handleRef,
      }}
    >
      <NodeViewWrapper
        className={cn("relative p-4 group", className)}
        ref={setRefs}
        {...props}
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
