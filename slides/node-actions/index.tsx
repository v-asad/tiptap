import { ComponentProps } from "react";
import { DragHandle } from "../dnd/drag-handle";
import { ReactNodeViewProps } from "@tiptap/react";
import { TextSelection, NodeSelection } from "@tiptap/pm/state";
import { NodeName } from "@/slides/slides.utils";

type NodeActionsProps<T> = ReactNodeViewProps<T> & {
  dragHandleProps?: ComponentProps<typeof DragHandle>;
};

export function NodeActions<T>({
  editor,
  getPos,
  dragHandleProps = {},
}: NodeActionsProps<T>) {
  const handleClick = () => {
    const pos = getPos();
    if (pos === null || pos === undefined) return;

    const node = editor.view.state.doc.nodeAt(pos);
    if (!node) return;

    const nodeType = node.type.name;

    // For text nodes (paragraph, heading): select all text content
    if (nodeType === NodeName.PARAGRAPH || nodeType === NodeName.HEADING) {
      const from = pos + 1;
      const to = pos + node.nodeSize - 1;

      const tr = editor.state.tr.setSelection(
        TextSelection.create(editor.state.doc, from, to),
      );

      editor.view.dispatch(tr);
    } else {
      // For row, column, image, chart: create NodeSelection
      const tr = editor.state.tr.setSelection(
        NodeSelection.create(editor.state.doc, pos),
      );

      editor.view.dispatch(tr);
    }

    editor.view.focus();
  };

  return (
    <DragHandle
      className="cursor-pointer"
      onClick={handleClick}
      {...dragHandleProps}
    />
  );
}
