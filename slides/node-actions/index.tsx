import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { ComponentProps, useState } from "react";
import { DragHandle } from "../dnd/drag-handle";
import { ReactNodeViewProps } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

type NodeActionsProps<T> = ReactNodeViewProps<T> & {
  dragHandleProps?: ComponentProps<typeof DragHandle>;
};

export function NodeActions<T>({
  editor,
  getPos,
  dragHandleProps = {},
}: NodeActionsProps<T>) {
  const [open, setOpen] = useState(false);

  const selectAll = () => {
    const pos = getPos();
    if (pos === null || pos === undefined) return;

    const node = editor.view.state.doc.nodeAt(pos);
    if (!node) return;

    const from = pos + 1;
    const to = pos + node.nodeSize - 1;

    const tr = editor.state.tr.setSelection(
      TextSelection.create(editor.state.doc, from, to),
    );

    editor.view.dispatch(tr);
    editor.view.focus();
  };

  const deleteNode = () => {
    const pos = getPos();
    if (pos === null || pos === undefined) return;

    const node = editor.view.state.doc.nodeAt(pos);
    if (!node) return;

    const tr = editor.state.tr.delete(pos, pos + node.nodeSize);

    editor.view.dispatch(tr);
    editor.view.focus();
  };

  const handleClick = () => {
    setOpen((p) => !p);
    selectAll();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor>
        <DragHandle
          className="cursor-pointer"
          shouldStayVisible={open}
          onClick={handleClick}
          {...dragHandleProps}
        />
      </PopoverAnchor>

      <PopoverContent align="start" side="top" className="p-2">
        <Button
          size="icon-sm"
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={() => deleteNode()}
        >
          <Trash2Icon />
        </Button>
      </PopoverContent>
    </Popover>
  );
}
