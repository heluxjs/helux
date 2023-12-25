import React from 'react';
import { useAtom, share, useLocalForceUpdate } from 'helux';
import * as util from './logic/util';

const ori = { a: 50, doubleA: 0, b: 2, c: { c1: 100, c2: 1000 }, list: [{ name: 'one', age: 1 }] };
const [ret, setState, ctx] = share(ori, {
  moduleName: 'd2s', exact: true,
  rules: [
    { when: (state) => [state.list, state.c.c1, state.c.c2], ids: ['list'] },
  ]
});

function change_a() {
  setState(draft => {
    draft.a = util.random();
  });
}

function A() {
  console.log('Render A');
  const [state] = useAtom(ret);
  return (
    <div>
      {state.a} update at: {util.timemark()}
    </div>
  );
}

function B() {
  console.log('Render B');
  const [state] = useAtom(ret);
  return (
    <div>
      {state.b} update at: {util.timemark()}
    </div>
  );
}

function Entry(props: any) {
  console.log('Render Entry');
  const [show, setShow] = React.useState(true);
  const forceUpdate = useLocalForceUpdate();
  const [obj, setObj] = ctx.useLocalState({ a: 1 });
  const changeObja = () => setObj(draft => { draft.a += 1 });

  return <div>
    <button onClick={() => setShow(!show)}>switch show</button>
    <button onClick={forceUpdate}>force update</button>
    <button onClick={change_a}>change_a</button>
    <button onClick={changeObja}>changeObja</button>
    {show && <>
      <h3>{obj.a}</h3>
      <A />
      <B />
    </>}
  </div>
}

Entry.desc = '演示 setState 时，设置 extraDeps 的效果';

export default Entry;
