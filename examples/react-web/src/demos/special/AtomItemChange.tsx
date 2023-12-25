import { $, atom, share } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';

const [shared, setState] = share({ number: 1 })

const [listAtom, setAtom] = atom([{ a: 1, b: { name: 2 } }, { a: 2, b: { name: 4 } }]);
const [a2, setAtom2] = atom({ a: 1, b: { b1: { b2: 100 } } });
const [a3, setAtom3, ctx3] = atom(new Map([
  [1, { info: { age: 1, age2: 2, age3: { k1: { k2: { k3: { k4: { k5: 1 } } } } } } }],
  [2, { info: { age: 2, age2: 2, age3: { k1: { k2: { k3: { k4: { k5: 1 } } } } } } }]
]));
function changeItem() {
  // const prevItem0 = listAtom.val[0];
  // const prevItem1 = listAtom.val[1];
  // setAtom(draft => { draft[0].b.name = Date.now() });
  // setAtom2(draft => { draft.b.b1.b2 += 100 });
  setAtom3(draft => {
    // @ts-ignore
    draft.get(1).info.age = Date.now();
  });
  // const currItem0 = listAtom.val[0];
  // const currItem1 = listAtom.val[1];
  // console.log('prevItem0===currItem0 ', prevItem0 === currItem0);
  // console.log('prevItem1===currItem1 ', prevItem1 === currItem1);
}

function changeItem2() {
  setAtom3(draft => {
    // @ts-ignore
    draft.get(1).info.age2 = Date.now();
  });
}

function changeItem3() {
  setAtom3(draft => {
    if (draft.get(2)) {
      // @ts-ignore
      draft.get(2).info.age3.k1.k2.k3.k4.k5 = Date.now();
    }
  });
}

function Comp() {
  console.log(listAtom);
  // const [m] = ctx3.useState();

  return (
    <MarkUpdate>
      listAtom.d {$(listAtom.val[0].b.name)}
      <br />
      a3.val.get(1).info.age {$(a3.val.get(1)?.info.age)}
      <br />
      a3.val.get(1).info.age2 {$(a3.val.get(1)?.info.age2)}
      <br />
      a3.val.get(1).info.age2 {$(a3.val.get(1)?.info.age2, val => `${val} <-- at ${Date.now()}`)}
      <br />
      a3.val.get(2).info.age {$(a3.val.get(2)?.info.age, val => `${val}`)}
      <br />
      <h3>最多直接6层依赖路径</h3>
      a3.val.get(2).info.age3.k1.k2.k3.k4.k5 {$(a3.val.get(2)?.info.age3.k1.k2.k3.k4.k5, val => `${val}`)}
      <br />
      {/* a2.b.b1.b2 {$(a2.val.b.b1.b2)} */}
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeItem, changeItem2, changeItem3]}>
    <Comp />
    {/* <Comp /> */}
  </Entry>
);

export default Demo;
