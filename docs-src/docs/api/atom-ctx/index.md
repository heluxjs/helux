---
nav:
  order: 6
---

# 共享上下文

共享上下文对象指的是 `atom`、`share` 返回元组里的第三位值，上下文对象本身也包含了元组前两位参数`state`、`setStae`

```ts
const [numAtom, setAtom, atomCtx] = atom(1);
// atomCtx.state === numAtom , atomCtx.setState === setAtom

const [shared, setShared, sharedCtx] = share({ name: 'helux' });
// sharedCtx.state === shared , atomCtx.setState === setShared
```

也指`atomx`、`sharex` 返回的对象，`atomx` 是 `atom` 变种表达形式，`sharex` 是 `share` 变种表达形式，
它们不再返回元组，而是直接返回共享上下文

```ts
const atomCtx = atomx(1);
const sharedCtx = sharex({ name: 'helux' });
```

共享上下文里包含的`api`分为两类

## 类顶层 api

这些 api 和顶层 api 名称一致，用法接近，只是少去了绑定目标共享状态的过程（内部完成了绑定）

```ts
// 这些函数在顶层 api 均有实现，用法也和顶层 api 一样，只是少去了绑定目标共享状态的过程（内部完成了绑定）
mutate              <-- 创建可变派生函数
runMutate           <-- 运行指定的可变派生函数
runMutateTask       <-- 运行指定的可变派生函数异步任务
action              <-- 创建修改状态的动作函数
call                <-- 定义修改状态的动作函数并立即调用
useState            <-- 是用当前状态的钩子函数，供react组件调用
getMutateLoading    <-- 组件外获取 mutate 可变派生函数的运行状态
useMutateLoading    <-- 组件内使用 mutate 可变派生函数运行状态的钩子
getActionLoading    <-- 组件外获取 action 动作函数的运行状态
useActionLoading    <-- 组件内使用 action 动作函数运行状态的钩子
sync                <-- 当前状态的多层级路径值的自动同步函数，通常用于表单双向绑定
syncer              <-- 当前状态的单层级路径值的自动同步函数，通常用于表单双向绑定

// 基于 action derive mutate 进一步封装的工具函数，用于辅助将状态拆分为多文件管理起来，做更好的模块化抽象
defineActions       <-- 创建多个动作函数
defineFullDerive    <-- 创建多个全量派生函数
defineMutateSelf    <-- 创建多个监听自己变化，修改自己其他数据节点的可变派生函数
defineMutateDerive  <-- 创建多个监听自己变化，修改新状态其他数据节点的可变派生函数
```

### setState

xxx
