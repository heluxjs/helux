---
nav:
  title: API
  order: 1
---

# API

- [基础](/api/base/atom)

- [共享上下文](/api/atom-ctx/)

- [Hooks](/api/hooks/)

>- [useAtom](/api/hooks/use-atom) 使用`atom`对象，返回元组
>- [useAtomX](/api/hooks/use-atom-x) 使用`atom`对象，返回字典
>- [useReactive](/api/hooks/use-reactive) 使用`reactive`对象，返回元组
>- [useReactiveX](/api/hooks/use-reactive-x) 使用`reactive`对象，返回字典
>- [useDerived](/api/hooks/use-derived) 使用全量派生结果
>- [useOnEvent](/api/hooks/use-on-event) 使用事件监听
>- [useWatch](/api/hooks/use-watch) 使用观察
>- [useGlobalId](/api/hooks/use-global-id) 使用`globalId`
>- [useMutate](/api/hooks/use-mutate) 使用可变本地状态
>- [useService](/api/hooks/use-service) 使用服务
>- [useActionLoading](/api/hooks/use-action-loading) 使用`action`函数执行状态
>- [useMutateLoading](/api/hooks/use-mutate-loading) 使用`mutate`函数执行状态
>- [useLocalForceUpdate](/api/hooks/use-local-force-update) 使用更新当前组件实例函数
>- [useGlobalForceUpdate](/api/hooks/use-global-force-update) 使用更新所有读取了共享状态的组件实例的函数

- [工具](/api/utils/)

>- [init](/api/utils/init) 初始化一些运行配置项
>- [flush](/api/utils/flush) 主动触发提交`reactive`对象变更数据
>- [reactiveDesc](/api/utils/reactive-desc) 为`reactive`对象的最近一次变更添加提交描述
>- [addMiddleware](/api/utils/add-middleware) 添加中间件
>- [addPlugin](/api/utils/add-plugin) 添加插件
>- [cst](/api/utils/cst) 常量对象合集
>- [getAtom](/api/utils/get-atom) 获取`atom`对象的真实值引用
>- [getSnap](/api/utils/get-snap) 获取`atom`对象的快照
>- [getActionLoading](/api/utils/get-action-loading) 获取`action`函数执行状态
>- [getDeriveLoading](/api/utils/get-derive-loading) 获取`derive`函数执行状态
>- [getMutateLoading](/api/utils/get-mutate-loading) 获取`mutate`函数执行状态
>- [isAtom](/api/utils/is-atom) 判断是否是`atom`接口返回的对象
>- [isDerivedAtom](/api/utils/is-derived-atom) 判断是否是`derive`接口返回的结果
>- [isDiff](/api/utils/is-diff) 比较两个值是否一样
>- [shallowCompare](/api/utils/shallow-compare) 浅比较两个对象