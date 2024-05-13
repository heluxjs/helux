---
group:
  title: 帮助
  order: 4
order: 0
---

# watch

`watch`用于观察数据变化，并做对应的处理逻辑，观察的粒度可以任意定制。

:::info
本章节展示基础用法，更多用法查阅[指南/观察](/guide/watch)
:::

## 基础用法

### 观察对象根节点变化

watch 可观察共享状态跟对象的变化，第二位参数可写为`()=>[]`或`{deps:()=>[]}`

<code src="./demos/watch-root-node.tsx"></code>

### 观察对象子节点变化

<code src="./demos/watch-sub-node.tsx"></code>

### 人工执行/取消watch

<code src="./demos/run-watch.tsx"></code>

## 死循环

设置`immediate`为 true 时，watch 回调首次执行会自动收集依赖，此时如果存在读取自己修改自己的行为，会造成死循环。

:::tip
死循环产生后，框架会定位到具体的函数位置并告知原因，用户可打开控制台查看
:::

```ts
import { watch, atom } from 'helux';

const [state, setAtom] = atom({ a: 1 });

watch(
  () => {
    // ❌ 读取 a 修改 a，触发死循环
    setAtom((draft) => {
      draft.a += 1;
    });
  },
  { immediate: true },
);
```
