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
