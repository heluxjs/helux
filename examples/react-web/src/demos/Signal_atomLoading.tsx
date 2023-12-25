import { $, share, atom, derive, deriveDict, block } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from './comps';
import { random, delay } from "./logic/util";

const [sharedState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 }, b12: 100 }, name: Date.now() }, { moduleName: 'SignalL1' });
const [numAtom, setAtom] = atom(100);

// const doubleNum = derive(() => {
//   console.log('derive doubleNum', numAtom.val * 2 + sharedState.a);
//   return numAtom.val * 2 + sharedState.a;
// });

const aPlusB2Result = deriveDict({
  deps: () => [sharedState.a, sharedState.b.b1.b2] as const,
  fn: () => ({ val: 0 }),
  task: async ({ input: [a, b], sn }) => {
    await delay(1000);
    const val = a + b + random();
    return { val };
  },
});

// 放这里引起 loading 不消失（问题已修复）
const doubleNum = derive(() => {
  return numAtom.val * 2 + sharedState.a;
});

function changeA() {
  setState(draft => { draft.a += 1 });
}

function changeAtom() {
  setAtom(numAtom.val + 100);
}

function change_b_b1_b2() {
  setState(draft => { draft.b.b1.b2 = Date.now() });
}

const AsyncBlock = block<{ a: number }, { sayHello: any }>((props, params) => {
  console.log('Render AsyncBlock');
  const [count, setCount] = React.useState(0);
  React.useImperativeHandle(params.ref, () => ({
    sayHello() {
      console.log('hello count ', count);
    },
  }));
  const { status } = params;
  // state
  const val2 = numAtom.val;
  const val3 = sharedState.a;
  // result
  const val1 = doubleNum.val;
  const val4 = aPlusB2Result.val;
  if (status.loading) return 'is loading !';

  return (
    <div className="box">
      <button onClick={() => setCount(count + 1)}>setCount</button>
      <div>count : {count}</div>
      <h3>{val2}</h3>
      <h3>{val3}</h3>
      <h3>{val1}</h3>
      <h3>aPlusB2Result.val: {val4}</h3>
      {/* <div>
        {$(() => <h2>nested: {sharedState.b.b1.b2}</h2>)}
      </div> */}
    </div>
  );
  // }, false);
}, true);
AsyncBlock.displayName = 'AsyncBlock';

const Demo = () => {
  const ref = React.useRef<any>();
  const sayHello = () => {
    ref.current?.sayHello();
  };
  return (
    <Entry fns={[changeA, changeAtom, change_b_b1_b2, sayHello]}>
      {$(sharedState.a)}
      <AsyncBlock ref={ref} a={1} />
    </Entry>
  )
};

export default Demo;
