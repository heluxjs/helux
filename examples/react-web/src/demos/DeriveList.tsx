import React from 'react';
import {
  useAtom, share, shallowCompare, deriveDict, useDerived,
} from 'helux';
import * as util from './logic/util';
import { MarkUpdate, Entry } from './comps';

const stateFn = {
  list: [{ name: "one", age: 1 }],
  nestedList: [{ name: "n-one", age: 1, list: [{ subName: "subOne" }] }]
};
const [ret, setState] = share(stateFn, {
  moduleName: 'dlist',
  exact: true,
  rules: [
    // { when: (state) => [state.list], ids: ['list'] },
    // { when: (state) => [state.nestedList], ids: ['list1', 'list2'] },
  ],
});

const lenMarkRet = deriveDict(() => {
  const { list } = ret;
  const idx = list.findIndex(item => item.name === 'xxx');
  // return { val: `len is ${list.length} (${util.timemark()})` };
  return { val: `see ${idx} (${util.timemark()})` };
});

function changeItemName(idx: number) {
  setState(draft => {
    const item = draft.list[idx];
    if (item) {
      const arr = item.name.split('_');
      arr[arr.length - 1] = String(Date.now());
      item.name = arr.join('_');
    }
  });
}

function addListItem() {
  setState(draft => {
    draft.list.push({ name: `new_${util.getSeed()}`, age: 100 });
  });
}

function spliceList() {
  setState(draft => {
    draft.list.splice(0, 1);
    console.log(draft.list);
  });
}

function changeNestedItemName(idx: number) {
  setState(draft => {
    const item = draft.nestedList[idx];
    if (item) {
      const arr = item.name.split('_');
      arr[arr.length - 1] = String(Date.now());
      item.name = arr.join('_');
    }
  });
}

function addNestedItemSubItem(idx: number) {
  setState(draft => {
    const item = draft.nestedList[idx];
    if (item) {
      item.list.push({ subName: `sub for ${idx} - ${Date.now()}` });
    }
  });
}

function changeNestedItemSubItemName(idx: number, subIdx: number) {
  setState(draft => {
    const item = draft.nestedList[idx];
    if (item) {
      const subItem = item.list[subIdx];
      if (subItem) {
        subItem.subName = `new name - ${Date.now()}`
      }
    }
  });
}


const ListItem = React.memo(function (props: any) {
  console.log(`Render ListItem ${props.item.name}`);
  return (
    <div style={{ border: '1px solid green', padding: '6px', margin: '6px' }}>
      name: {props.item.name}
      <div>update at: {Date.now()}</div>
      <button onClick={() => changeItemName(props.idx)}>change name</button>
    </div>
  );
}, shallowCompare);


function List() {
  console.log('Render List');
  const [state] = useAtom(ret, { id: 'list' });
  return (
    <div>
      {state.list.map((item, idx) => <ListItem key={idx} item={item} idx={idx} />)}
    </div>
  );
}

function ListLen() {
  console.log('Render ListLen');
  const [lenMark] = useDerived(lenMarkRet);
  return (
    <div>
      {lenMark.val}
    </div>
  );
}

function NestedList() {
  console.log('Render NestedList');
  const [state] = useAtom(ret, { id: 'list1' });

  return (
    <div>
      {state.nestedList.map((item, idx) => <NestedListItem key={idx} item={item} idx={idx} />)}
    </div>
  );
}

const NestedListItem = React.memo(function (props: any) {
  console.log(`Render NestedListItem ${props.item.name}`);
  return (
    <div style={{ border: '1px solid green', padding: '6px', margin: '6px' }}>
      name: {props.item.name}
      <div>update at: {Date.now()}</div>
      <div>
        <div>sub list</div>
        <div>
          {props.item.list.map((item: any, idx: number) => (
            <NestedListSubItem key={idx} item={item} idx={props.idx} subIdx={idx} />
          ))}
        </div>
      </div>
      <button onClick={() => changeNestedItemName(props.idx)}>change nested item name</button>
      <button onClick={() => addNestedItemSubItem(props.idx)}>add nested item sub item</button>
    </div>
  );
}, shallowCompare);


const NestedListSubItem = React.memo(function (props: any) {
  console.log(`Render NestedListSubItem ${props.subIdx}`);
  return (
    <div style={{ border: '1px solid green', padding: '6px', margin: '6px' }}>
      subItem name: {props.item.subName}
      <button onClick={() => changeNestedItemSubItemName(props.idx, props.subIdx)}>change sub name</button>
    </div>
  );
}, shallowCompare);


function Demo(props: any) {
  return <Entry fns={[addListItem, spliceList]}>
    <List />
    <ListLen />
    <NestedList />
  </Entry>
}


export default Demo;
