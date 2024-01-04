---
group:
  title: 帮助
  order: 4
order: 1
---

# syncer

为原始值，或一层路径的字典对象生成同步函数，此接口偏向于库开发者，推荐使用[共享上下文/syncer](/atom-ctx/syncer)替代，省略掉主动绑定目标共享状态的步骤。

:::info
本章节展示基础用法，更多用法查阅[指南/双向绑定](/guide/sync)
:::

## 基础用法

### 绑定原始值

```tsx
/**
 * defaultShowCode: true
 */
import { atom, syncer } from 'helux';

const [numAtom, , ctx] = atom(1);

export default () => {
  const [num] = ctx.useState();
  return <input value={num} onChange={syncer(numAtom)} />;
};
```

使用`ctx.syncer`，写法更简便，无绑定目标共享状态步骤。

```tsx
/**
 * defaultShowCode: true
 */
import { atom } from 'helux';

const [numAtom, , ctx] = atom(1);

export default () => {
  const [num] = ctx.useState();
  return <input value={num} onChange={ctx.syncer} />;
};
```

### 绑定一层结构的字典对象

```tsx
/**
 * defaultShowCode: true
 */
import { atom, syncer } from 'helux';

const [objAtom, , ctx] = atom({ a: '1', b: '2' });

export default () => {
  const [obj] = ctx.useState();
  return (
    <div>
      <input value={obj.a} onChange={syncer(objAtom).a} />
      <input value={obj.b} onChange={syncer(objAtom).b} />
    </div>
  );
};
```

使用`ctx.syncer`，写法更简便，无绑定目标共享状态步骤。

```tsx
/**
 * defaultShowCode: true
 */
import { atom } from 'helux';

const [objAtom, , ctx] = atom({ a: '1', b: '2' });

export default () => {
  const [obj] = ctx.useState();
  return (
    <div>
      <input value={obj.a} onChange={ctx.syncer.a} />
      <input value={obj.b} onChange={ctx.syncer.b} />
    </div>
  );
};
```

`syncer`生成同步函数时，针对同一个路径总是返回不变的引用

```tsx
/**
 * defaultShowCode: true
 */
import { atom, syncer } from 'helux';

const [objAtom, , ctx] = atom({ a: '1', b: '2' });

export default () => {
  const [obj] = ctx.useState();
  const s1 = syncer(objAtom).a;
  const s2 = syncer(objAtom).a;
  return (
    <div>
      <h1>s1 === s2 {`${s1 === s2}`}</h1>
    </div>
  );
};
```
