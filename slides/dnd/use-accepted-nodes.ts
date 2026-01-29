import { ReactNodeViewProps } from "@tiptap/react";
import { NodeName } from "../slides.utils";
import { useMemo } from "react";

type UseAcceptedNodesParams<T> = Pick<
  ReactNodeViewProps<T>,
  "getPos" | "editor" | "node"
>;

const LEAF_NODES = [NodeName.HEADING, NodeName.PARAGRAPH];
const BRANCH_NODES = [NodeName.COLUMN, NodeName.ROW];

export const useAcceptedNodes = <T>({
  editor,
  getPos,
  node,
}: UseAcceptedNodesParams<T>) => {
  const nodeName = useMemo(() => node.type.name as NodeName, [node]);

  const parentName = useMemo(() => {
    const pos = getPos();
    if (pos === undefined || pos === null) return null;

    return editor.state.doc.resolve(pos).parent.type.name as NodeName;
  }, [getPos, editor]);

  const acceptedNodes = useMemo(() => {
    switch (nodeName) {
      case NodeName.HEADING:
      case NodeName.PARAGRAPH:
        if (parentName === NodeName.DOC)
          return [...LEAF_NODES, ...BRANCH_NODES];
        return LEAF_NODES;

      case NodeName.COLUMN:
        return [...LEAF_NODES, NodeName.COLUMN];

      case NodeName.ROW:
        return [NodeName.ROW];
    }
  }, [nodeName, parentName]);

  return { acceptedNodes, nodeName, parentName };
};
