import React from "react";
import {
  atom,
  share,
  useAtom,
  action,
} from "helux";
import { MarkUpdate, Entry } from './comps';
import { random, delay } from './logic/util';

const [numAtom, , ctx] = atom(1, { moduleName: 'AtomAction' });
const [shared, , ctx2] = share({ a: 1, b: 2 }, { moduleName: 'AtomAction2' });

const someAction = ctx.action()(({ draftRoot, payload }) => {
  draftRoot.val = (payload && Number.isInteger(payload)) ? payload : random();
}, 'someAction');

const someAsyncAction = ctx.action<number>()(async ({ setState, payload }) => {
  await delay(2000);
  const val = (payload && Number.isInteger(payload)) ? payload : random();
  // setState((_, draftRoot) => draftRoot.val = val);
  setState(val);
}, 'someAsyncAction');
setTimeout(() => {
  someAsyncAction(6000);
}, 6000)

// someAction()
// createAction3(numAtom, fnDef, desc)
// createAction3(numAtom)(fnDef, desc) --> actionFn
// createAction3(numAtom)<[...]>(fnDef, desc) --> actionFn

const normalAction = action(numAtom)<[number, string]>()(
  ({ setState, payload: args }) => {
    const val = (args[0] && Number.isInteger(args[0])) ? args[0] : random();
    // return val;
    setState(val);
  },
  'normalAction'
);

const asyncAction = action(numAtom)<[number, string]>()(
  async ({ setState, payload: args }) => {
    await delay(2000);
    const val = (args[0] && Number.isInteger(args[0])) ? args[0] : random();
    setState(val);
  }, 'asyncAction'
);

function NumAtom() {
  const [num, setNum, info] = useAtom(numAtom);
  const [shared2, setNum2, info2] = useAtom(shared);
  const changeNum = () => setNum(num + 1);
  const changeNumByDraft = () => setNum((val) => (val + 2));
  const changeNumByDraft2 = () => setNum2((draft) => { draft.a += 1 });

  return (
    <MarkUpdate info={[info, info2]}>
      <pre>num: {num}</pre>
      <pre>num2: {shared2.a}</pre>
      <button onClick={changeNum}>changeNum</button>
      <button onClick={changeNumByDraft}>changeNumByDraft</button>
      <button onClick={changeNumByDraft2}>changeNumByDraft2</button>
    </MarkUpdate>
  );
}

function NumAtomLoading() {
  const [loading, , info2] = ctx.useActionLoading();
  const [num, , info] = useAtom(numAtom);
  const status = loading['asyncAction'];

  return (
    <MarkUpdate name="NumAtomLoading" info={[info, info2]}>
      <pre> {status.loading ? <h1>loading ...</h1> : <>num: {num}</>}</pre>
    </MarkUpdate>
  );
}

function Demo(props: any) {
  return (
    <Entry fns={[someAction, someAsyncAction, normalAction, asyncAction]}>
      <NumAtomLoading />
      <NumAtom />
    </Entry>
  );
}

export default Demo;

// // createAtomAsyncAction
// export function createAction2<T = any>(atom: Atom<T>): <A extends any[] = any[]>(fn: AtomAsyncActionFnDef<A, T>, desc?: string) => AtomAsyncActionFn<A, T>;

// // createAtomAction
// export function createAction3<T = any>(atom: Atom<T>): <A extends any[] = any[]>(fn: AtomActionFnDef<A, T>, desc?: string) => AtomActionFn<A, T>;