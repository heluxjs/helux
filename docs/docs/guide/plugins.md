---
group:
  title: 基础
  order: 0
order: 1
---

# 插件

插件是一个普通对象，包含有`install`属性，其值对应一个函数，`helux`调用该函数后，会将一个插件上下文对象透传给用户，用户可使用该上下文监听来自`helux`内部的各种行为事件并做对应的处理，例如[helux-plugin-redux-devtoo](https://github.com/heluxjs/helux/tree/master/packages/helux-plugin-redux-devtool)插件接收状态已改变事件，并将其对应的快照写入到 redux 开发工具的状态中，方便用户可视化查看整个应用的状态树。

![](https://tnfe.gtimg.com/image/akpc29z24n_1699705611085.png)

### 开发插件

```ts
import { IPlugin } from 'helux';

const MyPlugin: IPlugin = {
  install(ctx) {
    ctx.on(EVENT_NAME.ON_DATA_CHANGED, (dataInfo) => {
      // do some staff here
    });
    ctx.on(EVENT_NAME.ON_SHARE_CREATED, (dataInfo) => {
      // do some staff here
    });
  },
  name: pluginName,
};
```

### 安装插件

```ts
import { addPlugin } from 'helux';

addPlugin(MyPlugin);
```
