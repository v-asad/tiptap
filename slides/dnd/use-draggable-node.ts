import { useMemo } from "react";
import { NodeParams } from "./dnd.types";
import { useDragDropMonitor, useDraggable } from "@dnd-kit/react";
import { useSlideEditorContext } from "../ctx/use-slide-editor";

export const useDraggableNode = ({ getPos, size }: NodeParams) => {
  const draggableId = useMemo(() => crypto.randomUUID(), []);

  const {
    ref: draggableRef,
    handleRef,
    isDragging,
  } = useDraggable({ id: draggableId });

  const { setActiveNode } = useSlideEditorContext();

  useDragDropMonitor({
    onDragStart({ operation: { source } }) {
      if (source?.id !== draggableId) return;

      const pos = getPos();
      if (pos === undefined || pos === null) return;

      setActiveNode({ pos, size });
    },
  });

  return {
    draggableRef,
    handleRef,
    isDragging,
  };
};
