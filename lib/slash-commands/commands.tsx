import {
  Heading1,
  Heading2,
  Heading3,
  Text,
  Link,
  Calendar,
  FileText,
  Sparkles,
} from "lucide-react";
import type { SlashCommand } from "./types";

export const defaultCommands: SlashCommand[] = [
  {
    id: "heading1",
    title: "Heading 1",
    description: "Large section heading",
    icon: <Heading1 className="h-4 w-4" />,
    keywords: ["h1", "title", "heading"],
    action: (editor) => {
      editor.chain().focus().setHeading({ level: 1 }).run();
    },
  },
  {
    id: "heading2",
    title: "Heading 2",
    description: "Medium section heading",
    icon: <Heading2 className="h-4 w-4" />,
    keywords: ["h2", "subtitle", "heading"],
    action: (editor) => {
      editor.chain().focus().setHeading({ level: 2 }).run();
    },
  },
  {
    id: "heading3",
    title: "Heading 3",
    description: "Small section heading",
    icon: <Heading3 className="h-4 w-4" />,
    keywords: ["h3", "heading"],
    action: (editor) => {
      editor.chain().focus().setHeading({ level: 3 }).run();
    },
  },
  {
    id: "paragraph",
    title: "Paragraph",
    description: "Plain text paragraph",
    icon: <Text className="h-4 w-4" />,
    keywords: ["text", "p", "normal"],
    action: (editor) => {
      editor.chain().focus().setParagraph().run();
    },
  },
  {
    id: "insertLink",
    title: "Link",
    description: "Insert a hyperlink",
    icon: <Link className="h-4 w-4" />,
    keywords: ["link", "url", "href", "anchor"],
    action: (editor) => {
      const url = window.prompt("Enter URL:");
      if (url) {
        const text = window.prompt("Enter link text:", url);
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${url}">${text || url}</a>`)
          .run();
      }
    },
  },
  {
    id: "insertDate",
    title: "Today's Date",
    description: "Insert current date",
    icon: <Calendar className="h-4 w-4" />,
    keywords: ["date", "today", "now", "time"],
    action: (editor) => {
      const date = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      editor.chain().focus().insertContent(date).run();
    },
  },
  {
    id: "insertLoremIpsum",
    title: "Lorem Ipsum",
    description: "Insert placeholder text",
    icon: <FileText className="h-4 w-4" />,
    keywords: ["lorem", "placeholder", "dummy", "text"],
    action: (editor) => {
      editor
        .chain()
        .focus()
        .insertContent(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        )
        .run();
    },
  },
  {
    id: "insertCallout",
    title: "Callout",
    description: "Insert highlighted text",
    icon: <Sparkles className="h-4 w-4" />,
    keywords: ["callout", "highlight", "note", "important"],
    action: (editor) => {
      editor
        .chain()
        .focus()
        .insertContent("✨ Important note: Add your text here")
        .run();
    },
  },
];

export function filterCommands(
  commands: SlashCommand[],
  query: string
): SlashCommand[] {
  if (!query) return commands;

  const lowerQuery = query.toLowerCase();

  return commands.filter((command) => {
    const titleMatch = command.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = command.description
      ?.toLowerCase()
      .includes(lowerQuery);
    const keywordMatch = command.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(lowerQuery)
    );

    return titleMatch || descriptionMatch || keywordMatch;
  });
}
