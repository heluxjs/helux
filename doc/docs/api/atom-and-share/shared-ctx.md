---
sidebar_position: 2
---

# 共享上下文

调用`atom`或`share`会返回共享上下文对象， 对象里的各个方法自动绑定了当前共享对象，让用户可以免去使用顶层 api 绑定的步骤

## 获取方式

`atom`或`share`返回的元组里第三位参数即共享上下文

```ts
// numCtx 即共享上下文对象
const [numAtom, setNum, numAtomCtx] = atom(1);

// sharedCtx 即共享上下文对象
const [sharedState, setShared, sharedCtx] = share({ a: 1 });
```

也可以使用`shareAtom` 和 `shareState` 接口直接返回共享上下文

```ts
const numCtx = shareAtom(1);
const sharedCtx = shareState({ a: 1 });
```

## 可映射为顶层 api 的方法

### mutate

`ctx.mutate` 映射顶层 api `mutate`

```ts
import { mutate } from 'helux';

// 两者等效
numAtomCtx.mutate(fn);
mutate(numAtom)(fn);
```

### sync & syncer

`ctx.sync` 映射顶层 api `sync`，`ctx.syncer` 映射顶层 api `syncer`

```ts
import { sync, syncer } from 'helux';

// 两者等效
const infoSyncer = numAtomCtx.sync((to) => to.val.info.name);
const infoSyncer = sync(numAtomCtx)((to) => to.val.info.name);

// 两者等效
const nameSyncer = numAtomCtx.syncer.name;
const nameSyncer = syncer(numAtom).name;
```

```ts
// 两者等效
const infoSyncer = sharedCtx.sync((to) => to.info.name);
const infoSyncer = sync(numAtomCtx)((to) => to.info.name);

// 两者等效
const nameSyncer = numAtomCtx.syncer.name;
const nameSyncer = syncer(numAtom).name;
```

### runMutate & runMutateTask

`ctx.runMutate` 映射顶层 api `runMutate`，`ctx.runMutateTask` 映射顶层 api `runMutateTask`

```ts
import { runMutate, runMutateTask } from 'helux';

// 两者等效
numAtomCtx.runMutate('fnName');
runMutate(numAtom);

// 两者等效
numAtomCtx.runMutateTask('fnName');
runMutateTask(numAtom);
```

### aciton & acitonAsync

`share` 返回的共享上下文里`aciton` 和 `acitonAsync` 方法对应顶层 api `aciton` 和 `acitonAsync`

```ts
import { aciton, acitonAsync } from 'helux';

// 两者等效
const myAction = sharedCtx.action(actionFnDef);
const myAction = aciton(sharedState)(actionFnDef);

// 两者等效（异步action）
const myActionAsync = sharedCtx.acitonAsync(actionFnDef);
const myActionAsync = acitonAsync(sharedState)(actionFnDef);
```

`atom` 返回的共享上下文里`aciton` 和 `acitonAsync` 方法对应顶层 api `atomAciton` 和 `atomAcitonAsync`

```ts
import { atomAciton, atomAcitonAsync } from 'helux';

// 两者等效
const myAction = numAtomCtx.action(actionFnDef);
const myAction = atomAciton(numAtom)(actionFnDef);

// 两者等效（异步action）
const myActionAsync = numAtomCtx.acitonAsync(actionFnDef);
const myActionAsync = atomAcitonAsync(numAtom)(actionFnDef);
```

:::tip action 和 atomAction

因`atom`有装箱和拆箱过程，故`action`相关接口设计为了类型提示区分为`action`和`atomAction`

:::

### useState

`share` 返回的共享上下文里 `useState` 方法对应顶层 api `useShared`

```ts
import { useShared } from 'helux';

// 组件里使用，两者等效
const [state, setState] = useShared(sharedState);
const [state, setState] = sharedCtx.useState();
```

### getMutateLoading

`share` 返回的共享上下文里 `getMutateLoading` 方法对应顶层 api `getMutateLoading`

```ts
import { getMutateLoading } from 'helux';

// 两者等效
const loadingObj = getMutateLoading(sharedState);
const loadingObj = sharedCtx.getMutateLoading();
```

### useMutateLoading

`share` 返回的共享上下文里 `useMutateLoading` 方法对应顶层 api `useMutateLoading`

```ts
import { getMutateLoading } from 'helux';

// 组件里使用，两者等效
const loadingObj = useMutateLoading(sharedState);
const loadingObj = sharedCtx.useMutateLoading();
```

### getActionLoading

`share` 返回的共享上下文里 `getActionLoading` 方法对应顶层 api `getActionLoading`

```ts
import { getActionLoading } from 'helux';

// 两者等效
const loadingObj = getActionLoading(sharedState);
const loadingObj = sharedCtx.getActionLoading();
```

### useActionLoading

`share` 返回的共享上下文里 `useActionLoading` 方法对应顶层 api `useActionLoading`

```ts
import { useActionLoading } from 'helux';

// 组件里使用，两者等效
const loadingObj = useActionLoading(sharedState);
const loadingObj = sharedCtx.useActionLoading();
```
