import { useMemo } from "react";
import { NodeParams } from "./dnd.types";
import { useDragDropMonitor, useDraggable } from "@dnd-kit/react";
import { useSlideEditorContext } from "../ctx/use-slide-editor";
import { NodeName } from "../slides.utils";

type UseDraggableNodeParams = NodeParams & {
  type?: NodeName;
};

export const useDraggableNode = ({
  getNodeInfo,
  type,
}: UseDraggableNodeParams) => {
  const draggableId = useMemo(() => crypto.randomUUID(), []);

  const {
    ref: draggableRef,
    handleRef,
    isDragging,
  } = useDraggable({ id: draggableId, type });

  const { setActiveNode } = useSlideEditorContext();

  useDragDropMonitor({
    onDragStart({ operation: { source } }) {
      if (source?.id !== draggableId) return;

      const nodeInfo = getNodeInfo();

      if (nodeInfo === null) return;

      setActiveNode({ pos: nodeInfo.pos, size: nodeInfo.size });
    },
  });

  return {
    draggableRef,
    handleRef,
    isDragging,
  };
};
