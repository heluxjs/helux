---
nav:
  title: 参考
  order: 3
---

# 词汇

## 全量派生

能够监听共享状态某些数据节点变化执行，并返回一份全新数据的函数，称之为**全量派生**函数

> 全量派生函数首次执行时会收集到当前函数对外部的各个数据依赖并记录下来。

```ts
import { derive, atom } from 'helux';

const [numAtom] = atom(1); // { val: 1 }
const plus100Result = derive(() => numAtom.val + 100); // { val: 101 }
```

## 可变派生

能够监听共享状态自身某些数据节点变化或其他共享状态的某些数据节点变化，并触发修改共享状态自身其他数据节点变化的函数，称之为**可变派生**函数

> 可变派生函数首次执行时会收集到当前函数对外部的各个数据依赖并记录下来。

### 自身依赖

```ts
const [state, setState, ctx] = atom({ a: 1, b: 0 }, {
  // 自身的a 变化时计算 b
  mutate: draft => draft.b = draft.a + 1;
});
```

### 外部依赖

```ts
const [ state1 ] = atom({a:1});
const [state, setState, ctx] = atom({ a: 1 }, {
  // state1.a 变化时计算自身 a
  mutate: draft => draft.a = state1.a + 1;
});
``
```
