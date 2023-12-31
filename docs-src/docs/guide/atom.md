---
group:
  title: 开始
  order: 0
order: 2
---

# atom

阅读此章节可快速了解`atom`接口简单用法，更多使用方式请查阅[atom 接口文档](xx)。

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

## 修改共享状态

钩子 `useAtom` 返回一个元组，使用方式完全对齐 `react.useState` 接口，react 用户可 0 成本上手此方式，在组件内使用`useAtom`接口来获得组件内使用的共享对象，数据变更后自动通知组件重渲染

```tsx | pure
import { useAtom } from 'helux';
const [numAtom] = atomx(1);

function Demo() {
  const [num, setAtom] = useAtom(numAtom); // 返回结果自动拆箱
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}
```

```tsx
import { atom, useAtom } from 'helux';
const [numAtom] = atom(1);

export default function Demo() {
  const [num, setAtom] = useAtom(numAtom);
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}
```

可调用组件外部`atom`返回的 set 句柄修改，效果和 `useAtom` 返回的句柄完全等效

```tsx | pure
import { atom, useAtom } from 'helux';
const [numAtom, setAtom] = atom(1);

function Demo() {
  const [num] = useAtom(numAtom);
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}
```

```tsx
import { atom, useAtom } from 'helux';
const [numAtom, setAtom] = atom(1);

export default function Demo() {
  const [num] = useAtom(numAtom);
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}
```

可使用`ctx.useState`来简化`useAtom(xxxState)`写法，`ctx`来自于`atom`返回的元组第三位参数、或`atomx`接口返回结果

```tsx | pure
import { atom } from 'helux';
const [numAtom, setAtom, ctx] = atom(1);
// or
const ctx = atomx(1);

function Demo() {
  const [num, setAtom] = ctx.useState();
}
```

```tsx
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

回调里基于草稿修改，修改结束后，生成一份新的具有结构共享特性的状态

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
