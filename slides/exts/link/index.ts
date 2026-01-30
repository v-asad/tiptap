import Link from "@tiptap/extension-link";

export const LinkExt = Link.configure({
  openOnClick: true,

  autolink: true,

  defaultProtocol: "https",

  HTMLAttributes: {
    class: "editor-link",
    rel: "noopener noreferrer",
    target: "_blank",
  },
});
