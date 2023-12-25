// @ts-nocheck
import React from 'react';
import { atom, share, useAtom, runMutateFn } from 'helux';
import { MarkUpdate, Entry } from './comps';
import { log, delay } from './logic/util';

const [numAtom] = atom(3000);
const [priceState, setPrice] = share({ a: 1, b: 100 }, { moduleName: 'MutateTask' });
const [idealPriceState, , ctx] = share({ loading: false, retA: 0, retB: 1 }, {
  moduleName: 'MutateTask_idealPrice',
  mutate: {
    // 首次只执行同步方法，后续只会执行异步方法
    retA: {
      deps: () => [priceState.a, numAtom.val] as const,
      fn: (draft, { input: [a, b] }) => draft.retA = a + b,
      task: async ({ setState, input: [a, b] }) => {
        debugger;
        console.error(' task been called ');
        setState({ loading: true });
        await delay(1000);
        setState(draft => {
          draft.retA = priceState.a + numAtom.val;
          draft.loading = false;
        });
      },
    },

    // // 首次只执行异步方法，后续会继续执行异步方法
    // retA2: {
    //   deps: () => [priceState.a, numAtom.val] as const,
    //   task: async ({ setState, input: [a, b] }) => {
    //     setState({ loading: true });
    //     await delay(1000);
    //     setState(draft => {
    //       draft.retA = priceState.a + numAtom.val;
    //       draft.loading = false;
    //     });
    //   },
    // },

    // // 首次同步方法和异步方法均执行（设置 immediate为 true ），后续只会执行异步方法
    // retA3: {
    //   deps: () => [priceState.a, numAtom.val] as const,
    //   fn: (draft, [a, b]) => draft.retA = a + b,
    //   task: async ({ setState, input: [a, b] }) => {
    //     setState({ loading: true });
    //     await delay(1000);
    //     setState(draft => {
    //       draft.retA = priceState.a + numAtom.val;
    //       draft.loading = false;
    //     });
    //   },
    //   immediate: true
    // },


    //
    // retB: (draft) => draft.retB = priceState.b + 2 + numAtom.val,
  },
});



const [finalPriceState] = share({ loading: false, retA: 0, time: 0 }, {
  mutate: {
    // retA: draft => draft.retA = idealPriceState.retA - 600,
    retA11: {
      deps: () => [idealPriceState.retA] as const,
      task: async ({ setState }) => {
        console.error('2 task been called ');
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
    log('finalPriceState', `desc is ${desc}`, draft);
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
    <div>idealPrice.retA: {idealPrice.loading ? 'loading' : idealPrice.retA}</div>
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
    {/* <Price />
    <Price />
    <IdealPrice />
    <IdealPrice />
    <FinalPrice />
    <FinalPrice /> */}
  </Entry>
);


export default Demo;
