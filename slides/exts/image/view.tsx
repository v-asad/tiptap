import { ReactNodeViewProps } from "@tiptap/react";
import { ImageIcon } from "lucide-react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";
import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";
import { NodeActions } from "@/slides/node-actions";

export const ImageView = (props: ReactNodeViewProps<HTMLImageElement>) => {
  const { src, alt } = props.node.attrs;

  const handlePlaceholderClick = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      props.updateAttributes({ src: url });
    }
  };

  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.High}
      className="px-1 py-1"
      {...props}
    >
      <DropCursor />
      <NodeActions {...props} />

      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || ""}
          className="w-full h-auto rounded object-cover"
          draggable={false}
        />
      ) : (
        <ImagePlaceholder onClick={handlePlaceholderClick} />
      )}
    </DragDropNodeViewProvider>
  );
};

type ImagePlaceholderProps = {
  onClick: () => void;
};

const ImagePlaceholder = ({ onClick }: ImagePlaceholderProps) => {
  return (
    <div
      contentEditable={false}
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed border-muted-foreground/50 bg-muted/30 py-8 text-muted-foreground transition-colors hover:border-muted-foreground hover:bg-muted/50"
    >
      <ImageIcon className="size-8" />
      <span className="text-sm">Add an image</span>
    </div>
  );
};
