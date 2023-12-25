import React from "react";
import { atom, share, watch, useAtom, getSnap, deriveDict } from "helux";
import { MarkUpdate, Entry } from "./comps";
import { noop, random } from "./logic/util";

const [priceState, setPrice] = share(
  {
    a: {
      a1: { a2: 1 },
      a11: { a22: 1 }
    },
    b: 1,
    c: { c1: { c2: { c3: 100 } } }
  },
  { moduleName: "WatchSubKey" }
);

function changeA() {
  setPrice(
    (draft) => {
      draft.a = { a1: { a2: 1 }, a11: { a22: 1 } };
    },
    { desc: "changeA" }
  );
}
function changeAReally() {
  setPrice(
    (draft) => {
      draft.a = { a1: { a2: random() }, a11: { a22: 1 } };
    },
    { desc: "changeA" }
  );
}

function changeA1() {
  setPrice(
    (draft) => {
      draft.a.a1 = { a2: 100 };
    },
    { desc: "changeA" }
  );
}

function changeA11() {
  setPrice(
    (draft) => {
      draft.a.a11 = { a22: 100 };
    },
    { desc: "changeA" }
  );
}

function changeB() {
  setPrice(
    (draft) => {
      draft.b = random();
    },
  );
}

// const result = deriveDict(() => {
//   console.log('trigger deriveDict');
//   return { num: priceState.a.a1.a2 + 100 };
// })

// watch(
//   () => {
//     console.log("watch a changed ", priceState.a);
//   },
//   () => [priceState.a]
// );

// watch(
//   () => {
//     console.log("watch a.a11 changed ", priceState.a.a11);
//   },
//   () => [priceState.a.a11]
// );

watch(
  () => {
    console.log("watch a.a1.a2 changed ", priceState.a.a1.a2);
  },
  () => [priceState.a.a1.a2]
);

watch(
  () => {
    const { a, b, c } = priceState;
    noop(a.a11, b);
    const c2 = c.c1.c2;
    noop(a.a11.a22);
    noop(c2.c3);
    console.log("complex scene", priceState.a.a1.a2);
  },
  { deps: () => [priceState.a.a1.a2], immediate: true }
);

function Price() {
  const [price, , info] = useAtom(priceState);
  noop(price.a);
  return (
    <MarkUpdate name="Price" info={info}>
      a changed
    </MarkUpdate>
  );
}

function Books() {
  const [price, , info] = useAtom(priceState);
  return (
    <MarkUpdate name="Price" info={info}>
      price.a.a1.a2: {price.a.a1.a2}
    </MarkUpdate>
  );
}

function Demo(props: any) {
  return (
    <Entry fns={[changeA, changeAReally, changeA1, changeA11, changeB]}>
      <Books />
      <Price />
      <Price />
    </Entry>
  );
}

export default Demo;
