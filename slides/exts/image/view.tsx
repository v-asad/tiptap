import { ReactNodeViewProps } from "@tiptap/react";
import { ImageIcon } from "lucide-react";
import { useRef, useEffect, useState } from "react";

import { DragDropNodeViewProvider } from "@/slides/dnd/dnd-node-view";
import { DropCursor } from "@/slides/dnd/drop-cursor";
import { CollisionPriority } from "@/slides/dnd/dnd.types";
import { NodeActions } from "@/slides/node-actions";
import type { ImageLayout } from "./index";
import { cn } from "@/lib/utils";

// Default sizes for full-layout images
const DEFAULT_HEIGHT = 192; // 12rem = 192px (h-48)
const DEFAULT_WIDTH_PERCENT = 50;

const DEFAULT_RESIZE_OPTIONS = {
  enabled: true,
  directions: ["bottom-right"] as const,
  minWidth: 50,
  minHeight: 50,
  alwaysPreserveAspectRatio: false,
};

const layoutClasses: Record<ImageLayout, string> = {
  default: "px-1 py-1",
  "full-top": "absolute top-0 left-0 right-0 z-10",
  "full-bottom": "absolute bottom-0 left-0 right-0 z-10",
  "full-left": "absolute top-0 bottom-0 left-0 z-10",
  "full-right": "absolute top-0 bottom-0 right-0 z-10",
};

const imageClasses: Record<ImageLayout, string> = {
  default: "w-full h-auto object-cover",
  "full-top": "w-full h-full object-cover",
  "full-bottom": "w-full h-full object-cover",
  "full-left": "w-full h-full object-cover",
  "full-right": "w-full h-full object-cover",
};

const placeholderClasses: Record<ImageLayout, string> = {
  default:
    "flex cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed border-muted-foreground/50 bg-muted/30 py-8 text-muted-foreground transition-colors hover:border-muted-foreground hover:bg-muted/50",
  "full-top":
    "flex cursor-pointer flex-col items-center justify-center gap-2 bg-muted/50 h-full text-muted-foreground transition-colors hover:bg-muted/70",
  "full-bottom":
    "flex cursor-pointer flex-col items-center justify-center gap-2 bg-muted/50 h-full text-muted-foreground transition-colors hover:bg-muted/70",
  "full-left":
    "flex cursor-pointer flex-col items-center justify-center gap-2 bg-muted/50 h-full text-muted-foreground transition-colors hover:bg-muted/70",
  "full-right":
    "flex cursor-pointer flex-col items-center justify-center gap-2 bg-muted/50 h-full text-muted-foreground transition-colors hover:bg-muted/70",
};

type ResizeDirection = "vertical" | "horizontal";

type ResizeHandleDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export const ImageView = (props: ReactNodeViewProps<HTMLImageElement>) => {
  const { src, alt, layout = "default", size } = props.node.attrs;
  const { editor, updateAttributes } = props;
  const imageLayout = layout as ImageLayout;

  const startPosRef = useRef<number>(0);
  const startSizeRef = useRef<number>(0);
  const directionRef = useRef<ResizeDirection>("vertical");

  const imageRef = useRef<HTMLImageElement>(null);
  const startPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startBoxRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const handleDirRef = useRef<ResizeHandleDirection>("bottom-right");

  const [isResizing, setResizing] = useState(false);

  const getDefaultSize = () => {
    if (imageLayout === "full-top" || imageLayout === "full-bottom") {
      return DEFAULT_HEIGHT;
    }
    return DEFAULT_WIDTH_PERCENT;
  };

  const currentSize = size ?? getDefaultSize();
  const currentWidth = props.node.attrs.width as number | null;
  const currentHeight = props.node.attrs.height as number | null;

  // Update CSS custom properties on the editor for dynamic padding
  useEffect(() => {
    if (imageLayout === "default") return;

    const editorEl = editor.view.dom as HTMLElement;
    const cssVarMap: Record<string, string> = {
      "full-top": "--image-top-size",
      "full-bottom": "--image-bottom-size",
      "full-left": "--image-left-size",
      "full-right": "--image-right-size",
    };

    const cssVar = cssVarMap[imageLayout];
    if (cssVar) {
      if (imageLayout === "full-top" || imageLayout === "full-bottom") {
        editorEl.style.setProperty(cssVar, `${currentSize}px`);
      } else {
        editorEl.style.setProperty(cssVar, `${currentSize}%`);
      }
    }

    return () => {
      if (cssVar) {
        editorEl.style.removeProperty(cssVar);
      }
    };
  }, [editor, imageLayout, currentSize]);

  const getContainerStyle = (): React.CSSProperties => {
    if (imageLayout === "full-top" || imageLayout === "full-bottom") {
      return { height: `${currentSize}px` };
    }
    if (imageLayout === "full-left" || imageLayout === "full-right") {
      return { width: `${currentSize}%` };
    }
    return {};
  };

  const handleResize = (e: MouseEvent) => {
    const direction = directionRef.current;
    const startPos = startPosRef.current;
    const startSize = startSizeRef.current;

    if (direction === "vertical") {
      const dy = e.clientY - startPos;
      // For full-top, dragging down increases height
      // For full-bottom, dragging up increases height (so we invert)
      const delta = imageLayout === "full-bottom" ? -dy : dy;
      const newSize = Math.max(100, Math.min(600, startSize + delta));
      updateAttributes({ size: newSize });
    } else {
      const dx = e.clientX - startPos;
      // Get the editor width for percentage calculation
      const editorEl = editor.view.dom;
      const editorWidth = editorEl.offsetWidth;
      const deltaPercent = (dx / editorWidth) * 100;
      // For full-left, dragging right increases width
      // For full-right, dragging left increases width (so we invert)
      const delta = imageLayout === "full-right" ? -deltaPercent : deltaPercent;
      const newSize = Math.max(20, Math.min(80, startSize + delta));
      updateAttributes({ size: newSize });
    }
  };

  const initiateResize = (e: React.MouseEvent, direction: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();

    directionRef.current = direction;
    startSizeRef.current = currentSize;

    if (direction === "vertical") {
      startPosRef.current = e.clientY;
    } else {
      startPosRef.current = e.clientX;
    }

    document.body.style.userSelect = "none";
    document.body.style.cursor =
      direction === "vertical" ? "row-resize" : "col-resize";

    const handleMouseUp = () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleDefaultResize = (e: MouseEvent) => {
    const start = startPointRef.current;
    const startBox = startBoxRef.current;
    const dir = handleDirRef.current;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    let nextWidth = startBox.width;
    let nextHeight = startBox.height;

    if (dir.includes("left")) {
      nextWidth = startBox.width - dx;
    }
    if (dir.includes("right")) {
      nextWidth = startBox.width + dx;
    }
    if (dir.includes("top")) {
      nextHeight = startBox.height - dy;
    }
    if (dir.includes("bottom")) {
      nextHeight = startBox.height + dy;
    }

    nextWidth = Math.max(DEFAULT_RESIZE_OPTIONS.minWidth, nextWidth);
    nextHeight = Math.max(DEFAULT_RESIZE_OPTIONS.minHeight, nextHeight);

    if (DEFAULT_RESIZE_OPTIONS.alwaysPreserveAspectRatio) {
      const ratio = startBox.height > 0 ? startBox.width / startBox.height : 1;
      if (Math.abs(dx) > Math.abs(dy)) {
        nextHeight = nextWidth / ratio;
      } else {
        nextWidth = nextHeight * ratio;
      }
    }

    updateAttributes({
      width: Math.round(nextWidth),
      height: Math.round(nextHeight),
    });
  };

  const initiateDefaultResize = (
    e: React.MouseEvent,
    direction: ResizeHandleDirection,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const imgEl = imageRef.current;
    if (!imgEl) return;

    const rect = imgEl.getBoundingClientRect();

    startPointRef.current = { x: e.clientX, y: e.clientY };
    startBoxRef.current = {
      width: currentWidth ?? rect.width,
      height: currentHeight ?? rect.height,
    };
    handleDirRef.current = direction;

    document.body.style.userSelect = "none";
    document.body.style.cursor = "nwse-resize";

    const handleMouseUp = () => {
      document.body.style.userSelect = "";
      document.body.style.cursor = "";

      setResizing(false);

      window.removeEventListener("mousemove", handleDefaultResize);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    setResizing(true);

    window.addEventListener("mousemove", handleDefaultResize);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handlePlaceholderClick = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      updateAttributes({ src: url });
    }
  };

  const renderResizeHandle = () => {
    if (imageLayout === "default") return null;

    const isVertical =
      imageLayout === "full-top" || imageLayout === "full-bottom";
    const direction: ResizeDirection = isVertical ? "vertical" : "horizontal";

    // Position the handle based on the layout
    const handlePositionClasses = {
      "full-top": "bottom-0 left-0 right-0 h-3 cursor-row-resize",
      "full-bottom": "top-0 left-0 right-0 h-3 cursor-row-resize",
      "full-left": "right-0 top-0 bottom-0 w-3 cursor-col-resize",
      "full-right": "left-0 top-0 bottom-0 w-3 cursor-col-resize",
    };

    const handleBarClasses = {
      "full-top": "w-12 h-1 rounded-full",
      "full-bottom": "w-12 h-1 rounded-full",
      "full-left": "h-12 w-1 rounded-full",
      "full-right": "h-12 w-1 rounded-full",
    };

    return (
      <div
        contentEditable={false}
        className={cn(
          "absolute z-20 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity",
          handlePositionClasses[imageLayout],
        )}
        onMouseDown={(e) => initiateResize(e, direction)}
      >
        <div
          className={cn(
            "bg-blue-400 hover:bg-blue-500 transition-colors",
            handleBarClasses[imageLayout],
          )}
        />
      </div>
    );
  };

  const renderDefaultResizeHandles = () => {
    if (imageLayout !== "default") return null;
    if (!DEFAULT_RESIZE_OPTIONS.enabled || !src) return null;

    const handleBase =
      "absolute size-3 bg-transparent border-r-2 border-b-2 border-[var(--editor-text)] shadow-sm";

    const handle: {
      dir: ResizeHandleDirection;
      className: string;
      cursor: string;
    } = {
      dir: "bottom-right",
      className: "-bottom-1 -right-1",
      cursor: "nwse-resize",
    };

    return (
      <div
        className={cn("absolute inset-0", {
          "hidden group-hover/image:flex": true,
          flex: isResizing,
        })}
      >
        <button
          key={handle.dir}
          type="button"
          aria-label={`Resize ${handle.dir}`}
          className={cn(handleBase, handle.className)}
          style={{ cursor: handle.cursor }}
          onMouseDown={(event) => initiateDefaultResize(event, handle.dir)}
        />
      </div>
    );
  };

  return (
    <DragDropNodeViewProvider
      collisionPriority={CollisionPriority.High}
      className={cn(layoutClasses[imageLayout], "group/image", {
        "mx-0 my-0": imageLayout !== "default",
      })}
      style={getContainerStyle()}
      data-node-type="image"
      data-image-layout={imageLayout}
      data-image-size={currentSize}
      {...props}
    >
      <DropCursor />
      <NodeActions {...props} />

      <div
        className={cn("h-full", {
          "relative inline-block max-w-full": imageLayout === "default",
        })}
        contentEditable={false}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imageRef}
            src={src}
            alt={alt || ""}
            className={imageClasses[imageLayout]}
            style={
              imageLayout === "default" && (currentWidth || currentHeight)
                ? {
                    width: currentWidth ?? undefined,
                    height: currentHeight ?? undefined,
                  }
                : undefined
            }
          />
        ) : (
          <ImagePlaceholder
            onClick={handlePlaceholderClick}
            layout={imageLayout}
          />
        )}

        {renderDefaultResizeHandles()}
      </div>

      {renderResizeHandle()}
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
