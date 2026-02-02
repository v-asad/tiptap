import OrderedList from "@tiptap/extension-ordered-list";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { OrderedListView } from "./view";
import { NodeName } from "@/slides/slides.utils";

export const OrderedListExt = OrderedList.extend({
  name: NodeName.ORDERED_LIST,

  addNodeView() {
    return ReactNodeViewRenderer(OrderedListView);
  },
});
