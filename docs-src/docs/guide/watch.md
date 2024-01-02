---
group:
  title: 开始
  order: 0
order: 8
---

# 观察

`helux`在内部为实现更智能的自动观察变化做了大量优化工作，同时也暴露了相关接口支持用户在一些特殊场景做人工的观察变化。

## 组件外观察变化

使用`watch`可观察 atom 对象自身变化或任意多个子节点的变化。

观察函数立即执行，首次执行时收集到相关依赖

```ts
import { share, watch, getSnap } from 'helux';

const [priceState, setPrice] = share({ a: 1 });

watch(
  () => {
    // 首次执行日志如下
    // price change from 1 to 1
    //
    // 反复调用 changePrice，日志变化如下
    // price change from 1 to 101
    // price change from 101 to 201
    console.log(
      `price change from ${getSnap(priceState).a} to ${priceState.a}`,
    );
  },
  { immediate: true },
);

const changePrice = () =>
  setPrice((draft) => {
    draft.a += 100;
  });
```

观察函数不立即执行，通过 deps 函数定义需要观察的数据，观察的粒度可以任意定制

```ts
const [priceState, setPrice] = share({ a: 1 });
const [numAtom, setNum] = atom(3000);

//
watch(
  () => {
    console.log(`found price.a changed: () => [priceState.a]`);
  },
  () => [priceState.a],
  // 或写为
  // { deps: () => [priceState.a] }
);

// 观察整个 priceState 的变化
watch(
  () => {
    console.log(`found price changed: [ priceState ]`);
  },
  () => [priceState],
);

// 观察整个 priceState 和 numAtom 的变化
watch(
  () => {
    console.log(`found price or numAtom changed: ()=>[ priceState, numAtom ]`);
  },
  () => [priceState, numAtom],
);
```

即设置依赖函数也设置立即执行，此时的依赖由 `deps` 和 `watch` 共同收集到并合并而得。

```ts
watch(
  () => {
    const { a } = priceState;
    console.log(`found one of them changed: [ priceState.a, numAtom ]`);
  },
  { deps: () => [numAtom], immediate: true },
);
```

## 组件内观察变化

提供`useWatch`让客户在组件内部观察变化

:::success{title=自动销毁观察监听}
组件销毁时，helux 会自动取消 useWatch 对应的观察监听函数
:::

```tsx
/**
 * title: 点击 changeA 按钮，观察 tip 变化
 * defaultShowCode: true
 */
import { getSnap, share, useWatch } from 'helux';
const [priceState, setPrice] = share({ a: 1 });

function changeA() {
  setPrice((draft) => void (draft.a += 1));
}

function Comp(props: any) {
  const [tip, setTip] = React.useState('');
  // watch 回调随组件销毁会自动取消监听
  useWatch(
    () => {
      setTip(
        `priceState.a changed from ${getSnap(priceState).a} to ${priceState.a}`,
      );
    },
    () => [priceState.a],
  );

  return <h1>watch tip: {tip}</h1>;
}

export default () => (
  <div>
    <Comp />
    <button onClick={changeA}>changeA</button>
  </div>
);
```

:::success{title=无闭包陷阱}
useWatch 无闭包陷阱问题，总能感知闭包外的最新值
:::

```tsx
/**
 * title: 先点changeLocal再点changeA
 * defaultShowCode: true
 */
import { demoUtils } from '@helux/demo-utils';
import { $, share, useObject, useWatch } from 'helux';
const [priceState, setPrice] = share({ a: 1 });
function changeA() {
  setPrice((draft) => void (draft.a += 1));
}

function Comp(props: any) {
  const [obj, setObj] = useObject({ num: 1 });
  const [tip, setTip] = React.useState('');

  useWatch(
    () => {
      // priceState.a changed, here can read the latest num
      setTip(`num in watch cb is ${obj.num}`);
    },
    () => [priceState.a],
  );

  return (
    <div>
      <button onClick={() => setObj({ num: demoUtils.random() })}>
        changeLocal
      </button>
      <div> num: {obj.num}</div>
      <div> watch tip: {tip}</div>
    </div>
  );
}

export default () => (
  <div>
    <Comp />
    <button onClick={changeA}>changeA</button>
    <h3>shared.a {$(priceState.a)}</h3>
  </div>
);
```
