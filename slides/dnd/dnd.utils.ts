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

export const isListNode = (name: NodeName) => {
  return name === NodeName.BULLET_LIST || name === NodeName.ORDERED_LIST;
};

export const isListItemNode = (name: NodeName) => {
  return name === NodeName.LIST_ITEM;
};

// Nodes that can be converted to list items when dropped on a list item
export const canConvertToListItem = (name: NodeName) => {
  return (
    name === NodeName.PARAGRAPH ||
    name === NodeName.HEADING ||
    name === NodeName.LIST_ITEM
  );
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

  // List items can accept drops from list items, paragraphs, and headings (top/bottom only)
  // They cannot accept drops from rows, columns, or images
  if (isListItemNode(nodeInfo.name)) {
    if (canConvertToListItem(sourceNodeType)) {
      return { TOP: true, RIGHT: false, BOTTOM: true, LEFT: false };
    }
    return { TOP: false, RIGHT: false, BOTTOM: false, LEFT: false };
  }

  // Lists can accept drops from anything, but only on top/bottom
  if (isListNode(nodeInfo.name)) {
    return getListNodeDropCursorPos();
  }

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

const getListNodeDropCursorPos = (): DropCursorPosAllowance => {
  // Lists can accept drops from anything, but only on top/bottom (never left/right)
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

  const MAX_OFFSET = 50;

  const top = Math.abs(y - rect.top);
  const right = Math.abs(x - rect.right) - horizontalThreshold;
  const bottom = Math.abs(y - rect.bottom);
  const left = Math.abs(x - rect.left) - horizontalThreshold;

  const edgeDistancesToCompute = [];

  if (dropCursorPosAllowance.TOP && top < MAX_OFFSET)
    edgeDistancesToCompute.push(top);
  if (dropCursorPosAllowance.RIGHT && right < MAX_OFFSET)
    edgeDistancesToCompute.push(right);
  if (dropCursorPosAllowance.BOTTOM && bottom < MAX_OFFSET)
    edgeDistancesToCompute.push(bottom);
  if (dropCursorPosAllowance.LEFT && left < MAX_OFFSET)
    edgeDistancesToCompute.push(left);

  const min = Math.min(...edgeDistancesToCompute);

  let edge: DropCursorPos | null = null;

  if (dropCursorPosAllowance.TOP && min === top) edge = "TOP";
  if (dropCursorPosAllowance.RIGHT && min === right) edge = "RIGHT";
  if (dropCursorPosAllowance.BOTTOM && min === bottom) edge = "BOTTOM";
  if (dropCursorPosAllowance.LEFT && min === left) edge = "LEFT";

  return edge;
};

// Helper to check if a node can be placed in a column (leaf-like behavior for layout purposes)
const isColumnableNode = (name: NodeName) => {
  return isLeafNode(name) || isListNode(name);
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

    // Convert paragraphs/headings to list items when dropped on a list item
    if (isListItemNode(targetNodeInfo.name)) {
      const sourceTypeName = sourceNode.type.name as NodeName;

      // If source is already a list item, just return it
      if (isListItemNode(sourceTypeName)) {
        return { moddedNode: sourceNode, deleteOriginalNode: false };
      }

      // Convert paragraph or heading to list item
      if (
        sourceTypeName === NodeName.PARAGRAPH ||
        sourceTypeName === NodeName.HEADING
      ) {
        const listItemNodeType = editor.state.schema.nodes[NodeName.LIST_ITEM];
        const paragraphNodeType = editor.state.schema.nodes[NodeName.PARAGRAPH];

        // Create a paragraph with the content of the source node
        const newParagraph = paragraphNodeType.create(
          null,
          sourceNode.content,
          sourceNode.marks,
        );

        // Wrap in a list item
        const listItem = listItemNodeType.create(null, newParagraph);
        return { moddedNode: listItem, deleteOriginalNode: false };
      }
    }

    return { moddedNode: sourceNode, deleteOriginalNode: false };
  }

  const isTargetColumnable = isColumnableNode(targetNodeInfo.name);
  const isSourceColumnable = isColumnableNode(sourceNode.type.name as NodeName);

  const columnNodeType = editor.state.schema.nodes[NodeName.COLUMN];
  const rowNodeType = editor.state.schema.nodes[NodeName.ROW];

  // Case 1 => target: columnable (leaf/list), source: columnable (leaf/list)
  if (isTargetColumnable && isSourceColumnable) {
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

  // Case 2 => target: branch, source: columnable (leaf/list)
  if (!isTargetColumnable && isSourceColumnable) {
    const column = columnNodeType.create(COL_CONFIG.DEFAULT_ATTRS, sourceNode);
    return { moddedNode: column, deleteOriginalNode: false };
  }

  // Case 3 => target: columnable (leaf/list), source: branch
  if (isTargetColumnable && !isSourceColumnable) {
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
