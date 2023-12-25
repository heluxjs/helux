import { $, share, deriveDict, useDerived } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { random, delay } from "../logic/util";

const [sharedState, setState] = share({ a: 1, b: { b1: { b2: 200 } } });
const result = deriveDict({
  fn: () => ({ val: 0 }),
  deps: () => [sharedState.a, sharedState.b],
  task: async () => {
    const { a, b } = sharedState;
    await delay(1000);
    return { val: a + b.b1.b2 + 1 };
  },
  immediate: true,
});

const result2 = deriveDict({
  fn: () => ({ val: sharedState.a + result.val }),
  task: async () => {
    await delay(1000);
    return { val: sharedState.a + result.val + random() };
  },
  immediate: true,
});


function changeA() {
  setState((draft) => {
    draft.a += 1;
  });
}

function SharedDict() {
  const [ret, isComputing] = useDerived(result);
  console.log('isComputing ', isComputing);
  return (
    <MarkUpdate>
      {!isComputing ? <>result1.val {result.val}</> : 'computing'}
    </MarkUpdate>
  );
}

function SharedDict2() {
  const [ret, isComputing] = useDerived(result2);
  console.log('isComputing ', isComputing);
  return (
    <MarkUpdate>
      {!isComputing ? <>result2.val {result.val}</> : 'computing'}
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeA]}>
    <SharedDict />
    <SharedDict />
    <SharedDict2 />
    <SharedDict2 />
    {/* <UseDerived /> */}
  </Entry>
);

export default Demo;
