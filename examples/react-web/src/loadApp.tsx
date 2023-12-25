import React from 'react';
import ReactDOM from 'react-dom';
// import { addPlugin, addMiddleware } from 'helux';
// import { HeluxPluginDevtool } from '@helux/plugin-devtool';
import './index.css';
import App from './App';

// addPlugin(HeluxPluginDevtool);

// addMiddleware((mid) => {
//   console.log(mid);
// })

let rootNode = document.getElementById('root') as HTMLElement;
if (!rootNode) {
  const div = document.createElement('div');
  div.id = 'root';
  document.body.appendChild(div);
  rootNode = div;
}

function renderBy16() {
  ReactDOM.render(<App />, rootNode);
}

renderBy16();
