---
group:
  title: 帮助
  order: 4
order: 0
---

# watchEffect

`watchEffect`用于观察数据变化，并做对应的处理逻辑，观察的粒度可以任意定制。

区别于`watch`，`watchEffect`回调会立即执行，自动对首次运行时函数内读取到的值完成变化监听。

:::info
本章节展示基础用法，更多用法查阅[指南/观察](/guide/watch)或[基础api/观察](/api/base/watch)
:::

## 基础用法

```ts
import { watchEffect, getSnap } from ' helux ';
const [priceState, setPrice] = share({ a: 1 });

// 观察 priceState.a 的变化
watchEffect(() => {
  console.log(`found price.a changed from ${getSnap(priceState).a} to ${priceState.a}`);
});
```
