import type { EditorTheme } from "@/lib/themes";

interface ThemePreviewProps {
  theme: Partial<EditorTheme>;
  className?: string;
}

export function ThemePreview({ theme, className = "" }: ThemePreviewProps) {
  return (
    <div
      className={`rounded-lg border overflow-hidden ${className}`}
      style={{ backgroundColor: theme.bgColor || "#ffffff" }}
    >
      <div className="p-4 space-y-2">
        <h3
          className="text-lg font-semibold"
          style={{
            color: theme.textColor || "#1f2937",
            fontFamily: theme.titleFont || "sans-serif",
          }}
        >
          Heading Text
        </h3>
        <p
          className="text-sm"
          style={{
            color: theme.textColor || "#1f2937",
            fontFamily: theme.bodyFont || "sans-serif",
          }}
        >
          This is body text that shows how content will look.{" "}
          <span
            style={{ color: theme.linkColor || "#2563eb" }}
            className="underline"
          >
            This is a link
          </span>
          .
        </p>
        <div className="flex items-center gap-2 pt-2">
          <div
            className="h-6 w-6 rounded"
            style={{ backgroundColor: theme.secondaryColor || "#3b82f6" }}
          />
          <span
            className="text-xs"
            style={{
              color: theme.textColor || "#1f2937",
              fontFamily: theme.bodyFont || "sans-serif",
            }}
          >
            Accent color
          </span>
        </div>
      </div>
    </div>
  );
}
