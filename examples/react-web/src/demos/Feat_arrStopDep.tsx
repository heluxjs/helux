import React from 'react';
import { Dict, mutate, share, useAtom, shallowCompare, $ } from 'helux';
import { MarkUpdate, Entry } from './comps';
import { randomStr, delay, random } from './logic/util';

const [, setState, ctx] = share({
  a: {
    b: {
      list: [
        { name: 1, age: 2, info: { street: 'u_road' } },
        { name: 2, age: 22, info: { street: 'u_road_2' } },
      ]
    }
  },
  a1: { a2: { a3: { a4: { a5: { a6: { a7: { a8: 1 } } } } } } }
}, {
  exact: true,
  stopDepth: 6,
  rules: [
    { when: state => state.a.b.list, stopDep: true }, // 优先级高于 stopArrDep
  ],
  stopArrDep: true,
});

function changeIdx(idx: number) {
  setState(draft => { draft.a.b.list[idx].info.street = randomStr() });
}

function changeIdx0() {
  changeIdx(0);
}

function changeIdx1() {
  changeIdx(1);
}

function changeA8() {
  setState(draft => { draft.a1.a2.a3.a4.a5.a6.a7.a8 = random() });
}

function List() {
  const [state, , info] = ctx.useState();
  return <MarkUpdate name="Price" info={info}>
    <h3>a8: {$(ctx.state.a1.a2.a3.a4.a5.a6.a7.a8)}</h3>
    {state.a.b.list.map(item => <ListItem key={item.name} item={item} info={info} />)}
  </MarkUpdate>;
}

const ListItem = React.memo(function (props: Dict) {
  const { item, info } = props;
  return <MarkUpdate name="LiteItem" info={info}>
    <div>item.info.street: {item.info.street}</div>
    <div>item.name: {item.name}</div>
  </MarkUpdate>;
}, shallowCompare);

const Demo = () => (
  <Entry fns={[changeIdx0, changeIdx1, changeA8]}>
    <h3>a8: {$(ctx.state.a1.a2.a3.a4.a5.a6.a7.a8)}</h3>
    <h3>a8: {$(ctx.state.a1.a2.a3.a4.a5.a6.a7.a8)}</h3>
    <h3>a8: {$(ctx.state.a1.a2.a3.a4.a5.a6.a7.a8)}</h3>
    <List />
    <List />
  </Entry>
);


export default Demo;
