---
group:
  title: 帮助
  order: 6
order: 4
---

# reactiveDesc

为`reactive`对象的最近一次变更添加提交描述，方便`helux-devtool`可追溯变更记录

---

:::info
建议使用`actions`修改状态，可参考[模块化/defineActions](/guide/modular#defineactions)
:::

## 基础使用

```ts
import { reactiveDesc, atomx } from 'helux';

const ctx = atomx({ a: 1, b: 2 });
const { reactive } = ctx;

async function changeA() {
  reactive.a += 100;
  reactiveDesc('changeA');
}
```
