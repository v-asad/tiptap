import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TextFormatButtonsProps = {
  editor: Editor;
  disabled?: boolean;
};

export function TextFormatButtons({ editor, disabled }: TextFormatButtonsProps) {
  const formats = [
    {
      name: "bold",
      icon: BoldIcon,
      isActive: () => editor.isActive("bold"),
      toggle: () => editor.chain().focus().toggleBold().run(),
    },
    {
      name: "italic",
      icon: ItalicIcon,
      isActive: () => editor.isActive("italic"),
      toggle: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      name: "underline",
      icon: UnderlineIcon,
      isActive: () => editor.isActive("underline"),
      toggle: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      name: "strike",
      icon: StrikethroughIcon,
      isActive: () => editor.isActive("strike"),
      toggle: () => editor.chain().focus().toggleStrike().run(),
    },
  ];

  return (
    <div className="flex items-center gap-0.5">
      {formats.map((format) => (
        <Button
          key={format.name}
          size="icon-sm"
          variant="ghost"
          className={cn(format.isActive() && "bg-accent")}
          onClick={format.toggle}
          disabled={disabled}
        >
          <format.icon className="size-4" />
        </Button>
      ))}
    </div>
  );
}
