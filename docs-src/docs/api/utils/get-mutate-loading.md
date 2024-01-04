---
group:
  title: 获取
  order: 6
order: 4
---

# getMutateLoading

获取`mutate`函数执行状态，获取异步函数执行状态才有是会变化的。

## 基础使用

```ts
const witness = mutate(state)({
  deps: () => [state.a, state.b],
  fn: (draft, { input }) => (draft.c = input[0] + input[1] + 1),
  task: async ({ input }) => {
    draft.c = input[0] + input[1] + 1;
  },
  immediate: true,
  desc: 'm1',
});

const ld = getMutateLoading(state);
console.log(ld.m1); // { loading, ok, err };
```
