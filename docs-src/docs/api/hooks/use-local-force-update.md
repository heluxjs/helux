---
order: 9
---

# useLocalForceUpdate

强制更新当前组件实例

## 基础用法

```tsx
/**
 * defaultShowCode: true
 */
import { useLocalForceUpdate } from 'helux';

export default function () {
  const forceUpdate = useLocalForceUpdate();

  return (
    <div>
      <h3>update at {Date.now()}</h3>
      <button onClick={forceUpdate}>click</button>
    </div>
  );
}
```
