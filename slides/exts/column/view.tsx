import { NodeViewContent, ReactNodeViewProps } from "@tiptap/react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";

import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";
import { cn } from "@/lib/utils";
import { NodeActions } from "@/slides/node-actions";
import { useMemo } from "react";
import { NodeName } from "@/slides/slides.utils";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const ColumnView = (props: ReactNodeViewProps<HTMLParagraphElement>) => {
  const { getPos, editor } = props;

  const $pos = useMemo(() => {
    const pos = getPos();
    if (pos === null || pos === undefined) return null;

    const $pos = editor.state.doc.resolve(pos);
    if ($pos.parent.type.name !== NodeName.ROW) return null;

    return $pos;
  }, [editor, getPos]);

  const index = $pos ? $pos.index() : -1;

  const isLast = index === ($pos?.parent.childCount ?? 0) - 1;

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

      <NodeViewContent className="outline-none" />

      <div
        contentEditable={false}
        className="group/col-control w-8 flex items-center justify-center h-full absolute right-0 top-0 z-2 translate-x-1/2"
      >
        {isLast ? (
          <Button
            contentEditable={false}
            variant="outline"
            size="icon-sm"
            className="rounded-full  bg-background cursor-pointer hidden group-hover/row:flex"
          >
            <PlusIcon />
          </Button>
        ) : (
          <div
            contentEditable={false}
            className="hidden group-hover/col-control:flex h-full w-0 group-hover/col-control:w-1 cursor-col-resize bg-blue-400 rounded"
          />
        )}
      </div>
    </DragDropNodeViewProvider>
  );
};
