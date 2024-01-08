---
group:
  title: 全量派生
  order: 2
order: 0
---

# derive

使用`derive`定义[全量派生](/reference/glossary#全量派生)函数，仅当函数内的依赖发生变化时才会触发重计算。

## 基础使用

### 同步派生

派生生成原始值

```ts
import { derive, atom } from 'helux';

const [numAtom] = atom(1); // { val: 1 }
const plus100Result = derive(() => numAtom.val + 100); // { val: 101 }
```

派生生成字典对象

:::info{title='deriveDict 免拆箱'}
因`derive`始终会装箱结果为`{val: T}` 结构，如生成字典对象结果推荐使用[deriveDict](/api/base/derive-dict)接口，免去直接使用结果时需要拆箱的过程
:::

```ts
import { derive, atom } from 'helux';

// { val: 1 }
const [numAtom] = atom(1);
// { val: { plus100: 201, plus200: 201 } }
const plusResult = derive(() => ({
  plus100: numAtom.val + 100,
  plus200: numAtom.val + 200,
}));
```

基于派生结果生成新的派生结果，形成派生链

```ts
import { derive, atom } from 'helux';

const [numAtom] = atom(1); // { val: 1 }
const plus100Result = derive(() => numAtom.val + 100); // { val: 101 }
const plus200Result = derive(() => plus100Result.val + 100); // { val: 201 }
```

### 异步派生

派生生成原始值

```ts
import { derive, atom } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom] = atom(1);
const plus100Result = derive({
  fn: () => 0,
  // 在 deps 返回结果里锁定依赖
  deps: () => [numAtom.val],
  // input 数组即 deps 函数返回结果
  task: async ({ input }) => {
    await delay();
    return input[0] + 100;
  },
});
```

```tsx
import { atom, derive, useDerived } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom, setAtom] = atom(1);
const change = () => setAtom((prev) => prev + 1);
const plus100Result = derive({
  fn: () => 0,
  deps: () => [numAtom.val],
  task: async ({ input }) => {
    await delay();
    return input[0] + 100;
  },
});

export default function Demo() {
  const [result, status] = useDerived(plus100Result);
  return (
    <div>
      {status.ok && <h1>{result}</h1>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1>{status.err.message}</h1>}
      <button onClick={change}>change</button>
    </div>
  );
}
```

异步派生默认首次只执行同步函数`fn`，后续监听到变化不再执行`fn`仅执行`task`，如需首次执行也需要执行`task`，配置`immediate`为`true`即可

```ts
const plus100Result = derive({
  fn: () => 0,
  deps: () => [numAtom.val],
  task: async ({ input }) => {
    /** 代码略 */ return 1;
  },
  immediate: true,
});
```
