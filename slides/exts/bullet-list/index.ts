import BulletList from "@tiptap/extension-bullet-list";
import { ReactNodeViewRenderer } from "@tiptap/react";

import { BulletListView } from "./view";
import { NodeName } from "@/slides/slides.utils";

export const BulletListExt = BulletList.extend({
  name: NodeName.BULLET_LIST,

  addNodeView() {
    return ReactNodeViewRenderer(BulletListView);
  },
});
