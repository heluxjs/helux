import { $, share } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from './comps';
import { random, delay } from "./logic/util";

const [sharedState, setState, ctx] = share({ a: 1, b: { b1: { b2: '200' } } }, {
  moduleName: 'DeriveTask',
  before(params) {
    console.log('test before', params);
  },
});

function changeA() {
  setState((draft) => {
    draft.a += 1;
  });
}

function SharedDict() {
  const [state] = ctx.useState();
  return (
    <MarkUpdate>
      syncer<input value={state.a} onChange={ctx.syncer.a} />
      <br />
      sync<input value={state.a} onChange={ctx.sync(to => to.a, (a, { draft }) => draft.a = Date.now())} />
      <br />
      sync multi path<input style={{ width: '300px' }} value={state.b.b1.b2} onChange={ctx.sync(to => to.b.b1.b2)} />
      <br />
      sync multi path by path arr<input style={{ width: '300px' }} value={state.b.b1.b2} onChange={ctx.sync(['b', 'b1', 'b2'])} />
      <br />
      sync multi path with before<input style={{ width: '300px' }} value={state.b.b1.b2} onChange={ctx.sync(to => to.b.b1.b2, (b, { draft }) => draft.b.b1.b2 = `${b}_${Date.now()}`)} />
      <br />
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeA]}>
    <SharedDict />
  </Entry>
);

export default Demo;
