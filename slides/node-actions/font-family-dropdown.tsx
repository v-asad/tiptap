"use client";

import { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fonts, loadFont } from "@/lib/fonts";

type FontFamilyDropdownProps = {
  editor: Editor;
  disabled?: boolean;
};

export const FontFamilyDropdown = ({ editor, disabled }: FontFamilyDropdownProps) => {
  const [currentFont, setCurrentFont] = useState(fonts[0].name);

  useEffect(() => {
    const fontFamily = editor.getAttributes("textStyle").fontFamily;
    if (fontFamily) {
      const font = fonts.find((f) => f.value === fontFamily);

      // eslint-disable-next-line
      if (font) setCurrentFont(font.name);
    }
  }, [editor]);

  const updateFontFamily = (font: (typeof fonts)[0]) => {
    loadFont(font);
    editor.chain().focus().setFontFamily(font.value).run();
    setCurrentFont(font.name);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-1 items-center border rounded px-2 h-8 min-w-25 justify-between disabled:opacity-50 disabled:cursor-not-allowed" disabled={disabled}>
        <span className="truncate text-sm">{currentFont}</span>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {fonts.map((font) => (
          <DropdownMenuItem
            key={font.value}
            onClick={() => updateFontFamily(font)}
            onMouseEnter={() => loadFont(font)}
            style={{ fontFamily: font.value }}
          >
            {font.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
