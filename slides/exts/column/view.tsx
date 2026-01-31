import { NodePos, NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";
import { cn } from "@/lib/utils";
import { NodeActions } from "@/slides/node-actions";
import { useRef } from "react";

export const ColumnView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  const { editor, getPos } = props;

  const startPosXRef = useRef<number>(0);
  const insertionPosRef = useRef<number>(0);
  const columnIndexRef = useRef<number>(0);
  const startWidthsRef = useRef<Array<number>>([]);

  const resizeRef = useRef<HTMLDivElement>(null);

  const resize = (e: MouseEvent) => {
    const dx = e.clientX - startPosXRef.current;

    const columnIndex = columnIndexRef.current;
    const startWidths = startWidthsRef.current;

    // Convert deltaX to "fr" units
    // For simplicity, assume total width = sum of columns * 100px per fr (or measure row width)
    const rowElement = (e.target as HTMLElement).closest(
      ".node-row",
    ) as HTMLElement;
    if (!rowElement) return;
    const totalWidth = rowElement.offsetWidth;
    const frUnit = totalWidth / startWidths.reduce((a, b) => a + b, 0);
    const deltaFr = dx / frUnit;

    // Update columns
    const columnWidths = [...startWidths];

    columnWidths[columnIndex] = startWidths[columnIndex] + deltaFr;
    columnWidths[columnIndex + 1] = startWidths[columnIndex + 1] - deltaFr;

    const tr = editor.state.tr.setNodeMarkup(
      insertionPosRef.current,
      undefined,
      {
        columnWidths,
      },
    );

    editor.view.dispatch(tr);
  };

  const initiateResize = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection on mousedown

    const el = resizeRef.current;
    if (!el) return;

    startPosXRef.current = e.clientX;

    const columnPos = getPos();
    if (columnPos === null || columnPos === undefined) return;

    const resolvedPos = editor.state.doc.resolve(columnPos);

    const row = new NodePos(resolvedPos, editor);

    insertionPosRef.current = row.range.from - 1;

    startWidthsRef.current = [...row.node.attrs.columnWidths];

    columnIndexRef.current = resolvedPos.index() - 1;

    // Disable text selection during resize
    document.body.style.userSelect = "none";

    const handleMouseUp = () => {
      // Re-enable text selection
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.Low}
      className={cn(
        "py-2 px-6 border border-transparent group-hover/row:border-border",
      )}
      {...props}
    >
      <DropCursor />
      <NodeActions dragHandleProps={{ pos: "top" }} {...props} />

      <NodeViewContent className="outline-none" contentEditable={false} />

      <div
        contentEditable={false}
        className="group/col-control w-4 flex items-center justify-center h-full absolute left-0 top-0 z-2 -translate-x-1/2"
      >
        <div
          ref={resizeRef}
          contentEditable={false}
          onMouseDown={initiateResize}
          id="resize-handle"
          className="hidden group-hover/col-control:flex h-full w-0 group-hover/col-control:w-1 cursor-col-resize bg-blue-400 rounded"
        />
      </div>
    </DragDropNodeViewProvider>
  );
};
