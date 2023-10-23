简体中文 | [English](./README.en.md)

helux v3 is releasd now! powerd by extremely fast immutable lib [limu](https://tnfe.github.io/limu/).

## why helux

- 基于超快的不可变数据 js 库[limu](https://tnfe.github.io/limu/)开发，依赖收集性能优异
- 不需要Provider，接入超级简单，0成本提升状态为共享模式
- 同时支持深、浅收集两种依赖收集策略
- 支持 `share`、`derive`、`watch`、`atom` 等特性
- 派生函数支持异步派生，支持人工触发派生函数重计算
- 支持基于派生结果再定义新的派生结果，形成有向图架构
- 除了依赖变更触发更新组件，还可自定义 id 来触发更新组件
- 兼容 react 18
- 支持热更新
- 100% ts 编写

## quick visit

[在线示例](https://codesandbox.io/s/helux-demo-ts-539scq?file=/src/App.tsx)，欢迎访问了解

### 定义共享状态、计算、观察

```ts
import { share, derive, watch, getRawStateSnap } from "helux";

// sharedState 稳定引用，无论何时何地都能够读取到最新值
const [sharedState, setState] = share({ a: 1, b: { b1: { b2: 200 }, k1: { k2: 100} } });
const doubleA = derive(()=> sharedState.a * 2);
watch((params)=>{
  const { a } = sharedState; // 收集观察依赖
  if(params.isFirstCall) return;
  console.log(`a change to ${a}`);
});
```

### 组件使用状态、组件内部修改状态

```ts
import { useShared } from 'helux';

const [state, setState] = useShared(sharedState);
// 两种更新方式：即可可变状态修改，或返回新的部分状态
const mutableSet = () =>
  setState((draft) => {
    draft.a += 100;
  });
const classicalSet = () => setState((draft) => ({ a: draft.a + 1 }));

// 注意以上修改只触发读取 state.a 的组件渲染，如以下更深层的修改
// 只会影响读取 draft.b、draft.b.b1、draft.b.b1.b2 的组件重渲染
// 读取 draft.b.k1 的相关组件不会触发重渲染
const mutableSet = () =>
  setState((draft) => {
    draft.b.b1.b2 += 100;
  });
```

### 组件外部修改状态

基于 share 返回的接口可在外部定义修改函数，提供给组件直接调用

```ts
const [sharedState, setState, call] = share({ a: 1, b: { b1: { b2: 200 }, k1: { k2: 100 } } });

// 方式1, 基于 mutable 修改
function changeA() {
  setState((draft) => {
    draft.a += 100;
  });
}

// 方式2, 返回新的部分状态修改
function changeA() {
  setState({ a: sharedState.a + 100 });
}

// 方式3, 返回新的部分状态函数修改
function changeA() {
  setState((draft) => ({ a: draft.a + 100 }));
}

// 方式3, 基于call 封装，结合 mutable 修改
function change(num) {
  call(function ({ draft, args }) {
    // call ctx { draft, state, setState, args }
    draft.a += args[0] || 100;
  }, num); // 透传参数给 callCtx
}
```

### 定义异步导出、重计算导出

```ts
import { deriveAsync, runDerive } from 'helux';

const aPlusB2Result = deriveAsync(
  // 定义输入源、初始值
  () => ({ source: [sharedState.a, sharedState.b.b1.b2], initial: { val: 0 } }),
  // 定义计算函数
  async ({ source: [a, b2] }) => {
    await delay(1000);
    return { val: a + b2 };
  },
);

runDerive(aPlusB2Result); // 同步导出、异步导出即可交给 runDerive 触发重导出
```

### 组件读取导出结果

```ts
import { useDerive } from 'helux';

const [aPlusB, isComputing] = useDerive(aPlusB2Result);
```

### 组件里定义导出结果

```ts
import { useDerive } from 'helux';
// 推荐在组件外部定义
const [aPlusB, isComputing] = useDerive(() => ({ val: sharedState.a * 2 }));
```

### atom

想比`share`只能传入 object 类型值，`derive`必须返回对象类型值，`atom`支持任意类型值，`deriveAtom`支持返回任意类型值

```ts
import { atom, deriveAtom, useAtom } from 'helux';

const numAtom = atom(1); // numAtom 被封装为 { val: T } 对象
deriveAtom(() => numAtom.val + 100);

const [num] = useAtom(numAtom); // num is 101，已被自动拆开
```
