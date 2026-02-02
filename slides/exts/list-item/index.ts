import ListItem from "@tiptap/extension-list-item";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { ListItemView } from "./view";
import { NodeName } from "@/slides/slides.utils";

export const ListItemExt = ListItem.extend({
  name: NodeName.LIST_ITEM,

  addNodeView() {
    return ReactNodeViewRenderer(ListItemView);
  },
});
