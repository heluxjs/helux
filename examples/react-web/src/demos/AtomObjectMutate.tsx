import React from 'react';
import { atom, useAtom } from 'helux';
import { MarkUpdateH3 as MarkUpdate, Entry } from './comps';
import { randomStr } from './logic/util';

const [infoAtom, setAtom] = atom(
  { price: 100, info: { from: 'bj', owner: 'fancy', detail: { street: 'n2' } } },
  { moduleName: 'AtomObjectMutate' }
);
const [funnyAtom] = atom({
  double: 0, funnyName: '',
}, {
  mutate: [
    (draft) => {
      console.log('double mutate');
      draft.double = infoAtom.val.price * 2;
    },
    (draft) => {
      console.log('funnyName mutate');
      const { from, detail } = infoAtom.val.info;
      draft.funnyName = `${from}_${detail.street}`;
    },
  ]
});
const [nickAtom] = atom({ nickName: '' }, {
  mutate: (draft) => {
    const { owner } = infoAtom.val.info;
    draft.nickName = `${funnyAtom.val.funnyName}|owner:${owner}`;
  },
});

function changePrice() {
  setAtom(draft => { draft.price += 100 }, { desc: 'changePrice' });
}

function changeStreet() {
  setAtom(draft => { draft.info.detail.street = `${randomStr()}` }, { desc: 'changeStreet' });
}

function InfoAtom() {
  const [base, , info] = useAtom(infoAtom);
  return <MarkUpdate name="InfoAtom" info={info}>price {base.price}</MarkUpdate>;
}

function FunnyAtom() {
  const [funny, , info] = useAtom(funnyAtom);
  return <MarkUpdate name="FunnyAtom" info={info}>funnyName: {funny.funnyName}</MarkUpdate>;
}

function FunnyAtomDouble() {
  const [funny, , info] = useAtom(funnyAtom);
  return <MarkUpdate name="FunnyAtomDouble" info={info}>double: {funny.double}</MarkUpdate>;
}

function NickAtom() {
  const [nick, , info] = useAtom(nickAtom);
  return <MarkUpdate name="NickAtom" info={info}>{nick.nickName}</MarkUpdate>;
}

function Demo(props: any) {
  return <Entry fns={[changePrice, changeStreet]}>
    <InfoAtom />
    <InfoAtom />
    <FunnyAtom />
    <FunnyAtom />
    <FunnyAtomDouble />
    <FunnyAtomDouble />
    <NickAtom />
    <NickAtom />
  </Entry>
}


export default Demo;
