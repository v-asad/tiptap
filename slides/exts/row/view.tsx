import { ReactNodeViewProps, useReactNodeView } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";
import { NodeActions } from "@/slides/node-actions";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { getNodeAttributes, NodeName } from "@/slides/slides.utils";
import { COL_CONFIG } from "../column/config";
import { ROW_CONFIG } from "./config";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export const RowView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  const childCount = props.node.childCount;
  const columnWidths = props.node.attrs.columnWidths;

  const shouldShowAddColButton = childCount < ROW_CONFIG.MAX_COL_COUNT;

  const contentRef = useRef<HTMLDivElement>(null);

  const { nodeViewContentRef } = useReactNodeView();

  useEffect(() => {
    if (nodeViewContentRef) nodeViewContentRef(contentRef.current);
  }, [contentRef, nodeViewContentRef]);

  // Compute grid template columns from widths
  const gridTemplateColumns: string = columnWidths?.length
    ? columnWidths.map((width: number) => `${width}fr`).join(" ")
    : "1fr";

  const handleAddColumn = () => {
    const { editor, node } = props;

    const $pos = getNodeAttributes(props);

    const pos = $pos?.pos;
    if (pos === null || pos === undefined) return;

    const paragraphNodeType = editor.state.schema.nodes[NodeName.PARAGRAPH];
    const columnNodeType = editor.state.schema.nodes[NodeName.COLUMN];

    const newParagraph = paragraphNodeType.create();
    const newColumn = columnNodeType.create(
      COL_CONFIG.DEFAULT_ATTRS,
      newParagraph,
    );

    // Update columnWidths array to include new column with default width of 1
    const currentWidths = node.attrs.columnWidths || [];
    const newColumnWidths = [...currentWidths, 1];

    const tr = editor.state.tr;
    // First insert the new column
    tr.insert(pos + node.nodeSize - 1, newColumn);
    // Then update the row's columnWidths attribute
    tr.setNodeMarkup(pos, undefined, { columnWidths: newColumnWidths });
    editor.view.dispatch(tr);
  };

  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.Low}
      className="my-4"
      data-node-type="row"
      {...props}
    >
      <DropCursor />
      <NodeActions {...props} />

      <div
        ref={contentRef}
        data-node-view-content=""
        className={cn(
          "outline-none whitespace-normal",
          "[&>div]:grid [&>div]:grid-flow-col [&>div]:grid-cols-(--grid-cols)",
          
          // must hide resize handle for first column
          "[&_.node-column:first-child_#resize-handle]:hidden!",
        )}
        // Pass grid-template-columns via CSS variable to child
        style={{ "--grid-cols": gridTemplateColumns } as React.CSSProperties}
      />

      {shouldShowAddColButton && (
        <Button
          contentEditable={false}
          variant="outline"
          size="icon-sm"
          className="rounded-full bg-background cursor-pointer hidden group-hover/row:flex absolute right-0 top-1/2 z-2 translate-x-1/2 -translate-y-1/2"
          onClick={handleAddColumn}
        >
          <PlusIcon />
        </Button>
      )}
    </DragDropNodeViewProvider>
  );
};
