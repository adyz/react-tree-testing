import { INode } from "./Tree/Tree";

function nest(start: number, limit: number): INode[] {
  const parents = [];
  start = start + 1;
  while (limit > 0) {
    limit = limit - 1;
    parents.push({
      expanded: false,
      state: 0,
      value: `node-0-${limit}-${start}`,
      label: `Node 0-${limit}-${start}`,
      children: nest(start, limit)
    });
  }
  return parents;
}

const nodes = nest(1, 12);

export default nodes;
