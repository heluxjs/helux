---
group:
  title: 基础
  order: 0
order: 1 
---

# 加载状态


可使用 `getMutateLoading` 、 `getActionLoading` 、`getDeriveLoading` 获取相对于的 loading 状态

```ts
import { getMutateLoading, getActionLoading, getDeriveLoading } from 'helux';

// loading.xxx 获取某个 mutate 函数的具体 loading 状态
const loading = getMutateLoading(someShared);

// loading.xxx 获取某个 action 函数的具体 loading 状态
const loading = getActionLoading(someShared);

// 获取某个全量派生结果的具体 loading 状态
const status = getDeriveLoading(someDerivedResult);
```
