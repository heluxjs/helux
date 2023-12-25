// @ts-nocheck
import React from 'react';
import ReactDOMLegacy from "react-dom";
import ReactDOM from "react-dom/client";
import './addPluginAndMid';
import App from './App';

let rootNode = document.getElementById('root') as HTMLElement;
if (!rootNode) {
  const div = document.createElement('div');
  div.id = 'root';
  document.body.appendChild(div);
  rootNode = div;
}

function renderBy16() {
  ReactDOMLegacy.render(<App />, rootNode);
}

function renderBy18() {
  ReactDOM.createRoot(rootNode).render(
    <App />
  );
}

function renderBy18Strict() {
  ReactDOM.createRoot(rootNode).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

renderBy16();
// renderBy18();
// renderBy18Strict();
