/**
 * Slide Layouts Module
 *
 * This module exports predefined slide layouts as HTML strings
 * that can be inserted into Tiptap via `editor.commands.insertContent()`.
 *
 * Each layout uses the same tag names as the Tiptap schema:
 * - `h1`-`h6` for headings
 * - `p` for paragraphs
 * - `row` / `column` for layout primitives
 * - `img` for images (with `layout` attr)
 * - `chart` for chart nodes (with `data-chart-type` and `data-chart`)
 */

import type { Content } from "@tiptap/react";

// ============================================================================
// Types
// ============================================================================

export interface SlideLayout {
  /** Unique identifier for the layout */
  id: string;
  /** Display name of the layout */
  name: string;
  /** Optional description explaining the layout's purpose */
  description?: string;
  /** The Tiptap-compatible HTML content string */
  content: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a text node with the given content
 */
const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeAttr = (value: string) => escapeHtml(value);

const text = (content: string): string => escapeHtml(content);

const wrap = (...parts: string[]): string => parts.join("");

/**
 * Creates a heading node with specified level and text
 * @param level - Heading level (1-6)
 * @param content - Text content for the heading
 */
const heading = (level: number, content: string): string =>
  `<h${level}>${text(content)}</h${level}>`;

/**
 * Creates a paragraph node with the given text
 * @param content - Text content for the paragraph
 */
const paragraph = (content: string): string => `<p>${text(content)}</p>`;

/**
 * Creates an empty paragraph node (useful for spacing or placeholders)
 */
const emptyParagraph = (): string => `<p></p>`;

type ImageLayout =
  | "default"
  | "full-top"
  | "full-bottom"
  | "full-left"
  | "full-right";

type ChartType = "line" | "bar" | "pie";

type ChartDatum = {
  label: string;
  value: number;
};

const defaultChartData: ChartDatum[] = [
  { label: "Q1", value: 32 },
  { label: "Q2", value: 48 },
  { label: "Q3", value: 27 },
  { label: "Q4", value: 58 },
];

/**
 * Creates an image node with optional src and layout
 * @param src - Optional image URL (null for placeholder)
 * @param layout - Optional layout for full-bleed positioning
 */
const image = (
  src: string | null = null,
  layout: ImageLayout = "default",
): string => {
  const srcAttr = src ? ` src="${escapeAttr(src)}"` : "";
  return `<img${srcAttr} layout="${layout}">`;
};

/**
 * Creates a chart node with specified type and data
 * @param chartType - Chart type (line, bar, pie)
 * @param data - Array of { label, value } pairs
 */
const chart = (
  chartType: ChartType = "bar",
  data: ChartDatum[] = defaultChartData,
): string => {
  const dataAttr = escapeAttr(JSON.stringify(data));
  return `<chart data-chart-type="${chartType}" data-chart="${dataAttr}"></chart>`;
};

/**
 * Creates a column node containing the specified block nodes
 * @param children - Array of block nodes (headings, paragraphs, etc.)
 */
const column = (...children: string[]): string =>
  `<column>${children.join("")}</column>`;

/**
 * Creates a row node containing the specified columns
 * Note: Maximum of 4 columns per row (enforced by ROW_CONFIG.MAX_COL_COUNT)
 * @param columns - Array of column nodes
 */
const row = (...columns: string[]): string =>
  `<row>${columns.join("")}</row>`;

/**
 * Creates a list item node with optional text content
 * @param content - Text content for the list item (creates a paragraph inside)
 */
const listItem = (content: string): string =>
  `<li>${paragraph(content)}</li>`;

/**
 * Creates a bullet list node with the specified items
 * @param items - Array of strings for each list item
 */
const bulletList = (...items: string[]): string =>
  `<ul>${items.map((item) => listItem(item)).join("")}</ul>`;

/**
 * Creates an ordered list node with the specified items
 * @param items - Array of strings for each list item
 * @param start - Starting number for the list (default: 1)
 */
const orderedList = (items: string[], start: number = 1): string =>
  `<ol start="${start}">${items.map((item) => listItem(item)).join("")}</ol>`;

// ============================================================================
// Predefined Layouts
// ============================================================================

/**
 * Title Layout
 *
 * A simple layout with a prominent title heading and a description paragraph.
 * Ideal for title slides or section dividers.
 *
 * Structure:
 * - Heading (level 1): Main title
 * - Paragraph: Description or subtitle
 */
const titleLayout: SlideLayout = {
  id: "title",
  name: "Title",
  description: "A title heading with a description paragraph below",
  content: wrap(
    // Main title - uses level 1 heading for maximum prominence
    heading(1, "Slide Title"),
    // Description paragraph below the title
    paragraph("Add your description or subtitle here"),
  ),
};

/**
 * Title Only Layout
 *
 * A minimal layout with just a centered title.
 * Perfect for section breaks or emphasis slides.
 *
 * Structure:
 * - Heading (level 1): Main title
 */
const titleOnlyLayout: SlideLayout = {
  id: "title-only",
  name: "Title Only",
  description: "A single prominent title heading",
  content: wrap(
    // Single heading for maximum impact
    heading(1, "Slide Title"),
  ),
};

/**
 * Two Column Layout
 *
 * A layout with a title and two equal columns below.
 * Great for comparisons, pros/cons, or side-by-side content.
 *
 * Structure:
 * - Heading (level 1): Section title
 * - Row:
 *   - Column 1: Heading + paragraph
 *   - Column 2: Heading + paragraph
 */
const twoColumnLayout: SlideLayout = {
  id: "two-column",
  name: "Two Columns",
  description: "A title with two equal columns below",
  content: wrap(
    // Main section heading
    heading(1, "Section Title"),
    // Row containing two columns with equal widths
    row(
      // First column with its own heading and content
      column(
        heading(2, "Column 1"),
        paragraph("Add content for the first column here"),
      ),
      // Second column with its own heading and content
      column(
        heading(2, "Column 2"),
        paragraph("Add content for the second column here"),
      ),
    ),
  ),
};

/**
 * Three Column Layout
 *
 * A layout with a title and three equal columns below.
 * Ideal for listing three points, features, or steps.
 *
 * Structure:
 * - Heading (level 1): Section title
 * - Row:
 *   - Column 1: Heading + paragraph
 *   - Column 2: Heading + paragraph
 *   - Column 3: Heading + paragraph
 */
const threeColumnLayout: SlideLayout = {
  id: "three-column",
  name: "Three Columns",
  description: "A title with three equal columns below",
  content: wrap(
    // Main section heading
    heading(1, "Section Title"),
    // Row containing three columns
    row(
      column(heading(2, "Column 1"), paragraph("First column content")),
      column(heading(2, "Column 2"), paragraph("Second column content")),
      column(heading(2, "Column 3"), paragraph("Third column content")),
    ),
  ),
};

/**
 * Four Column Layout
 *
 * A layout with a title and four equal columns below.
 * Maximum column capacity - good for comparing four items or showing a process.
 *
 * Structure:
 * - Heading (level 1): Section title
 * - Row:
 *   - Column 1-4: Each with heading + paragraph
 */
const fourColumnLayout: SlideLayout = {
  id: "four-column",
  name: "Four Columns",
  description: "A title with four equal columns below (maximum)",
  content: wrap(
    heading(1, "Section Title"),
    row(
      column(heading(3, "Point 1"), paragraph("Description")),
      column(heading(3, "Point 2"), paragraph("Description")),
      column(heading(3, "Point 3"), paragraph("Description")),
      column(heading(3, "Point 4"), paragraph("Description")),
    ),
  ),
};

/**
 * Content Layout
 *
 * A simple layout with a title and multiple paragraphs.
 * Good for text-heavy slides or explanations.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Multiple paragraphs for content
 */
const contentLayout: SlideLayout = {
  id: "content",
  name: "Content",
  description: "A title with multiple paragraphs below",
  content: wrap(
    heading(1, "Content Title"),
    paragraph("First paragraph of content. Add your main points here."),
    paragraph(
      "Second paragraph with additional details or supporting information.",
    ),
  ),
};

/**
 * Two Column Text Layout
 *
 * A layout with a title and two columns containing only paragraphs.
 * Useful for longer text content split into columns.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Row:
 *   - Column 1: Paragraph
 *   - Column 2: Paragraph
 */
const twoColumnTextLayout: SlideLayout = {
  id: "two-column-text",
  name: "Two Column Text",
  description: "A title with two text columns (no column headings)",
  content: wrap(
    heading(1, "Section Title"),
    row(
      column(
        paragraph(
          "Left column content. Add your text here for the left side of the slide.",
        ),
      ),
      column(
        paragraph(
          "Right column content. Add your text here for the right side of the slide.",
        ),
      ),
    ),
  ),
};

/**
 * Sidebar Layout
 *
 * A layout with a main content area and a sidebar.
 * The first column is wider (conceptually) for main content.
 * Note: Column widths are equal by default; use CSS for custom widths.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Row:
 *   - Main Column: Heading + paragraphs
 *   - Sidebar Column: Heading + paragraph
 */
const sidebarLayout: SlideLayout = {
  id: "sidebar",
  name: "Content with Sidebar",
  description: "Main content area with a sidebar column",
  content: wrap(
    heading(1, "Main Topic"),
    row(
      // Main content column
      column(
        heading(2, "Main Content"),
        paragraph(
          "Primary content goes here. This is the main focus of the slide.",
        ),
        paragraph("Add additional paragraphs as needed for your content."),
      ),
      // Sidebar column for supplementary info
      column(
        heading(3, "Sidebar"),
        paragraph("Quick facts, notes, or supplementary information."),
      ),
    ),
  ),
};

/**
 * Blank Layout
 *
 * An empty layout with just a placeholder paragraph.
 * Useful as a starting point for custom content.
 *
 * Structure:
 * - Empty paragraph (placeholder)
 */
const blankLayout: SlideLayout = {
  id: "blank",
  name: "Blank",
  description: "An empty slide to start from scratch",
  content: wrap(
    // Single empty paragraph as a starting point
    emptyParagraph(),
  ),
};

// ============================================================================
// Image Layouts
// ============================================================================

/**
 * Image and Text Layout
 *
 * A layout with image on the left and text on the right.
 *
 * Structure:
 * - Row:
 *   - Column 1: Image
 *   - Column 2: Heading + paragraph
 */
const imageAndTextLayout: SlideLayout = {
  id: "image-and-text",
  name: "Image and Text",
  description: "Image on the left, text on the right",
  content: wrap(
    row(
      column(image()),
      column(heading(2, "Title"), paragraph("Add your description here")),
    ),
  ),
};

/**
 * Text and Image Layout
 *
 * A layout with text on the left and image on the right.
 *
 * Structure:
 * - Row:
 *   - Column 1: Heading + paragraph
 *   - Column 2: Image
 */
const textAndImageLayout: SlideLayout = {
  id: "text-and-image",
  name: "Text and Image",
  description: "Text on the left, image on the right",
  content: wrap(
    row(
      column(heading(2, "Title"), paragraph("Add your description here")),
      column(image()),
    ),
  ),
};

/**
 * Title with Text and Image Layout
 *
 * A layout with a title, followed by text and image columns.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Row:
 *   - Column 1: Paragraph
 *   - Column 2: Image
 */
const titleTextImageLayout: SlideLayout = {
  id: "title-text-image",
  name: "Title with Text and Image",
  description: "A title with text on the left and image on the right",
  content: wrap(
    heading(1, "Section Title"),
    row(
      column(
        paragraph(
          "Add your main content here. This text will appear next to the image.",
        ),
      ),
      column(image()),
    ),
  ),
};

/**
 * Two Image Columns with Text Layout
 *
 * A layout with a title and two columns, each with an image and text.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Row:
 *   - Column 1: Image + heading + paragraph
 *   - Column 2: Image + heading + paragraph
 */
const twoImageColumnsLayout: SlideLayout = {
  id: "two-image-columns",
  name: "2 Image Columns",
  description: "Title with two image-text columns",
  content: wrap(
    heading(1, "Section Title"),
    row(
      column(image(), heading(3, "Caption 1"), paragraph("Description")),
      column(image(), heading(3, "Caption 2"), paragraph("Description")),
    ),
  ),
};

/**
 * Three Image Columns with Text Layout
 *
 * A layout with a title and three columns, each with an image and text.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Row:
 *   - Column 1-3: Image + heading + paragraph
 */
const threeImageColumnsLayout: SlideLayout = {
  id: "three-image-columns",
  name: "3 Image Columns",
  description: "Title with three image-text columns",
  content: wrap(
    heading(1, "Section Title"),
    row(
      column(image(), heading(3, "Caption 1"), paragraph("Description")),
      column(image(), heading(3, "Caption 2"), paragraph("Description")),
      column(image(), heading(3, "Caption 3"), paragraph("Description")),
    ),
  ),
};

/**
 * Four Image Columns with Text Layout
 *
 * A layout with a title and four columns, each with an image and text.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Row:
 *   - Column 1-4: Image + heading + paragraph
 */
const fourImageColumnsLayout: SlideLayout = {
  id: "four-image-columns",
  name: "4 Image Columns",
  description: "Title with four image-text columns",
  content: wrap(
    heading(1, "Section Title"),
    row(
      column(image(), heading(3, "Caption 1"), paragraph("Description")),
      column(image(), heading(3, "Caption 2"), paragraph("Description")),
      column(image(), heading(3, "Caption 3"), paragraph("Description")),
      column(image(), heading(3, "Caption 4"), paragraph("Description")),
    ),
  ),
};

/**
 * Image Gallery Layout
 *
 * A layout with a title and three image columns (no text).
 *
 * Structure:
 * - Heading (level 1): Title
 * - Row:
 *   - Column 1-3: Image only
 */
const imageGalleryLayout: SlideLayout = {
  id: "image-gallery",
  name: "Image Gallery",
  description: "Title with three images in a row",
  content: wrap(heading(1, "Gallery Title"), row(column(image()), column(image()), column(image()))),
};

// ============================================================================
// Full-Width/Full-Height Image Layouts
// ============================================================================

/**
 * Image Top Layout
 *
 * A layout with a full-width image at the top and content below.
 *
 * Structure:
 * - Image (full-top, absolutely positioned)
 * - Heading
 * - Paragraph
 */
const imageTopLayout: SlideLayout = {
  id: "image-top",
  name: "Image Top",
  description: "Full-width image at top with content below",
  content: wrap(
    image(null, "full-top"),
    heading(2, "Title"),
    paragraph("Add your description here"),
  ),
};

/**
 * Image Bottom Layout
 *
 * A layout with content at the top and a full-width image at the bottom.
 *
 * Structure:
 * - Heading
 * - Paragraph
 * - Image (full-bottom, absolutely positioned)
 */
const imageBottomLayout: SlideLayout = {
  id: "image-bottom",
  name: "Image Bottom",
  description: "Content at top with full-width image below",
  content: wrap(
    heading(2, "Title"),
    paragraph("Add your description here"),
    image(null, "full-bottom"),
  ),
};

/**
 * Full Image Left Layout
 *
 * A layout with a full-height image on the left and content on the right.
 *
 * Structure:
 * - Image (full-left, absolutely positioned)
 * - Heading + paragraphs (with left padding to avoid overlap)
 */
const fullImageLeftLayout: SlideLayout = {
  id: "full-image-left",
  name: "Full Image Left",
  description: "Full-height image on left, content on right",
  content: wrap(
    image(null, "full-left"),
    heading(1, "Title"),
    paragraph("Add your main content here."),
    paragraph("Additional details can go in this paragraph."),
  ),
};

/**
 * Full Image Right Layout
 *
 * A layout with content on the left and a full-height image on the right.
 *
 * Structure:
 * - Image (full-right, absolutely positioned)
 * - Heading + paragraphs (with right padding to avoid overlap)
 */
const fullImageRightLayout: SlideLayout = {
  id: "full-image-right",
  name: "Full Image Right",
  description: "Content on left, full-height image on right",
  content: wrap(
    image(null, "full-right"),
    heading(1, "Title"),
    paragraph("Add your main content here."),
    paragraph("Additional details can go in this paragraph."),
  ),
};

/**
 * Image Header Layout
 *
 * A layout with a full-width image header, title, and content.
 *
 * Structure:
 * - Image (full-top, absolutely positioned)
 * - Heading
 * - Row with two text columns
 */
const imageHeaderLayout: SlideLayout = {
  id: "image-header",
  name: "Image Header",
  description: "Full-width image header with title and columns",
  content: wrap(
    image(null, "full-top"),
    heading(1, "Section Title"),
    row(
      column(paragraph("Left column content")),
      column(paragraph("Right column content")),
    ),
  ),
};

/**
 * Image Footer Layout
 *
 * A layout with title, content, and a full-width image footer.
 *
 * Structure:
 * - Heading
 * - Row with two text columns
 * - Image (full width footer)
 */
const imageFooterLayout: SlideLayout = {
  id: "image-footer",
  name: "Image Footer",
  description: "Title and columns with full-width image footer",
  content: wrap(
    heading(1, "Section Title"),
    row(
      column(paragraph("Left column content")),
      column(paragraph("Right column content")),
    ),
    image(null, "full-bottom"),
  ),
};

/**
 * Quote Layout
 *
 * A layout designed for featuring a quote or statement.
 *
 * Structure:
 * - Heading (level 2): The quote
 * - Paragraph: Attribution
 */
const quoteLayout: SlideLayout = {
  id: "quote",
  name: "Quote",
  description: "A prominent quote with attribution",
  content: wrap(
    heading(2, '"Your inspiring quote goes here"'),
    paragraph("— Author Name"),
  ),
};

// ============================================================================
// List Layouts
// ============================================================================

/**
 * Bullet List Layout
 *
 * A simple layout with a title and bullet points.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Bullet list with items
 */
const bulletListLayout: SlideLayout = {
  id: "bullet-list",
  name: "Bullet List",
  description: "A title with bullet points",
  content: wrap(
    heading(1, "Key Points"),
    bulletList(
      "First important point",
      "Second important point",
      "Third important point",
    ),
  ),
};

/**
 * Numbered List Layout
 *
 * A simple layout with a title and numbered steps.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Ordered list with items
 */
const numberedListLayout: SlideLayout = {
  id: "numbered-list",
  name: "Numbered List",
  description: "A title with numbered steps",
  content: wrap(
    heading(1, "Steps to Follow"),
    orderedList([
      "First step in the process",
      "Second step in the process",
      "Third step in the process",
    ]),
  ),
};

/**
 * Two Column List Layout
 *
 * A layout with two columns, each containing a list.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Row:
 *   - Column 1: Heading + bullet list
 *   - Column 2: Heading + bullet list
 */
const twoColumnListLayout: SlideLayout = {
  id: "two-column-list",
  name: "Two Column List",
  description: "Two columns with bullet lists",
  content: wrap(
    heading(1, "Comparison"),
    row(
      column(
        heading(2, "Pros"),
        bulletList("Advantage one", "Advantage two", "Advantage three"),
      ),
      column(
        heading(2, "Cons"),
        bulletList("Disadvantage one", "Disadvantage two", "Disadvantage three"),
      ),
    ),
  ),
};

/**
 * Content with List Layout
 *
 * A layout with text and a supporting bullet list.
 *
 * Structure:
 * - Heading (level 1): Title
 * - Paragraph: Introduction
 * - Bullet list: Key points
 */
const contentWithListLayout: SlideLayout = {
  id: "content-with-list",
  name: "Content with List",
  description: "Paragraph text followed by bullet points",
  content: wrap(
    heading(1, "Overview"),
    paragraph(
      "Here is an introduction to the topic. This paragraph provides context for the points below.",
    ),
    bulletList(
      "Supporting point one",
      "Supporting point two",
      "Supporting point three",
    ),
  ),
};

/**
 * Image and List Layout
 *
 * A layout with an image on one side and a list on the other.
 *
 * Structure:
 * - Row:
 *   - Column 1: Image
 *   - Column 2: Heading + bullet list
 */
const imageAndListLayout: SlideLayout = {
  id: "image-and-list",
  name: "Image and List",
  description: "Image on left, bullet list on right",
  content: wrap(
    row(
      column(image()),
      column(
        heading(2, "Key Features"),
        bulletList("Feature one", "Feature two", "Feature three"),
      ),
    ),
  ),
};

/**
 * Agenda Layout
 *
 * A layout designed for meeting agendas or presentation outlines.
 *
 * Structure:
 * - Heading (level 1): Agenda title
 * - Ordered list: Agenda items
 */
const agendaLayout: SlideLayout = {
  id: "agenda",
  name: "Agenda",
  description: "Meeting agenda or presentation outline",
  content: wrap(
    heading(1, "Agenda"),
    orderedList([
      "Introduction and welcome",
      "Review of previous items",
      "Main discussion topic",
      "Action items and next steps",
      "Q&A and closing",
    ]),
  ),
};

/**
 * Section Header Layout
 *
 * A layout for marking new sections in a presentation.
 *
 * Structure:
 * - Heading (level 1): Section title
 * - Heading (level 3): Section number or subtitle
 */
const sectionHeaderLayout: SlideLayout = {
  id: "section-header",
  name: "Section Header",
  description: "A section divider with title and subtitle",
  content: wrap(heading(3, "Section 01"), heading(1, "Section Title")),
};

/**
 * Line Chart Layout
 *
 * A layout with a title and a line chart below.
 */
const lineChartLayout: SlideLayout = {
  id: "line-chart",
  name: "Line Chart",
  description: "A title with a line chart",
  content: wrap(heading(1, "Performance Over Time"), chart("line")),
};

/**
 * Bar Chart Layout
 *
 * A layout with a title and a bar chart below.
 */
const barChartLayout: SlideLayout = {
  id: "bar-chart",
  name: "Bar Chart",
  description: "A title with a bar chart",
  content: wrap(heading(1, "Category Breakdown"), chart("bar")),
};

/**
 * Pie Chart Layout
 *
 * A layout with a title and a pie chart below.
 */
const pieChartLayout: SlideLayout = {
  id: "pie-chart",
  name: "Pie Chart",
  description: "A title with a pie chart",
  content: wrap(heading(1, "Share of Total"), chart("pie")),
};

// ============================================================================
// Exports
// ============================================================================

/**
 * Layout category for grouping in UI
 */
export interface LayoutCategory {
  id: string;
  name: string;
  layouts: SlideLayout[];
}

/**
 * Array of all available slide layouts grouped by category.
 */
export const layoutCategories: LayoutCategory[] = [
  {
    id: "text",
    name: "Text Layouts",
    layouts: [
      titleLayout,
      titleOnlyLayout,
      contentLayout,
      twoColumnLayout,
      twoColumnTextLayout,
      threeColumnLayout,
      fourColumnLayout,
      sidebarLayout,
      sectionHeaderLayout,
      quoteLayout,
      blankLayout,
    ],
  },
  {
    id: "list",
    name: "List Layouts",
    layouts: [
      bulletListLayout,
      numberedListLayout,
      twoColumnListLayout,
      contentWithListLayout,
      imageAndListLayout,
      agendaLayout,
    ],
  },
  {
    id: "image",
    name: "Image Layouts",
    layouts: [
      imageAndTextLayout,
      textAndImageLayout,
      titleTextImageLayout,
      twoImageColumnsLayout,
      threeImageColumnsLayout,
      fourImageColumnsLayout,
      imageGalleryLayout,
    ],
  },
  {
    id: "full-image",
    name: "Full Image Layouts",
    layouts: [
      imageTopLayout,
      imageBottomLayout,
      fullImageLeftLayout,
      fullImageRightLayout,
      imageHeaderLayout,
      imageFooterLayout,
    ],
  },
  {
    id: "charts",
    name: "Chart Layouts",
    layouts: [lineChartLayout, barChartLayout, pieChartLayout],
  },
];

/**
 * Array of all available slide layouts (flat list).
 * Use this to populate a layout picker or menu.
 */
export const layouts: SlideLayout[] = layoutCategories.flatMap(
  (category) => category.layouts,
);

/**
 * Get a layout by its ID
 * @param id - The layout ID to find
 * @returns The matching layout or undefined
 */
export const getLayoutById = (id: string): SlideLayout | undefined => {
  return layouts.find((layout) => layout.id === id);
};

/**
 * Insert a layout into the editor
 * @param editor - The Tiptap editor instance
 * @param layoutId - The ID of the layout to insert
 * @returns true if the layout was inserted, false if not found
 *
 * @example
 * ```ts
 * import { insertLayout } from './layouts';
 *
 * // Insert a two-column layout
 * insertLayout(editor, 'two-column');
 * ```
 */
export const insertLayout = (
  editor: { commands: { insertContent: (content: Content) => boolean } },
  layoutId: string,
): boolean => {
  const layout = getLayoutById(layoutId);
  if (!layout) {
    console.warn(`Layout with id "${layoutId}" not found`);
    return false;
  }
  return editor.commands.insertContent(layout.content);
};

/**
 * Replace the entire editor content with a layout
 * @param editor - The Tiptap editor instance
 * @param layoutId - The ID of the layout to use
 * @returns true if the layout was set, false if not found
 *
 * @example
 * ```ts
 * import { setLayout } from './layouts';
 *
 * // Replace content with title layout
 * setLayout(editor, 'title');
 * ```
 */
export const setLayout = (
  editor: { commands: { setContent: (content: Content) => boolean } },
  layoutId: string,
): boolean => {
  const layout = getLayoutById(layoutId);
  if (!layout) {
    console.warn(`Layout with id "${layoutId}" not found`);
    return false;
  }
  return editor.commands.setContent(layout.content);
};

// Also export individual layouts for direct access
export {
  titleLayout,
  titleOnlyLayout,
  contentLayout,
  twoColumnLayout,
  twoColumnTextLayout,
  threeColumnLayout,
  fourColumnLayout,
  sidebarLayout,
  sectionHeaderLayout,
  quoteLayout,
  blankLayout,
  // List layouts
  bulletListLayout,
  numberedListLayout,
  twoColumnListLayout,
  contentWithListLayout,
  imageAndListLayout,
  agendaLayout,
  // Image layouts
  imageAndTextLayout,
  textAndImageLayout,
  titleTextImageLayout,
  twoImageColumnsLayout,
  threeImageColumnsLayout,
  fourImageColumnsLayout,
  imageGalleryLayout,
  // Full image layouts
  imageTopLayout,
  imageBottomLayout,
  fullImageLeftLayout,
  fullImageRightLayout,
  imageHeaderLayout,
  imageFooterLayout,
  // Chart layouts
  lineChartLayout,
  barChartLayout,
  pieChartLayout,
};

// Export helper functions for creating custom layouts
export {
  text,
  heading,
  paragraph,
  emptyParagraph,
  column,
  row,
  image,
  chart,
  listItem,
  bulletList,
  orderedList,
};
