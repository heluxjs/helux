---
group:
  title: 开始
  order: 0
order: 2
---

# Atom

阅读此章节可快速了解`atom`接口简单用法，更多使用方式请查阅[atom 接口文档](/api/base/atom)。

## 定义共享状态

使用`atom`定义全局共享状态，该状态是一个引用稳定的只读代理对象，始终可以访问到最新结果

```ts
import { atom } from 'helux';
const [numAtom] = atom(1); // { val: 1 }
```

`atom`支持任意数据类型，直接读取时需要手动拆箱，`share`仅支持字典类型，因返回结果是字典对象，无装箱行为，可以直接读取目标任意节点值

```ts
import { share } from 'helux';

const [sharedObj] = share({ info: { born: 2023 } });
console.log(sharedObj); // sharedObj: {info: { born: 2023 }}
```

:::success{title=优先考虑 share}
优先考虑 share 共享字典对象，由于`share`接口没有装箱`{val: T}` 的操作，当共享对象为 `object` 时，可优先使用`share`来共享对象，避免一些无自动拆箱的场景多做一次`.val`取值操作
:::

也可以使用工厂函数定义（❤️ 推荐）

```ts
const [numAtom] = atom(() => 1);
const [objAtom] = atom(() => ({ a: 1, b: { b1: 1 } }));
```

`atom` 返回元组完整结构为`[ state, setter, ctx ]`，也可使用 `atomx` 直接返回共享上下文 `ctx`，两种写法区别仅在于，`atom` 直接将 `ctx.state` 和 `ctx.setState` 放置到元组的第一位和第二次参数处，对齐了`react.useState`接口风格，让 react 用户可 0 成本上手。

```ts
import { atom, atomx } from 'helux';

// 返回元组，元组的第一位和第二次参数即是 state setter
const [numAtom, setAtom, atomCtx] = atom(1);

// 返回字典对象，对象里可解构出 state setter
const atomCtx = atomx(1);
const { numAtom, setAtom } = atomCtx;
```

:::info{title=共享上下文}
共享上下文更多功能查阅[进阶/模块化](/guide/modular)、[API/共享上下文](api/atom-ctx)了解
:::

## 修改共享状态

钩子 `useAtom` 返回一个元组，使用方式大体对齐 `react.useState` 接口，唯一的区别是`setter`提供的回调参数是一个草稿对象，可基于草稿对象直接修改，这个差异点下面会再次提到。

在组件内使用`useAtom`接口来获得组件内使用的共享对象，数据变更后自动通知组件重渲染

```tsx
/**
 * title: 点击数字触发修改
 * defaultShowCode: true
 */
import { atom, useAtom } from 'helux';
const [numAtom] = atom(1);

export default function Demo() {
  const [num, setAtom] = useAtom(numAtom); // 返回结果自动拆箱
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}
```

可调用组件外部`atom`返回的 set 句柄修改，效果和 `useAtom` 返回的句柄完全等效

```tsx
/**
 * title: 点击数字触发修改
 * defaultShowCode: true
 */
import { atom, useAtom } from 'helux';
const [numAtom, setAtom] = atom(1);

export default function Demo() {
  const [num] = useAtom(numAtom);
  // 调用外部的 set 句柄
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}
```

可使用`ctx.useState`来简化`useAtom(xxxState)`写法，`ctx`来自于`atom`返回的元组第三位参数、或`atomx`接口返回结果

```tsx
/**
 * title: 点击click me 按钮触发修改
 * defaultShowCode: true
 */
import { atomx } from 'helux';
const ctx = atomx(1);

function Demo() {
  const [num] = ctx.useState();
  const change = () => ctx.setState(Math.random());
  return (
    <h1>
      <button onClick={change}>click me</button>
      {num}
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <Demo />
  </>
);
```

回调里基于草稿修改，修改结束后，生成一份新的具有结构共享特性的状态，这个是和`react.setState`最大的差别之处，需要注意区别对待。

```ts | pure
const [shared, setShared] = share({
  info: { name: 'helux', age: 1 },
  desc: 'awesome lib',
});

function changName(name) {
  setShared((draft) => {
    draft.info.name = name;
  });
}
```

:::warning
注意 react.setState 提供的回调参数不能直接修改，需要拷贝为一份新的引用后，基于新引用修改才生效
:::

```tsx
/**
 * title: 基于draft修改
 * defaultShowCode: true
 */
import { Entry, MarkUpdate } from '@helux/demo-utils';
import { share, useAtom } from 'helux';

const [sharedState, setState] = share({
  a: 1,
  b: 2,
  info: { born: '2023-12-31', age: 2 },
});

function changeBornOut() {
  setState((draft) => void (draft.info.born = `${Date.now()}`));
}

function HelloBorn() {
  const [state, setState, info] = useAtom(sharedState);
  const change = () =>
    setState((draft) => void (draft.info.born = `${Date.now()}`));
  return (
    <MarkUpdate info={info}>
      <h1>hello helux {state.info.born}</h1>
      <button onClick={change}>changeBornInner</button>
    </MarkUpdate>
  );
}

function HelloAge() {
  const [state, setState, info] = useAtom(sharedState);
  const change = () =>
    setState((draft) => void (draft.info.born = `${Date.now()}`));
  return (
    <MarkUpdate info={info}>
      <h1>hello helux age {state.info.age}</h1>
      <button onClick={change}>changeBornInner</button>
    </MarkUpdate>
  );
}

export default function Demo() {
  return (
    <Entry fns={{ changeBornOut }}>
      <HelloBorn />
      <HelloAge />
    </Entry>
  );
}
```
