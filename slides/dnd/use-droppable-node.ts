import { useMemo } from "react";
import { Coords, NodeParams } from "./dnd.types";
import { DropCursorPos, useSlideEditorContext } from "../ctx/use-slide-editor";
import { useDragDropMonitor, useDroppable } from "@dnd-kit/react";
import { closestCenter } from "@dnd-kit/collision";

export const useDroppableNode = ({ getNodeInfo }: NodeParams) => {
  const droppableId = useMemo(() => crypto.randomUUID(), []);

  const { editor, dropCursorPos, activeNode, setDropTarget, setDropCursorPos } =
    useSlideEditorContext();

  const {
    ref: droppableRef,
    droppable,
    isDropTarget,
  } = useDroppable({
    id: droppableId,
    collisionDetector: closestCenter,
  });

  const findNearestEdge = ({ x, y }: Coords) => {
    const rect = droppable.shape?.boundingRectangle;

    if (!rect) return;

    const aspectRatio = rect.width / rect.height;
    const horizontalThreshold = aspectRatio > 1 ? rect.width * 0.1 : 0;

    const top = Math.abs(y - rect.top);
    const right = Math.abs(x - rect.right) - horizontalThreshold;
    const bottom = Math.abs(y - rect.bottom);
    const left = Math.abs(x - rect.left) - horizontalThreshold;

    const min = Math.min(top, bottom, left, right);

    let edge: DropCursorPos = "LEFT";

    if (min === top) edge = "TOP";
    else if (min === right) edge = "RIGHT";
    else if (min === bottom) edge = "BOTTOM";

    setDropCursorPos(edge);
    setDropTarget(droppableId);
  };

  const handleDragEnd = () => {
    if (!editor) return;
    if (!activeNode) return;

    const nodeInfo = getNodeInfo();
    if (nodeInfo === null) return;

    let targetPos = nodeInfo.pos;

    const sourceNode = editor.state.doc.nodeAt(activeNode.pos);
    if (!sourceNode) return;

    // If dragging DOWN, deletion happens before insertion point
    if (activeNode.pos < targetPos) targetPos -= activeNode.size;

    const tr = editor.state.tr;

    const insertionOffset =
      dropCursorPos === "TOP"
        ? 0
        : dropCursorPos === "BOTTOM"
          ? nodeInfo.size
          : 0;

    tr.delete(activeNode.pos, activeNode.pos + activeNode.size);
    tr.insert(targetPos + insertionOffset, sourceNode);

    editor.view.dispatch(tr);
  };

  useDragDropMonitor({
    onDragMove({ operation: { target, position } }) {
      if (target?.id !== droppableId) return;
      findNearestEdge(position.current);
    },
    onDragEnd({ operation: { target } }) {
      if (target?.id !== droppableId) return;
      handleDragEnd();
    },
  });

  return { droppableRef, isDropTarget, dropCursorPos };
};
