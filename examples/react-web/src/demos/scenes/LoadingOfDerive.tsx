import { share, deriveDict, useDerived } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { random, delay } from "../logic/util";

const [sharedState, setState] = share({ a: 1, b: { b1: { b2: 200 } } }, { moduleName: 'LoadingOfDerive' });
const changeA = () => setState(draft => { draft.a = random() });

const result = deriveDict({
  deps: () => [sharedState.a, sharedState.b.b1.b2] as const,
  fn: () => ({ a: 0, b2: 0 }),
  task: async ({ input: [a, b2] }) => {
    await delay(1000);
    if (a < 80) {
      throw new Error(`a ${a} < 80`)
    }
    return { a: a + 100, b2: b2 + 200 };
  },
})

function Comp() {
  const [data, status] = useDerived(result);
  return (
    <MarkUpdate>
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
      {status.ok && <h1>{data.a}</h1>}
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeA]}>
    <Comp />
  </Entry>
);

export default Demo;
