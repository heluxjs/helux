import ReactDOM from 'react-dom';
import React from 'react';
import { CC_DISPATCHER_BOX } from '../../support/constant';

export default (Dispatcher) => {
  let box = document.querySelector(`#${CC_DISPATCHER_BOX}`);
  if (!box) {
    box = document.createElement('div');
    box.id = CC_DISPATCHER_BOX;
    const boxSt = box.style;
    boxSt.position = 'fixed';
    boxSt.left = 0;
    boxSt.top = 0;
    boxSt.display = 'none';
    boxSt.zIndex = -888666;
    document.body.append(box);
  }
  ReactDOM.render(React.createElement(Dispatcher), box);
}
