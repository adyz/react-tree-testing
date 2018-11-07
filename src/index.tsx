import * as React from 'react';
import { render } from 'react-dom';

import FlatTree from './FlatTree/FlatTree';
import nodes from './nodes';

const App = () => (
  <div>
    <h2>Start editing to see some magic happen {'\u2728'}</h2>
    <FlatTree nodes={nodes} />
  </div>
);

render(<App />, document.getElementById('root'));
