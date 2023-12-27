---
hero:
  title: Helux
  description: A state library that integrates atom, signal, derive, watch and collection dep
  actions:
    - text: 快速入门
      link: /
    - text: Github
      link: /
features:
  - title: 极简核心api
    emoji: 💎
    description: run载入模块配置，register注册类组件，useConcent注册函数组件。
  - title: 渲染性能出众
    emoji: 🌈
    description: 启用Proxy在运行时动态收集每一个组件的最新依赖列表，保证最小粒度更新，同时内置renderKey、lazyDispatch、delayBroadcast等高级特性满足更复杂的更新场景。
  - title: 数据消费粒度灵活
    emoji: 🚀
    description: 支持组件跨多个模块消费数据，同时所有组件都自动连接到内置的$$global模块。
  - title: 0入侵成本接入
    emoji: 💎
    description: 无根Provider包裹，注册后的组件setState即可更新store
  - title: 贴心模块配置
    emoji: 🌈
    description: 模块提供state、reducer、watch、computed和init 5个选项，支持按需定义，覆盖所有业务场景。
  - title: 渐进式
    emoji: 🚀
    description: 除setState之外，还支持dispatch、invoke提交数据变更，同时让ui视图与业务逻辑彻底解耦。



---

helux-docs
