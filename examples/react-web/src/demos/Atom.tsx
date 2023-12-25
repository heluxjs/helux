import React from "react";
import {
  AtomValType,
  share,
  atom,
  watch,
  useDerived,
  useAtom,
  derive,
  action,
} from "helux";
import { MarkUpdate, Entry } from './comps';
import { random } from './logic/util';

const [numAtom, setAtom, ctx] = atom(1, { moduleName: 'Atom' });
const [numAtom2, setAtom2, ctx2] = atom({ a: 2, b: 2 }, { moduleName: 'Atom2' });
const [numAtom3, setAtom3, ctx3] = share({ a: 2, b: 2 }, { moduleName: 'Atom3' });

const n3 = ctx2.setState(draft => { draft.a = 1 })
const n1 = setAtom2(draft => { draft.a = 1 })
const n2 = setAtom3(draft => { draft.a = 2 })
const n4 = ctx3.setState(draft => { draft.a = 2 })

const numPlusAtom = derive(() => {
  return numAtom.val + 100;
});

const numPlus200Atom = derive(() => {
  return numPlusAtom.val + 200;
});

function changeNumOutOfComp() {
  setAtom(numAtom.val + 1);
}

function changeNumOutOfCompWithCb() {
  setAtom(() => numAtom.val + 1);
}

function changeNumByDraftOutOfComp() {
  setAtom((val) => (val + 2));
  ctx.setState(val => val + 2)
}

const hiAction = action(numAtom)<[number, string]>()(({ draftRoot, payload }) => {
  draftRoot.val += 100;
}, 'hi action');

// const aciton2 = createAtomAction(numAtom)<[number, string]>(({ draft, payload }) => {
//   draft.val += 100;
// }, 'hi action');
// console.log('aciton ', aciton);

const someAction = ctx.action<number>()(({ draftRoot, payload, draft }) => {
  draftRoot.val = (payload && Number.isInteger(payload)) ? payload : random();
}, 'someAction');
const someActionTop = action(numAtom)<number>()(({ draftRoot, payload }) => {
  draftRoot.val = (payload && Number.isInteger(payload)) ? payload : random();
}, 'someActionTop');

watch((params) => {
  const { val } = numAtom;
  console.log("val changed -->", val);
});

function NumAtom() {
  const [num, setNum, info] = useAtom(numAtom, { collectType: 'first' });
  const changeNum = () => setNum(num + 1);
  const changeNumByDraft = () => setNum((val) => (val + 2));

  return (
    <MarkUpdate info={info}>
      <pre>num: {num}</pre>
      <button onClick={changeNum}>changeNum</button>
      <button onClick={changeNumByDraft}>changeNumByDraft</button>
    </MarkUpdate>
  );
}

function NumPlusAtom() {
  const [num, , info] = useDerived(numPlusAtom);

  return (
    <MarkUpdate info={info}>
      <pre>num plus: {num}</pre>
    </MarkUpdate>
  );
}

function NumPlus200Atom() {
  const [num, , info] = useDerived(numPlus200Atom);

  return (
    <MarkUpdate info={info}>
      <pre>num plus 200: {num}</pre>
    </MarkUpdate>
  );
}

function Demo(props: any) {
  return (
    <Entry fns={[changeNumOutOfComp, changeNumOutOfCompWithCb, changeNumByDraftOutOfComp, someAction, someActionTop, hiAction]}>
      <NumAtom />
      <NumAtom />
      <NumPlusAtom />
      <NumPlusAtom />
      <NumPlus200Atom />
      <NumPlus200Atom />
    </Entry>
  );
}

export default Demo;

