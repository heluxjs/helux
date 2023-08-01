---
sidebar_position: 3
---

# hel-micro-react

`hel-micro-react` sdk 是基于 `hel-micro` 封装并适配 `react` 框架的适配层

- 获取 `Hel Pack` 云 hel 模块服务或其它云 hel 模块服务提供的远程 react 组件
- 支持组件声明方式懒加载远程 react 组件
- 支持以钩子函数的形式懒加载远程 react 组件
- 提供组件样式隔离
- 提供`renderApp`接口让用户将整个 react 应用弹射给调用者，调用者只需使用 `MicroApp` 实例化应用即可，以便搭建成为 `one react runtime`的微前端架构，具体例子可参考[hel-react-app](https://www.to-be-added.com/coming-soon)

:::tip react 适配层是可选的

如不需要样式隔离特性和懒加载机制，直接基于 `hel-micro` 拉取远程 react 组件即可

:::

无需样式隔离和组件懒加载时，使用[preFetchLib](/docs/api/hel-micro/prefetch-lib#基础用法)即可，代码形如

```tsx
import { Button } from 'remote-tdesign-react';

function HiRemoteButton() {
  return <Button theme="danger">prefetched remote tdesign button</Button>;
}
```

示例见[demo-use-remote-tdesign-react](https://www.to-be-added.com/coming-soon)站点，站点源码见[git](https://www.to-be-added.com/coming-soon)

文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/tnfe/hel/issues) ....
