import { ReactNodeViewProps } from "@tiptap/react";
import { ImageIcon } from "lucide-react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";
import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";
import { NodeActions } from "@/slides/node-actions";
import type { ImageLayout } from "./index";
import { cn } from "@/lib/utils";

const layoutClasses: Record<ImageLayout, string> = {
  default: "px-1 py-1",
  "full-top": "absolute top-0 left-0 right-0 z-10",
  "full-bottom": "absolute bottom-0 left-0 right-0 z-10",
  "full-left": "absolute top-0 bottom-0 left-0 w-1/2 z-10",
  "full-right": "absolute top-0 bottom-0 right-0 w-1/2 z-10",
};

const imageClasses: Record<ImageLayout, string> = {
  default: "w-full h-auto rounded object-cover",
  "full-top": "w-full h-48 object-cover",
  "full-bottom": "w-full h-48 object-cover",
  "full-left": "w-full h-full object-cover",
  "full-right": "w-full h-full object-cover",
};

const placeholderClasses: Record<ImageLayout, string> = {
  default:
    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed border-muted-foreground/50 bg-muted/30 py-8 text-muted-foreground transition-colors hover:border-muted-foreground hover:bg-muted/50",
  "full-top":
    "flex cursor-pointer flex-col items-center justify-center gap-2 bg-muted/50 h-48 text-muted-foreground transition-colors hover:bg-muted/70",
  "full-bottom":
    "flex cursor-pointer flex-col items-center justify-center gap-2 bg-muted/50 h-48 text-muted-foreground transition-colors hover:bg-muted/70",
  "full-left":
    "flex cursor-pointer flex-col items-center justify-center gap-2 bg-muted/50 h-full text-muted-foreground transition-colors hover:bg-muted/70",
  "full-right":
    "flex cursor-pointer flex-col items-center justify-center gap-2 bg-muted/50 h-full text-muted-foreground transition-colors hover:bg-muted/70",
};

export const ImageView = (props: ReactNodeViewProps<HTMLImageElement>) => {
  const { src, alt, layout = "default" } = props.node.attrs;
  const imageLayout = layout as ImageLayout;

  const handlePlaceholderClick = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      props.updateAttributes({ src: url });
    }
  };

  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.High}
      className={cn(layoutClasses[imageLayout], {
        "mx-0 my-0": imageLayout !== "default",
      })}
      data-image-layout={imageLayout}
      {...props}
    >
      <DropCursor />
      <NodeActions {...props} />

      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ""} className={imageClasses[imageLayout]} />
      ) : (
        <ImagePlaceholder
          onClick={handlePlaceholderClick}
          layout={imageLayout}
        />
      )}
    </DragDropNodeViewProvider>
  );
};

type ImagePlaceholderProps = {
  onClick: () => void;
  layout: ImageLayout;
};

const ImagePlaceholder = ({ onClick, layout }: ImagePlaceholderProps) => {
  return (
    <div
      contentEditable={false}
      onClick={onClick}
      className={placeholderClasses[layout]}
    >
      <ImageIcon className="size-8" />
      <span className="text-sm">Add an image</span>
    </div>
  );
};
