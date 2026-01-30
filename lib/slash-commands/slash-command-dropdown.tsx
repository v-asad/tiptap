"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { SlashCommand } from "./types";

interface SlashCommandDropdownProps {
  commands: SlashCommand[];
  selectedIndex: number;
  position: { top: number; left: number } | null;
  onSelect: (command: SlashCommand) => void;
  onHover: (index: number) => void;
}

export function SlashCommandDropdown({
  commands,
  selectedIndex,
  position,
  onSelect,
  onHover,
}: SlashCommandDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  if (!position || commands.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="slash-command-dropdown fixed z-50 min-w-55 max-w-80 max-h-75 overflow-hidden rounded-lg border border-border bg-popover shadow-lg animate-in fade-in-0 slide-in-from-top-1"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="max-h-64 overflow-y-auto p-1">
        {commands.map((command, index) => (
          <button
            key={command.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            type="button"
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2 rounded-md border-none bg-transparent text-left cursor-pointer transition-colors",
              index === selectedIndex
                ? "bg-accent [&_.slash-icon]:bg-primary [&_.slash-icon]:text-primary-foreground"
                : "hover:bg-accent hover:[&_.slash-icon]:bg-primary hover:[&_.slash-icon]:text-primary-foreground"
            )}
            onClick={() => onSelect(command)}
            onMouseEnter={() => onHover(index)}
          >
            {command.icon && (
              <span className="slash-icon flex items-center justify-center w-8 h-8 shrink-0 rounded-md bg-muted text-muted-foreground transition-colors">
                {command.icon}
              </span>
            )}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium text-foreground truncate">
                {command.title}
              </span>
              {command.description && (
                <span className="text-xs text-muted-foreground truncate">
                  {command.description}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
