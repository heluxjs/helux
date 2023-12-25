import { share, deriveDict, useDerived } from "helux";
import { random } from "./logic/util";
import { MarkUpdate, Entry } from "./comps";

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const [sharedState, setState, call] = share({ a: 1, b: { b1: { b2: 200 } } });
const doubleAResult = deriveDict(() => ({ val: sharedState.a * 2 + random() }));
const aPlusB2Result = deriveDict({
  deps: () => [sharedState.a, sharedState.b.b1.b2] as const,
  fn: () => ({ val: 0 }),
  task: async ({ input: [a, b] }) => {
    await delay(1000);
    return { val: a + b + random() };
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

function ReadAsyncRerived() {
  const [aPlusB2, isComputing, info] = useDerived(aPlusB2Result);

  return (
    <MarkUpdate info={[info]}>
      <div>{isComputing ? 'computing' : ''} aPlusB2.val 11 22: {aPlusB2.val}</div>
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeA]}>
    <ReadAsyncRerived />
    <ReadAsyncRerived />
    {/* <ReadRerived />
    <ReadRerived /> */}
  </Entry>
);

export default Demo;
