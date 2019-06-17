import CcFragment from '../component/CcFragment';
import * as util from '../support/util';
import React from 'react';

/**
mapComputed = {
  fullName(state){
    return state.firstName + state.lastName;
  }
};
*/

function _connectDumb(connect, state, setup, mapState, alias, Dumb, props) {
  const render = (ctx) => {
    let mappedState = {};
    if (mapState) {
      const { state, connectedState } = ctx;
      if (mapState === true) {
        mappedState = util.flatObject(connectedState, alias);
      } else {
        mappedState = mapState(state, connectedState, props) || {};
      }
    }
    return React.createElement(Dumb, { mappedState, ctx, props });
  };

  return React.createElement(CcFragment, { props, connect, state, setup, render });
}

export default ({ connect, state, setup, alias = {}, mapState }) => Dumb => {
  //这样写可以避免react dev tool显示的dom为Unknown
  const ConnectedFragment = props => _connectDumb(connect, state, setup, mapState, alias, Dumb, props);
  return ConnectedFragment;
}
