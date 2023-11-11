---
sidebar_position: 7
---

# bindVueRuntime

`bindVueRuntime`是服务于模块使用方的接口，用户共享模块使用方（后面我们统称为宿主）的 vue 相关运行时，当宿主使用的 cdn 的 vue 库，且宿主的 externals 是以下映射关系时

```bash
  'vue': 'Vue',
```

不需要调用此接口来到达 vue 运行时共享的目的，因为此种情况下宿主和子模块的 externals 配置是一致的，已经达成了共享效果，但此种情况调用了此接口也不影响运行。

当出现以下 2 种情况时，需要调用`bindVueRuntime`来到达 vue 相关运行时共享的目的

- 宿主使用的是 node_modules 里的 vue 相关运行时
- 宿主的 vue 相关 externals 配置非上诉标准的约定映射关系

综上所述，总是调用该接口也是没问题的，可以应对任何情况。

## 基础用法

### 共享 react 相关运行时

在入口文件出调用此接口来共享宿主的 vue 相关运行时给子模块，见[在线示例](https://codesandbox.io/s/demo-load-remote-vue-comp-st0295)

```ts
import { bindReactRuntime } from 'hel-micro';
import Vue from 'vue';

bindReactRuntime({ Vue });
```

**文档正在拼命建设中，有疑问可联系 fantasticsoul，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ....**
