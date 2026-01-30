import { NodeName } from "@/slides/slides.utils";
import { Plugin } from "@tiptap/pm/state";

export const rowNormalizationPlugin = new Plugin({
  appendTransaction(transactions, oldState, newState) {
    // Only run if something actually changed
    if (!transactions.some((tr) => tr.docChanged)) return null;

    const tr = newState.tr;

    let modified = false;

    newState.doc.descendants((node, pos) => {
      if (node.type.name !== NodeName.ROW) return;
      if (node.childCount !== 1) return;

      const col = node.child(0);

      tr.replaceWith(pos, pos + node.nodeSize, col.content);

      modified = true;

      // Important: stop recursing into replaced content
      return true;
    });

    return modified ? tr : null;
  },
});
