---
order: 4
---

# useOnEvent

组件中监听事件，会在组件销毁时自动取消监听

## 基础用法

### 监听事件

```tsx
/**
 * defaultShowCode: true
 */
import { emit, useOnEvent } from 'helux';

const emitEvent = () => emit('someEv', 1, 2);

function Demo() {
  useOnEvent('someEv', (...args) => {
    alert(`receive ${args.join(',')}`);
  });
  return <h1>useOnEvent</h1>;
}

export default () => (
  <>
    <Demo />
    <button onClick={emitEvent}>emitEvent</button>
  </>
);
```

### 无闭包陷阱

`useOnEvent` 内部做了优化，事件回调里总是可获取外部最新值，无闭包陷阱问题

:::info
先点击 `change` 按钮，再点击 `emitEvent` 按钮，可观察到弹出提示里的 `num` 值为最新值
:::

```tsx
/**
 * defaultShowCode: true
 */
import React from 'react';
import { emit, useOnEvent } from 'helux';

const emitEvent = () => emit('someEv2', 1, 2);

function Demo() {
  const [num, setNum] = React.useState(1);
  const change = () => setNum(prev => prev + 1);
  useOnEvent('someEv2', (...args) => {
      alert(`receive ${args.join(',')}, num is ${num}`);
  });
  return <h1><button onClick={change}>change {num}</button></h1>;
}

export default () => (
  <>
    <Demo />
    <button onClick={emitEvent}>emitEvent</button>
  </>
);
```

