import { $, share, mutateDict, runMutate } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { random, delay } from "../logic/util";

const [sharedState, setState, ctx] = share({
  a: 1,
  b: 2,
  c: 2,
  d: 10,
  e: 1,
  f: { b1: { b2: 200 } },
}, { moduleName: 'MutateSelf' });

// const witness1 = ctx.mutate({
//   deps: (state) => [state.a],
//   fn: (draft) => { draft.c = draft.a + 1 + random() },
// });
// const witness2 = ctx.mutate({
//   deps: (state) => [state.c],
//   fn: (draft) => { draft.a = draft.c + 1 + random() },
// });

const witnessDict = mutateDict(sharedState)({
  // key1: {
  //   deps: (state) => [state.a],
  //   fn: (draft) => { draft.c = draft.a + 1 + random() },
  // },

  key1: {
    deps: (state) => [state.a],
    fn: (draft, { input: [a] }) => {
      draft.b = a + 1 + random();
    },
    // fn: (draft) => { draft.b = sharedState.a + 1 + random() },
  },
  key2: {
    deps: (state) => [state.b],
    fn: (draft, { input: [b] }) => {
      console.log('trigger key2');
      draft.c = b + 1 + random()
    },
  },
  key3: {
    deps: (state) => [state.c],
    fn: (draft, { input: [c] }) => {
      console.log('trigger key3');
      draft.d = c + 1 + random();
    },
  },

  // key4: {
  //   deps: (state) => [state.d],
  //   fn: (draft, { input: [d] }) => { draft.a = d + 1 + random() },
  // },


  // depA: {
  //   deps: (state) => [state.a],
  //   fn: (draft, [a]) => { draft.b = a + 1 + random() },
  // },
  // depB: {
  //   deps: (state) => [state.b],
  //   fn: (draft, [b]) => { draft.a = b + 1 + random() },
  // },
});
// witnessDict.key1.call();

// const witnessDict2 = mutateDict(sharedState)({
//   test: {
//     deps: () => [],
//     fn: (draft) => draft.a  = 1,
//   }
// });

function changeA() {
  const n = setState((draft) => {
    draft.f.b1.b2 = random();
  });
  console.log('n', n);
  ctx.reactive.f.b1.b2 += 1;
  ctx.flush('xx');
  // console.log(n);
  console.log(sharedState);
  ctx.reactive.f.b1.b2 += 1;
  ctx.flush('xx');
  console.log(sharedState);
}

function changeC() {
  ctx.runMutate('key3');
  // setState((draft) => {
  //   draft.c += 1;
  // });
}

function Comp() {
  return (
    <MarkUpdate>
      shared.a:  {$(sharedState.a)}
    </MarkUpdate>
  );
}

function Comp2() {
  return (
    <MarkUpdate>
      shared.c {$(sharedState.c)}
    </MarkUpdate>
  );
}

function Comp3() {
  return (
    <MarkUpdate>
      shared.d {$(sharedState.d)}
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeA, changeC]}>
    <Comp />
    <Comp2 />
    <Comp3 />
    {$(ctx.reactive.f.b1.b2)}
  </Entry>
);

export default Demo;
