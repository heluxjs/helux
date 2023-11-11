---
sidebar_position: 4
---

# eventBus

使用`eventBus`可方便的在主应用和子模块之间进行事件通信

:::tip 不同包的 eventBus 也可以相互通信

`hel-lib-proxy`包导出的`eventBus`和`hel-micro`包导出的`eventBus`相互间也是可以进行事件通信的

:::

## 基础用法

### 发射事件

```ts
import { eventBus } from 'hel-lib-proxy';
eventBus.emit('evName', ...args);
```

### 监听事件

```ts
const cb = (...args) => {
  /** your logic */
};
eventBus.on('evName', cb);
```

### 取消监听

```ts
eventBus.off('evName', cb);
```
