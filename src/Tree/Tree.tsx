export type CheckState = number;

export interface INode {
  value: string;
  label: string;
  children: INode[];
  state: CheckState;
  expanded: boolean;
}