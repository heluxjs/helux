import { $, share, mutate } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { random, delay } from "../logic/util";

const [base] = share({ a: 1 });
const [sharedState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 } } }, { moduleName: 'LoadingOfMutate' });

const witness = mutate(sharedState)({
  deps: () => [base.a] as const,
  task: async ({ setState, input: [a] }) => {
    await delay(2000);
    if (a < 80) {
      throw new Error(`a ${a} < 80 at ${Date.now()}`);
    }
    setState(draft => { draft.a += (a + random()) });
  },
  desc: 'mutateFn',
});

function Comp() {
  const [state] = ctx.useState();
  const [loading, , info] = ctx.useMutateLoading();
  const status = loading['mutateFn'];

  return (
    <MarkUpdate info={info}>
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
      {status.ok && <h1>{state.a}</h1>}
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[witness.runTask]}>
    <Comp />
  </Entry>
);

export default Demo;
