import React from 'react';
import { atom, sharex, useAtom, atomx, $ } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { log, delay, random } from '../logic/util';

const [baseAtom, setAtom] = atom(3000, { moduleName: 'baseAtom' });

const x = atomx({ a: 1, b: 2 }, {
  moduleName: 'yy',
  alertDeadCycleErr: false,
  mutate: [
    {
      // TODO  这个是拦不住的死循环示例
      fn: (draft, { draftRoot }) => {
        console.log('a is', draft.a);
        // draftRoot.
        // changeA();
        // x.reactive.a += 100;
      },
      desc: 'xx',
    }
  ],
  before: (params)=>{
    // params.draftRoot.val.
  },
});

// x.mutate(() => ({ a: 3, b: 4 }));
x.mutate({
  // TODO  这个是拦不住的死循环示例
  fn: (draft, { draftRoot }) => {
    console.log('a is', draft.a);
    // changeA();
    // x.reactive.a += 100;
  },
  desc: 'xx',
});


function Price() {
  const [base, , info] = useAtom(baseAtom);
  return <MarkUpdate name="Price" info={info}>{base}</MarkUpdate>;
}


function changeA() {
  x.reactive.a += 100;
}

function Demo(props: any) {
  const fns = [changeA];
  // const fns:any[] = [];
  return <Entry fns={fns}>
    <Price />
    {$(x.reactive.a)}
  </Entry>
}

export default Demo;
