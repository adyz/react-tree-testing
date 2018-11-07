import * as React from "react";
import * as _ from "lodash";
import NativeCheckbox from "./NativeCheckbox";

export type CheckState = number;

export interface INode {
  value: string;
  label: string;
  children: INode[];
  state: CheckState;
  expanded: boolean;
}

interface TreeProps {
  nodes: INode[];
}

interface TreeState {
  nodes: INode[] | [];
}

export default class Tree extends React.Component<TreeProps, TreeState> {
  constructor(props: TreeProps) {
    super(props);

    this.state = {
      nodes: []
    };
  }

  componentDidMount() {
    console.log("Mounted");
    this.setState(() => {
      return {
        nodes: this.props.nodes
      };
    });
  }

  public toggleChildren = (nodes: any, checked: CheckState) => {
    return nodes.map((kid: any) => {
      return {
        ...kid,
        state: checked,
        ...(kid.children && {
          children: this.toggleChildren(kid.children, checked)
        })
      };
    });
  };

  public nodeHasChildren(node: INode) {
    return Array.isArray(node.children) && node.children.length > 0;
  }

  public checkParents = (access: string, isChecked: CheckState) => {
    let accessClone = access
      .replace(/\[(\w+)\]/g, ".$1")
      .replace(/^\./, "")
      .split(".")
      .filter(e => e !== "children");

    let myLevel = "";

    this.setState(prevState => {
      accessClone.forEach(level => {
        myLevel = myLevel + `${myLevel === "" ? "" : ".children."}${level}`;

        let isIndeterminate = false;

        let myNode = _.get(prevState.nodes, myLevel);

        if (this.nodeHasChildren(myNode)) {
          myNode.children.forEach((element: INode) => {
            if (element.state !== 2) {
              if (element.state !== isChecked) {
                isIndeterminate = true;
              }
            }
          });

          if (isIndeterminate) {
            myNode.state = 2;
          } else {
            myNode.state = isChecked;
          }
        }
      });
      return { ...prevState };
    });
  };

  public handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { currentTarget } = e;
    const access = currentTarget.dataset.access;
    const isChecked = currentTarget.checked ? 1 : 0;

    this.setState(prevState => {
      _.set(prevState.nodes, access + ".state", isChecked);

      if (_.has(prevState.nodes, access + ".children")) {
        const children = this.toggleChildren(
          _.get(prevState.nodes, access + ".children"),
          isChecked
        );
        _.set(prevState.nodes, access + ".children", children);
      }

      return {
        ...prevState
      };
    });

    this.checkParents(access, isChecked);
  };

  public toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const path = e.currentTarget.dataset.access + ".expanded";

    this.setState(prevState => {
      _.update(prevState.nodes, path, expanded => {
        return !expanded;
      });
      return {
        ...prevState
      };
    });
  };

  public renderItem(children: INode[], parentId: string, key: number) {
    return (
      <ul key={key}>
        {children.length > 0 &&
          children.map((children, childrenIndex) => (
            <li key={childrenIndex}>
              <span>
                {children.children &&
                  children.children.length > 0 && (
                    <button
                      data-value={children.value}
                      data-access={`${parentId}[${childrenIndex}]`}
                      onClick={this.toggle}
                    >
                      {children.expanded ? "-" : "+"}
                    </button>
                  )}

                <NativeCheckbox
                  onChange={this.handleChange}
                  checked={children.state === 1}
                  indeterminate={children.state === 2}
                  type="checkbox"
                  id={children.value}
                  data-access={`${parentId}[${childrenIndex}]`}
                />

                <label htmlFor={children.value}>
                  {children.label} / Parent:
                  {`${parentId}[${childrenIndex}].children`}
                </label>
              </span>

              {children.children &&
                children.expanded &&
                this.renderItem(
                  children.children,
                  `${parentId}[${childrenIndex}].children`,
                  childrenIndex
                )}
            </li>
          ))}
      </ul>
    );
  }

  public render() {
    return (
      <div>
        {this.state.nodes
          ? this.renderItem(this.state.nodes, "", 1)
          : "Pass nodes please"}
      </div>
    );
  }
}
