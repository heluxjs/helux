---
order: 4
---

# useWatch

组件中观察共享状态变化。

类型描述

```ts
function useWatch(
  watchFn: (fnParams: IWatchFnParams) => void,
  options: WatchOptionsType,
);

type WatchOptionsType = WatchFnDeps | IWatchOptions;

interface IWatchOptions {
  deps?: WatchFnDeps;
  /**
   * default: false，
   * 如没有定义 deps 依赖，需设置 immediate，这样可以让 watch 首次执行后收集到相关依赖，
   * 当然也可以定义了 deps 依赖的情况下设置 immediate 为 true，这样整个 watch 函数的依赖是
   * deps 定义的和 watch 首次执行后收集到的两者合并的结果
   */
  immediate?: boolean;
  /**
   * default: false
   * 是否抛出错误，默认不抛出（重执行函数可独立设定抛出），错误会发送给插件
   */
  throwErr?: boolean;
}
type WatchFnDeps = () => any[] | undefined;
```

:::info
`useWatch`回调的首次运行的执行时机是在组件挂载完毕后才执行
:::

## 基础用法

### 观察原始类型 atom

```tsx
/**
 * defaultShowCode: true
 */
import { atomx, useWatch } from 'helux';

const { state, reactiveRoot, getSnap } = atomx(1);
const change = () => {
  reactiveRoot.val += 1;
};

function Demo() {
  useWatch(
    () => {
      alert(`change from ${getSnap().val} to ${state.val}`);
    },
    () => [state],
  );
  return (
    <h1>
      <pre>watch state</pre>
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <button onClick={change}>change</button>
  </>
);
```

### 观察字典类型 atom

观察根对象变化

```tsx
/**
 * defaultShowCode: true
 */
import { atomx, useWatch } from 'helux';

const { reactive, getSnap } = atomx({ a: 1, b: 2 });
const change = () => {
  reactive.a += 10;
};

function Demo() {
  useWatch(
    () => {
      alert(
        `change from ${JSON.stringify(getSnap().val)} to ${JSON.stringify(
          reactive,
        )}`,
      );
    },
    () => [reactive],
  );
  return (
    <h1>
      <pre>watch reactive</pre>
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <button onClick={change}>change</button>
  </>
);
```

观察对象子节点变化

:::info
点击`changeB`，不会触发提示
:::

```tsx
/**
 * defaultShowCode: true
 */
import { atomx, useWatch } from 'helux';

const { reactive, getSnap } = atomx({ a: 1, b: 2 });
const changeA = () => {
  reactive.a += 10;
};
const changeB = () => {
  reactive.b += 10;
};

function Demo() {
  useWatch(
    () => {
      alert(
        `change from ${JSON.stringify(getSnap().val)} to ${JSON.stringify(
          reactive,
        )}`,
      );
    },
    () => [reactive.a],
  );
  return (
    <h1>
      <pre>watch reactive.a</pre>
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <button onClick={changeA}>changeA</button>
    <button onClick={changeB}>changeB</button>
  </>
);
```

### 无闭包陷阱

`useWatch` 内部做了优化，观察回调里总是可获取外部最新值，无闭包陷阱问题

:::info
先点击 `changeNum` 按钮，再点击 `change` 按钮，可观察到弹出提示里的 `num` 值为最新值
:::

```tsx
/**
 * defaultShowCode: true
 */
import { atomx, useWatch } from 'helux';
import React from 'react';

const { state, reactiveRoot, getSnap } = atomx(1);
const change = () => {
  reactiveRoot.val += 1;
};

function Demo() {
  const [num, setNum] = React.useState(1);
  const changeNum = () => setNum((prev) => prev + 1);
  useWatch(
    () => {
      alert(`change from ${getSnap().val} to ${state.val}, num is ${num}`);
    },
    () => [state],
  );
  return (
    <h1>
      <button onClick={changeNum}>changeNum {num}</button>
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <button onClick={change}>change</button>
  </>
);
```
