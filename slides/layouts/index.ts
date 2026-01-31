/**
 * Slide Layouts Module
 *
 * This module exports predefined slide layouts as JavaScript objects
 * that can be inserted into Tiptap via `editor.commands.insertContent()`.
 *
 * Each layout follows the Tiptap JSON node structure:
 * - `type`: The node type name (e.g., "heading", "paragraph", "row", "column")
 * - `attrs`: Optional attributes for the node (e.g., { level: 1 } for headings)
 * - `content`: An array of child nodes or text nodes
 *
 * Text nodes have the structure: { type: "text", text: "content" }
 */

import type { JSONContent } from "@tiptap/react";

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
  /** The Tiptap-compatible content structure */
  content: JSONContent[];
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates a text node with the given content
 */
const text = (content: string): JSONContent => ({
  type: "text",
  text: content,
});

/**
 * Creates a heading node with specified level and text
 * @param level - Heading level (1-6)
 * @param content - Text content for the heading
 */
const heading = (level: number, content: string): JSONContent => ({
  type: "heading",
  attrs: { level },
  content: [text(content)],
});

/**
 * Creates a paragraph node with the given text
 * @param content - Text content for the paragraph
 */
const paragraph = (content: string): JSONContent => ({
  type: "paragraph",
  content: [text(content)],
});

/**
 * Creates an empty paragraph node (useful for spacing or placeholders)
 */
const emptyParagraph = (): JSONContent => ({
  type: "paragraph",
});

/**
 * Creates an image node with optional src
 * @param src - Optional image URL (null for placeholder)
 */
const image = (src: string | null = null): JSONContent => ({
  type: "image",
  attrs: { src },
});

/**
 * Creates a column node containing the specified block nodes
 * @param children - Array of block nodes (headings, paragraphs, etc.)
 */
const column = (...children: JSONContent[]): JSONContent => ({
  type: "column",
  content: children,
});

/**
 * Creates a row node containing the specified columns
 * Note: Maximum of 4 columns per row (enforced by ROW_CONFIG.MAX_COL_COUNT)
 * @param columns - Array of column nodes
 */
const row = (...columns: JSONContent[]): JSONContent => ({
  type: "row",
  attrs: {
    // Set equal widths for all columns (1fr each)
    columnWidths: columns.map(() => 1),
  },
  content: columns,
});

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
  content: [
    // Main title - uses level 1 heading for maximum prominence
    heading(1, "Slide Title"),
    // Description paragraph below the title
    paragraph("Add your description or subtitle here"),
  ],
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
  content: [
    // Single heading for maximum impact
    heading(1, "Slide Title"),
  ],
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
  content: [
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
  ],
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
  content: [
    // Main section heading
    heading(1, "Section Title"),
    // Row containing three columns
    row(
      column(heading(2, "Column 1"), paragraph("First column content")),
      column(heading(2, "Column 2"), paragraph("Second column content")),
      column(heading(2, "Column 3"), paragraph("Third column content")),
    ),
  ],
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
  content: [
    heading(1, "Section Title"),
    row(
      column(heading(3, "Point 1"), paragraph("Description")),
      column(heading(3, "Point 2"), paragraph("Description")),
      column(heading(3, "Point 3"), paragraph("Description")),
      column(heading(3, "Point 4"), paragraph("Description")),
    ),
  ],
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
  content: [
    heading(1, "Content Title"),
    paragraph("First paragraph of content. Add your main points here."),
    paragraph(
      "Second paragraph with additional details or supporting information.",
    ),
  ],
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
  content: [
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
  ],
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
  content: [
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
  ],
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
  content: [
    // Single empty paragraph as a starting point
    emptyParagraph(),
  ],
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
  content: [
    row(
      column(image()),
      column(heading(2, "Title"), paragraph("Add your description here")),
    ),
  ],
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
  content: [
    row(
      column(heading(2, "Title"), paragraph("Add your description here")),
      column(image()),
    ),
  ],
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
  content: [
    heading(1, "Section Title"),
    row(
      column(
        paragraph(
          "Add your main content here. This text will appear next to the image.",
        ),
      ),
      column(image()),
    ),
  ],
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
  content: [
    heading(1, "Section Title"),
    row(
      column(image(), heading(3, "Caption 1"), paragraph("Description")),
      column(image(), heading(3, "Caption 2"), paragraph("Description")),
    ),
  ],
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
  content: [
    heading(1, "Section Title"),
    row(
      column(image(), heading(3, "Caption 1"), paragraph("Description")),
      column(image(), heading(3, "Caption 2"), paragraph("Description")),
      column(image(), heading(3, "Caption 3"), paragraph("Description")),
    ),
  ],
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
  content: [
    heading(1, "Section Title"),
    row(
      column(image(), heading(3, "Caption 1"), paragraph("Description")),
      column(image(), heading(3, "Caption 2"), paragraph("Description")),
      column(image(), heading(3, "Caption 3"), paragraph("Description")),
      column(image(), heading(3, "Caption 4"), paragraph("Description")),
    ),
  ],
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
  content: [heading(1, "Gallery Title"), row(column(image()), column(image()), column(image()))],
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
  content: [
    heading(2, '"Your inspiring quote goes here"'),
    paragraph("— Author Name"),
  ],
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
  content: [heading(3, "Section 01"), heading(1, "Section Title")],
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
  editor: { commands: { insertContent: (content: JSONContent[]) => boolean } },
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
  editor: { commands: { setContent: (content: JSONContent) => boolean } },
  layoutId: string,
): boolean => {
  const layout = getLayoutById(layoutId);
  if (!layout) {
    console.warn(`Layout with id "${layoutId}" not found`);
    return false;
  }
  // Wrap content in a doc node for setContent
  return editor.commands.setContent({
    type: "doc",
    content: layout.content,
  });
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
  // Image layouts
  imageAndTextLayout,
  textAndImageLayout,
  titleTextImageLayout,
  twoImageColumnsLayout,
  threeImageColumnsLayout,
  fourImageColumnsLayout,
  imageGalleryLayout,
};

// Export helper functions for creating custom layouts
export { text, heading, paragraph, emptyParagraph, column, row, image };
