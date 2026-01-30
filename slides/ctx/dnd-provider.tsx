import { PointerActivationConstraints } from "@dnd-kit/dom";
import { DragDropProvider, PointerSensor } from "@dnd-kit/react";
import { PropsWithChildren } from "react";

export const DnDProvider = (props: PropsWithChildren) => {
  return (
    <DragDropProvider
      sensors={[
        PointerSensor.configure({
          activationConstraints: [
            new PointerActivationConstraints.Distance({
              value: 5,
              tolerance: 10,
            }),
          ],
        }),
      ]}
    >
      {props.children}
    </DragDropProvider>
  );
};
