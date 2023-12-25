import React from 'react';
import { mutate, share, useAtom, reactiveDesc, flush, $, watch } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { random, delay, noop } from '../logic/util';

const [data, setState, ctx1] = share({ a: 1, b: 100, ccc: 1000, d: { d1: { d2: 1 } } }, {
  moduleName: 'SetStateInWatch',
});

// 以下示例只执行一次代表死循环拦截拦截正常

// watch(() => {
//   console.log(data.a);
//   ctx1.reactive.a += 5;
//   // setState(draft => { draft.a += 1 });
// }, { immediate: true });

// ctx1.mutate(draft => draft.a += 1);

ctx1.mutate({
  deps: () => [data.a],
  async task({ draft }) {
    // draft.a += 1;
    console.log('trigger task');
  },
});

function changeA() {
  ctx1.reactive.a += 5;
}

const Demo = () => (
  <Entry fns={[changeA]}>
    {$(data.a)}
  </Entry>
);

export default Demo;
