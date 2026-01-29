export type Coords = { x: number; y: number };

export type NodeInfo = {
  pos: number;
  name: string;
  size: number;
  parentName: string;
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
