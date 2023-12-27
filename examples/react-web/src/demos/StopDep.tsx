import { atom, shallowCompare, useAtom } from 'helux';
import React from 'react';
import { Entry, MarkUpdate } from './comps';

const [listAtom, setAtom] = atom(
  { list: [{ name: 1 }, { name: 2 }] },
  {
    rules: [{ when: (state) => state.list, stopDep: true }],
  },
);

const changeItem1 = () => {
  setAtom((state) => {
    state.list[0].name = Date.now();
  });
};

const ListItem = React.memo(function (props: any) {
  return (
    <MarkUpdate info={props.info} name="ListItem">
      {props.item.name}
    </MarkUpdate>
  );
}, shallowCompare);

function List() {
  const [val, , info] = useAtom(listAtom);
  return (
    <MarkUpdate info={info} name="List">
      {val.list.map((item, idx) => (
        <ListItem key={idx} item={item} info={info} />
      ))}
    </MarkUpdate>
  );
}

function Demo(props: any) {
  return (
    <Entry
      buttonArea={
        <>
          <button onClick={changeItem1}>changeItem1</button>
        </>
      }
    >
      <List />
    </Entry>
  );
}

export default Demo;
