import { NodeName } from "@/slides/slides.utils";
import { Plugin } from "@tiptap/pm/state";

export const rowNormalizationPlugin = new Plugin({
  appendTransaction(transactions, oldState, newState) {
    // Only run if something actually changed
    if (!transactions.some((tr) => tr.docChanged)) return null;

    const tr = newState.tr;

    let modified = false;

    // Track position offset as we modify the document
    let offset = 0;

    newState.doc.descendants((node, pos) => {
      if (node.type.name !== NodeName.ROW) return;

      const adjustedPos = pos + offset;

      // If row has only 1 column, flatten it (remove row wrapper)
      if (node.childCount === 1) {
        const col = node.child(0);
        tr.replaceWith(adjustedPos, adjustedPos + node.nodeSize, col.content);
        // Update offset for position changes
        offset += col.content.size - node.nodeSize;
        modified = true;
        return false; // Stop recursing into replaced content
      }

      // Sync columnWidths array with actual column count
      const columnWidths: number[] = node.attrs.columnWidths || [];
      const childCount = node.childCount;

      if (columnWidths.length !== childCount) {
        let newWidths: number[];

        if (columnWidths.length < childCount) {
          // Add default width (1) for new columns
          newWidths = [
            ...columnWidths,
            ...Array(childCount - columnWidths.length).fill(1),
          ];
        } else {
          // Remove extra widths (keep first N matching column count)
          newWidths = columnWidths.slice(0, childCount);
        }

        tr.setNodeMarkup(adjustedPos, undefined, { columnWidths: newWidths });
        modified = true;
      }
    });

    return modified ? tr : null;
  },
});
