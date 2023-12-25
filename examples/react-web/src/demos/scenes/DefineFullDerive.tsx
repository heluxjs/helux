import React from 'react';
import { share, useAtom, $ } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { dictFactory, delay } from '../logic/util';

const [priceState, , ctxp] = share(dictFactory, { moduleName: 'DefineApi' });
function changeC() {
  ctxp.reactive.a.b.c++;
}
function changeC1() {
  ctxp.reactive.a.b1.c1++;
}

type DR = {
  a: { result: number };
  // c: { deps: [number, string], result: number };
};

const fd = ctxp.defineFullDerive<DR>()({
  a: () => priceState.a.b.c + 10000,
  b: () => priceState.a.b.c + 20000,
  c: {
    deps: () => [priceState.a.b1.c1, priceState.info.name],
    fn: () => 1,
    async task(params) {
      const [c1, name] = params.input;
      await delay(2000);
      return 1 + c1;
    },
  }
});

function Price() {
  const [price, , info] = useAtom(priceState);
  const [a, status] = fd.helper.a.useDerivedInfo();
  const [c, status2] = fd.helper.c.useDerivedInfo();

  return <MarkUpdate name="Price" info={info}>
    {price.a.b.c}
    <h3>derived a: {a} {status.loading ? 'loading...' : ''}</h3>
    {/* <h3>derived c ( dep a.b1.c1 ): {c} {status2.loading ? 'loading...' : ''}</h3> */}
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
    {/* <h3>ctxp.reactive.a.b.c: {$(ctxp.reactive.a.b.c)}</h3>
    <h3>ctxp.reactive.a.b1.c1: {$(ctxp.reactive.a.b1.c1)}</h3>
    <h3>ctxp.state.a.b1.c1: {$(ctxp.state.a.b1.c1)}</h3> */}
  </Entry>
);

export default Demo;
