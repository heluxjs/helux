import React from 'react';
import { atom, mutate, share, useAtom, reactiveDesc, flush, $ } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { random, delay, noop } from '../logic/util';

const [numAtom, setNum, numCtx] = atom(1, { moduleName: 't1' });
// const [numAtom, setNum, numCtx] = atom(1);

function SharedAtom() {
  const [num] = numCtx.useState();
  return (
    <MarkUpdate>
      primitive syncer <input value={num} onChange={numCtx.syncer} />
    </MarkUpdate>
  );
}


// 这里的 a 和 atom 里一样时出现误判
const [priceState, setPrice, ctx1] = share({ a: 1, b: 100, ccc: 1000, d: { d1: { d2: 1 } } }, {
  moduleName: 't2',
  recordLoading: 'no',
});
const [finalPriceState, setP2, ctx2] = share({ retA: 0, retB: 0, time: 0, time2: 0, f: { f1: 1 } }, {
  moduleName: 't3',
  recordLoading: 'no',
});

// 外部定义 mutate 函数
const witness = mutate(finalPriceState)({
  // 初始值函数，只会执行一次
  fn: (draft) => {
    draft.retA = 3000;
    draft.time += 1;
    draft.retA += 100; // 触发死循环
    // setP2(draft => { draft.retA += 100 });
  },
  deps: () => [priceState.a, finalPriceState.retA, finalPriceState.retB] as const,
  task: async ({ input: [a], setState, draft }) => {
    console.error('start -----------------------C1_File2');
    const result = draft.retA + a
    const d1 = ctx1.reactive.d.d1;
    noop(ctx2.reactive.f.f1);
    // d1.d2 = 3000;
    noop(ctx2.reactive.f.f1);
    noop(draft.f.f1);

    draft.retA += a;
    // setState(draft => { draft.retB += a });
    console.error('after -----------------------C1_File2');
  },
  desc: 'dangerousMutate',
  immediate: true, // 控制 task 立即执行
});


const Demo = () => (
  <Entry fns={[]}>
    {/* <SharedAtom /> */}
  </Entry>
);

export default Demo;
