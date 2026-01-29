import { Editor } from "@tiptap/core";
import { NodeName } from "../slides.utils";

export type Coords = { x: number; y: number };

export type BoundingRect = {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type NodeInfo = {
  pos: number;
  name: NodeName;
  size: number;
  parentName: NodeName;
};

export type NodeParams = {
  getNodeInfo: () => NodeInfo | null;
};

export enum CollisionPriority {
  Lowest = 0,
  Low = 1,
  Normal = 2,
  High = 3,
  Highest = 4,
}

export type NodeType = Editor["state"]["doc"];
