---
sidebar_position: 6
---

# 响应 loading 变化

参数为`enableLoading`，默认值`true`，当你确定此状态永远不会存在异步修改的情况，可以设置为`false`关闭 loading 响应

```ts
const [state, setState, ctx] = share({ ... }, {
  enableLoading: false,
});
```

:::caution

大多数情况下不需要调整此值，除非你真的确定某共享状态不存在异步修改的情况，或不需要使用方感知到异步 loading 变化，为了提高一点运行性能则可以设置为 false

:::

关闭后，`useMutateLoading`、`useActionLoading`、`useDerived` 返回的 loadStatus 均不会变化

```ts
// 异步 mutate 的 loadStatus 不再变化
function Demo() {
  const loading = useMutateLoading(state);
  const loadStatus = loading['someAsyncMutate'];
}

// 异步 action 的 loadStatus 不再变化
function Demo() {
  const loading = useActionLoading(state);
  const loadStatus = loading['someAsyncAction'];
}

// 异步全量计算结果 的 loadStatus 不再变化
function Demo() {
  const [result, loadStatus] = useDerived(someAsyncResult);
}
```
