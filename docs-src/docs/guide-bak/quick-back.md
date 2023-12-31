---
group:
  title: 开始
  order: 0
order: 11
---

# 快速上手

## atom

### 共享与修改

使用`atom`定义全局共享状态，该状态是一个引用稳定的只读代理对象，始终可以访问到最新结果

```ts
import { atom } from 'helux';
const [numAtom] = atom(1); // { val: 1 }

function Demo() {
  const [num] = useAtom(numAtom); // num 自动拆箱
  return <h1>{num}</h1>;
}
```

调用组件外部`atom`返回的 set 句柄修改

```ts
import { atom, useAtom } from 'helux';
const [numAtom, setAtom] = atom(1);

function Demo() {
  const [num] = useAtom(numAtom);
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}
```

调用组件内部钩子函数返回的 set 句柄修改

```ts
import { atom, useAtom } from 'helux';
const [numAtom] = atomx(1);

function Demo() {
  const [num, setAtom] = useAtom(numAtom);
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}
```

使用`ctx.useState`来简化`useAtom(xxxState)`写法

```ts
import { atom, useAtom } from 'helux';
const [numAtom, setAtom, ctx] = atom(1);
// or
const ctx = atomx(1);

function Demo() {
  const [num, setAtom] = ctx.useState();
  const change = () => setAtom(Math.random());
  // or
  const change = () => ctx.setState(Math.random());
  return (
    <h1>
      <button onClick={change}>click me</button>
      {num}
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <Demo />
  </>
);
```

### 使用 share 免拆箱

`atom`支持任意数据类型，直接读取时需要手动拆箱，`share`仅支持字典类型，因返回结果是字典对象，无装箱行为，可以直接读取目标任意节点值

```ts
import { share } from 'helux';

const [sharedObj] = share({ info: { born: 2023 } });
console.log(sharedObj); // sharedObj: {info: { born: 2023 }}
```

:::success{title=优先考虑 share}
优先考虑 share 共享字典对象，由于`share`接口没有装箱`{val: T}` 的操作，当共享对象为 `object` 时，可优先使用`share`来共享对象，避免一些无自动拆箱的场景多做一次`.val`取值操作
:::

## signal

`signal`响应机制允许用户跳过`useAtom`直接将数据绑定到视图。

### $绑定

使用`$`符号绑定单个原始值

```ts
import { $ } from 'helux';

// 数据变更仅触发 $符号区域内重渲染
<h1>{$(numAtom)}</h1> // 包含原始值的atom可安全绑定
<h1>{$(shared.b.b1)}</h1>// 对象型需自己取到原始值绑定
```

```tsx
import { useAtom } from 'helux';
const [numAtom] = share({ a: 1, b: 2 });

function Demo() {
  const [num, setAtom] = useAtom(numAtom); // num 自动拆箱
  const change = () => setAtom(Math.random());
  return (
    <h1>
      <button onClick={change}>click me</button>
      {num}
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <Demo />
  </>
);
```

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

也可以

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

`signal`响应机制允许用户跳过`useAtom`和`useShared`直接将数据绑定到视图。

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
