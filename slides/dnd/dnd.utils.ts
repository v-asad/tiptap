import { Editor } from "@tiptap/core";
import { NodeName } from "../slides.utils";
import {
  BoundingRect,
  Coords,
  DropCursorPos,
  NodeInfo,
  NodeType,
} from "./dnd.types";
import { Fragment } from "@tiptap/pm/model";
import { ROW_CONFIG } from "../exts/row/config";
import { COL_CONFIG } from "../exts/column/config";

export type DropCursorPosAllowance = Record<DropCursorPos, boolean>;

export const isLeafNode = (name: NodeName) => {
  switch (name) {
    case NodeName.HEADING:
    case NodeName.PARAGRAPH:
    case NodeName.IMAGE:
      return true;

    default:
      return false;
  }
};

const findRowChildCountUsingColumnPos = (
  editor: Editor | null,
  columnPos: number,
): number => {
  if (!editor) return 0;

  const parent = editor.state.doc.resolve(columnPos).parent;
  if (parent.type.name !== NodeName.ROW) return 0;

  return parent.childCount;
};

export const getAllowedDropCursorPositions = (
  nodeInfo: NodeInfo | null,
  sourceNodeType: NodeName,
  editor: Editor | null,
): DropCursorPosAllowance => {
  if (!nodeInfo)
    return { TOP: false, RIGHT: false, BOTTOM: false, LEFT: false };

  if (isLeafNode(nodeInfo.name))
    return getLeafNodeDropCursorPos(nodeInfo, sourceNodeType);

  if (nodeInfo.name === NodeName.COLUMN) {
    // check parent child count before allowing here
    const childCountForThisRow = findRowChildCountUsingColumnPos(
      editor,
      nodeInfo.pos,
    );

    if (childCountForThisRow < ROW_CONFIG.MAX_COL_COUNT) {
      return { TOP: false, RIGHT: true, BOTTOM: false, LEFT: true };
    } else {
      return { TOP: false, RIGHT: false, BOTTOM: false, LEFT: false };
    }
  }

  if (nodeInfo.name === NodeName.ROW)
    return { TOP: true, RIGHT: false, BOTTOM: true, LEFT: false };

  return { TOP: false, RIGHT: false, BOTTOM: false, LEFT: false };
};

const getLeafNodeDropCursorPos = (
  { parentName }: NodeInfo,
  sourceNodeType: NodeName,
): DropCursorPosAllowance => {
  if (parentName === NodeName.DOC)
    if (sourceNodeType === NodeName.ROW)
      return { TOP: true, RIGHT: false, BOTTOM: true, LEFT: false };
    else return { TOP: true, RIGHT: true, BOTTOM: true, LEFT: true };

  return { TOP: true, RIGHT: false, BOTTOM: true, LEFT: false };
};

export const findNearestEdge = (
  rect: BoundingRect | undefined,
  { x, y }: Coords,
  dropCursorPosAllowance: DropCursorPosAllowance,
) => {
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

  return edge;
};

export const getModdedSourceNode = (
  editor: Editor,
  dropCursorPos: DropCursorPos | null,
  sourceNode: NodeType,
  targetNodeInfo: NodeInfo,
): { moddedNode: NodeType; deleteOriginalNode: boolean } => {
  if (dropCursorPos === "TOP" || dropCursorPos === "BOTTOM") {
    // For row nodes, explicitly copy with preserved columnWidths attribute
    if (sourceNode.type.name === NodeName.ROW) {
      const rowNodeType = editor.state.schema.nodes[NodeName.ROW];
      const copiedRow = rowNodeType.create(
        { columnWidths: sourceNode.attrs.columnWidths || [1, 1, 1] },
        sourceNode.content,
        sourceNode.marks,
      );
      return { moddedNode: copiedRow, deleteOriginalNode: false };
    }
    return { moddedNode: sourceNode, deleteOriginalNode: false };
  }

  const isTargetNodeALeaf = isLeafNode(targetNodeInfo.name);
  const isSourceNodeALeaf = isLeafNode(sourceNode.type.name as NodeName);

  const columnNodeType = editor.state.schema.nodes[NodeName.COLUMN];
  const rowNodeType = editor.state.schema.nodes[NodeName.ROW];

  // Case 1 => target: leaf, source: leaf
  if (isTargetNodeALeaf && isSourceNodeALeaf) {
    const targetNode = editor.state.doc.nodeAt(targetNodeInfo.pos);
    const leftColumn = columnNodeType.create(
      COL_CONFIG.DEFAULT_ATTRS,
      targetNode,
    );

    const rightColumn = columnNodeType.create(
      COL_CONFIG.DEFAULT_ATTRS,
      sourceNode,
    );

    const columns = [leftColumn, rightColumn];

    // Create row with proper columnWidths for 2 columns
    const row = rowNodeType.create(
      { columnWidths: [1, 1] },
      Fragment.fromArray(
        dropCursorPos === "RIGHT" ? columns : columns.reverse(),
      ),
    );

    return { moddedNode: row, deleteOriginalNode: true };
  }

  // Case 2 => target: branch, source: leaf
  if (!isTargetNodeALeaf && isSourceNodeALeaf) {
    const column = columnNodeType.create(COL_CONFIG.DEFAULT_ATTRS, sourceNode);
    return { moddedNode: column, deleteOriginalNode: false };
  }

  // Case 3 => target: leaf, source: branch
  if (isTargetNodeALeaf && !isSourceNodeALeaf) {
    const targetNode = editor.state.doc.nodeAt(targetNodeInfo.pos);
    const leftColumn = columnNodeType.create(
      COL_CONFIG.DEFAULT_ATTRS,
      targetNode,
    );

    const columns = [leftColumn, sourceNode];

    // Create row with proper columnWidths for 2 columns
    const row = rowNodeType.create(
      { columnWidths: [1, 1] },
      Fragment.fromArray(
        dropCursorPos === "RIGHT" ? columns : columns.reverse(),
      ),
    );

    return { moddedNode: row, deleteOriginalNode: true };
  }

  // Case 4 => target: branch, source: branch
  return { moddedNode: sourceNode, deleteOriginalNode: false };
};
