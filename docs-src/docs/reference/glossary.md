---
nav:
  title: 参考
  order: 3
---

# 词汇

## 可变派生

共享状态对自身状态或其他共享状态的某些数据节点有依赖的函数，它们将在这些依赖项变化时被自动执行，可变派生函数首次执行时会收集到当前函数对外部的各个数据依赖并记录下来。

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