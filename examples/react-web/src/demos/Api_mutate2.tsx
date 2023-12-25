import React from 'react';
import { mutate, share, useAtom } from 'helux';
import { MarkUpdate, Entry } from './comps';
import { random, delay } from './logic/util';

const [priceState, setPrice] = share({ a: 1, b: 100 }, { moduleName: 'Api_mutate2' });
const [finalPriceState, , ctx] = share({ retA: 0, time: 0 }, { moduleName: 'Api_mutate_finalPriceState2' });

// 外部定义 mutate 函数
const witness = mutate(finalPriceState)({
  deps: () => [priceState.a] as const,
  fn: (draft, { input: [a] }) => {
    // draft.retA += a; // 初始值函数，随 priceState.a 变化会重新执行
    draft.retA = a + 100; // 初始值函数，随 priceState.a 变化会重新执行
  },
  desc: 'Api_mutate_finalPriceState2_m1'
});

function changePrice() {
  setPrice(draft => { draft.a = random() });
}

function forceRunMutate() {
  witness.run();
};

function Price() {
  const [price, , info] = useAtom(priceState);
  return <MarkUpdate name="Price" info={info}>{price.a}</MarkUpdate>;
}

function FinalPrice() {
  const [finalPrice, , info] = useAtom(finalPriceState);
  const [loading] = ctx.useMutateLoading();
  const status = loading[witness.desc];

  return <MarkUpdate name="FinalPrice" info={info}>
    {status.loading && 'loading'}
    {status.err && status.err.message}
    {status.ok && <>finalPrice.retA: {finalPrice.retA}</>}
  </MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[forceRunMutate, changePrice]}>
    <Price />
    <Price />
    <FinalPrice />
    <FinalPrice />
  </Entry>
);


export default Demo;
