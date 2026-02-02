import { ComponentProps } from "react";
import { DragHandle } from "../dnd/drag-handle";
import { ReactNodeViewProps } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

type DeleteNodeProps<T> = Pick<
  ReactNodeViewProps<T> & {
    dragHandleProps?: ComponentProps<typeof DragHandle>;
  },
  "getPos" | "editor"
>;

export function DeleteNode<T>({ getPos, editor }: DeleteNodeProps<T>) {
  const deleteNode = () => {
    const pos = getPos();
    if (pos === null || pos === undefined) return;

    const node = editor.view.state.doc.nodeAt(pos);
    if (!node) return;

    const tr = editor.state.tr.delete(pos, pos + node.nodeSize);

    editor.view.dispatch(tr);
    editor.view.focus();
  };

  return (
    <Button
      size="icon-sm"
      variant="ghost"
      className="text-destructive hover:text-destructive"
      onClick={() => deleteNode()}
    >
      <Trash2Icon />
    </Button>
  );
}
