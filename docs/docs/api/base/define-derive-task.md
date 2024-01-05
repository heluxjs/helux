---
group:
  title: 全量派生
  order: 2
order: 2
---

# defineDeriveTask

`defineDeriveTask`用于定义异步派生任务，是一个配合共享上下文`defineFullDerive`接口在独立文件里定义异步派生任务时，帮助提升类型推导体验的函数。

## 基础使用

在[模块化/多文件代码组织方式](/guide/modular#多文件代码组织方式)的`deriveFull`文件里，定义异步全量派生函数

```ts
import { defineDeriveTask } from 'helux';

/**
 * 通过 defineDeriveTask 约束结果返回类型，自动将 deps 返回类型并透传给 params.input
 */
export const f2 = defineDeriveTask(() => [state.f] as const)<number>({
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000);
    return params.prevResult + 100;
  },
});
```
