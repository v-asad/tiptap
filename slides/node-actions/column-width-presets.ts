export interface ColumnWidthPreset {
  id: string;
  label: string;
  widths: number[];
}

export const COLUMN_WIDTH_PRESETS: Record<number, ColumnWidthPreset[]> = {
  2: [
    { id: "2-equal", label: "Equal (50% - 50%)", widths: [1, 1] },
    {
      id: "2-left-heavy",
      label: "Large - Small (75% - 25%)",
      widths: [1.5, 0.5],
    },
    {
      id: "2-right-heavy",
      label: "Small - Large (25% - 75%)",
      widths: [0.5, 1.5],
    },
  ],
  3: [
    { id: "3-equal", label: "Equal (33% each)", widths: [1, 1, 1] },
    { id: "3-left-heavy", label: "Large - Small - Small", widths: [2, 1, 1] },
    { id: "3-center-heavy", label: "Small - Large - Small", widths: [1, 2, 1] },
    { id: "3-right-heavy", label: "Small - Small - Large", widths: [1, 1, 2] },
  ],
  4: [
    { id: "4-equal", label: "Equal (25% each)", widths: [1, 1, 1, 1] },
    {
      id: "4-first-heavy",
      label: "Large - Small - Small - Small",
      widths: [2, 1, 1, 1],
    },
    {
      id: "4-last-heavy",
      label: "Small - Small - Small - Large",
      widths: [1, 1, 1, 2],
    },
  ],
};

export const getPresetsForColumnCount = (
  count: number
): ColumnWidthPreset[] => {
  return COLUMN_WIDTH_PRESETS[count] || [];
};

export const getCurrentPreset = (
  columnCount: number,
  currentWidths: number[]
): ColumnWidthPreset | undefined => {
  const presets = getPresetsForColumnCount(columnCount);
  return presets.find((preset) =>
    preset.widths.every((w, i) => Math.abs(w - (currentWidths[i] || 1)) < 0.01)
  );
};
