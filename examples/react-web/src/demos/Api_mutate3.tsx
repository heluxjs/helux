import React from 'react';
import { mutate, share, useAtom, useGlobalForceUpdate, $ } from 'helux';
import { MarkUpdate, Entry } from './comps';
import { random, delay, noop } from './logic/util';

const [priceState, setPrice, ctx1] = share({ a: 1, b: 100, ccc: 1000, d: { d1: { d2: 1 } } }, {
  moduleName: 'Api_mutate3',
});
const [finalPriceState, setP2, ctx2] = share({ retA: 0, retB: 0, time: 0, time2: 0, f: { f1: 1 } }, {
  moduleName: 'Api_mutate_finalPriceState3',
});

// 约束各个函数入参类型
type Payloads = {
  changeA: [number, number];
  foo: boolean | undefined;
};

const { actions, useLoading, getLoading } = ctx1.defineActions<Payloads>()({
  changeA({ draftRoot, payload }) {
    draftRoot.a = 200;
  },
  async foo({ draftRoot, payload }) {
    await delay(3000);
    draftRoot.ccc += 1000;
  },
});

const { actions: ac2 } = ctx1.defineActions()({
  changeA({ draftRoot, payload }) {
    draftRoot.a = 200;
  },
  async foo({ draftRoot, payload }) {
    await delay(3000);
    draftRoot.ccc += 1000;
  },
});
// ac2.



// const s = actions.changeA([1, 2]);
// console.log('111 is ', s);
// console.log('foo is ', actions.foo(true));
// setTimeout(() => {
//   // const s = actions.changeA(1, 2);
//   console.log('222 s is ', s);
// }, 3000);


// const witness2 = mutate(finalPriceState)({
//   fn: (draft) => draft.time = draft.time2 + 1,
// });

// const witness3 = mutate(finalPriceState)({
//   fn: (draft) => draft.time2 = draft.time + 1,
// });

// 外部定义 mutate 函数
const witness = mutate(finalPriceState)({
  // 初始值函数，只会执行一次
  fn: (draft) => {
    draft.retA = 3000;
  },
  deps: () => [priceState.a, finalPriceState.retA, finalPriceState.retB] as const,
  task: async ({ input: [a], setState, draft }) => {
    // const d1 = ctx1.reactive.d.d1;
    noop(ctx2.reactive.f.f1);
    // d1.d2 = 3000;
    noop(ctx2.reactive.f.f1);
    await delay(1000);
    noop(draft.f.f1);
    console.error('after ----------------------------------------------------------------');
  },
  desc: 'dangerousMutate',
  immediate: true, // 控制 task 立即执行
});

const witness2 = mutate(finalPriceState)({
  // 初始值函数，只会执行一次
  fn: (draft) => {
    draft.retA = 3000;
  },
  deps: () => [priceState.a, finalPriceState.retA, finalPriceState.retB] as const,
  task: async ({ input: [a], setState, draft }) => {
    noop(draft.f.f1);
    console.error('after 222 ----------------------------------------------------------------');
  },
  desc: 'dangerousMutate_another',
  immediate: true, // 控制 task 立即执行
});

// 外部定义 mutate 函数
// const witness2 = mutate(finalPriceState)({ fn: (draft) => draft.retA += 100, desc: 'gogo' });

// setInterval(() => {
//   witness2.call();
// }, 2000);

function changePriceA() {
  setPrice(draft => { draft.a = random() });
  // ctxp.reactive.a = random();
}

function changeRetA() {
  setP2(draft => { draft.retA += 1 });
}

function changePrev() {
  setPrice(draft => {
    const { a } = draft;
    draft.a = a;
  });
}

function seeCCC() {
  console.log(ctx1.reactive.ccc);
}

function forceRunMutate() {
  witness.run();
};
function forceRunMutateTask() {
  witness.runTask();
};

function Price() {
  const [price, , info] = useAtom(priceState);
  const ld = useLoading();

  return <MarkUpdate name="Price" info={info}>
    {price.a}
    <h3>{ld.foo.loading ? 'foo is running' : 'foo is done'}</h3>
  </MarkUpdate>;
}

function PriceB() {
  const [price, , info] = useAtom(priceState);
  return <MarkUpdate name="Price" info={info}>
    price.b: {price.b}
  </MarkUpdate>;
}

function FinalPrice() {
  const [finalPrice, , info] = useAtom(finalPriceState);
  const [loading] = ctx2.useMutateLoading();
  const status = loading[witness.desc];

  return <MarkUpdate name="FinalPrice" info={info}>
    {status.loading && 'loading'}
    {status.err && status.err.message}
    {status.ok && <>finalPrice.retA: {finalPrice.retA}</>}
  </MarkUpdate>;
}

function CCC() {
  const [r, , info] = ctx1.useReactive();
  const [loading] = ctx2.useMutateLoading();
  const atomForceUpdate = useGlobalForceUpdate(r);
  const onlyUpdateB = ctx1.useForceUpdate(state => [state.b]);

  return <MarkUpdate name="FinalPrice" info={info}>
    {r.ccc}
    <button onClick={() => atomForceUpdate()}>atomForceUpdate</button>
    <button onClick={() => onlyUpdateB()}>onlyUpdateB</button>
    <button onClick={() => onlyUpdateB(state => state.a)}>onlyUpdateA</button>
    <button onClick={onlyUpdateB}>onlyUpdateB_2</button>
    <button onClick={() => onlyUpdateB(state => [])}>onlyUpdateB_nothing</button>
    <button onClick={() => onlyUpdateB(null)}>onlyUpdateB_all</button>
  </MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[forceRunMutate, forceRunMutateTask, changePrev, changePriceA, actions.foo, changeRetA, seeCCC]}>
    <Price />
    <Price />
    <PriceB />
    <FinalPrice />
    <FinalPrice />
    <CCC />
    <h3>ctxp.reactive.a: {$(ctx1.reactive.a)}</h3>
    <h3>ctxp.reactive.ccc: {$(ctx1.reactive.ccc)}</h3>
    <h3>getLoading().foo.loading: {$(getLoading().foo.loading, v => `${v}`)}</h3>
    <h3>getLoading().foo.loading: {$(getLoading().foo.loading, v => `${v}<------`)}</h3>
  </Entry>
);

export default Demo;
