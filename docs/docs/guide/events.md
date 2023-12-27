---
group:
  title: 基础
  order: 1
order: 1 
---

# 事件


内部提供事件总线让用户可以全局使用

### 发射事件

```ts
import { emit } from 'helux';

emit('xxx_event', 1, 2, 3);
```

### 组件外监听事件

```ts
import { on } from 'helux';

const off = on('xxx_event', (...args) => {
  console.log('received args ', args);
});
off(); // 取消监听
```

### 组件内监听事件

组件内使用 `useOnEvent` 钩子函数监听，再组件销毁后会自动取消监听

```tsx
import { useOnEvent } from 'helux';

function Demo() {
  useOnEvent('xxx_event', (...args) => {
    console.log('received args ', args);
  });
}
```
