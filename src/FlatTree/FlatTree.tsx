import * as React from 'react';
import flattenObject from '../flatten';
import NativeCheckbox from '../Tree/NativeCheckbox';

interface FlatTreeProps {
  nodes: any[];
}

interface FlatTreeState {
  nodes: any[];
}

export default class FlatTree extends React.Component<
  FlatTreeProps,
  FlatTreeState
> {
  constructor(props: FlatTreeProps) {
    super(props);

    this.state = {
      nodes: []
    };
  }

  componentDidMount() {
    console.log('FlatTree Mounted');

    this.setState(prevState => {
      return {
        ...prevState,
        nodes: flattenObject(this.props.nodes)
      };
    });
  }

  public expand = (e: any) => {
    const index = e.currentTarget.dataset.index;

    this.setState(prevState => {
      const isExpanded = prevState.nodes[index].expanded;

      console.log({ isExpanded });

      prevState.nodes[index] = {
        ...prevState.nodes[index],
        expanded: !isExpanded
      };

      Object.keys(prevState.nodes).forEach(nodeKey => {
        if (
          prevState.nodes[nodeKey].path.startsWith(index) &&
          prevState.nodes[nodeKey].path !== index
        ) {
          prevState.nodes[nodeKey].visible = !isExpanded;
        }
      });

      return {
        nodes: prevState.nodes
      };
    });
  }

  public handleChange = (e: any) => {
    const { currentTarget } = e;
    const index = currentTarget.dataset.index;
    const isChecked = currentTarget.checked ? 1 : 0;

    console.log('Handle change', { index });

    this.setState(prevState => {
      Object.keys(prevState.nodes).forEach(nodeKey => {
        if (prevState.nodes[nodeKey].path.startsWith(index)) {
          prevState.nodes[nodeKey].state = isChecked;
        }
      });

      prevState.nodes[index] = {
        ...prevState.nodes[index],
        state: isChecked
      };
      return {
        nodes: prevState.nodes
      };
    });
  }

  public render() {
    const { nodes } = this.state;
    return (
      <React.Fragment>
        <h1>Hello</h1>
        {Object.keys(nodes).map((nodeKey: any) => {
          const superDisplay =
            nodes[nodes[nodeKey].parent] === undefined
              ? true
              : nodes[nodeKey].visible
              ? nodes[nodes[nodeKey].parent].expanded
                ? true
                : false
              : false;
          return (
            superDisplay && (
              <div key={nodeKey}>
                <p
                  style={{
                    paddingLeft: nodes[nodeKey].path.length * 10 + 'px'
                  }}
                >
                  {nodes[nodeKey].children ? (
                    <button data-index={nodeKey} onClick={this.expand}>
                      {nodes[nodeKey].expanded ? '-' : '+'}
                    </button>
                  ) : (
                    '*'
                  )}
                  <NativeCheckbox
                    checked={nodes[nodeKey].state === 1}
                    indeterminate={nodes[nodeKey].state === 2}
                    data-index={nodeKey}
                    onChange={this.handleChange}
                    id={nodes[nodeKey].path}
                  />
                  <label htmlFor={nodes[nodeKey].path}>
                    {nodes[nodeKey].path}{' '}
                  </label>
                </p>
              </div>
            )
          );
        })}
      </React.Fragment>
    );
  }
}
