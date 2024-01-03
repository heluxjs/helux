---
group:
  title: 帮助
  order: 4
order: 2
---

# sync

为字典对象生成同步函数，此接口偏向于库开发者，推荐使用[共享上下文/sync](/atom-ctx/sync)替代，省略掉主动绑定目标共享状态的步骤。

:::info
本章节展示基础用法，更多用法查阅[指南/双向绑定](/guide/sync)
:::

## 基础用法

### 绑定字典对象

支持绑定一层或多层路径的目标值做数据同步

```tsx
/**
 * defaultShowCode: true
 */
import { sync, atom } from 'helux';

const [ objAtom,,ctx ] = atom({a:'1', b: { b1: { b2: '1'}}});

export default ()=> {
  const [ obj ] = ctx.useState();
  return (
    <div>
      <input value={obj.a} onChange={sync(objAtom)(to=>to.a)} />
      <input value={obj.b.b1.b2} onChange={sync(objAtom)(to=>to.b.b1.b2)} />
    </div>
  );
}
```

使用`ctx.sync`，写法更简便，无绑定目标共享状态步骤。

```tsx
/**
 * defaultShowCode: true
 */
import { sync, atom } from 'helux';

const [ objAtom,,ctx ] = atom({a:'1', b: { b1: { b2: '1'}}});

export default ()=> {
  const [ obj ] = ctx.useState();
  return (
    <div>
      <input value={obj.a} onChange={ctx.sync(to=>to.a)} />
      <input value={obj.b.b1.b2} onChange={ctx.sync(to=>to.b.b1.b2)} />
    </div>
  );
}
```
