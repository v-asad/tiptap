import { fonts } from "./fonts";

export interface EditorTheme {
  name: string;
  bgColor: string;
  secondaryColor: string;
  textColor: string;
  linkColor: string;
  titleFont: string;
  bodyFont: string;
}

export interface CustomEditorTheme extends EditorTheme {
  id: string;
  isCustom: true;
}

export const AVAILABLE_FONTS = fonts.map((font) => ({
  name: font.name,
  value: font.cssValue,
}));

export const themes: EditorTheme[] = [
  {
    name: "Default",
    bgColor: "#ffffff",
    secondaryColor: "#3b82f6",
    textColor: "#1f2937",
    linkColor: "#2563eb",
    titleFont: "'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
  },
  {
    name: "Dark Slate",
    bgColor: "#1e293b",
    secondaryColor: "#60a5fa",
    textColor: "#f1f5f9",
    linkColor: "#93c5fd",
    titleFont: "'Montserrat', sans-serif",
    bodyFont: "'Inter', sans-serif",
  },
  {
    name: "Warm Sepia",
    bgColor: "#fef7ed",
    secondaryColor: "#d97706",
    textColor: "#451a03",
    linkColor: "#b45309",
    titleFont: "'Playfair Display', serif",
    bodyFont: "'Merriweather', serif",
  },
  {
    name: "Ocean",
    bgColor: "#ecfeff",
    secondaryColor: "#06b6d4",
    textColor: "#164e63",
    linkColor: "#0891b2",
    titleFont: "'Raleway', sans-serif",
    bodyFont: "'Open Sans', sans-serif",
  },
  {
    name: "Forest",
    bgColor: "#f0fdf4",
    secondaryColor: "#22c55e",
    textColor: "#14532d",
    linkColor: "#16a34a",
    titleFont: "'Lato', sans-serif",
    bodyFont: "'Lato', sans-serif",
  },
  {
    name: "Midnight Pro",
    bgColor: "#0F172A",
    secondaryColor: "#A5B4FC",
    textColor: "#FFFFFF",
    linkColor: "#818CF8",
    titleFont: "'DM Sans', sans-serif",
    bodyFont: "'Inter', sans-serif",
  },
  {
    name: "Sepia",
    bgColor: "#FFFBEB",
    secondaryColor: "#78716C",
    textColor: "#1C1917",
    linkColor: "#D97706",
    titleFont: "'Playfair Display', serif",
    bodyFont: "'Source Sans 3', sans-serif",
  },
  {
    name: "Ocean Breeze",
    bgColor: "#F0FDFA",
    secondaryColor: "#64748B",
    textColor: "#0F172A",
    linkColor: "#0D9488",
    titleFont: "'Poppins', sans-serif",
    bodyFont: "'Poppins', sans-serif",
  },
  {
    name: "Lavender Haze",
    bgColor: "#F5F3FF",
    secondaryColor: "#7C3AED",
    textColor: "#0F172A",
    linkColor: "#8B5CF6",
    titleFont: "'DM Sans', sans-serif",
    bodyFont: "'Poppins', sans-serif",
  },
  {
    name: "Carbon",
    bgColor: "#18181B",
    secondaryColor: "#71717A",
    textColor: "#FAFAFA",
    linkColor: "#22D3EE",
    titleFont: "'Space Grotesk', sans-serif",
    bodyFont: "'IBM Plex Sans', sans-serif",
  },
  {
    name: "Sunrise",
    bgColor: "#FFFBF5",
    secondaryColor: "#EA580C",
    textColor: "#1C1917",
    linkColor: "#DC2626",
    titleFont: "'Sora', sans-serif",
    bodyFont: "'Nunito', sans-serif",
  },
];

export const DEFAULT_THEME = themes[2];
