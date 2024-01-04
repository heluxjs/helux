---
group:
  title: 获取
  order: 6
order: 3
---

# getDeriveLoading

获取`derive`函数执行状态，获取异步函数执行状态才有是会变化的。

## 基础使用

```ts
import { derive, atom, getDeriveLoading } from 'helux';

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

getDeriveLoading(plus100Result); // { loading, ok, err };

```