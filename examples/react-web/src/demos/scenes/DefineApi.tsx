import React from 'react';
import { mutate, share, useAtom, $, action, IActionTaskParams } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { dictFactory, delay } from '../logic/util';

const [priceState, setPrice, ctxp] = share(dictFactory, { moduleName: 'DefineApi' });
type S = typeof dictFactory;

export type DepsResult = { deps: any[], result: any };

// 约束各个函数入参类型
type Payloads = {
  changeA: [number, number];
  foo: boolean | undefined;
};

const fn = action(priceState)<number>()(async (params) => {
  const p = params.payload;
  params.draft.f += 1;
})

fn(1);

// TODO  action 允许自定义返回值
// 新增 eActions，返回 [ result, err ] 对
const { actions, eActions, useLoading, getLoading } = ctxp.defineActions<Payloads>()({
  // const { actions, eActions, useLoading, getLoading } = ctxp.defineActions()({
  changeA: ({ draft, payload }) => {
    draft.a.b.c = 200;
    // return { f: 1 };
    return 1;
  },
  async foo({ draft, payload }) {
    await delay(3000);
    draft.a.b.c += 1000;
    return 1;
  },
  cc({ draft, payload }) {
    // return 1;
    return { f2: 1 }
  },
  dd({ draft, payload }: IActionTaskParams<S, number>) {
    // return 1;
    return { f2: 1 }
  },
});

async function test() {
  const a = actions.changeA([1, 2])
  const b = await actions.foo(true)
  const ee = actions.cc();
  const xx = actions.dd(1);
  const ret = await eActions.foo(true);
  console.log(1);
}
test();

const { actions: a2, eActions: ea2, useLoading: u2, getLoading: g2 } = ctxp.defineTpActions()({
  changeA: ctxp.action<number>()(({ draft, payload }) => { // 此处 payload 获得类型提示
    draft.a.b.c = 200;
    return { a: 1 };
  }),
  changeB: ctxp.action<boolean>()(async ({ draft, payload }) => {
    draft.a.b.c = 200;
    return 2;
  }),
});


async function test2() {
  const a1 = ea2.changeA(1);
  const b1 = await ea2.changeB(true);

  const ret1 = a2.changeA(1); // 此处入参 payload 获得类型校验
  const ret2 = await a2.changeB(true); // 此处入参 payload 获得类型校验
  const a = ret2;
  console.log(1);
}
test2();

const actions2 = {
  changeB: ctxp.action<number>()(({ draft, payload }) => {
    draft.a.b.c = 200;
  }),
}

actions2.changeB(1)

// actions.

// TODO FIX TYPE
type DR = {
  a: { result: number };
  b: { result: string };
  c: { deps: [number, string], result: number };
};

const fd = ctxp.defineFullDerive()({
  a() {
    return priceState.a.b.c + 10000;
  },
  b() {
    return priceState.a.b.c + 20000;
  },
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

const a = fd.result.a;
const b = fd.result.b;
// const c = fd.result.c;
// a.z__is_atom_result__
// a.__helux_ts_type_helper_attr__

// a.val
// console.log('---> ', a.val);
// console.log('---> ', c.val);

// const md = ctxp.defineMutateDerive({
//   a: 1, b: '2', c: 3
// }, {
//   changeA: (draft) => draft.a = priceState.a.b.c + 100,
//   changeB: {
//     deps: () => [priceState.info.name],
//     async task(params) {
//       await delay(1000);
//       params.draft.b = priceState.info.name + 'ccc';
//     },
//   }
// });

ctxp.mutate({
  async task({ setState }) {
    console.error('---->>> mutate task');
    setState(draft => { draft.a.b.c = 1 });
  },
  // immediate: false,
})

function changeC() {
  ctxp.reactive.a.b.c++;
}

function changeC1() {
  ctxp.setState(draft => { draft.a.b1.c1++ });
  // ctxp.reactive.a.b1.c1++;
}

// function Price() {
//   const [price, , info] = useAtom(priceState);
//   const ld = useLoading();
//   const [a, status] = fd.helper.a.useDerivedInfo();
//   const [c, status2] = fd.helper.c.useDerivedInfo();

//   return <MarkUpdate name="Price" info={info}>
//     {price.a.b.c}
//     <h3>{ld.foo.loading ? 'foo is running' : 'foo is done'}</h3>
//     <h3>derived a: {a} {status.loading ? 'loading...' : ''}</h3>
//     <h3>derived c ( dep a.b1.c1 ): {c} {status2.loading ? 'loading...' : ''}</h3>
//   </MarkUpdate>;
// }

function C1() {
  const [state, , info] = ctxp.useState();

  return <MarkUpdate name="Price" info={info}>
    state.a.b1.c1: {state.a.b1.c1}
  </MarkUpdate>;
}

console.log(actions.foo);
// @ts-ignore
console.log(actions.foo.__fnName);

const Demo = () => (
  <Entry fns={[actions.foo, changeC1, changeC]}>
    {/* <Price />
    <Price /> */}
    <C1 />
    {/* <h3>ctxp.reactive.a.b.c: {$(ctxp.reactive.a.b.c)}</h3>
    <h3>ctxp.reactive.a.b1.c1: {$(ctxp.reactive.a.b1.c1)}</h3>
    <h3>ctxp.state.a.b1.c1: {$(ctxp.state.a.b1.c1)}</h3> */}
    <h3>getLoading().foo.loading: {$(getLoading().foo.loading)}</h3>
    <h3>getLoading().foo.loading: {$(() => <h1>foo.loading:{`${getLoading().foo.loading}`}</h1>)}</h3>
    <h3>true:{true}</h3>
  </Entry>
);

export default Demo;
// 