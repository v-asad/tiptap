import { Editor } from "@tiptap/core";
import { DropCursorPos } from "../ctx/use-slide-editor";
import { NodeName } from "../slides.utils";
import { NodeInfo, NodeType } from "./dnd.types";
import { Fragment } from "@tiptap/pm/model";

type DropCursorPosAllowance = Record<DropCursorPos, boolean>;

export const isLeafNode = (name: NodeName) => {
  switch (name) {
    case NodeName.HEADING:
    case NodeName.PARAGRAPH:
      return true;

    default:
      return false;
  }
};

export const getAllowedDropCursorPositions = (
  nodeInfo: NodeInfo | null,
): DropCursorPosAllowance => {
  if (!nodeInfo)
    return { TOP: false, RIGHT: false, BOTTOM: false, LEFT: false };

  if (isLeafNode(nodeInfo.name)) return getLeafNodeDropCursorPos(nodeInfo);

  if (nodeInfo.name === NodeName.COLUMN)
    return { TOP: false, RIGHT: true, BOTTOM: false, LEFT: true };

  if (nodeInfo.name === NodeName.ROW)
    return { TOP: true, RIGHT: true, BOTTOM: true, LEFT: true };

  return { TOP: false, RIGHT: false, BOTTOM: false, LEFT: false };
};

const getLeafNodeDropCursorPos = ({
  parentName,
}: NodeInfo): DropCursorPosAllowance => {
  if (parentName === NodeName.DOC)
    return { TOP: true, RIGHT: true, BOTTOM: true, LEFT: true };

  return { TOP: true, RIGHT: false, BOTTOM: true, LEFT: false };
};

export const getModdedSourceNode = (
  editor: Editor,
  dropCursorPos: DropCursorPos,
  sourceNode: NodeType,
  targetNodeInfo: NodeInfo,
): { moddedNode: NodeType; deleteOriginalNode: boolean } => {
  if (dropCursorPos === "TOP" || dropCursorPos === "BOTTOM")
    return { moddedNode: sourceNode, deleteOriginalNode: false };

  const isTargetNodeALeaf = isLeafNode(targetNodeInfo.name);
  const isSourceNodeALeaf = isLeafNode(sourceNode.type.name as NodeName);

  const columnNodeType = editor.state.schema.nodes[NodeName.COLUMN];
  const rowNodeType = editor.state.schema.nodes[NodeName.ROW];

  // Case 1 => target: leaf, source: leaf
  if (isTargetNodeALeaf && isSourceNodeALeaf) {
    const targetNode = editor.state.doc.nodeAt(targetNodeInfo.pos);
    const leftColumn = columnNodeType.create(null, targetNode);

    const rightColumn = columnNodeType.create(null, sourceNode);

    const columns = [leftColumn, rightColumn];

    const row = rowNodeType.create(
      null,
      Fragment.fromArray(
        dropCursorPos === "RIGHT" ? columns : columns.reverse(),
      ),
    );

    return { moddedNode: row, deleteOriginalNode: true };
  }

  // Case 2 => target: branch, source: leaf
  if (!isTargetNodeALeaf && isSourceNodeALeaf) {
    const column = columnNodeType.create(null, sourceNode);
    return { moddedNode: column, deleteOriginalNode: false };
  }

  // Case 3 => target: leaf, source: branch
  if (isTargetNodeALeaf && !isSourceNodeALeaf) {
    const targetNode = editor.state.doc.nodeAt(targetNodeInfo.pos);
    const leftColumn = columnNodeType.create(null, targetNode);

    const columns = [leftColumn, sourceNode];

    const row = rowNodeType.create(
      null,
      Fragment.fromArray(
        dropCursorPos === "RIGHT" ? columns : columns.reverse(),
      ),
    );

    return { moddedNode: row, deleteOriginalNode: true };
  }

  // Case 4 => target: branch, source: branch
  return { moddedNode: sourceNode, deleteOriginalNode: false };
};
