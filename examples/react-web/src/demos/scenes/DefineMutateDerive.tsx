import React from 'react';
import { $, share } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { dictFactory, delay } from '../logic/util';

const [priceState, , ctxp] = share(dictFactory, { moduleName: 'DefineApi2' });

const md = ctxp.defineMutateDerive({
  a: 1, b: '2', c: 3
})({
  changeA: (draft) => draft.a = priceState.a.b.c + 100,
  changeB: {
    deps: () => [priceState.info.name],
    async task(params) {
      await delay(1000);
      params.draft.b = priceState.info.name + 'ccc';
    },
  }
});

console.log(md);

function changeC() {
  ctxp.reactive.a.b.c++;
}

function changeC1() {
  ctxp.setState(draft => { draft.a.b1.c1++ });
  // ctxp.reactive.a.b1.c1++;
}

function Price() {
  const [derivedState] = md.useDerivedState();
  return <MarkUpdate name="Price">
    <h3>derivedState.a: {derivedState.a}</h3>
    <h3>derivedState.b: {derivedState.b}</h3>
  </MarkUpdate>;
}

function C1() {
  const [state, , info] = ctxp.useState();

  return <MarkUpdate name="Price" info={info}>
    state.a.b1.c1: {state.a.b1.c1}
  </MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[changeC1, changeC]}>
    <Price />
    <Price />
    <C1 />
    <h3>priceState.a.b.c: {$(priceState.a.b.c)}</h3>
  </Entry>
);

export default Demo;
