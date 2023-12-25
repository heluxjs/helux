import { share, deriveDict, useAtom, useDerived, runDerive } from "helux";
import { random } from "./logic/util";
import { MarkUpdate, Entry } from "./comps";

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const [sharedState, setState, call] = share({ a: 1, b: { b1: { b2: 200 } } });
const doubleAResult = deriveDict(() => ({ val: sharedState.a * 2 + random() }));
const aPlusB2Result = deriveDict({
  fn: () => ({ val: 0 }),
  deps: () => [sharedState.a, sharedState.b.b1.b2] as const,
  task: async ({ input: [a, b2] }) => {
    await delay(1000);
    return { val: a + b2 + random() };
  },
});
// const transResult1 = deriveDict(() => aPlusB2Result);
// const transResult2 = deriveDict(() => transResult1);
const transResult1 = deriveDict({
  fn: () => ({ val: 0 }),
  deps: () => [sharedState.a, aPlusB2Result.val] as const,
  task: async ({ input: [a, val] }) => {
    await delay(1000);
    return { val: a + val + random() };
  },
});
const transResult2 = deriveDict({
  fn: () => ({ val: 0 }),
  deps: () => [sharedState.a, transResult1.val] as const,
  task: async ({ input: [a, val] }) => {
    await delay(1000);
    return { val: a + val + random() };
  },
});
// const transResult3 = deriveDict(() => {
//   return { val: transResult2.val + 5 };
// });
const transResult3 = deriveDict({
  fn: () => {
    console.error('run transResult3');
    return { val: transResult2.val + 5 };
  },
});

function changeA() {
  setState((draft) => {
    draft.a += 100;
  });
}

function ReadRerived() {
  const [doubleA, , info] = useDerived(doubleAResult);

  return (
    <MarkUpdate info={[info]}>
      <div>doubleA: {doubleA.val}</div>
    </MarkUpdate>
  );
}

function ReadTrans1() {
  const [aPlusB2, status, info] = useDerived(transResult1);

  return (
    <MarkUpdate info={[info]}>
      <div>{status.loading ? 'computing' : ''} aPlusB2.val: {aPlusB2.val}</div>
    </MarkUpdate>
  );
}

function ReadTrans2() {
  const [result, status, info] = useDerived(transResult2);

  return (
    <MarkUpdate info={[info]}>
      <div>{status.loading ? 'computing' : ''} transResult2.val: {result.val}</div>
    </MarkUpdate>
  );
}

function ReadTrans3() {
  const [result, status, info] = useDerived(transResult3);

  return (
    <MarkUpdate info={[info]}>
      <div>{status.loading ? 'computing' : ''} transResult3.val: {result.val}</div>
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeA]}>
    <ReadTrans1 />
    <ReadTrans2 />
    <ReadTrans3 />
    <ReadRerived />
    <ReadRerived />
  </Entry>
);

export default Demo;
