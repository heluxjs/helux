---
nav:
  title: API
  order: 1
---

# API

- [基础](/api/base/atom)

> - [atom](/api/base/atom) 创建`atom`对象，返回元组
> - [atomx](/api/base/atomx) 创建`atom`对象，返回字典
> - [share](/api/base/share) 创建字典型`atom`对象，返回元组
> - [sharex](/api/base/sharex) 创建字典型`atom`对象，返回字典
> - [signal](/api/base/signal) 创建`signal`响应区域，实现dom粒度更新
> - [block](/api/base/block) 创建`block`块响应区域，实现块粒度更新
> - [dynamicBlock](/api/base/dynamic-block) 组件渲染过程中创建动态`block`块响应区域，实现块粒度更新
> - [derive](/api/base/derive) 定义单个全量派生函数
> - [deriveDict](/api/base/derive-dict) 批量定义全量派生函数
> - [defineDeriveTask](/api/base/define-derive-task) 类型辅助函数，定义全量派生函数异步任务，自动推导 deps 返回类型
> - [defineDeriveFnItem](/api/base/define-drive-fn-item) 类型辅助函数，定义全量派生函数异步任务
> - [runDerive](/api/base/run-derive) 人工触发全量派生函数
> - [runDeriveTask](/api/base/run-derive-task) 人工触发全量派生函数异步任务
> - [mutate](/api/base/mutate) 定义单个可变派生函数
> - [mutateDict](/api/base/mutate-dict) 批量定义可变派生函数
> - [runMutate](/api/base/run-mutate) 人工触发可变派生函数
> - [runMutateTask](/api/base/run-mutate-task) 人工触发可变派生函数异步任务
> - [action](/api/base/action) 创建修改状态的 action 同步或异步函数
> - [watch](/api/base/watch) 创建观察数据变化的监听函数
> - [watchEffect](/api/base/watch-effect) 创建观察数据变化的监听函数，立即运行并在首次运行时收集到依赖
> - [syncer](/api/base/syncer) 浅层次对象的同步函数生成器，辅助双向绑定
> - [sync](/api/base/sync) 深层次对象的同步函数生成器，辅助双向绑定
> - [emit](/api/base/emit) 发射事件
> - [on](/api/base/on) 监听事件

- [共享上下文](/api/atom-ctx/)

共享上下文对象里的api基本和顶层api保持一致，区别在于，顶层api需要指定目标共享状态，共享上下文api导出时一自动绑定当前共享状态。

```ts
import { action, atom } from 'helux';

const ctx = atomx(1);

action(ctx.state)()(/** action 函数定义 */)
// 等效于
ctx.aciton()(/** action 函数定义 */)

```

- [Hooks](/api/hooks/)

> - [useAtom](/api/hooks/use-atom) 使用`atom`对象，返回元组
> - [useAtomX](/api/hooks/use-atomx) 使用`atom`对象，返回字典
> - [useReactive](/api/hooks/use-reactive) 使用`reactive`对象，返回元组
> - [useReactiveX](/api/hooks/use-reactive-x) 使用`reactive`对象，返回字典
> - [useDerived](/api/hooks/use-derived) 使用全量派生结果
> - [useOnEvent](/api/hooks/use-on-event) 使用事件监听
> - [useWatch](/api/hooks/use-watch) 使用观察
> - [useWatchEffect](/api/hooks/use-watch-effect) 使用观察，立即运行并在首次运行时收集到依赖
> - [useGlobalId](/api/hooks/use-global-id) 使用`globalId`
> - [useMutate](/api/hooks/use-mutate) 使用可变本地状态
> - [useService](/api/hooks/use-service) 使用服务
> - [useActionLoading](/api/hooks/use-action-loading) 使用`action`函数执行状态
> - [useMutateLoading](/api/hooks/use-mutate-loading) 使用`mutate`函数执行状态
> - [useLocalForceUpdate](/api/hooks/use-local-force-update) 使用更新当前组件实例函数
> - [useGlobalForceUpdate](/api/hooks/use-global-force-update) 使用更新所有读取了共享状态的组件实例的函数

- [工具](/api/utils/)

> - [init](/api/utils/init) 初始化一些运行配置项
> - [flush](/api/utils/flush) 主动触发提交`reactive`对象变更数据
> - [reactiveDesc](/api/utils/reactive-desc) 为`reactive`对象的最近一次变更添加提交描述
> - [addMiddleware](/api/utils/add-middleware) 添加中间件
> - [addPlugin](/api/utils/add-plugin) 添加插件
> - [cst](/api/utils/cst) 常量对象合集
> - [getAtom](/api/utils/get-atom) 获取`atom`对象的真实值引用
> - [getSnap](/api/utils/get-snap) 获取`atom`对象的快照
> - [getActionLoading](/api/utils/get-action-loading) 获取`action`函数执行状态
> - [getDeriveLoading](/api/utils/get-derive-loading) 获取`derive`函数执行状态
> - [getMutateLoading](/api/utils/get-mutate-loading) 获取`mutate`函数执行状态
> - [isAtom](/api/utils/is-atom) 判断是否是`atom`接口返回的对象
> - [isDerivedAtom](/api/utils/is-derived-atom) 判断是否是`derive`接口返回的结果
> - [isDiff](/api/utils/is-diff) 比较两个值是否一样
> - [shallowCompare](/api/utils/shallow-compare) 浅比较两个对象
> - [markRaw](/api/utils/mark-raw) 标记对象不会转变为代理对象
