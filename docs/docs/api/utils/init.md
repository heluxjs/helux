---
group:
  title: 帮助
  order: 6
order: 0
---

# init

初始化一些运行配置项

类型描述

```ts
interface IInitOptions {
  /**
   * defaut: true，
   * 是否是 createRoot(dom).render(comp) 模式渲染根组件，此配置只针对 react 18 有效
   */
  isRootRender?: boolean;
}
```

## 基础使用

### isRootRender

如果使用 react 18，默认相信用户采用的是 createRoot(dom).render(comp) 方式渲染根组件，
内部的 useSync 会走到真实的 useSyncExternalStore 调用逻辑（ 非 18 提供的是假的 useSyncExternalStore 实现 ），
而如果用户实际上并未在 18 使用 createRoot 方式渲染时，真实的 useSyncExternalStore 内部会抛出一个错误：
`dispatcher.useSyncExternalStore is not a function`。

此时用户可以设置 `isRootRender` 为 false 消除此错误提示。

```ts
init({ isRootRender: false });
```
