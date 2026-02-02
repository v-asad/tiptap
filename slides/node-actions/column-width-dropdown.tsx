import { Editor } from "@tiptap/react";
import { ColumnsIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  getPresetsForColumnCount,
  getCurrentPreset,
  type ColumnWidthPreset,
} from "./column-width-presets";

type ColumnWidthDropdownProps = {
  editor: Editor;
  getPos: () => number | undefined;
};

export const ColumnWidthDropdown = ({
  editor,
  getPos,
}: ColumnWidthDropdownProps) => {
  const pos = getPos();
  if (pos === undefined) return null;

  const node = editor.state.doc.nodeAt(pos);
  if (!node) return null;

  const columnCount = node.childCount;
  const currentWidths: number[] = node.attrs.columnWidths || [];
  const presets = getPresetsForColumnCount(columnCount);

  if (columnCount < 2 || presets.length === 0) return null;

  const currentPreset = getCurrentPreset(columnCount, currentWidths);

  const updateColumnWidths = (preset: ColumnWidthPreset) => {
    const pos = getPos();
    if (pos === undefined) return;

    const tr = editor.state.tr.setNodeMarkup(pos, undefined, {
      columnWidths: preset.widths,
    });
    editor.view.dispatch(tr);
    editor.view.focus();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-1 items-center h-8 px-2"
        >
          <ColumnsIcon className="size-4" />
          <ChevronDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{columnCount} Column Layouts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {presets.map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onClick={() => updateColumnWidths(preset)}
            className={currentPreset?.id === preset.id ? "bg-accent" : ""}
          >
            <span className="flex-1">{preset.label}</span>
            {currentPreset?.id === preset.id && (
              <span className="text-xs text-primary ml-2">Active</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
