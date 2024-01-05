---
nav:
  order: 6
---

# 工具

包含以下常用工具函数

- [init](/api/utils/init) 初始化一些运行配置项
- [flush](/api/utils/flush) 主动触发提交`reactive`对象变更数据
- [reactiveDesc](/api/utils/reactive-desc) 为`reactive`对象的最近一次变更添加提交描述
- [addMiddleware](/api/utils/add-middleware) 添加中间件
- [addPlugin](/api/utils/add-plugin) 添加插件
- [cst](/api/utils/cst) 常量对象合集
- [getAtom](/api/utils/get-atom) 获取`atom`对象的真实值引用
- [getSnap](/api/utils/get-snap) 获取`atom`对象的快照
- [getActionLoading](/api/utils/get-action-loading) 获取`action`函数执行状态
- [getDeriveLoading](/api/utils/get-derive-loading) 获取`derive`函数执行状态
- [getMutateLoading](/api/utils/get-mutate-loading) 获取`mutate`函数执行状态
- [isAtom](/api/utils/is-atom) 判断是否是`atom`接口返回的对象
- [isDerivedAtom](/api/utils/is-derived-atom) 判断是否是`derive`接口返回的结果
- [isDiff](/api/utils/is-diff) 比较两个值是否一样
- [shallowCompare](/api/utils/shallow-compare) 浅比较两个对象
