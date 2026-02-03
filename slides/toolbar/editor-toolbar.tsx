"use client";

import { ThemeDropdown } from "@/components/theme-dropdown";
import { LayoutDropdown } from "@/components/layout-dropdown";
import { ExportTemplate } from "../template-actions/export-template";
import { ImportTemplate } from "../template-actions/import-template";
import { FontFamilyDropdown } from "../node-actions/font-family-dropdown";
import { FontSizeDropdown } from "../node-actions/font-size";
import { TextFormatButtons } from "../node-actions/text-format-buttons";
import { TextAlignDropdown } from "../node-actions/text-align-dropdown";
import { useSlideEditorContext } from "../ctx/use-slide-editor";
import { NodeName } from "../slides.utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash2Icon,
  TypeIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  TextIcon,
  CaseSensitiveIcon,
  TextQuoteIcon,
  ImageIcon,
  BarChart3,
  LineChart,
  PieChart,
  ChevronDownIcon,
  FileJsonIcon,
} from "lucide-react";
import { DEFAULT_CHART_DATA } from "../exts/chart";
import { layouts } from "../layouts";

export const EditorToolbar = () => {
  const { editor, selectionState } = useSlideEditorContext();

  if (!editor) return null;

  const isTextNode =
    selectionState.nodeType === NodeName.PARAGRAPH ||
    selectionState.nodeType === NodeName.HEADING;

  const hasTextSelection =
    selectionState.type === "text" && !selectionState.isEmpty;
  const hasNodeSelection = selectionState.type === "node";
  const hasSelection = hasTextSelection || hasNodeSelection;

  const isRowOrColumnSelected =
    hasNodeSelection &&
    (selectionState.nodeType === NodeName.ROW ||
      selectionState.nodeType === NodeName.COLUMN);

  const handleExportLayouts = () => {
    const exportData = layouts.map((layout) => ({
      title: layout.name,
      description: layout.description || "",
      content: layout.content,
    }));

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "layouts.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const deleteSelectedNode = () => {
    if (!hasSelection) return;

    const { from } = selectionState;
    const node = editor.state.doc.nodeAt(from);
    if (!node) return;

    if (selectionState.type === "text") {
      const $from = editor.state.doc.resolve(from);
      const parentPos = $from.before($from.depth);
      const parentNode = editor.state.doc.nodeAt(parentPos);
      if (parentNode) {
        const tr = editor.state.tr.delete(
          parentPos,
          parentPos + parentNode.nodeSize,
        );
        editor.view.dispatch(tr);
      }
    } else {
      const tr = editor.state.tr.delete(from, from + node.nodeSize);
      editor.view.dispatch(tr);
    }

    editor.view.focus();
  };

  const typographyItems = [
    {
      id: "h1",
      title: "Heading 1",
      description: "Large section heading",
      icon: Heading1,
      action: () => editor.chain().focus().setHeading({ level: 1 }).run(),
    },
    {
      id: "h2",
      title: "Heading 2",
      description: "Medium section heading",
      icon: Heading2,
      action: () => editor.chain().focus().setHeading({ level: 2 }).run(),
    },
    {
      id: "h3",
      title: "Heading 3",
      description: "Small section heading",
      icon: Heading3,
      action: () => editor.chain().focus().setHeading({ level: 3 }).run(),
    },
    {
      id: "h4",
      title: "Heading 4",
      description: "Subsection heading",
      icon: Heading4,
      action: () => editor.chain().focus().setHeading({ level: 4 }).run(),
    },
    {
      id: "h5",
      title: "Heading 5",
      description: "Minor heading",
      icon: Heading5,
      action: () => editor.chain().focus().setHeading({ level: 5 }).run(),
    },
    {
      id: "h6",
      title: "Heading 6",
      description: "Smallest heading",
      icon: Heading6,
      action: () => editor.chain().focus().setHeading({ level: 6 }).run(),
    },
    {
      id: "paragraph",
      title: "Paragraph",
      description: "Plain text paragraph",
      icon: TextIcon,
      action: () => editor.chain().focus().setParagraph().run(),
    },
    {
      id: "subtitle",
      title: "Subtitle",
      description: "Secondary title text",
      icon: CaseSensitiveIcon,
      action: () => editor.chain().focus().setHeading({ level: 2 }).run(),
    },
    {
      id: "small",
      title: "Small Text",
      description: "Smaller body text",
      icon: TextQuoteIcon,
      action: () => editor.chain().focus().setParagraph().run(),
    },
  ];

  const chartItems = [
    {
      id: "line",
      title: "Line Chart",
      description: "Show trends over time",
      icon: LineChart,
      action: () =>
        editor
          .chain()
          .focus()
          .insertContent({
            type: "chart",
            attrs: { chartType: "line", data: DEFAULT_CHART_DATA },
          })
          .run(),
    },
    {
      id: "bar",
      title: "Bar Chart",
      description: "Compare categories",
      icon: BarChart3,
      action: () =>
        editor
          .chain()
          .focus()
          .insertContent({
            type: "chart",
            attrs: { chartType: "bar", data: DEFAULT_CHART_DATA },
          })
          .run(),
    },
    {
      id: "pie",
      title: "Pie Chart",
      description: "Show proportions",
      icon: PieChart,
      action: () =>
        editor
          .chain()
          .focus()
          .insertContent({
            type: "chart",
            attrs: { chartType: "pie", data: DEFAULT_CHART_DATA },
          })
          .run(),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-2 sticky top-0 z-50 bg-background p-4">
      {/* Row 1: Theme, Export/Import */}
      <div className="flex items-center justify-between gap-2">
        <ThemeDropdown />

        <div className="flex items-center gap-2">
          <ExportTemplate />
          <ImportTemplate />
          <Button variant="outline" onClick={handleExportLayouts}>
            <FileJsonIcon className="size-4" />
            <span>Export Layouts</span>
          </Button>
        </div>
      </div>

      {/* Row 2: Layout, Add nodes, Formatting tools */}
      <div className="flex items-center gap-2">
        <LayoutDropdown />

        <div className="w-px h-6 bg-border" />

        {/* Typography Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <TypeIcon className="size-4" />
              <span>Text</span>
              <ChevronDownIcon className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {typographyItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={item.action}
                className="flex items-start gap-3 py-2"
              >
                <item.icon className="size-4 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Image Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <ImageIcon className="size-4" />
              <span>Image</span>
              <ChevronDownIcon className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem
              onClick={() =>
                editor.chain().focus().insertContent({ type: "image" }).run()
              }
              className="flex items-start gap-3 py-2"
            >
              <ImageIcon className="size-4 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium">Image Placeholder</span>
                <span className="text-xs text-muted-foreground">
                  Add an image block to upload or link
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Charts Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <BarChart3 className="size-4" />
              <span>Chart</span>
              <ChevronDownIcon className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {chartItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={item.action}
                className="flex items-start gap-3 py-2"
              >
                <item.icon className="size-4 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Formatting tools - only show when there's a selection */}
        {hasSelection && (
          <>
            <div className="w-px h-6 bg-border" />

            <FontFamilyDropdown editor={editor} disabled={!isTextNode} />
            <FontSizeDropdown editor={editor} disabled={!isTextNode} />

            <div className="w-px h-6 bg-border" />

            <TextFormatButtons editor={editor} disabled={!isTextNode} />

            <div className="w-px h-6 bg-border" />

            <TextAlignDropdown editor={editor} disabled={!isTextNode} />
          </>
        )}

        {/* Delete button - only show for row/column selection */}
        {isRowOrColumnSelected && (
          <>
            <div className="w-px h-6 bg-border" />
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={deleteSelectedNode}
            >
              <Trash2Icon className="size-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
