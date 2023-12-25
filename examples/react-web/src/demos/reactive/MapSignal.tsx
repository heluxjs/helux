import { $, atom, atomx, share, block, useAtom, watch } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { delay, random } from '../logic/util';

const { reactive, defineActions, state: atomObj } = atomx({
  a: 1,
  b: {
    b1: 1,
    b2: 1,
    b3: 1,
  },
  c: 100,
}, { moduleName: 'ruikun2', recordLoading: 'no' });


const { actions } = defineActions()({
  changeC({ draft, payload }) {
    const c = typeof payload === 'number' ? payload : random();
    draft.c = c;
  },
  async changeB({ draft }) {
    draft.b.b1 = random();
    await delay(1000);
    draft.b.b2 = random();
  },
})

watch(() => {
  reactive.a = 1000;
}, () => [atomObj.val.b])


function Test1() {
  const [state, , info] = useAtom(atomObj);

  if (state.c <= 100) {
    return <MarkUpdate info={info}><div>{state.a} -- b1 {state.b.b1}</div></MarkUpdate>
  }

  return <MarkUpdate info={info}><div>{state.a} -- b2 {state.b.b2}</div></MarkUpdate>;
}

const Demo = () => (
  // @ts-ignore
  <Entry fns={Object.keys(actions).map((key) => actions[key])}>
    <Test1 />
    <Test1 />
  </Entry>
);

export default Demo;
