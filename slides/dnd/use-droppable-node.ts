import { useMemo } from "react";
import { CollisionPriority, Coords, NodeParams } from "./dnd.types";
import { DropCursorPos, useSlideEditorContext } from "../ctx/use-slide-editor";
import { useDragDropMonitor, useDroppable } from "@dnd-kit/react";
import { pointerIntersection } from "@dnd-kit/collision";
import { NodeName } from "../slides.utils";
import { getAllowedDropCursorPositions } from "./dnd.utils";

type UseDroppableNodeParams = NodeParams & {
  accept?: NodeName | NodeName[];
  collisionPriority?: CollisionPriority;
};

export const useDroppableNode = ({
  getNodeInfo,
  accept,
  collisionPriority = CollisionPriority.Normal,
}: UseDroppableNodeParams) => {
  const droppableId = useMemo(() => crypto.randomUUID(), []);

  const { editor, dropCursorPos, activeNode, setDropTarget, setDropCursorPos } =
    useSlideEditorContext();

  const {
    ref: droppableRef,
    droppable,
    isDropTarget,
  } = useDroppable({
    id: droppableId,
    collisionDetector: pointerIntersection,
    collisionPriority,
    accept,
  });

  const findNearestEdge = ({ x, y }: Coords) => {
    const rect = droppable.shape?.boundingRectangle;

    const dropCursorPosAllowance = getAllowedDropCursorPositions(getNodeInfo());

    if (!rect) return;

    const aspectRatio = rect.width / rect.height;
    const horizontalThreshold =
      aspectRatio > 1 ? Math.min(50, rect.width * 0.1) : 0;

    const top = Math.abs(y - rect.top);
    const right = Math.abs(x - rect.right) - horizontalThreshold;
    const bottom = Math.abs(y - rect.bottom);
    const left = Math.abs(x - rect.left) - horizontalThreshold;

    const edgeDistancesToCompute = [];

    if (dropCursorPosAllowance.TOP) edgeDistancesToCompute.push(top);
    if (dropCursorPosAllowance.RIGHT) edgeDistancesToCompute.push(right);
    if (dropCursorPosAllowance.BOTTOM) edgeDistancesToCompute.push(bottom);
    if (dropCursorPosAllowance.LEFT) edgeDistancesToCompute.push(left);

    const min = Math.min(...edgeDistancesToCompute);

    let edge: DropCursorPos | null = null;

    if (dropCursorPosAllowance.TOP && min === top) edge = "TOP";
    if (dropCursorPosAllowance.RIGHT && min === right) edge = "RIGHT";
    if (dropCursorPosAllowance.BOTTOM && min === bottom) edge = "BOTTOM";
    if (dropCursorPosAllowance.LEFT && min === left) edge = "LEFT";

    if (edge) {
      setDropCursorPos(edge);
      setDropTarget(droppableId);
    }
  };

  const handleDragEnd = () => {
    if (!editor) return;
    if (!activeNode) return;

    const nodeInfo = getNodeInfo();
    if (nodeInfo === null) return;

    let targetPos = nodeInfo.pos;

    const sourceNode = editor.state.doc.nodeAt(activeNode.pos);
    if (!sourceNode) return;

    const tr = editor.state.tr;

    let insertionOffset = 0;

    switch (dropCursorPos) {
      case "TOP":
      case "LEFT":
        insertionOffset = 0;
        break;
      case "RIGHT":
      case "BOTTOM":
        insertionOffset = nodeInfo.size;
        break;
    }

    tr.delete(activeNode.pos, activeNode.pos + activeNode.size);

    targetPos = tr.mapping.map(targetPos + insertionOffset);

    tr.insert(targetPos, sourceNode);

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
