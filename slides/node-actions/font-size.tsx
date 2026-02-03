import { useState } from "react";
import { Editor } from "@tiptap/react";
import { ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type FontSizeDropdownProps = {
  editor: Editor;
  disabled?: boolean;
};

const fontSizes = [
  "12",
  "14",
  "16",
  "18",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "50",
  "64",
  "128",
];

export const FontSizeDropdown = ({ editor, disabled }: FontSizeDropdownProps) => {
  const [fontSize, setFontSize] = useState(fontSizes[0]);

  const updateFontSize = (size: string) => {
    editor.commands.setFontSize(`${size}px`);
    setFontSize(size);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-0 items-center border rounded pe-1 disabled:opacity-50 disabled:cursor-not-allowed" disabled={disabled}>
        <Input
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="border-none outline-none w-12 h-8"
          disabled={disabled}
        />
        <ChevronDownIcon className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {fontSizes.map((size) => (
          <DropdownMenuItem key={size} onClick={() => updateFontSize(size)}>
            {size}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
