---
group:
  title: 获取
  order: 6
order: 2
---

# getActionLoading

获取`action`函数执行状态，获取异步函数执行状态才有是会变化的。

## 基础用法

```ts
import { share, action, getActionLoading } from 'helux';

const { state } = sharex({a:1, b:2});

const hiAction = action(state)()(({ draft, payload }) => {
  draft.a += 100;
}, 'hiAction');

const ld = getActionLoading(state);
console.log(ld.hiAction); // { loading, ok, err };
```
