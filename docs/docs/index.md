---
hero:
  title: Helux
  description: 集原子，信号、依赖追踪为一体，支持细粒度响应式更新的状态引擎（兼容所有类react库，包括react18）
  actions:
    - text: 快速开始
      link: /guide/quick-start
    - text: Playground
      link: /playground
    - text: Github
      link: https://github.com/heluxjs/helux
features:
  - title: atom
    description: atom 支持任意数据结构，对非原始类型数据内置依赖收集功能， 意味着 atom 不用拆分的很细，天然对 DDD 领域驱动设计友好
  - title: signal
    description: 内置 signal 响应机制，可实现 0 hook 编码 + dom 粒度的更新
  - title: 依赖追踪
    description: 基于最快的不可变 js 库 limu 做到运行时对视图渲染实时收集数据依赖，提供超强渲染性能
  - title: reactive
    description: 提供全局响应式对象，数据变更直接驱动关联ui渲染（默认在下一个事件循环微任务开始前提交，支持人工提交变更数据）
  - title: modular
    description: 支持对状态模块化抽象，并内置 actions、derive、watch、loading 等特性，轻松驾驭大型前端应用架构
  - title: middleware&plugin
    description: 内置中间件和插件系统，无缝衔接redux生态优秀组件
---
