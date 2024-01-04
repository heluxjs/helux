---
order: 2
---

# useReactive

`useReactive`和`useAtom`使用方式完全一样，区别如下：

- `useReactive`没有返回`setState`句柄，返回的`state`是可读可写的对象。

- `useAtom`返回`[state, setState]`结果，`state`是只读对象，修改必须使用`setState`。

:::info
其他使用方式可参考[useAtom](/api/hooks/use-atom)
:::

## 基础用法

`useReactive` 返回结果为 `[reactive, reactiveRoot, renderInfo]`，`reactive` 指向拆箱后的状态引用，`reactiveRoot` 指向拆原始状态引用，具体如何使用见下面示例。

:::tip
`useReactive`可替换为`ctx.useReactive`，书写更简便。
:::

### 原始类型 atom

由于`reactive` 指向拆箱后的状态引用，对于原始类型 atom，拆箱后就指向原始值了，此时可使用第二位参数`reactiveRoot`来操作`.val`修改状态

```tsx
/**
 * defaultShowCode: true
 */
import { atom, useReactive } from 'helux';

const [numAtom, , ctx] = atom(1);

function Demo() {
  const [state, stateRoot] = useReactive(numAtom);
  const change = () => {
    stateRoot.val += 1;
  };
  return <h1 onClick={change}>{state}</h1>;
}

function Demo2() {
  const [state, stateRoot] = ctx.useReactive();
  const change = () => {
    stateRoot.val += 1;
  };
  return <h1 onClick={change}>{state}</h1>;
}

export default () => (
  <>
    <Demo />
    <Demo2 />
    <button onClick={() => ctx.setState((prev) => prev + 1)}>change</button>
  </>
);
```

当然了也可以使用顶层`reactive`来修改

```tsx
/**
 * defaultShowCode: true
 */
import { atomx, useReactive } from 'helux';

const ctx = atomx(1);
const change = () => {
  ctx.reactiveRoot.val += 1;
};

function Demo() {
  const [state] = useReactive(ctx.reactiveRoot);
  return <h1 onClick={change}>{state}</h1>;
}

function Demo2() {
  const [state] = ctx.useReactive();
  return <h1 onClick={change}>{state}</h1>;
}

export default () => (
  <>
    <Demo />
    <Demo2 />
    <button onClick={change}>change</button>
  </>
);
```

进一步使用`signal`来简化写法

```tsx
/**
 * defaultShowCode: true
 */
import { $, atomx } from 'helux';

const { reactiveRoot } = atomx(1);
const change = () => {
  reactiveRoot.val += 1;
};

function Demo() {
  // 此处 signal 会自动拆箱 atom
  return <h1 onClick={change}>{$(reactiveRoot)}</h1>;
}

export default () => (
  <>
    <Demo />
    <Demo />
    <button onClick={change}>change</button>
  </>
);
```
