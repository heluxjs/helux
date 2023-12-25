import { block, share, getAtom, atom } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from './comps';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const [sharedState, setState, call] = share({ a: 1, b: { b1: { b2: 200 } } }, { moduleName: 'View' });
const [numAtom, setAtom] = atom(100);

const val = getAtom(numAtom);
const val2 = getAtom(sharedState);

// mutate state out of react component
function changeB2() {
  setState((draft) => {
    draft.b.b1.b2 += 100;
  });
}

const DemoBlock = block(() => {
  return <div>
    state.b.b1.b2 {sharedState.b.b1.b2}
  </div>
});


const Demo = () => (
  <Entry fns={[changeB2]}>
    <DemoBlock />
    <DemoBlock />
  </Entry>
);
export default Demo;
