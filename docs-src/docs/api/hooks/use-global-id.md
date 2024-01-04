---
order: 5
---

# useGlobalId

使用全局id，配合`ICreationAtomOptions.rules`里的`globalIds`参数，满足条件时被触发刷新

:::tip
更新`rules`配置可阅读[rules](/api/base/atom#rules)了解
:::

## 基础用法

```tsx
/**
 * defaultShowCode: true
 */
import React from 'react';
import { atomx, useGlobalId } from 'helux';

const { state, reactive, getSnap } = atomx({a:1, b:1}, {
  rules: [
    {
      when: state=>state.a, globalIds: ['up1'],
    },
  ]
});
const change = () => {
  reactive.a += 1;
};

function Demo() {
  useGlobalId('up1');
  return <h1>found a changed! update at: {Date.now()}</h1>;
}

export default () => (
  <>
    <Demo />
    <button onClick={change}>change</button>
  </>
);
```
