import { ReactNodeViewProps, useReactNodeView } from "@tiptap/react";
import { useEffect, useRef } from "react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";

import { NodeActions } from "@/slides/node-actions";

export const BulletListView = (
  props: ReactNodeViewProps<HTMLUListElement>,
) => {
  const contentRef = useRef<HTMLUListElement>(null);
  const { nodeViewContentRef } = useReactNodeView();

  useEffect(() => {
    if (nodeViewContentRef) nodeViewContentRef(contentRef.current);
  }, [contentRef, nodeViewContentRef]);

  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.Normal}
      className="px-1 py-1"
      {...props}
    >
      <DropCursor />
      <NodeActions {...props} />

      <ul
        ref={contentRef}
        data-node-view-content=""
        className="outline-none list-disc pl-6 space-y-1"
      />
    </DragDropNodeViewProvider>
  );
};
