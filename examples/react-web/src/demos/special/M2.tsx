import { $, share, mutateDict } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { random, delay } from "../logic/util";

const [sharedState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 } }, c: 2, d: 4 }, { moduleName: 'M2' });

const witnessDict = mutateDict(sharedState)({
  // d1: {
  //   deps: (state) => [state.a],
  //   fn: (draft) => {
  //     // window.a.b = 1; // mock err
  //     draft.c = draft.a + 1 + random()
  //   },
  // },
  // d2: {
  //   deps: (state) => [state.c],
  //   fn: (draft) => { draft.a = draft.c + 1 + random() },
  // },

  key1: {
    deps: (state) => [state.a],
    fn: (draft, { input: [a] }) => {
      // window.a.b = 1; // mock err
      draft.c = a + 1 + random()
    },
  },
  // key2: {
  //   deps: (state) => [state.c],
  //   fn: (draft, { input: [c] }) => { draft.a = c + 1 + random() },
  // },


  // key3: {
  //   deps: (state) => [state.c],
  //   fn: (draft) => { draft.d = draft.d + 9 },
  // },
});
// witnessDict.key1.call();

function changeA() {
  setState((draft) => {
    draft.a += 33;
  });
}

const Demo = () => (
  <Entry fns={[changeA]}>
    {/* <Comp />
    <Comp2 /> */}
  </Entry>
);

export default Demo;
