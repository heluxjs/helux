---
group:
  title: 进阶
  order: 1
order: 3
---

# 模块化

尽管`atom`共享上下文提供了`action`、`derive`、`mutate`、`userState`、`userActionLoading`、`userMutateLoading`等一系列 api 方便用户使用各项功能，但这些 api 比较零碎，处理大型前端应用时用户更希望面向领域模型对状态的`state`、`derive`、`action`建模，故共享上下文还提供`define`系列 api 来轻松驾驭此类场景。

为了开发者工具能够查看`模块化`相关变更动作记录，配置`moduleName`即可

```ts
atom({ name: 'helux', age: 1 }, { moduleName: 'user' });
```

## Define

### defineActions

批量定义状态对应的修改函数，返回 `{ actions, eActions, getLoading, useLoading, useLoadingInfo }`， 组件中可通过 useLoading 读取异步函数的执行中状态 loading、是否正常执行结束 ok、以及执行出现的错误 err， 其他地方可通过 getLoading 获取

```ts
// 【可选】约束各个函数入参 payload 类型
type Payloads = {
  changeA1: number;
  foo: boolean | undefined;
  // 不强制要求为每一个action key 都定义 payload 类型约束，但为了可维护性建议都补上
};

// 不约束 payloads 类型时写为 ctx.defineActions()({ ... });
const { actions, eActions, useLoading, getLoading } =
  ctx.defineActions<Payloads>()({
    // 同步 action，直接修改草稿
    changeA1({ draft, payload }) {
      draft.a.b.c += payload;
    },
    // 同步 action，返回结果
    changeA2({ draft, payload }) {
      draft.a.b.c += payload;
      return true;
    },
    // 同步 action，直接修改草稿深节点数据，使用 merge 修改浅节点数据
    changeA3({ draft, payload, merge }) {
      draft.a.b.c += payload;
      merge({ c: 'new desc' }); // 等效于 draft.c = 'new desc';
      return true;
    },
    // 异步 action，直接修改草稿
    async foo1({ draft, payload }) {
      await delay(3000);
      draft.a.b.c += 1000;
    },
    // 异步 action，多次直接修改草稿，合并修改多个状态，同时返回一个结果
    async foo2({ draft, payload, merge }) {
      draft.a.b.c += 1000;
      await delay(3000); // 进入下一次事件循环触发草稿提交
      draft.a.b.c += 1000;
      await delay(3000); // 再次进入下一次事件循环触发草稿提交
      const { list, total } = await fetchList();
      merge({ list, total }); // 等价于 draft.list = list, draft.tatal = total
      return true;
    },
  });
```

多个 action 组合为一个新的 action

```ts
const { actions, eActions, useLoading, getLoading } =
  ctx.defineActions<Payloads>()({
    foo() {},
    bar() {},
    baz() {
      actions.foo();
      actions.bar();
    },
  });
```

调用 `actions.xxx` 执行修改动作，actions 方法调用只返回结果，如出现异常则抛出，同时也会发送给插件和伴生 loading 状态

```ts
// 调用同步action函数
const result = actions.changeA([1, 1]);

// 调用异步action函数
actions.foo2().then(console.log);
```

:::info{title=查看执行历史}
如安装了[helux-devtool 插件]，可观察到 action 提交记录，可很方便地对状态变更历史做回溯
:::

![commit-desc](https://tnfe.gtimg.com/image/muuwbgeqtv_1704086284944.png)

调用 `eActions.xxx` 执行修改动作，eActions 方法调用只返回结果形如`{result, snap, err}`，默认不抛出异常，出现异常会同时发送给插件和伴生 loading 状态，并赋给返回对象里的`err`属性。

```ts
const { result, snap, err } = eActions.changeA([1, 1]);
if (err) {
  // handle err
}
```

调用 `eActions.xxx` 并抛出出现的异常

```ts
// 此时错误既发给插件和伴生loading状态，也向上抛出，用户需自己 catch
try {
  const { result, snap } = eActions.changeA([1, 1], true);
} catch (err) {
  // handle err
}
```

组件中使用 `useLoading` 获取各个 action 函数的执行状态 `{loading, ok, err}`

```ts
function Demo() {
  // 获得 foo bar baz 3 个 ation 函数的执行状态
  const { foo, bar, baz } = useLoading();
}
```

组件中使用 `getLoading` 获取各个 action 函数的执行状态 `{loading, ok, err}`

```ts
// 获得 foo bar baz 3 个 ation 函数的执行状态
const { foo, bar, baz } = getLoading();
```

:::info
点击 2 次 changeC1 按钮后，触发组件展示异步 action 函数里的错误信息
:::

```tsx
import { sharex } from 'helux';
const ctx = sharex(
  { a: { b: { c: 1 }, b1: { c1: 1 } }, info: { name: 'helux' } },
  { moduleName: 'dfDemo' },
);
const { state } = ctx;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const ac = ctx.defineActions()({
  changeC: ({ draft }) => (draft.a.b.c += 1000),
  changeC1: async ({ draft }) => {
    const ret = draft.a.b1.c1 + 100;
    if (ret > 300) {
      throw new Error('>300');
    }
    draft.a.b1.c1 = ret;
  },
});

function Price() {
  const [state] = ctx.useState();
  const { changeC1: status } = ac.useLoading();

  return (
    <div>
      {status.ok && <h3>a.b1.c1: {state.a.b1.c1}</h3>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
    </div>
  );
}

export default () => (
  <>
    <button onClick={ac.actions.changeC1}>changeC1</button>
    <Price />
  </>
);
```

### defineFullDerive

批量定义状态对应的全量派生函数，返回结果形如  
 `{ result, helper: { [key]: runDeriveFn, runDeriveTask, useDerived, useDerivedInfo } }`

```ts
type DR = {
  a: { result: number };
  c: { deps: [number, string]; result: number };
  // 不强制要求为每一个 result key 都定义 deps 返回类型约束和 result 类型约束，但为了可维护性建议都补上
};

const df = ctx.defineFullDerive<DR>()({
  a: () => priceState.a.b.c + 10000,
  b: () => priceState.a.b.c + 20000,
  c: {
    // DR['c']['result'] 将约束此处的 deps 返回类型
    deps: () => [priceState.a.b1.c1, priceState.info.name],
    fn: () => 1,
    async task(params) {
      const [c1, name] = params.input; // 获得类型提示
      await delay(2000);
      return 1 + c1;
    },
  },
});
```

重新运行同步派生函数

```ts
df.helper.a.runDeriveFn();
```

重新运行异步派生函数

```ts
df.helper.a.runDeriveTask();
```

组件外读取全量派生结果

:::info
结果均已自动拆箱
:::

```ts
console.log(df.result.a); // number
console.log(df.result.b); // number
console.log(df.result.c); // number
```

组件中读取全量派生结果，并读取异步派生任务的执行状态

```tsx | pure
function Price() {
  const [price, , info] = ctx.useState();
  const a = df.helper.a.useDerived();
  const [c, status] = df.helper.c.useDerivedInfo();

  return (
    <div>
      {price.a.b.c}
      <h3>derived a: {a}</h3>
      <h3>
        derived c: {c} {status.loading ? 'loading...' : ''}
      </h3>
    </div>
  );
}
```

:::info
点击 2 次 changeC1 按钮后，触发组件展示异步派生函数里的错误信息
:::

```tsx
import { $, sharex } from 'helux';
const ctx = sharex(
  { a: { b: { c: 1 }, b1: { c1: 1 } }, info: { name: 'helux' } },
  { moduleName: 'dfDemo' },
);
const { state } = ctx;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const ac = ctx.defineActions()({
  changeC: ({ draft }) => (draft.a.b.c += 1000),
  changeC1: ({ draft }) => (draft.a.b1.c1 += 100),
});

const df = ctx.defineFullDerive()({
  a: () => state.a.b.c + 10000,
  b: () => state.a.b.c + 20000,
  c: {
    // DR['c']['result'] 将约束此处的 deps 返回类型
    deps: () => [state.a.b1.c1, state.info.name],
    fn: () => 1,
    async task(params) {
      const [c1, name] = params.input; // 获得类型提示
      await delay(2000);
      const ret = 1 + c1;
      if (ret > 300) {
        throw new Error('>300');
      }
      return ret;
    },
  },
});

function Price() {
  const a = df.helper.a.useDerived();
  const [c, status] = df.helper.c.useDerivedInfo();

  return (
    <div>
      <h3>derived a: {a}</h3>
      {status.ok && <h1>derived c: {c} </h1>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
    </div>
  );
}

export default () => (
  <>
    <h3>state.a.b.c: {$(state.a.b.c)}</h3>
    <h3>state.a.b1.c1: {$(state.a.b1.c1)}</h3>
    <button onClick={ac.actions.changeC}>changeC</button>
    <button onClick={ac.actions.changeC1}>changeC1</button>
    <Price />
  </>
);
```

### defineMutateSelf

批量定义状态对应的自我可变派生函数，返回结果形如  
 `{ witnessDict, getLoading, useLoading, useLoadingInfo }`

:::warning
自我可变派生需要注意修改关系，否则会引起死循环，内部会尽力拦住死循环并给用户提示
:::

```ts
const ctx = sharex(
  {
    a: { b: { c: 1 }, b1: { c1: 1 } },
    info: { name: 'helux', extraName: 'helux cool' },
  },
  { moduleName: 'deriveM' },
);
const { state } = ctx;

const dm = ctx.defineMutateSelf()({
  // a.b.c 变化后，修改 a.b1.c1
  toBeDrive: (draft, { state }) => {
    draft.a.b1.c1 = state.a.b.c + 1000;
  },
  changeB: {
    // 通过 deps 显示定义依赖
    deps: () => [state.info.name],
    async task({ draft, input }) {
      await delay(1000);
      draft.info.extraName = `${input[0]}_${Date.now()}`;
    },
  },
});
```

```tsx
import { $, sharex } from 'helux';
const ctx = sharex(
  {
    a: { b: { c: 1 }, b1: { c1: 1 } },
    info: { name: 'helux', extraName: 'helux cool' },
  },
  { moduleName: 'deriveM' },
);
const { state } = ctx;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const ac = ctx.defineActions()({
  changeC: ({ draft }) => (draft.a.b.c += 1000),
});

const ds = ctx.defineMutateSelf()({
  // a.b.c 变化后，修改 a.b1.c1
  toBeDrive: (draft, { state }) => {
    draft.a.b1.c1 = state.a.b.c + 1000;
  },
  changeB: {
    // 通过 deps 显示定义依赖为 a.b.c
    deps: () => [state.a.b.c],
    async task({ draft, input }) {
      await delay(1000);
      // a.b.c 变化后，修改 info.extraName
      draft.info.extraName = `${input[0]}_${Date.now()}`;
    },
    // 未定义 fn 时，immediate 默认为 true，会立即只需 task
    immediate: false,
  },
});

function Price() {
  const [state] = ctx.useState();
  const { changeB: status } = ds.useLoading();

  return (
    <div>
      {status.ok && <h3>info.extraName: {state.info.extraName}</h3>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
    </div>
  );
}

export default () => (
  <>
    <h3>state.a.b.c: {$(state.a.b.c)}</h3>
    <button onClick={ac.actions.changeC}>changeC</button>
    <Price />
  </>
);
```

### defineMutateDerive

全新定义一个状态对象并对其批量定义派生函数，这些函数的计算依赖源可以是当前`ctx.state`，返回结果形如  
 `{ derivedState, useDerivedState, witnessDict, getLoading, useLoading, useLoadingInfo }`

```ts
import { sharex } from 'helux';

const ctx = sharex(
  {
    a: { b: { c: 1 }, b1: { c1: 1 } },
    info: { name: 'helux', extraName: 'helux cool' },
  },
  { moduleName: 'deriveM' },
);
const { state } = ctx;

const dm = ctx.defineMutateDerive({
  a: 1,
  b: '2',
  c: 3,
})({
  // a.b.c 变化修改 newState.a
  changeA: (draft) => (draft.a = state.a.b.c + 100),
  changeB: {
    // name 变化修改 newState.b
    deps: () => [state.info.name],
    async task(params) {
      await delay(1000);
      params.draft.b = state.info.name + 'ccc';
    },
  },
});
```

:::info
点击 changeC，触发 a 变化，点击 changeName，触发 b 变化
:::

```tsx
import { $, sharex } from 'helux';
const ctx = sharex(
  {
    a: { b: { c: 1 }, b1: { c1: 1 } },
    info: { name: 'helux', extraName: 'helux cool' },
  },
  { moduleName: 'deriveM' },
);
const { state } = ctx;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const ac = ctx.defineActions()({
  changeC: ({ draft }) => (draft.a.b.c += 1000),
  changeName: ({ draft }) => (draft.info.name = `${Date.now()}`),
});

const dm = ctx.defineMutateDerive({
  a: 1,
  b: '2',
  c: 3,
})({
  changeA: (draft) => (draft.a = state.a.b.c + 100),
  changeB: {
    deps: () => [state.info.name],
    async task(params) {
      await delay(1000);
      params.draft.b = state.info.name + 'ccc';
    },
  },
});

function Price() {
  const [state] = dm.useDerivedState();
  const { changeB: status } = dm.useLoading();

  return (
    <div>
      <h3>a: {state.a}</h3>
      {status.ok && <h3>b: {state.b}</h3>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
    </div>
  );
}

export default () => (
  <>
    <h3>derivedState.b: {$(dm.derivedState.b)}</h3>
    <button onClick={ac.actions.changeC}>changeC</button>
    <button onClick={ac.actions.changeName}>changeName</button>
    <Price />
  </>
);
```

## 多文件代码组织方式

当`defineActions`，`defineFullDerive`，`defineMutateSelf`，`defineMutateDerive`批量定义的函数过多时，建议将其分散到各个文件独立维护，顶层目录统一导出给上层使用，这样有利于维护和扩展。

推荐多文件代码目录结构如下

<Tree>
  <ul>
    <li>
      modules
      <small>模块根目录</small>
      <ul>
        <li>
          user
          <small>用户信息</small>
          <ul>
            <li>index.ts<small>导出模块数据</small></li>
            <li>actions<small>【可选】动作函数</small></li>
            <li>deriveFull<small>【可选】全量派生</small></li>
            <li>deriveMutate<small>【可选】可变派生</small></li>
            <li>deriveSelf<small>【可选】自我可变派生</small></li>
            <li>mutateState<small>【可选】可变派生对应宿主状态</small></li>
            <li>state<small>【必须】模块对应状态</small></li>
          </ul>
        </li>
        <li>other-module<small>其他业务模块...</small></li>
      </ul>
    </li>
    <li>
      pages<small>页面组件</small>
      <ul>
         <li>page-foo<small>页面1</small></li>
      </ul>
    </li>
    <li>
      components
      <small>公共组件目录</small>
      <ul></ul>
    </li>
    <li>
      ...
      <small>其他目录</small>
      <ul></ul>
    </li>
  </ul>
</Tree>

### index

`index.ts`导出目录如下

```ts
import * as actions from './actions'; // action 函数定义
import * as deriveFull from './deriveFull'; // 全量派生结果定义
import * as deriveMutate from './deriveMutate'; // 新对象来可变派生结果定义
import * as deriveSelf from './deriveSelf'; // 自我可变派生结果定义
import { mutateStateFn } from './mutateState';
import { ctx } from './state';

// ctx 二次导出
export { ctx } from './state';
// action 对象，可简写为 ac
export const action = ctx.defineActions()(actions);
// 全量派生对象，可简写为 df
export const deriveF = ctx.defineFullDerive()(deriveFull);
// 自我可变派生对象，可简写为 ds
export const deriveS = ctx.defineMutateSelf()(deriveSelf);
// 全新可变派生对象，可简写为 dm
export const deriveM = ctx.defineMutateDerive(mutateStateFn)(deriveMutate);
```

### state

`state`是模块的状态定义，文件内如如下

```ts
import { sharex } from 'helux';
import type { IActionTaskParams, DraftType, UnconfirmedArg, IMutateTaskParam, IMutateFnItem, IMutateFnParams } from 'helux';

export function getInitial() {
  return {
    a: 1,
    f: 1,
    g: 1,
    k: 1,
    list: [],
    // ... 其他略
  };
}

// 此处可以是 atomx 或 sharex ，看用户具体使用哪一个，推荐字典对象有效考考 sharex
export const ctx = sharex(getInitial, { moduleName: 'CompWithModule' });
export const { state } = ctx;

export type State = typeof ctx.state; // 状态类型
export type Draft = DraftType<State>; // 草稿类型，DraftType 会自动拆箱 Atom 类型值出来
export type ActionTaskParams<P = UnconfirmedArg> = IActionTaskParams<State, P>; // action 函数回调参数类型
export type MutateFnItem<P = any[]> = IMutateFnItem<State, P>; // mutate 对象类型，用于辅助定义 task
export type MutateFnParams<P = any[]> = IMutateFnParams<State, P>; // mutate 函数参数类型，用于辅助定义 task
export type MutateTaskParam<P = UnconfirmedArg> = IMutateTaskParam<State, P>; // mutate 异步函数参数类型
```

### mutateState

`mutateState`是可变派生对应的状态定义，文件内如如下

```ts
import { UnconfirmedArg, IMutateTaskParam, IMutateFnItem, DraftType } from 'helux';

/** get initial mutate state */
export function mutateStateFn() {
  return {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
  };
}

export type State = ReturnType<typeof mutateStateFn>; // 状态类型
export type Draft = DraftType<State>; // 草稿类型，DraftType 会自动拆箱 Atom 类型值出来
export type MutateFnItem<P = UnconfirmedArg> = IMutateFnItem<State, P>; // mutate 对象类型，用于辅助定义 task
export type MutateTaskParam<P = UnconfirmedArg> = IMutateTaskParam<State, P>; // mutate 异步函数参数类型
```

### actions

`actions`文件定义多个动作函数，内容如下

```ts
import { ActionTaskParams } from './state';

export function changeA(params: ActionTaskParams<number>) {
  return 2;
}

export function changeF(params: ActionTaskParams<number>) {
  params.draft.f += 100;
}
```

### deriveFull

`deriveFull`文件定义多个全量派生函数，内容如下

```ts
import { IDeriveFnParams, IDeriveFnItem, defineDeriveFnItem, defineDeriveTask } from 'helux';
import { state } from './state';
import { delay } from '../../../logic/util';

export function go(params: IDeriveFnParams) {
  return state.f + 100;
}

export function test() {
  const map: Record<number, any> = {};
  state.list.forEach(item => map[item.id] = item);
  return map;
}

/**
 * 通过 IDeriveFnItem 主动约束结果返回类型和deps 返回类型，同时 deps 返回类型自动透传给 params.input
 */
export const fTask: IDeriveFnItem<number, [number]> = {
  deps: () => [state.f],
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000)
    return params.prevResult + 100;
  },
}

/**
 * 通过 IDeriveFnItem 类型同时约束 fn 和 task 的返回类型，约束 deps 的返回类型
 */
export const fTask2 = defineDeriveFnItem<IDeriveFnItem<number, [number]>>({
  deps: () => [state.f],
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000);
    return params.prevResult + 100;
  },
});

/**
 * 通过 defineDeriveTask 仅约束结果返回类型，同时自动推导出 deps 返回类型并透传给 params.input
 */
export const f2 = defineDeriveTask(
  () => [state.f] as const,
)<number>({
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000)
    return params.prevResult + 100;
  },
});
```

### deriveMutate

`deriveMutate`文件定义多个可变派生函数，内容如下

```ts
import { Draft, MutateFnItem } from './mutateState';
import { ctx } from './state';

/**
 * 关注自身 b 的变化
 */
export function plusAByB(draft: Draft) {
  draft.a = draft.b + 1;
}

/**
 * 关注 ctx.state.j 的变化
 */
export function changeC(draft: Draft) {
  draft.c = ctx.state.j + 1;
}

/**
 * 定义异步计算任务
 * MutateFnItemType<[number]> 约束了 deps 返回类型和 task 里的 input 类型
 */
export const changeDTask: MutateFnItem<[number]> = {
  deps: () => [ctx.state.j],
  // 无 fn 函数，task 会立即执行
  task: async ({ draft, input }) => {
    draft.d = input[0] + 1;
  },
}

export const changeDTask2: MutateFnItem<[number]> = {
  deps: () => [ctx.state.j],
  // 主动定义 fn 函数，task 不会立即执行
  fn: ( draft )=> draft.d = 0,
  task: async ({ draft, input }) => {
    draft.d = input[0] + 1;
  },
}

```

### deriveSelf

`deriveSelf`文件定义模块状态自身的多个可变派生函数，内容如下

```ts
import { Draft, MutateFnItem, MutateFnParams } from './state';

/**
 * 对应 mutateFnItem.fn
 */
export function plusK(draft: Draft) {
  draft.k = draft.g + 1;
}

export function plusK2(draft: Draft, params: MutateFnParams) {
  draft.k = draft.g + 1;
}

/**
 * 对应 mutateFnItem.task
 */
export const jTask: MutateFnItem<[number]> = {
  deps: (state) => {
    return [state.g];
  },
  task: async ({ draft, input }) => {
    draft.j = input[0] + 2;
  },
}
```
