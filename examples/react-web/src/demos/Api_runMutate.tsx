import React from 'react';
import { atom, share, useAtom, runMutate, runMutateTask, mutate } from 'helux';
import { MarkUpdate, Entry } from './comps';
import { log, delay } from './logic/util';

console.log('useAtom', useAtom.name);

const [numAtom] = atom(3000);
const [priceState, setPrice] = share({ a: 1, b: 100 }, { moduleName: 'MutateTask' });
const [idealPriceState, , ctx] = share({ loading: false, retA: 0, retB: 1 }, {
  moduleName: 'idealPrice',
  mutate: {
    retB: (draft) => draft.retB = priceState.b + 2 + numAtom.val,
  },
});


const witness = mutate(idealPriceState)({
  desc: 'retA',
  deps: () => [priceState.a, numAtom.val] as const,
  fn: (draft, { input: [a, b] }) => draft.retA = a + b,
  task: async ({ setState, input: [a, b] }) => {
    console.log('call mutate retA task');
    setState({ loading: true });
    console.log('call mutate retA task 2');
    await delay(1000);
    setState(draft => {
      draft.retA = priceState.a + numAtom.val;
      draft.loading = false;
    });
  },
})


const [finalPriceState] = share({ loading: false, retA: 0, time: 0 }, {
  mutate: {
    // retA: draft => draft.retA = idealPriceState.retA - 600,
    depOnRetA: {
      deps: () => [idealPriceState.retA],
      task: async ({ setState }) => {
        console.log('call mutate depOnRetA task');
        setState({ loading: true });
        console.log('call mutate depOnRetA task');
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
    log('call before, finalPriceState', `desc is ${desc}`);
  },
});

function changePrice() {
  setPrice(
    draft => { draft.a += 100 },
    { desc: 'changePrice' },
  );
}

function runMutateRetA() {
  // runMutate(idealPriceState, 'retA');
  runMutateTask(idealPriceState, 'retA');
}

function runMutateRetA2() {
  // witness.run();
  witness.runTask();
}

function runMutateRetA2Async() {
  witness.runTask().then(snap => {
    console.log(snap);
  });
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
    <div>{loading.retB.loading ? 'retA is loading ...' : 'end'}</div>
  </MarkUpdate>;
}

function FinalPrice() {
  const [finalPrice, , info] = useAtom(finalPriceState);
  return <MarkUpdate name="FinalPrice" info={info}>
    {finalPrice.loading ? 'loading' : finalPrice.retA}
  </MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[changePrice, runMutateRetA, runMutateRetA2, runMutateRetA2Async]}>
    <Price />
    <Price />
    <IdealPrice />
    <IdealPrice />
    <FinalPrice />
    <FinalPrice />
  </Entry>
);


export default Demo;
