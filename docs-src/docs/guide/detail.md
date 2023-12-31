---
group:
  title: 开始
  order: 0
order: 12
---

# 快速开始 2

## 创建共享对象

使用`atom`，`share`接口定义全局共享状态，该状态是一个引用稳定的只读代理对象，始终可以访问到最新结果

### atom

atom 支持传入所有类型的值（包括原值类型值），返回结果是一个元组

```ts
import { atom } from 'helux';

const [atomState, setAtom, atomCtx] = atom(1);
```

可使用工厂函数创建

```ts
const [atomState, setAtom, atomCtx] = atom(() => 1);
```

元组第一位结果即是共享状态

```ts
import { atom } from 'helux';

const [numAtom] = atom(1); // { val: 1 }
const [boolAtom] = atom(true); // { val: true }
const [listAtom] = atom([1, 2, 3]); // { val: [1,2,3] }
const [dictAtom] = atom({ desc: 'helux atom' }); // { val: { desc: 'helux atom'} }

// 也支持 Map Set 结构，但不建议使用，不利于后期做数据持久化
const [numAtom] = atom(
  new Map([
    [1, 1],
    [2, 2],
  ]),
);
```

共享状态被被自动装箱为 { val: T } 结构，取值需做一次.val 操作

```ts
const [dictAtom] = atom({ desc: 'helux atom' }); // { val: { desc: 'helux atom'} }
console.log(dictAtom.val.desc);
```

### atomx

`atomx` 和 `atom` 完全等效，返回结果为对象结构

```ts
// atom返回的元组结果的第三位 atomCtx 即是 atomx 返回结果
const [atomState, setAtom, atomCtx] = atom(1);
atomCtx.state === atomState; // true
atomCtx.setState === setAtom; // true

// 等效于如下写法
const atomCtx = atomx(1);
const { state: atomState, setState: setAtom } = atomCtx;
```

### share

share 和 atom 使用方式完全一样，但只支持传入字典类型的值（`{}`），返回结果是一个元组

```ts
const [sharedDict, setShared, shareCtx] = share({ desc: 'helux atom' }); // ✅ ok
const [sharedDict, setShared, shareCtx] = share(() => ({ desc: 'helux atom' })); // ✅ ok

share(1); // ❌ error
share(() => 1); // ❌ error
```

返回的共享状态无`{ val: T }` 装箱行为，可直接取值

```ts
const [sharedDict] = share({ desc: 'helux atom' });
console.log(sharedDict.desc);
```

### sharex

`sharex` 和 `share` 完全等效，返回结果为对象结构

```ts
// atom返回的元组结果的第三位 atomCtx 即是 atomx 返回结果
const [sharedDict, setShared, shareCtx] = share({ desc: 'helux atom' });
shareCtx.state === sharedDict; // true
atomCtx.setState === setShared; // true

// 等效于如下写法
const shareCtx = sharex({ desc: 'helux atom' });
const { state: sharedDict, setState: setShared } = shareCtx;
```

:::success{title=优先考虑 share}
优先考虑 share 共享字典对象，由于`share`接口没有装箱`{val: T}` 的操作，当共享对象为 `object` 时，可优先使用`share`来共享对象，避免一些无自动拆箱的场景多做一次`.val`取值操作
:::

## 使用和修改

### hook

钩子 `useAtom` 返回一个元组，使用方式完全对齐 `react.useState` 接口，react 用户可 0 成本上手此方式，在组件内使用`useAtom`接口来获得组件内使用的共享对象，数据变更后自动通知组件重渲染

```ts
import { useAtom, share } from 'helux';
const [sharedState] = share({
  a: 1,
  b: 2,
  info: { born: '2023-12-31', age: 2 },
});

function Demo() {
  const [state, setState] = useAtom(sharedState);
  const change = () =>
    setState((draft) => void (draft.info.born = `${Date.now()}`));
  return <h1>hello helux shared {state.info.born}</h1>;
}
```

也可以在组件中使用`ctx.useState`来简化`useAtom(xxxState)`写法

```ts
const [sharedState, setState, ctx] = share({
  a: 1,
  b: 2,
  info: { born: '2023-12-31', age: 2 },
});
// or
const ctx = sharex({ a: 1, b: 2, info: { born: '2023-12-31', age: 2 } });

function Demo() {
  const [state, setState] = ctx.useState();
}
```

- 示例 1：

```tsx
import { MarkUpdate } from '@helux/demo-utils';
import { share, useAtom } from 'helux';

const [sharedState] = share({
  a: 1,
  b: 2,
  info: { born: '2023-12-31', age: 2 },
});

function HelloBorn() {
  const [state, setState, info] = useAtom(sharedState);
  const change = () =>
    setState((draft) => void (draft.info.born = `${Date.now()}`));
  return (
    <MarkUpdate info={info}>
      <h1>hello helux {state.info.born}</h1>
      <button onClick={change}>changeBorn</button>
    </MarkUpdate>
  );
}

function HelloAge() {
  const [state, setState, info] = useAtom(sharedState);
  const change = () =>
    setState((draft) => void (draft.info.born = `${Date.now()}`));
  return (
    <MarkUpdate info={info}>
      <h1>hello helux {state.info.born}</h1>
      <button onClick={change}>changeBorn</button>
    </MarkUpdate>
  );
}

export default function Demo() {
  const [state] = useAtom(sharedState);
  return (
    <div>
      <HelloBorn />
      <HelloBorn />
    </div>
  );
}
```

### signal

`signal`响应机制允许用户跳过`useAtom`直接将数据绑定到视图。

#### $绑定

使用`$`符号绑定单个原始值

```ts
import { $ } from 'helux';

// 数据变更仅触发 $符号区域内重渲染
<h1>{$(numAtom)}</h1> // 包含原始值的atom可安全绑定
<h1>{$(shared.b.b1)}</h1>// 对象型需自己取到原始值绑定
```

#### block 绑定

使用`block`创建局部响应块

```ts
// UserBlock 已被 memo
const UserBlock = block(() => (
  <div>
    name: {user.name}
    desc: {user.detail.desc}
  </div>
));

// 其他地方使用 UserBlock
<UserBlock />;
```

#### 混合使用

`block` 和 `$` 混合使用

```ts
const UserBlock = block(() => (
  <div>
    name: {user.name}
    price: <h1>{$(numAtom)}</h1>
  </div>
));
```

:::tip 依赖追踪

`helux`内部会自动对`$`或`block`节点建立起视图对数据变化的依赖关系，让 react 的渲染粒度从**组件粒度**降低到**dom 粒度**，极致缩小视图渲染范围，大幅提高应用整体渲染性能！

:::

## 修改共享对象

### setState

使用钩子返回的 set 句柄创建修改共享对象的函数

```ts
const [state, setState] = useShared(sharedState);
const handelChange = () =>
  setState((draft) => {
    draft.name = 'newName';
  });
```

使用`atom`或者`share`接口返回的 set 句柄定义修改函数，将修改函数提升到组件外部

#### share 修改

修改`share`返回的共享对象

```ts
const [shared, setShared] = share({
  info: { name: 'helux', age: 1 },
  desc: 'awesome lib',
});

// 这是一个组件外部的函数，可全局任意地方使用
function changName(name) {
  // 回调里基于草稿修改，修改结束后，生成一份新的具有结构共享特性的状态
  setShared((draft) => {
    draft.info.name = name;
  });
}
```

#### atom 修改

修改`atom`返回的共享原始值

```ts
const [numAtom, setAtom] = atom(1);

// 回调里返回最新值
setAtom(() => Math.random());
// 回调里基于草稿修改，回调里已对atom拆箱，因atom是原始值，此刻的草稿也是原始值
setAtom((draft) => draft + Math.random());
// 直接传入最新值修改
setAtom(Math.random());
```

修改`atom`返回的共享对象

```ts
const [dictAtom, setDict] = atom({ desc: 'helux atom', info: { born: 2023 } });
// 回调里基于草稿修改
setDict((draft) => {
  draft.info.born = 2022;
});
```

:::tip setAtom 回调 draft 已拆箱

`setAtom` 回调已对 `draft` 已做拆箱操作，如果是原始值 atom，draft 也是原始值

:::

### action

使用`action`工厂函数接口创建修改共享对象的方法

#### atom 同步函数

```ts
import { atomAction } from 'helux';

const normalAction = atomAction(numAtom)(
  ({ setState, args, draft, draftRoot }) => {
    const val = args[0] && Number.isInteger(args[0]) ? args[0] : random();
    // 返回新值
    return val;

    // 参考当前值返回新值
    // return draft + val;

    // 修改draftRoot
    // draftRoot.val = val;
  },
  'normalAction',
);
normalAction(1); // 参数将透传给 args
```

#### atom 异步函数

```ts
import { atomActionAsync } from 'helux';

const asyncAction = atomActionAsync(numAtom)(async ({ setState, args }) => {
  await delay(2000);
  const val = args[0] && Number.isInteger(args[0]) ? args[0] : random();
  return val;

  // 如果 atom 定义的是对象，此处需基于草稿修改
  // setState((draft) => (draft.xx = 'new val'));
  // 返回字典的话会按浅合并策略处理
  // return { xx: 'new val' };
}, 'asyncAction');

// 调用 action 返回 Promise
asyncAction(1);
```
