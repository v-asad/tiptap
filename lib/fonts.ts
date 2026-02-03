export type FontConfig = {
  name: string;
  value: string;
  cssValue: string;
  weights?: string;
};

export const fonts: FontConfig[] = [
  { name: "Montserrat", value: "Montserrat", cssValue: "'Montserrat', sans-serif", weights: "400;500;600;700" },
  { name: "Inter", value: "Inter", cssValue: "'Inter', sans-serif", weights: "400;500;600;700" },
  { name: "Roboto", value: "Roboto", cssValue: "'Roboto', sans-serif", weights: "400;500;700" },
  { name: "Open Sans", value: "Open Sans", cssValue: "'Open Sans', sans-serif", weights: "400;600;700" },
  { name: "Lato", value: "Lato", cssValue: "'Lato', sans-serif", weights: "400;700" },
  { name: "Playfair Display", value: "Playfair Display", cssValue: "'Playfair Display', serif", weights: "400;600;700" },
  { name: "Merriweather", value: "Merriweather", cssValue: "'Merriweather', serif", weights: "400;700" },
  { name: "Poppins", value: "Poppins", cssValue: "'Poppins', sans-serif", weights: "400;500;600;700" },
  { name: "Raleway", value: "Raleway", cssValue: "'Raleway', sans-serif", weights: "400;500;600;700" },
  { name: "Source Sans 3", value: "Source Sans 3", cssValue: "'Source Sans 3', sans-serif", weights: "400;600;700" },
];

const loadedFonts = new Set<string>();

export function loadFont(font: FontConfig): void {
  if (loadedFonts.has(font.value)) return;

  const fontFamily = font.value.replace(/ /g, "+");
  const weights = font.weights || "400;700";
  const url = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weights}&display=swap`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);

  loadedFonts.add(font.value);
}

export function preloadFont(font: FontConfig): void {
  const fontFamily = font.value.replace(/ /g, "+");
  const weights = font.weights || "400;700";
  const url = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weights}&display=swap`;

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "style";
  link.href = url;
  document.head.appendChild(link);
}
