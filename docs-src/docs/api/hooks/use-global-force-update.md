---
order: 10
---

# useGlobalForceUpdate

强制更新订阅了某个节点变化的所有组件实例

:::warning
谨慎使用此功能，会触发大面积的更新，推荐设定 presetDeps、overWriteDeps 函数减少更新范围
:::

```ts
const updateAllAtomIns = useGlobalForceUpdate(someShared);
// 和从 ctx 上获取的 useForceUpdate 效果一样，useForceUpdate 自动绑定了对应的共享状态
const updateAllAtomIns = ctx.useForceUpdate();
```

类型描述为

```ts
function useGlobalForceUpdate<T = any>(
  sharedState: T,
  presetDeps?: (sharedState: T) => any[],
): (overWriteDeps?: ((sharedState: T) => any[]) | Dict | null) => void;
```

## 基础用法

### 更新所有实例

```tsx
/**
 * defaultShowCode: true
 */
import { share, useAtom, useGlobalForceUpdate } from 'helux';
const [dictAtom, , ctx] = share({ a: 1, b: { b1: 1 } });

function Demo() {
  // 或写为
  // or const updateAllAtomIns = ctx.useForceUpdate();
  const updateAllAtomIns = useGlobalForceUpdate(dictAtom);
  const [dict] = useAtom(dictAtom);
  return (
    <div>
      <h1>{dict.a}</h1>
      <h3>update at {Date.now()}</h3>
      <button onClick={updateAllAtomIns}>updateAllAtomIns</button>
    </div>
  );
}

export default ()=> <><Demo /><Demo /></>;
```

### 指定更新范围

:::info
由于指定了更新范围`state.a`，下述例子中Demo2因未使用到`state.a`将不被更新
:::

```tsx
/**
 * defaultShowCode: true
 */
import { share, useAtom, useGlobalForceUpdate } from 'helux';
const [dictAtom, , ctx] = share({ a: 1, b: { b1: 2 } });

function Demo1() {
  // 或写为
  // or const updateSomeIns = ctx.useForceUpdate(state=>[state.a]);
  const updateSomeIns = useGlobalForceUpdate(dictAtom, state=>[state.a]);
  const [dict] = useAtom(dictAtom);
  return (
    <div>
      <h1>dict.a: {dict.a}</h1>
      <h3>update at {Date.now()}</h3>
      <button onClick={updateSomeIns}>updateSomeIns</button>
    </div>
  );
}

function Demo2() {
  const updateSomeIns = useGlobalForceUpdate(dictAtom, state=>[state.a]);
  const [dict] = useAtom(dictAtom);
  return (
    <div>
      <h1>dict.b.b1: {dict.b.b1}</h1>
      <h3>update at {Date.now()}</h3>
      <button onClick={updateSomeIns}>updateSomeIns</button>
    </div>
  );
}

export default ()=> <><Demo1 /><Demo2 /></>;
```

### 重写更新范围

支持调用时重写更新范围

```ts
updateSomeAtomIns(state=>[state.c]); // 本次更新只更新 c 相关的实例

// 重写为 null，表示更新所有实例，强制覆盖可能存在的 presetDeps
updateSomeAtomIns(null)

// 返回空数组不会做任何更新
updateSomeAtomIns(state=>[]);

// 返回里包含了自身也会触发更新所有实例
updateSomeAtomIns(state=>[state]);
```