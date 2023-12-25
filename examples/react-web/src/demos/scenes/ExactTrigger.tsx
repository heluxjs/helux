import { atom, derive, useAtom, watch, shallowCompare, $, useWatch } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { random, delay, noop } from "../logic/util";

// TODO， 引入参数 middleDep， deriveDict and watch 默认 false ，hook 默认 true

const [numAtom, setNumAtom] = atom(1);
const [numAtom2, setNumAtom2] = atom(1);
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

const changeNum = () => setNumAtom(Date.now());
const changeNum2 = () => setNumAtom2(Date.now());
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
const changeExtra = () => {
  setShared((draft) => {
    draft.extra = { ...draft.extra };
  });
};
const resetRoot = () => {
  setShared(draft => ({ ...draft }));
}

const countStat = {
  watch: () => console.error('trigger watch'),
  nameResult: () => console.error('trigger nameResult'),
  infoComp: () => console.error('trigger infoComp'),
  nameComp: () => console.error('trigger nameComp'),
  ageComp: () => console.error('trigger ageComp'),
};
// ✅ 不被执行
watch(
  () => {
    countStat.watch();
    console.log('name changed');
  },
  () => [shared.val.info.name],
);
// ✅ 不被执行
const nameResult = derive(() => {
  countStat.nameResult();
  noop(shared.val.extra);
  // noop(shared.val.extra.mark);
  return `prefix:${shared.val.info.name}`;
});
// 💢 触发执行，因为 info 引用已变化
function Info() {
  countStat.infoComp();
  const [state, , info] = useAtom(shared);
  console.log(state.info);
  return <MarkUpdate info={info}><h3>just read info </h3></MarkUpdate>;
}
// ✅ 不被执行
function Name() {
  countStat.nameComp();
  const [state, , info] = useAtom(shared);
  return <MarkUpdate info={info}> <h3>{state.info.name}</h3></MarkUpdate>;
}
// ✅ 不被执行
function Age() {
  countStat.ageComp();
  const [state, , info] = useAtom(shared);
  React.useEffect(() => {
    console.error('state.info changed');
  }, [state.info]);

  return <MarkUpdate info={info}><h3>{state.info.age}</h3></MarkUpdate>;
}

const Item = React.memo(function Item(props: any) {
  return <MarkUpdate>
    {props.item.id}
    {props.item.name}
  </MarkUpdate>
}, shallowCompare);

let renderCount = 0;

function List() {
  renderCount += 1;
  console.log('List');
  const [state, , info] = useAtom(shared, { arrDep: false });
  const [num, , info1] = useAtom(numAtom, { deps: (state) => [state] });
  const [num2, , info2] = useAtom(numAtom2);
  // noop(state.extra);
  // noop(state.desc);
  // noop(state.extra.list);

  // const { extra, desc } = state;
  // const { list } = extra;
  // React.useEffect(() => {
  //   console.error(`state.extra changed`);
  // }, [state.extra]);

  // const { desc, extra } = state;
  // const { list } = extra;
  // noop(state.extra.list[0]);
  // if (renderCount % 2 === 0) {
  //   console.log('---> shoulod have 7/val|extra|list|1');
  //   noop(state.extra.list[1]);
  // } else {
  //   console.log('---> shoulod lost 7/val|extra|list|1');
  // }

  // useWatch(() => {
  //   console.log(`state.desc changed`);
  // }, () => [state.desc]);
  // useWatch(() => {
  //   console.log(`state.extra changed`);
  // }, () => [state.extra]);
  // useWatch(() => {
  //   console.log(`state changed`);
  // }, () => [state]);
  // useWatch(() => {
  //   console.log(`shared changed`);
  // }, () => [shared]);
  useWatch(() => {
    console.log(`num changed`);
  }, () => [num]);
  useWatch(() => {
    console.log(`numAtom2 changed`);
  }, () => [num2]);

  return <MarkUpdate info={[info, info1, info2]}>
    {/* {state.extra.list.map((item) => <Item key={item.id} item={item} />)} */}
    {/* {$(state.desc)} */}
    <br />
    {$(shared.val.desc)}
  </MarkUpdate>;
}


const Demo = () => (
  <Entry fns={[changeNum, changeNum2, changeDesc, changeShared, changeList0, changeExtra, resetRoot]}>
    <Info />
    <Name />
    <Age />
    <List />
  </Entry>
);

export default Demo;
