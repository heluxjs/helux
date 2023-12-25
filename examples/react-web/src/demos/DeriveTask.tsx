import { $, share, deriveDict, useDerived, block } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from './comps';
import { delay } from "./logic/util";

const [sharedState, setState] = share({ a: 1, b: { b1: { b2: 200 } } });

const result = deriveDict({
  deps: () => [sharedState.a, sharedState.b.b1.b2] as const, // 定义依赖项
  fn: ({ input: [a, b2] }) => ({ val: a + b2 }),// 定义初始值
  task: async ({ input: [a, b2] }) => {
    await delay(1000);
    return { val: a + b2 + 1 };
  },
  immediate: true,
});


function changeA() {
  setState((draft) => {
    draft.a += 1;
  });
}

const RetBlock = block((props, params) => {
  const [val] = params.read(result.val);
  return (
    <MarkUpdate>
      {params.status.loading ? 'loading' : <>ret.val {val}</>}
    </MarkUpdate>
  )
});

function SharedDict() {
  return (
    <MarkUpdate>
      signal result.val {$(result.val)}
    </MarkUpdate>
  );
}

function UseDerived() {
  const [ret, status, info] = useDerived(result);
  return (
    <MarkUpdate info={info}>
      {status.loading ? 'loading' : <>ret.val {$(ret.val)}</>}
      {/* {status.err ? 'err' : (status.err && status.err.message)} */}
      {status.err && status.err.message}
      {status.err && <>{status.err.message}</>}
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeA]}>
    <RetBlock />
    <SharedDict />
    <SharedDict />
    <UseDerived />
  </Entry>
);

export default Demo;
