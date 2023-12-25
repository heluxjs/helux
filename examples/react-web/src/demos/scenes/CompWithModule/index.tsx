import { $, share } from 'helux';
import React from 'react';
import { ctx, action, deriveS, deriveM } from './module';
import { random, delay, getAtionFns } from "../../logic/util";
import { MarkUpdate, Entry } from "../../comps";

function test() {
  const a = action.actions.changeA(2);
  console.log(a);
}

function testF() {
  const a = action.actions.changeF(2);
  let c: undefined
  const b = action.eActions.changeF(2);
  // c = b.result;
  console.log(a);
}

function Comp() {
  const [state] = ctx.useState();
  return (
    <MarkUpdate>
      state.f {state.f}
    </MarkUpdate>
  );
}


function Comp2() {
  return (
    <MarkUpdate>
      ctx.state.val.f {$(ctx.state.val.f)}
    </MarkUpdate>
  );
}

function Comp3() {
  const [state] = deriveM.useDerivedState();
  return (
    <MarkUpdate>
      state.c {state.c}
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={getAtionFns(action.actions, [test, testF])}>
    <Comp />
    <Comp2 />
    <Comp3 />
    <div>ctx.state.val.f {$(ctx.state.val.f)}</div>
    <div>ctx.state.val.g {$(ctx.state.val.g)}</div>
    <div>ctx.state.val.k {$(ctx.state.val.k)}</div>
    <div>ctx.state.val.j {$(ctx.state.val.j)}</div>
  </Entry>
);

export default Demo;
