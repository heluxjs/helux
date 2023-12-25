import { useMutable, produce } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from './comps';
import { log } from './logic/util';

function Comp() {
  const [state, setState] = useMutable({ a: 1, b: { b1: 1 }, c: 100 });
  const updateA = () => {
    setState({ a: Date.now() }); // change by partial
  };
  const updateB = () => {
    setState(draft => { draft.b.b1 = Date.now() }); // change by draft
  };
  React.useEffect(() => {
    log('setState is a stable ref'); // print only one time
  }, [setState]);

  return (
    <MarkUpdate>
      <div>state.a {state.a}</div>
      <div>state.b.b1 {state.b.b1}</div>
      <div>state.c {state.c}</div>
      <button onClick={updateA}>update a</button>
      <button onClick={updateB}>update b</button>
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry>
    <Comp />
  </Entry>
);

export default Demo;
