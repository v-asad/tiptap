export type Coords = { x: number; y: number };

export type NodeParams = {
  getNodeInfo: () => {
    pos: number;
    name: string;
    size: number;
    parentName: string;
  } | null;
};
