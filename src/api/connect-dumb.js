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

function _connectDumb(connect, mapState, alias, Dumb, props) {
  const render = (cc) => {
    const { connectedState } = cc;
    let flatedObj;
    if (mapState) {
      flatedObj = mapState(connectedState, props) || {};
    } else {
      flatedObj = util.flatObject(connectedState, alias);
    }

    return React.createElement(Dumb, { state: flatedObj, connectedState, cc, props });
  };
  return React.createElement(CcFragment, { connect, render });
}

export default ({ connect, alias = {}, mapState = {} }) => Dumb => (props) => {
  return _connectDumb(connect, mapState, alias, Dumb, props);
}
