export type Coords = { x: number; y: number };

export type NodeParams = {
  getPos: () => number | undefined;
  size: number;
};
