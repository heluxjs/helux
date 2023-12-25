/**
 * 
 * 这个实例曾被误判
 * 
 */
import React from 'react';
import { $, share } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { dictFactory, delay } from '../logic/util';

const [priceState, , ctxp] = share(dictFactory, { moduleName: 'DefineApi3', alertDeadCycleErr: false });

const ms = ctxp.defineMutateSelf()({
  toBeDrive: (draft, params) => {
    console.error('trigger toBeDrive');
    draft.extra.toBeDrive = params.state.a.b.c + 1000;
  },
  prefixedMark: (draft) => draft.extra.prefixedMark = draft.desc + 'xx',
  changeB: {
    deps: () => [priceState.info.name],
    async task(params) {
      console.error('should trigger task');
      await delay(1000);
      params.draft.extra.newName = params.input[0] + Date.now();
    },
  }
});

function changeName() {
  ctxp.reactive.info.name = `${Date.now()}_`;
}

function changeC() {
  ctxp.setState(draft => { draft.a.b.c += 100 });
}

function Price() {
  const [state] = ctxp.useState();
  const ld = ms.useLoading();

  return <MarkUpdate name="Price">
    <h3>extra.prefixedMark: {state.extra.prefixedMark}</h3>
    <h3>extra.toBeDrive: {state.extra.toBeDrive}</h3>
    <h3>extra.newName: {state.extra.newName} {ld.changeB.loading ? 'loading...' : ''}</h3>
  </MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[changeC, changeName]}>
    <Price />
    <Price />
    <h3>priceState.a.b.c: {$(priceState.a.b.c)}</h3>
    <h3>ctxp.reactive.info.name: {$(ctxp.reactive.info.name)}</h3>
    <h3>priceState.info.name: {$(priceState.info.name)}</h3>
    <h3>priceState.extra.newName: {$(priceState.extra.newName)}</h3>
  </Entry>
);

export default Demo;
