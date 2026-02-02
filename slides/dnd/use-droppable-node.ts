import { useMemo } from "react";
import {
  CollisionPriority,
  Coords,
  DropCursorPos,
  NodeParams,
} from "./dnd.types";
import { useSlideEditorContext } from "../ctx/use-slide-editor";
import { useDragDropMonitor, useDroppable } from "@dnd-kit/react";
import { pointerIntersection } from "@dnd-kit/collision";
import { NodeName } from "../slides.utils";
import {
  findNearestEdge,
  getAllowedDropCursorPositions,
  getModdedSourceNode,
} from "./dnd.utils";

type UseDroppableNodeParams = NodeParams & {
  accept?: NodeName | NodeName[];
  collisionPriority?: CollisionPriority;

  dropCursorPos: DropCursorPos | null;
  setDropCursorPos: (value: DropCursorPos | null) => void;
};

export const useDroppableNode = ({
  getNodeInfo,
  accept,
  collisionPriority = CollisionPriority.Normal,
  dropCursorPos,
  setDropCursorPos,
}: UseDroppableNodeParams) => {
  const droppableId = useMemo(() => crypto.randomUUID(), []);

  const { editor, activeNode, setDropTarget } = useSlideEditorContext();

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

  const handleDragMove = (coords: Coords, sourceNodeType: NodeName) => {
    const nodeInfo = getNodeInfo();

    const dropCursorPosAllowance = getAllowedDropCursorPositions(
      nodeInfo,
      sourceNodeType,
      editor,
    );

    const edge = findNearestEdge(
      droppable.shape?.boundingRectangle,
      coords,
      dropCursorPosAllowance,
    );

    if (edge) {
      setDropCursorPos(edge);
      setDropTarget(droppableId);
    } else {
      setDropCursorPos(null);
      setDropTarget(undefined);
    }
  };

  const handleDragEnd = () => {
    if (!editor) return;
    if (!activeNode) return;

    const nodeInfo = getNodeInfo();
    if (nodeInfo === null) return;

    const targetPos = nodeInfo.pos;

    const sourceNode = editor.state.doc.nodeAt(activeNode.pos);
    if (!sourceNode) return;

    // Use the actual node size from the current document state
    const sourceNodeSize = sourceNode.nodeSize;

    // Don't do anything if dragging to the same position
    if (activeNode.pos === targetPos) return;

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

    const { moddedNode, deleteOriginalNode } = getModdedSourceNode(
      editor,
      dropCursorPos,
      sourceNode,
      {
        ...nodeInfo,
        pos: targetPos,
      },
    );

    tr.delete(activeNode.pos, activeNode.pos + sourceNodeSize);

    const targetPosWithOffset = tr.mapping.map(targetPos + insertionOffset);

    tr.insert(targetPosWithOffset, moddedNode);

    if (deleteOriginalNode) {
      const targetPosAfterInsertion = tr.mapping.map(nodeInfo.pos);
      tr.delete(
        targetPosAfterInsertion,
        targetPosAfterInsertion + nodeInfo.size,
      );
    }

    editor.view.dispatch(tr);
  };

  useDragDropMonitor({
    onDragMove({ operation: { target, position, source } }) {
      if (target?.id !== droppableId || !source) return;

      handleDragMove(position.current, source.type as NodeName);
    },
    onDragEnd({ operation: { target } }) {
      if (target?.id !== droppableId) return;

      handleDragEnd();
    },
  });

  return { droppableRef, isDropTarget, dropCursorPos };
};
