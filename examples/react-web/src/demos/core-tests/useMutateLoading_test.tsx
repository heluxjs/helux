import React from 'react';
import { atom, sharex, useAtom, useMutateLoading } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { log, delay, random } from '../logic/util';

const [state, , ctx] = atom({ a: 1, b: 2, c: 1, d: 1, e: 1 }, {
  moduleName: 'baseAtom',
  alertDeadCycleErr: false,
});
const witness = ctx.mutate({
  deps: () => [state.val.a],
  onlyDeps: true,
  fn: (draft) => {
    console.error('xxx');
    draft.b = draft.c + draft.d + draft.e;
  },
  task: async ({ setState }) => {
    console.log('run task');
    await delay(1000);
    setState((draft) => {
      draft.b = 100;
    });
  },
  desc: 'mutate1',
});

let runCount = 0;
function TestComp() {
  console.log('render TestComp');
  runCount += 1;
  console.log('runCount', runCount);
  const [ld] = useMutateLoading(state);

  return <div>{`${ld['mutate1'].loading}`}</div>
}

function Demo(props: any) {
  const fns = [witness.runTask];
  // const fns:any[] = [];
  return <Entry fns={fns}>
    <TestComp />
  </Entry>
}

export default Demo;
