---
sidebar_position: 2
---

# preFetchApp

拉取通过`hel-micro`的`emitApp`接口弹射出去的应用，

:::tip 面向适配层开发者

通常情况下`emitApp`由适配层库调用，例如 `hel-micro-react` 的`renderApp`接口，应用提供者会调用适配层开发者提供的`renderApp`接口渲染整个应用，当应用非本地运行时，`renderApp`不触发渲染逻辑而是调用 `emitApp` 弹射整个根应用出去，这样使用方可通过 ui 对接层 的 `<MicroApp name="xxApp" />` 来实例化整个远程应用，以便达到搭建`one runtime`微前端架构的目的，例如 [hel-react-app](https://www.to-be-added.com/coming-soon)

:::

## 基本用法

通过指定模块名称拉取模块，默认总是拉取最新版本，如当前用户在灰度名单里，则返回灰度版本

```ts
const app = await preFetchApp('sub-app1');
// 可实例化的应用根组件
<app.Comp />;
```

通过指定模块名称、版本号拉取模块

```ts
const app = await preFetchApp('sub-app1', { versionId: 'v1' });
// 可实例化的应用根组件
<app.Comp />;
```

**文档正在拼命建设中，有疑问可联系 fantasticsoul，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ....**
