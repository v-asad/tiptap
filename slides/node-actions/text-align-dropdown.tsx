import { Editor } from "@tiptap/react";
import {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
  ChevronDownIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TextAlignDropdownProps = {
  editor: Editor;
  disabled?: boolean;
};

const alignments = [
  { value: "left", label: "Left", icon: AlignLeftIcon },
  { value: "center", label: "Center", icon: AlignCenterIcon },
  { value: "right", label: "Right", icon: AlignRightIcon },
  { value: "justify", label: "Justify", icon: AlignJustifyIcon },
] as const;

type Alignment = (typeof alignments)[number]["value"];

export const TextAlignDropdown = ({ editor, disabled }: TextAlignDropdownProps) => {
  const currentAlignment =
    alignments.find((a) => editor.isActive({ textAlign: a.value }))?.value ||
    "left";

  const CurrentIcon =
    alignments.find((a) => a.value === currentAlignment)?.icon || AlignLeftIcon;

  const setAlignment = (alignment: Alignment) => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-1 items-center h-8 px-2"
          disabled={disabled}
        >
          <CurrentIcon className="size-4" />
          <ChevronDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {alignments.map((alignment) => (
          <DropdownMenuItem
            key={alignment.value}
            onClick={() => setAlignment(alignment.value)}
            className={cn(
              "flex items-center gap-2",
              currentAlignment === alignment.value && "bg-accent"
            )}
          >
            <alignment.icon className="size-4" />
            <span>{alignment.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
