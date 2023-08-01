import * as comps from 'components';
import ReactDOM from 'react-dom';

function getHostNode(id = 'root') {
  let node = document.getElementById(id);
  if (!node) {
    node = document.createElement('div');
    node.id = id;
    document.body.appendChild(node);
  }
  return node;
}

const { REACT_APP_COMP_TYPE = 'HelloRemoteReactComp' } = process.env;
// @ts-ignore
const Comp = comps[REACT_APP_COMP_TYPE] || (() => <h1>comp {REACT_APP_COMP_TYPE} not defined</h1>);

ReactDOM.render(<Comp />, getHostNode('root'));
