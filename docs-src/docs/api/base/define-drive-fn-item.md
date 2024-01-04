---
group:
  title: 全量派生
  order: 2
order: 3
---

# defineDeriveFnItem

`defineDeriveFnItem`用于定义异步派生任务，是一个配合共享上下文`defineFullDerive`接口在独立文件里定义异步派生任务时，帮助提升类型推导体验的函数。

## 基础使用

在[模块化/多文件代码组织方式](/guide/modular#多文件代码组织方式)的`deriveFull`文件里，定义异步全量派生函数

```ts
import { defineDeriveFnItem, IDeriveFnItem } from 'helux';

/**
 * 通过 IDeriveFnItem 主动约束结果返回类型和 deps 返回类型，同时 deps 返回类型自动透传给 params.input
 */
export const fTask2 = defineDeriveFnItem<IDeriveFnItem<number, [number]>>({
  deps: () => [state.f],
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000);
    return params.prevResult + 100;
  },
});
```
