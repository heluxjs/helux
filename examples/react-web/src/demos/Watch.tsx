import React from "react";
import { atom, share, watch, useAtom, getSnap } from "helux";
import { MarkUpdate, Entry } from "./comps";

const [priceState, setPrice] = share(
  { a: 1, books: [] as any[] },
  { moduleName: "Watch" }
);
const [numAtom, setNum] = atom(3000);

function changePrice() {
  setPrice(
    (draft) => {
      draft.a += 100;
    },
    { desc: "changeA" }
  );
}

function changePriceAndNum() {
  changePrice();
  setNum(numAtom.val + 1000);
}

function addBooks() {
  setPrice((draft) => { draft.books.push(1) });
}

const w1 = watch(
  () => {
    console.log("books changed ", priceState.books);
  },
  () => [priceState.books]
);

setTimeout(() => {
  console.log('rerun watch', w1.run());
}, 6000);

setTimeout(() => {
  console.log('unwatch', w1.unwatch());
}, 12000);

watch(
  () => {
    console.log(
      `price change from ${getSnap(priceState).a} to ${priceState.a}`
    );
  },
  { immediate: true }
);

watch(
  () => {
    console.log(`found price changed: () => [priceState.a]`);
  },
  () => [priceState.a]
);

watch(
  () => {
    console.log(`found price changed: [ priceState ]`);
  },
  () => [priceState]
);

watch(
  () => {
    console.log(`found price or numAtom changed: ()=>[ priceState, numAtom ]`);
  },
  () => [priceState, numAtom]
);

function Price() {
  const [price, , info] = useAtom(priceState);
  return (
    <MarkUpdate name="Price" info={info}>
      {price.a}
    </MarkUpdate>
  );
}

function Books() {
  const [price, , info] = useAtom(priceState);
  return (
    <MarkUpdate name="Price" info={info}>
      price.books.length: {price.books.length}
    </MarkUpdate>
  );
}

function Demo(props: any) {
  return (
    <Entry fns={[changePrice, changePriceAndNum, addBooks]}>
      <Books />
      <Price />
      <Price />
    </Entry>
  );
}

export default Demo;
