---
nav:
  order: 6
---

# 基础

包含以下基础函数

- [atom](/api/base/atom) 创建`atom`对象，返回元组
- [atomx](/api/base/atomx) 创建`atom`对象，返回字典
- [share](/api/base/share) 创建字典型`atom`对象，返回元组
- [sharex](/api/base/sharex) 创建字典型`atom`对象，返回字典
- [signal](/api/base/signal) 创建`signal`响应区域，实现dom粒度更新
- [block](/api/base/block) 创建`block`块响应区域，实现块粒度更新
- [dynamicBlock](/api/base/dynamic-block) 组件渲染过程中创建动态`block`块响应区域，实现块粒度更新
- [derive](/api/base/derive) 定义单个全量派生函数
- [deriveDict](/api/base/derive-dict) 批量定义全量派生函数
- [defineDeriveTask](/api/base/define-derive-task) 类型辅助函数，定义全量派生函数异步任务，自动推导 deps 返回类型
- [defineDeriveFnItem](/api/base/define-drive-fn-item) 类型辅助函数，定义全量派生函数异步任务
- [runDerive](/api/base/run-derive) 人工触发全量派生函数
- [runDeriveTask](/api/base/run-derive-task) 人工触发全量派生函数异步任务
- [mutate](/api/base/mutate) 定义单个可变派生函数
- [mutateDict](/api/base/mutate-dict) 批量定义可变派生函数
- [runMutate](/api/base/run-mutate) 人工触发可变派生函数
- [runMutateTask](/api/base/run-mutate-task) 人工触发可变派生函数异步任务
- [action](/api/base/action) 创建修改状态的 action 同步或异步函数
- [watch](/api/base/watch) 创建观察数据变化的监听函数
- [watchEffect](/api/base/watch-effect) 创建观察数据变化的监听函数，立即运行并在首次运行时收集到依赖
- [syncer](/api/base/syncer) 浅层次对象的同步函数生成器，辅助双向绑定
- [sync](/api/base/sync) 深层次对象的同步函数生成器，辅助双向绑定
- [emit](/api/base/emit) 发射事件
- [on](/api/base/on) 监听事件
