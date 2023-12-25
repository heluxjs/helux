// @ts-nocheck
import React from 'react';
import {
  useAtom, share, watch, useForceUpdate, useDerived
} from 'helux';
import * as util from './logic/util';
import { MarkUpdate, Entry } from './comps';
import { createDraft } from 'limu';

const node = { a: 1 }
const base = { node, wrap: { node } };
const draft = createDraft(base, { onOperate: console.log });
draft.node.a = 100;
console.log('draft.node.a', draft.node.a);
console.log('draft.wrap.node.a', draft.wrap.node.a);
console.log('1', draft.node);
console.log('2', draft.wrap.node);


const ori = {
  a: 50,
  doubleA: 0,
  b: 2,
  c: { c1: 100, c2: 1000 },
  list: [{ name: 'one', age: 1 }],
  f: {
    f1: {
      newNode: {} as any,
    },
  },
  g: {
    newNode2: {} as any,
  },
};
const [ret, setState, call] = share(ori, {
  moduleName: 'd2s', exact: true,
  rules: [
    { when: (state) => [state.list, state.c.c1, state.c.c2], ids: ['list'] },
  ],
  // compute: {
  //   initial: ()=>({double:0});
  //   fns: {
  //     doubleA({raw, draft}){
  //     },
  //   }
  // }
});

watch(() => {
  console.log('read a');
  const { a } = ret;
  console.log('read a 2');

  // TODO  原生watch draft 禁止收集
  setState(draft => {
    console.log('watch and change a');
    draft.doubleA = a * 2;
    const c = draft.c;
    const newNode = { c };
    draft.f.f1.newNode = newNode;
    draft.g.newNode2 = newNode;

    draft.f.f1.newNode.c.c1 = 3000 + util.random(100);
  });
}, { immediate: true });

util.bindToWindow({ ret, ori });

function change_a() {
  setState(draft => {
    draft.a = util.random();
  });
  console.log('ret.a', ret.a);
  console.log('ret.doubleA', ret.doubleA);
}

function changeNewNode() {
  setState(draft => {
    draft.f.f1.newNode.c.c1 = util.random(100);
  });
}

function A() {
  console.log('Render A');
  const [state] = useAtom(ret);
  return (
    <div>
      {state.a}
    </div>
  );
}

function C() {
  console.log('Render DoubleA');
  const [state] = useAtom(ret);
  return (
    <div>
      state.c.c1：{state.c.c1}
    </div>
  );
}

function AnotherC() {
  console.log('Render ReadCool');
  const [state, , info] = useAtom(ret);
  return (
    <MarkUpdate info={[info]}>
      state.f.f1.newNode.c.c1: {state.f.f1.newNode.c?.c1}
      <br />
      state.g.newNode2.c.c1: {state.g.newNode2.c?.c1}
      <br />
    </MarkUpdate>
  );
}

function Demo(props: any) {
  return <Entry fns={[change_a, changeNewNode]}>
    <h3>caution: 多引用存在问题的示例</h3>
    <A />
    <C />
    <AnotherC />
  </Entry>
}

export default Demo;
