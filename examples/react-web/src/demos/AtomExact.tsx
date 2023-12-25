import React from 'react';
import { atom, useAtom } from 'helux';
import { MarkUpdate, Entry } from './comps';

const [numAtom, setAtom] = atom({ a: 1, b: 2 }, { moduleName: 'AtomExact' });

function changeA() {
  setAtom(draft => { draft.a += 100 });
}

function changeB() {
  setAtom(draft => { draft.b += 1 });
}

function changeAB() {
  setAtom(draft => {
    draft.a += 100;
    draft.b += 1;
  });
}

function changeABWithNewObj() {
  setAtom(draft => {
    const { a, b } = draft;
    return { a: a + 100, b: b + 1 };
  });
}

function ReadA() {
  const [num, , info] = useAtom(numAtom);
  return <MarkUpdate name="ReadA" info={info}>{num.a}</MarkUpdate>;
}

function ReadB() {
  const [num, , info] = useAtom(numAtom);
  return <MarkUpdate name="ReadB" info={info}>{num.b}</MarkUpdate>;
}

function ReadAB() {
  const [num, , info] = useAtom(numAtom);
  return <MarkUpdate name="ReadB" info={info}>{num.a} - {num.b}</MarkUpdate>;
}

function NoRead() {
  const [, , info] = useAtom(numAtom);
  return <MarkUpdate name="NoRead" info={info}>nothing</MarkUpdate>;
}


function Demo(props: any) {
  return <Entry fns={[changeA, changeB, changeAB, changeABWithNewObj]}>
    <ReadA />
    <ReadA />
    <ReadB />
    <ReadB />
    <ReadAB />
    <ReadAB />
    <NoRead />
  </Entry>
}


export default Demo;
