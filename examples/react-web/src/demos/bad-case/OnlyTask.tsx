import React from 'react';
import { mutate, share, useAtom, reactiveDesc, flush, $ } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { random, delay, noop } from '../logic/util';

const [priceState, setPrice, ctx1] = share({ a: 1, b: 100, ccc: 1000, d: { d1: { d2: 1 } } }, {
  moduleName: 'Api_mutate',
  // 切换这个配置时，会引起死循环
  recordLoading: 'no',
});
const [finalPriceState, setP2, ctx2] = share({ retA: 0, retB: 0, time: 0, time2: 0, f: { f1: 1 } }, {
  moduleName: 'Api_mutate_finalPriceState',
  recordLoading: 'no',
});

// 约束各个函数入参类型
type Payloads = {
  changeA: [number, number];
  foo: boolean | undefined;
};

const { actions, useLoading } = ctx1.defineActions<Payloads>()({
  changeA({ draftRoot, payload }) {
    draftRoot.a = 200;
  },
  async foo({ draftRoot, payload }) {
    await delay(3000);
    draftRoot.ccc += 1000;
  },
});

// 控制 task 立即执行引起死循环
const witness = mutate(finalPriceState)({
  deps: () => [priceState.a, finalPriceState.retA, finalPriceState.retB] as const,
  // 初始值函数，只会执行一次
  fn: (draft) => {
    draft.retA = 3000;
    draft.time += 1;
    draft.retA += 100; // 触发死循环
    // setP2(draft => { draft.retA += 100 });
  },
  task: async ({ input: [a], setState, draft }) => {
    // const result = draft.retA + a
    // draft.retA += a;
    setState(draft => { draft.retB += a });
    console.error('after ----------------------------------------------------------------');
  },
  desc: 'dangerousMutate',
  // immediate: true, 
});

function changePriceA() {
  setPrice(draft => { draft.a = random() });
  // ctxp.reactive.a = random();
}

const Demo = () => (
  <Entry fns={[changePriceA]}>
  </Entry>
);

export default Demo;
