import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { ComponentProps, useState } from "react";
import { DragHandle } from "../dnd/drag-handle";
import { ReactNodeViewProps } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import { FontSizeDropdown } from "./font-size";
import { DeleteNode } from "./delete-node";

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

      <PopoverContent
        contentEditable={false}
        align="start"
        side="top"
        className="p-2 flex gap-2 items-center"
      >
        <DeleteNode editor={editor} getPos={getPos} />
        <FontSizeDropdown editor={editor} />
      </PopoverContent>
    </Popover>
  );
}
