import React from 'react';
import { mutate, sharex, useService, $ } from 'helux';
import { MarkUpdate, Entry } from './comps';
import { random, delay, getAtionFns, dictFactory } from './logic/util';

const ctx = sharex(dictFactory, {
  moduleName: 'Api_defineActions',
});

// 约束各个函数入参类型
type Payloads = {
  changeA: [number, number];
  foo: number;
};

const { actions, useLoading } = ctx.defineActions<Payloads>()({
  changeA({ draftRoot }) {
    draftRoot.f += 200;
    return 1;
  },
  async changeB({ draftRoot }) {
    draftRoot.f += 200;
    return 1;
  },
  async foo({ draftRoot, payload, dispatch }) {
    if (typeof payload !== 'number') return;
    const a = dispatch(actions.changeA, [1, 1]);
    const b = await dispatch(actions.changeB, [1, 1]);

    await delay(1000);
    draftRoot.a.b.c += payload;
    await delay(1000);
    draftRoot.a.b.c += payload;
  },
});

function Comp() {
  const [state, , info] = ctx.useState();
  const loadingState = useLoading();
  const { foo } = loadingState;
  const srv = useService({
    foo() {
      actions.foo(state.f);
    },
    seeDeps() {
      console.log(info.getDeps());
    },
  });

  return <MarkUpdate name="Comp" info={info}>
    {foo.loading && 'loading'}
    {foo.err && foo.err.message}
    {foo.ok && <>finalPrice.retA: {state.a.b.c}</>}
    <div style={{ textAlign: 'center' }}>
      <button onClick={srv.foo}>call foo</button>
      <button onClick={srv.seeDeps}>seeDeps</button>
    </div>
  </MarkUpdate>;
}



const Demo = () => (
  <Entry fns={getAtionFns(actions)}>
    <Comp />
    <Comp />
    <Comp />
    <h3>ctxp.reactive.f: {$(ctx.reactive.f)}</h3>
    <h3>ctxp.state.f: {$(ctx.state.f)}</h3>
  </Entry>
);

export default Demo;

