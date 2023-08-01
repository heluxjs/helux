import lib from 'hel-tpl-remote-lib';
import React from 'react';
import './App.css';
import logo from './logo.svg';

const App = React.forwardRef(function App(props, ref) {
  React.useImperativeHandle(ref, () => ({
    sayHello() {
      alert('Hello hel-micro');
    },
  }));

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          onClick={() => {
            alert(lib.num.random(20));
          }}
        />
        <p>
          <h1>This is a hel remote react component</h1>
          <h2>emitted by hel-micro</h2>
        </p>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://tnfe.github.io/hel" target="_blank" rel="noopener noreferrer">
          Learn hel-micro
        </a>
      </header>
    </div>
  );
});

export default App;
