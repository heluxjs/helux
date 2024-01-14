---
group:
  title: 进阶
  order: 0
order: 5
---

# 插件

插件是一个普通对象，包含有`install`属性，其值对应一个函数，`helux`调用该函数后，会将一个插件上下文对象透传给用户，用户可使用该上下文监听来自`helux`内部的各种行为事件并做对应的处理，例如[helux-plugin-devtool](https://github.com/heluxjs/helux/tree/master/packages/helux-plugin-devtool)插件接收状态已改变事件，并将其对应的快照写入到 redux 开发工具的状态中，方便用户可视化查看整个应用的状态树。

![](https://tnfe.gtimg.com/image/akpc29z24n_1699705611085.png)

### 开发插件

基于`cst`变量导出事件名

```ts
import { IPlugin, cst } from 'helux';

const MyPlugin: IPlugin = {
  install(pluginCtx) {
    pluginCtx.on(cst.EVENT_NAME.ON_DATA_CHANGED, (dataInfo) => {
      // do some staff here
    });
    pluginCtx.on(cst.EVENT_NAME.ON_SHARE_CREATED, (dataInfo) => {
      // do some staff here
    });
  },
  name: pluginName,
};
```

基于ts的类型提示感知事件名

```ts
const MyPlugin: IPlugin = {
  install(pluginCtx) {
    // 这里输入 '' 后将自动提示事件名
    pluginCtx.on('', ()=>{ });
  },
  name: 'MyPlugin',
};
```

![ev](https://tnfe.gtimg.com/image/cl5rps0ipu_1705203390745.png)

### 安装插件

```ts
import { addPlugin } from 'helux';

addPlugin(MyPlugin);
```

### 事件名说明

- ON_SHARE_CREATED，共享状态创建时的事件

- ON_DATA_CHANGED，共享状态变化时的事件

:::info
若需要其他事件可以提[issue](https://github.com/heluxjs/helux/issues)让`helux-core`内部去实现
:::
