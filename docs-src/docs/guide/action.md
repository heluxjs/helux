---
group:
  title: 开始
  order: 0
order: 8
---

# Action

除了可以通过封装`setState` 调用达到修改状态的目的

```ts
const [numState, setState] = share({ num: 1 }); // { num: 1 }
function methodA(input: number) {
  setState((draft) => (draft.num = input));
}
```

`helux`还提供`action`工厂函数创建专用于修改状态的 action 同步或异步函数，通过 action 函数调用有 2 大好处

- 接入 devltool 后状态修改历史可详细追溯

- 异步函数可自动享受下文提到的`loading`管理能力

![cool loading](https://tnfe.gtimg.com/image/iu3p7105vx_1699699924785.gif)

## 同步 Action

定义有业务含义的同步 action 并约束入参类型

```ts
const hiAction = action<[number, string]>()(({ draft, payload }) => {
  draft.a += 100;
}, 'hi action');

hiAction(1, 1); // ❌ 第二位参数将提示：类型“number”的参数不能赋给类型“string”的参数
```

```tsx
import { Entry } from '@helux/demo-utils';
import { sharex } from 'helux';

const { useState, action } = sharex({ a: 1, b: { b1: 1 }, c: true, desc: '' });

const hiAction = action<[number, string]>()(({ draft, payload }) => {
  draft.a += 100;
}, 'hi action');

function Demo1() {
  const [state] = useState();
  return <h1>{state.a}</h1>;
}

export default () => (
  <Entry fns={{ hiAction }}>
    <Demo1 />
    <Demo1 />
  </Entry>
);
```

## 异步 Action

定义有业务含义的异步 action 并约束入参类型

```ts
const hiAsyncAction = action<[number, string]>()(async ({ draft, payload }) => {
  draft.a += 100;
  await delay(); // 进入下一次事件循环微任务执行前，触发提交 draft 变更数据
  draft.a += 100;
  return true;
}, 'hiAsyncAction');

// ❌ 第二位参数将提示：类型“number”的参数不能赋给类型“string”的参数
const { result, snap, err } = await hiAsyncAction(1, 1);
```

配合 `useActionLoading` 钩子可自动感知执行状态

```ts
const [ld] = useActionLoading();
const { loading, ok, err } = ld.hiAsyncAction;
```

:::info{title=错误捕获}
多次点击 `hiAsyncAction` 见触发组件渲染捕获到 action 抛出的错误
:::

```tsx
import { Entry, demoUtils } from '@helux/demo-utils';
import { sharex } from 'helux';

const { useState, action, useActionLoading } = sharex({
  a: 1,
  b: { b1: 1 },
  c: true,
  desc: '',
});

const hiAsyncAction = action<[number, string]>()(async ({ draft, payload }) => {
  draft.a += 100;
  await demoUtils.delay(); // 进入下一次事件循环微任务执行前，触发提交 draft 变更数据
  draft.a += 100;

  if (draft.a > 300) {
    // 抛出错误让 useActionLoading 处理
    throw new Error('300!');
  }
  return true;
}, 'hiAsyncAction');

function Demo1() {
  const [state] = useState();
  const [{ hiAsyncAction: ld }] = useActionLoading(); // 获得 hiAsyncAction 的执行状态

  if (ld.loading) {
    return <h1>loading...</h1>;
  }

  if (!ld.ok) {
    return <h1 style={{ color: 'red' }}>{ld.err.message}</h1>;
  }

  return <h1>{state.a}</h1>;
}

export default () => (
  <Entry fns={{ hiAsyncAction }}>
    <Demo1 />
    <Demo1 />
  </Entry>
);
```
