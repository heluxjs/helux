import { share, useAtom } from 'helux';
import { getVal } from '@helux/utils';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';


const [shared, setShared, ctx] = share({
  a: {
    b: { c: 1 },
    b1: { c1: 1 },
  },
  info: { name: 'helux', age: 1 },
  desc: 'awesome lib',
  extra: {
    mark: 'extra',
    c: (draft: any) => {
      draft.extra.c = draft.a.b.c + 103;
    },
  }
}, {
  stopArrDep: true,
  enableDraftDep: true,
});

// 记录是否已替换
const replacedMap: any = {};
ctx.setOnReadHook((params) => {
  console.log('setOnReadHook');
  const key = params.fullKeyPath.join('.');
  if (typeof params.value === 'function' && !replacedMap[key]) {
    replacedMap[key] = true;
    // 注册 mutate
    const witness = ctx.mutate((draft) => {
      params.value(draft, shared);
    });
    params.replaceValue(getVal(witness.snap, params.fullKeyPath));
    // return getVal(witness.snap, params.fullKeyPath);
  }
});

const changeABC = () => {
  setShared((draft) => {
    draft.a.b.c += 1;
  });
};

function Info() {
  const [state, , info] = useAtom(shared, { pure: true, arrIndexDep: false });
  console.log('typeof state.extra.c', typeof state.extra.c);

  return <MarkUpdate info={info}>
    <h2>state.extra.c {state.extra.c}</h2>
  </MarkUpdate>;
}


const Demo = () => (
  <Entry fns={[changeABC]}>
    <Info />
  </Entry>
);

export default Demo;

