import React from 'react';
import { mutate, share, useAtom, reactiveDesc, flush, $ } from 'helux';
import { MarkUpdate, Entry } from './comps';
import { random, delay, noop } from './logic/util';

const [priceState, setPrice, ctx1] = share({ a: 1, b: 100, ccc: 1000, d: { d1: { d2: 1 } } }, {
  moduleName: 'UseReactive',
});

function changePriceByTopReactive() {
  ctx1.reactive.a = random();
}

function changePriceByTopSet() {
  setPrice(draft => {
    draft.a = random();
  });
}

function seeA() {
  console.log(ctx1.reactive.a);
}

function A() {
  const [r, , info] = ctx1.useReactive();

  function changePriceByInsReactive() {
    setPrice(draft => {
      r.a = random();
    });
  }

  return <MarkUpdate name="FinalPrice" info={info}>
    <button onClick={changePriceByInsReactive}> changePriceByInsReactive </button>
    {r.a}
  </MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[changePriceByTopReactive, changePriceByTopSet, seeA]}>
    <A />
    <h3>ctxp.reactive.a: {$(ctx1.reactive.a)}</h3>
    <h3>priceState.a: {$(priceState.a)}</h3>
  </Entry>
);

export default Demo;
