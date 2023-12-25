// @ts-nocheck
import React from 'react';
import {
  useAtom, share, watch,
  getRawState, shallowCompare, useLocalForceUpdate,
} from 'helux';
import * as util from './logic/util';
import * as limu from 'limu';

const draft = limu.createDraft({ key: 1 }, { readOnly: true });
draft.key = 2;
const final = limu.finishDraft(draft);
console.log('draft.key ---> ', final);

const ori = { a: 50, b: 2, c: { c1: 100, c2: 1000 }, list: [{ name: 'one', age: 1 }] };
const [ret, setState] = share(ori, { moduleName: 'st2' });
util.bindToWindow({ IsStatle: { ori, ret } });

watch((params) => {
  const { a, b } = ret;
  console.log('a or b changed', a, b);
});

// will cause error: ERR_ALREADY_SHARED: pass a shared object to createShared!
// const { state: ret2 } = share(ret, { moduleName: 'st2' });

function COMP_C() {
  const [state, , info] = useAtom(ret);
  console.log('info', info.sharedKey);
  const c = state.c;
  return (
    <pre>
      state.c: {c['xx']}
    </pre>
  );
}

const COMP_C_C1 = React.memo(function () {
  const [state, , info] = useAtom(ret);
  console.log(' COMP_C_C1..ee', info.sharedKey);
  return (
    <pre>
      state.c.c1: {state.c.c1}
      <div>update at: {Date.now()}</div>
    </pre>
  );
});

const COMP_C_C2 = React.memo(function () {
  const [state] = useAtom(ret);
  return (
    <pre>
      state.c.c2: {state.c.c2}
      <div>update at: {Date.now()}</div>
    </pre>
  );
});

function change_a() {
  setState(draft => {
    draft.a = util.random();
  });
}

function change_c_c1() {
  setState(draft => {
    draft.c.c1 += 100;
  });
}

function change_c_c2() {
  setState(draft => {
    draft.c.c2 += 200;
  });
}

function changeItemName(idx: number) {
  setState(draft => {
    const item = draft.list[idx];
    console.log(`changeItemName ${idx}`);
    if (item) {
      const arr = item.name.split('_');
      arr[arr.length - 1] = Date.now();
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
// }); // 不使用 shallowCompare 的话，会造成所有 list item 全部更新


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
  const [state] = useAtom(ret, { id: 'list' });
  return (
    <div>
      {state.list.length}
    </div>
  );
}


function Entry(props: any) {
  console.log('Render Entry');
  const [show, setShow] = React.useState(true);
  const showRef = React.useRef(show);
  const forceUpdate = useLocalForceUpdate();
  showRef.current = show;

  return <div>
    <button onClick={() => setShow(!show)}>switch show</button>
    <button onClick={forceUpdate}>force update</button>
    <button onClick={change_a}>change_a</button>
    <button onClick={change_c_c1}>change_c_c1</button>
    <button onClick={change_c_c2}>change_c_c2</button>
    <button onClick={addListItem}>add_list_item</button>
    <button onClick={spliceList}>splice_list</button>
    {show && <>
      <COMP_C />
      <COMP_C_C1 />
      <COMP_C_C2 />
      <List />
      <ListLen />
    </>}
  </div>
}


export default Entry;
