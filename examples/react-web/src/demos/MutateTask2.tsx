// @ts-nocheck
import React from 'react';
import { atom, share, useAtom, useForceUpdate, } from 'helux';
import { MarkUpdate, Entry } from './comps';
import { log, delay } from './logic/util';

const [numAtom] = atom(3000);
const [priceState, setPrice] = share({ a: 1, b: 100 }, { moduleName: 'MutateTask' });
const [idealPriceState, , ctx] = share({ loading: false, retA: 0, retB: 1 }, {
  moduleName: 'idealPrice',
  mutate: {
    retA: {
      deps: () => [priceState.a, numAtom.val],
      fn: (draft, [a, b]) => draft.retA = a + b,
      task: async ({ setState }) => {
        await delay(1000);
        // some async logic here ...
        setState(draft => {
          draft.retA = priceState.a + numAtom.val;
        });
      },
      immediate: true,
    },
    retB: (draft) => draft.retB = priceState.b + 2 + numAtom.val,
  },
});



const [finalPriceState] = share({ loading: false, retA: 0, time: 0 }, {
  mutate: {
    // retA: draft => draft.retA = idealPriceState.retA - 600,
    retA: {
      dep: () => [idealPriceState.retA],
      task: async ({ setState }) => {
        setState({ loading: true });
        await delay(1000);
        setState(draft => {
          draft.retA = idealPriceState.retA - 600;
          draft.loading = false;
        });
      },
    }
  },
  before({ desc, draft }) {
    draft.time = Date.now();
    log('finalPriceState', `desc is ${desc}`);
  },
});

function changePrice() {
  setPrice(
    draft => { draft.a += 100 },
    { desc: 'changePrice' },
  );
}


function Price() {
  const [price, , info] = useAtom(priceState);
  return <MarkUpdate name="Price" info={info}>{price.a}</MarkUpdate>;
}

function IdealPrice() {
  const [idealPrice, , info] = useAtom(idealPriceState);
  const [loading] = ctx.useMutateLoading();

  return <MarkUpdate name="IdealPrice" info={info}>
    <div>{idealPrice.loading ? 'loading' : idealPrice.retA}</div>
    <div>{loading.retA.loading ? 'retA is loading ...' : 'end'}</div>
  </MarkUpdate>;
}

function FinalPrice() {
  const [finalPrice, , info] = useAtom(finalPriceState);
  return <MarkUpdate name="FinalPrice" info={info}>
    {finalPrice.loading ? 'loading' : finalPrice.retA}
  </MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[changePrice]}>
    <Price />
    <Price />
    <IdealPrice />
    <IdealPrice />
    <FinalPrice />
    <FinalPrice />
  </Entry>
);


export default Demo;
