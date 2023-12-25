import React from 'react';
import { mutate, share, useAtom, atom, flush, $ } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { random, delay, noop, dictFactory } from '../logic/util';

const [priceState, setPrice, ctx1] = share({ a: 1, b: 100, ccc: 1000, d: { d1: { d2: 1 } } }, {
  moduleName: 'Api_mutate',
  enableDraftDep: true,
  recordLoading: 'no',
  alertDeadCycleErr: false,
});
const [finalPriceState, setP2, ctx2] = share({ retA: 0, retB: 0, time: 0, time2: 0, f: { f1: 1 } }, {
  moduleName: 'Api_mutate_finalPriceState',
  enableDraftDep: true,
  recordLoading: 'no',
  alertDeadCycleErr: false,
});


// 外部定义 mutate 函数
const witness = mutate(finalPriceState)({
  // 初始值函数，只会执行一次
  fn: (draft) => {
    draft.retA = 3000;
    draft.time += 1;
    draft.retA += 100; // 读取自己触发死循环
  },
  deps: () => [priceState.a, finalPriceState.retA, finalPriceState.retB] as const,
  task: async ({ input: [a], setState, draft }) => {
    // draft.retA += a; // 触发死循环
    // setState(draft => { draft.retB += a }); // 触发死循环
  },
  desc: 'dangerousMutate',
  immediate: true, // 控制 task 立即执行
});


function changeRetA() {
  setP2(draft => { draft.retA += 1 });
}

function SharedAtom() {
  return (
    <MarkUpdate>
      de demo
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeRetA]}>
    <SharedAtom />
  </Entry>
);

export default Demo;
