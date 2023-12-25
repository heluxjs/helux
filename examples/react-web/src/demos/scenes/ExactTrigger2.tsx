import { atom, derive, useAtom, watch, shallowCompare, $, useWatch } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { random, delay, noop } from "../logic/util";


const [shared, setShared] = atom({
  info: { name: 'helux', age: 1 },
  desc: 'awesome lib',
  extra: {
    mark: 'extra',
    list: [
      { id: 1, name: 'helux1' },
      { id: 2, name: 'helux2' },
    ],
  }
});

const plusAge = () => setShared(draft => { draft.info.age += 1 });
const minusAge = () => setShared(draft => { draft.info.age -= 1 });
const changeShared = () => {
  setShared((draft) => {
    draft.info = { ...draft.info };
  });
};
const changeDesc = () => {
  setShared((draft) => {
    draft.desc = `${Date.now()}`;
  });
};
const changeList0 = () => {
  setShared((draft) => {
    draft.extra.list[0].name = `name:${Date.now()}`;
  });
};
const resetList = () => {
  setShared((draft) => {
    draft.extra.list = draft.extra.list.slice();
  });
};
const changeExtra = () => {
  setShared((draft) => {
    draft.extra = { ...draft.extra };
  });
};

// 💢 触发执行，因为 info 引用已变化
function Info() {
  console.log('----------------------------------------');
  const [state, , info] = useAtom(shared, { pure: false });
  React.useEffect(() => {
    console.log('state changed');
  }, [state]);
  useWatch(() => {
    console.log('state changed 2');
  }, () => [state]);

  return <MarkUpdate info={info}>info</MarkUpdate>

  noop(state.info);

  if (state.info.age === 2) {
    return <MarkUpdate info={info}>only info.age {state.info.age}</MarkUpdate>
  }
  noop(state.extra.list[0]);
  // noop(state.extra.list[1]);

  return <MarkUpdate info={info}><h2>arrDep=true,arrIndexDep=true {state.info.age} </h2></MarkUpdate>;
}

function Info1() {
  const [state, , info] = useAtom(shared, { pure: true, arrDep: false });
  noop(state.info);

  if (state.info.age === 2) {
    return <MarkUpdate info={info}>only info.age {state.info.age} {state.desc}</MarkUpdate>
  }
  noop(state.extra.list[0]);
  noop(state.extra.list[1]);

  return <MarkUpdate info={info}><h2>arrDep=false {state.info.age}</h2></MarkUpdate>;
}

function Info2() {
  const [state, , info] = useAtom(shared, { pure: true, arrIndexDep: false });
  noop(state.info);

  if (state.info.age === 2) {
    return <MarkUpdate info={info}>only info.age {state.info.age} </MarkUpdate>
  }
  noop(state.extra.list[0]);
  console.log(info.getDeps());
  noop(state.extra.list[1]);

  return <MarkUpdate info={info}><h2>arrIndexDep=false  {info.insKey} {state.info.age}</h2></MarkUpdate>;
}


const Demo = () => (
  <Entry fns={[plusAge, minusAge, changeDesc, changeShared, changeList0, changeExtra, resetList]}>
    <Info />
    {/* <Info1 />
    <Info2 /> */}
    {/* <Info />
    <Name />
    <Age /> */}
  </Entry>
);

export default Demo;
