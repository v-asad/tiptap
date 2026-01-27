import { DragDropProvider } from "@dnd-kit/react";
import { PropsWithChildren } from "react";

export const DnDProvider = (props: PropsWithChildren) => {
  return <DragDropProvider>{props.children}</DragDropProvider>;
};
