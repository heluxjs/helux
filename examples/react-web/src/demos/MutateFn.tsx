import React from 'react';
import { atom, share, useAtom } from 'helux';
import { MarkUpdate, Entry } from './comps';


const [aAtom] = atom({ a: 1, b: 2 }, {
  mutate: {
    changeB: (draft, params) => draft.b = params.state.a + 1,
  },
});

const [numAtom] = atom(3000);
const [priceState, setPrice] = share({ a: 1, b: 100 }, { moduleName: 'MutateFn' });
const [idealPriceState] = share({ idealPrice: 0, retB: 1 }, {
  mutate: [
    (draft) => draft.idealPrice = priceState.a + 1000 + numAtom.val,
    (draft) => { draft.retB = priceState.b + 2 + numAtom.val },
  ],
});

const [finalPriceState] = share({ finalPrice: 0, time: 0 }, {
  mutate: draft => draft.finalPrice = idealPriceState.idealPrice - 600,
  before(params) {
    console.log(params);
  },
});

function changePrice() {
  setPrice(
    draft => { draft.a += 100 },
  );
}

function Price() {
  const [price, , info] = useAtom(priceState);
  return <MarkUpdate name="Price" info={info}>{price.a}</MarkUpdate>;
}

function IdealPrice() {
  const [idealPrice, , info] = useAtom(idealPriceState);
  return <MarkUpdate name="IdealPrice" info={info}>{idealPrice.idealPrice}</MarkUpdate>;
}

function FinalPrice() {
  const [finalPrice, , info] = useAtom(finalPriceState);
  return <MarkUpdate name="FinalPrice" info={info}>{finalPrice.finalPrice}</MarkUpdate>;
}

function Demo(props: any) {
  return (
    <Entry fns={[changePrice]}>
      <Price />
      <Price />
      <IdealPrice />
      <IdealPrice />
      <FinalPrice />
      <FinalPrice />
    </Entry>
  );
}


export default Demo;
