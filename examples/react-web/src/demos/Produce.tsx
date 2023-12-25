import { produce } from 'helux';
import React from 'react';
import { Entry } from './comps';

function Comp() {
  const [state, setState] = React.useState({ a: 1, b: { b1: 2 } });
  const update = () => {
    setState(produce(draft => {
      draft.b.b1 = Date.now();
    }))
  };

  return (
    <div>
      state.b.b1: {state.b.b1}
      <div><button onClick={update}>update</button></div>
    </div>
  );
}

function CompArr() {
  const [state, setState] = React.useState([{ name: 'a', age: 2 }]);
  const update = () => {
    setState(produce(draft => {
      draft[0].age = Date.now();
    }))
  };

  return (
    <div>
      state[0].age: {state[0].age}
      <div><button onClick={update}>update</button></div>
    </div>
  );
}

const Demo = () => (
  <Entry>
    <Comp />
    <CompArr />
  </Entry>
);

export default Demo;
