---
order: 1
---

# useAtomX

`useAtomX`和`useAtom`使用方式完全一样，区别于`useAtom`返回元组结构，`useAtomX`返回的是字典结构

:::info
其他使用方式可参考[useAtom](/api/hooks/use-atom)
:::

## 基础用法

`useAtomX`可替换为`ctx.useStateX`，书写更简便。

```tsx
/**
 * defaultShowCode: true
 */
import { atom, useAtomX } from 'helux';

const [numAtom, , ctx] = atom(1);

function Demo() {
  const { state: num } = useAtomX(numAtom);
  return <h1>{num}</h1>;
}

function Demo2() {
  const { state: num } = ctx.useStateX();
  return <h1>{num}</h1>;
}

export default () => (
  <>
    <Demo />
    <Demo2 />
    <button onClick={() => ctx.setState((prev) => prev + 1)}>change</button>
  </>
);
```
