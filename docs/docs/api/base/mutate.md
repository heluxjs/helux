---
group:
  title: 可变派生
  order: 3
order: 0
---

# mutate

使用`mutate`定义[可变派生](/reference/glossary#可变派生)函数，仅当函数内的依赖发生变化时才会触发重计算。

:::info
`mutate`一次只能定义一个可变派生函数，一次定义多个可使用[mutateDict](/api/base/mutateDict)。
:::

## 基础使用

为了更好的类型推导，接口调用采用了柯里化风格

### 同步可变函数

```ts
import { atom, mutate } from 'helux';

const [state, setState, ctx] = atom({ a: 1, b: 0 });

//                      👇🏻 指定共享状态
const witness = mutate(state)((draft) => (draft.b = draft.a + 1));
//                              👆🏻 为其定义mutate函数
```

`wintess` 类型描述为

```ts
interface IMutateWitness<T = any> {
  /** 人工调用 mutate 配置里的同步函数 */
  run: MutateCall<T>;
  /** 人工调用 mutate 配置里的异步函数 */
  runTask: MutateTaskCall<T>;
  /** 用户透传的原始描述值 */
  oriDesc: string;
  /**
   * 内部生成的实际描述值，可能和 oriDesc 相等，
   * 在没人工指定 desc 或 指定的 desc 值和已有 mutate desc 重复时，内部会新生成一个
   */
  desc: string;
  /** 此函数可获取最新的快照 */
  getSnap: () => T;
  /** snap 只代表生成 witness 那一刻对应的共享状态的快照 */
  snap: T;
}
```

## 参数

支持以`IMutateFnLooseItem`格式定义可变函数

```ts
  /** 依赖项列表，有 task 无 fn 时，可作为 task 的依赖收集函数 */
  deps?: (state: StateType<T>) => P;
  /**
   * defalt: false
   * 为 true 时表示依赖全部由 deps 函数提供，fn 执行过程中不收集任何依赖
   */
  onlyDeps?: boolean;
  /** fn 和 deps 均可以收集依赖，对应存在 task 的场景，deps 或 fn 两者保证至少有一个 */
  fn?: MutateFn<T, P>;
  task?: MutateTask<T, P>;
  /** default: false, task 是否立即执行 */
  immediate?: boolean;
  /**
   * default: undefined，是否检测死循环，设置为 false 表示不检查
   * 未设定时，使用 atom、share 接口设定的 checkDeadCycle 值
   */
  checkDeadCycle?: boolean;
  /** 建议用户指定，无指定时内部会自动生成唯一 desc */
  desc?: FnDesc;
```

### fn

定义同步可变函数

```ts
import { mutate } from 'helux';

const witness = mutate(state)({
  fn: (draft) => (draft.b = draft.a + 1),
});
```

### task

定义异步可变函数，task 执行时机遵循以下规律：

- fn 和 task 同时存在时，没有指定`immediate`，`immediate`会默认为 `false`，首次执行仅触发 fn，后续执行仅触发 task
- fn 和 task 同时存在时，指定了`immediate`为 true，首次执行既触发 fn 也 触发 task（先 fn 后 task），后续执行仅触发 task
- 仅 task 存在时，没有指定`immediate`，`immediate`会默认为 `true`，首次执行触发 task，后续执行继续触发 task
- 仅 task 存在时，指定了 `immediate`会默认为 false，首次执行不触发 task，后续执行才会触发 task

task 和 fn 同时存在，未设定`immediate`，首次执行 mutate 不触发 task

```ts
const witness = mutate(state)({
  // deps 用于收集依赖，同时返回结果会透传给 taskFnParams.input 数组
  deps: () => [state.a, state.b],
  fn: (draft, { input }) => (draft.c = input[0] + input[1] + 1),
  task: async ({ input }) => {
    draft.c = input[0] + input[1] + 1;
  },
});
```

task 和 fn 同时存在，设定`immediate`为`true`，首次执行 mutate 先触发 fn 再触发 task

```ts
const witness = mutate(state)({
  deps: () => [state.a, state.b],
  fn: (draft, { input }) => (draft.c = input[0] + input[1] + 1),
  task: async ({ draft, input }) => {
    draft.c = input[0] + input[1] + 1;
  },
  immediate: true,
});
```

仅 task 存在，未设定`immediate`，首次执行触发 task

```ts
const witness = mutate(state)({
  deps: () => [state.a, state.b],
  task: async ({ draft, input }) => {
    draft.c = input[0] + input[1] + 1;
  },
});
```

仅 task 存在，设定`immediate`为`false`，首次执行不触发 task

```ts
const witness = mutate(state)({
  deps: () => [state.a, state.b],
  task: async ({ draft, input }) => {
    draft.c = input[0] + input[1] + 1;
  },
  immediate: false,
});
```

### immediate

`immediate`用于控制首次执行 mutate 时是否需要触发 task，具体控制规则见 [task](/api/base/mutate#task) 说明。

### deps

依赖项收集函数，fn 和 deps 同时存在时，收集到的依赖结果为 fn 和 deps 的并集。

```ts
import { share, mutate } from 'helux';
const [state] = share({ a: 1, b: 1, c: 0 });

const witness = mutate(state)({
  deps: () => [state.b],
  fn: (draft) => (draft.c = draft.a + draft.b + 1),
});

// 等同于写为
const witness = mutate(state)({
  deps: () => [state.b], // deps 返回结果会透传给 params.input 数组
  fn: (draft, params) => (draft.c = draft.a + params.input[0] + 1),
});
```

有 task 无 fn 时，可作为 task 的依赖收集函数

```ts
import { share, mutate } from 'helux';
const [state] = share({ a: 1, b: 1, c: 0 });

const witness = mutate(state)({
  deps: () => [state.a, state.b], // deps 返回结果会透传给 taskFnParams.input 数组
  task: async ({ draft, input }) => {
    draft.c = input[0] + input[1] + 1;
  },
});
```

:::warning
task 函数内部并不会有依赖收集行为，需将全部依赖提前定义到 deps 函数返回值里。
:::

### onlyDeps

默认`false`，为 `true` 时表示依赖全部由 deps 函数提供，fn 执行过程中不收集任何依赖

```ts
import { share, mutate } from 'helux';
const [state] = share({ a: 1, b: 1, c: 0 });

const witness = mutate(state)({
  deps: () => [state.a],
  onlyDeps: true,
  task: async ({ draft, input }) => {
    // 此时 b 的变化不会引起 task 执行
    draft.c = input[0] + state.b + 1;
  },
});
```

:::warning
慎用此参数，可能会照成依赖丢失的情况产生，仅当需要锁定依赖做一些特殊处理时可用此参数
:::

### checkDeadCycle

默认 `undefined`，是否检测死循环，设置为 `false` 表示不检查，未设定时，使用 atom、share 接口设定的 `checkDeadCycle` 值。

读取自己改变自己，出现死循环

```ts
import { share, mutate } from 'helux';
const [state] = share({ a: 1, b: 1, c: 0 });

const witness = mutate(state)({
  fn: (draft) => (draft.a += 1),
});
```

### desc

没指定时内部会自动生成唯一 desc，指定了如出现重复会被丢弃，内部还是为之生成唯一 desc

```ts
const witness = mutate(state)({
  fn: (draft) => (draft.b = draft.a + 1),
  desc: 'myWitness',
});
```

## witness

`mutate`返回结果`witness`可用于帮助用户重新运行`mutate`定义的可变派生函数

### 运行同步函数

存在同步函数 fn 时，运行才有效，默认不抛出错误，需用户自己读取元组第二位参数做处理

```ts
const witness = mutate(state)({
  fn: (draft) => (draft.a += 1),
});

// 返回元组，第一位参数为最新快照，第二位是错误
const [snap, err] = witness.run();
if (err) {
  // handle err
}
```

运行同步函数并抛出错误

```ts
try {
  const [snap] = witness.run(true);
} catch (err) {
  // handle err
}
```

### 运行异步函数

存在异步函数 task 时，运行才有效，默认不抛出错误，需用户自己读取元组第二位参数做处理

```ts
const witness = mutate(state)({
  fn: (draft) => (draft.a += 1),
});

// 返回元组，第一位参数为最新快照，第二位是错误
const [snap, err] = await witness.runTask();
if (err) {
  // handle err
}
```

运行同步函数 task 并抛出错误

```ts
try {
  const [snap] = await witness.runTask(true);
} catch (err) {
  // handle err
}
```
