import { DropCursorPos } from "../ctx/use-slide-editor";
import { NodeName } from "../slides.utils";
import { NodeInfo } from "./dnd.types";

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
