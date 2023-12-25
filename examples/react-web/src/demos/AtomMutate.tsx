import React from 'react';
import { atom, sharex, useAtom, atomx, $ } from 'helux';
import type { IPlugin } from 'helux';
import { MarkUpdate, Entry } from './comps';
import { log, delay, random } from './logic/util';

const [baseAtom, setAtom] = atom(3000, { moduleName: 'baseAtom' });

const [doubleAtom, setDouble] = atom(2, {
  moduleName: 'doubleAtom',
  mutate: [
    {
      // TODO 加入死循环示例
      fn: (draft: any, params: any) => {
        // console.log('draftRoot ', draftRoot)
        params.draftRoot.val = params.draftRoot.val + 200;
        // return draft * 2;
      },
      desc: 'atom_xxx',
    },
  ],
  alertDeadCycleErr: false,
});
const changeDoubleAtom = () => {
  setDouble(prev => prev + 100);
};

const [minus10Atom] = atom(0, {
  mutate: () => doubleAtom.val - 10,
});
atom(0)[2].mutate(() => doubleAtom.val - 10);

const x = atomx({ a: 1, b: 2 }, { moduleName: 'yy', alertDeadCycleErr: false });

// x.mutate(() => ({ a: 3, b: 4 }));
x.mutate({
  // TODO  这个是拦不住的死循环示例
  // DONE  目前已经可以挡住了
  fn: (draft, { draftRoot }) => {
    // console.error('trigger fn');
    // // draftRoot.val = { a: 3, b: 4 }; // dc
    // // return { a: 3, b: 4 };
    // console.error('trigger fn');
    // // draft.a = draft.b + 8;
    // draft.a = draftRoot.val.b + 8;
    console.log('a is', draft.a);
    // changeA();
  },
  desc: 'xx',
});

const x2 = sharex({ a: 1, b: 2 }, { moduleName: 'yy2' });

console.log(x.state.val.a);
x.reactive.b = 100;
x.flush();
console.log(x.state.val.a);

x.reactive.b = 103;
x.flush();
console.log(x.state.val.a);
console.log(x.state.val.b);

x.reactive.b = 108;
x.flush();
console.log(x.state.val.a);
console.log(x.state.val.b);

function Price() {
  const [base, , info] = useAtom(baseAtom);
  return <MarkUpdate name="Price" info={info}>{base}</MarkUpdate>;
}

function IdealPrice() {
  const [double, , info] = useAtom(doubleAtom);
  return <MarkUpdate name="Price" info={info}>{double}</MarkUpdate>;
}

function FinalPrice() {
  const [minus10, , info] = useAtom(minus10Atom);
  return <MarkUpdate name="Price" info={info}>{minus10}</MarkUpdate>;
}

function changeBase() {
  setAtom(baseAtom.val + 100);
}

function changeB1() {
  x.setState(draft => { draft.b = 100 });
}

function changeB2() {
  const b = random();
  console.error(`new b ${b}`);
  x.reactive.b = b;
}

function changeB3() {
  x.reactiveRoot.val.b = random();
}

function changeA() {
  x.reactive.a += 100;
}

function Demo(props: any) {
  const fns = [changeBase, changeB1, changeB2, changeB3, changeA, changeDoubleAtom];
  // const fns:any[] = [];
  return <Entry fns={fns}>
    <Price />
    <IdealPrice />
    <IdealPrice />
    <FinalPrice />
    <FinalPrice />
    {$(x.reactive.a)}
    <br />
    {$(x.reactive.b)}
    {$(() => <h3>x.reactive.b: {x.reactive.b} a:{x.reactive.a}</h3>)}
  </Entry>
}


export default Demo;
