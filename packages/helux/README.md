简体中文 | [English](./README.en.md)

# helux 简介

[helux](https://github.com/heluxjs/helux) 是一个集`atom`、`signal`、`依赖收集`、`派生`、`观察`为一体，支持细粒度响应式更新的状态引擎，支持所有类 react 框架（包括 react 18）

<p align="center">
  <a href="https://heluxjs.github.io/helux" target="__blink">
    <img width="680px" src="https://tnfe.gtimg.com/image/wgf9lcdy0l_1703770385145.png">
  </a>
</p>

- [Doc](https://heluxjs.github.io/helux)
- [Playground](https://heluxjs.github.io/helux/playground)
- [Helux-react-starter](https://codesandbox.io/p/sandbox/helux-react-starter-ts-539scq)
- [Helux-preact-starter](https://codesandbox.io/p/sandbox/helux-preact-starter-dnyzpy)
- [Helux-nextjs-starter](https://github.com/heluxjs/helux-nextjs-starter)

特性简介：

- 内置依赖追踪特性，基于最快的不可变 js 库[limu](https://github.com/tnfe/limu)开发，拥有超强性能
- `atom` 支持任意数据结构且自带依赖收集功能， 无需拆分很细，天然对 DDD 领域驱动设计友好
- 内置 `signal` 响应机制，实现 0 hook 编码 dom 粒度或块粒度的更新
- 内置 `loading` 模块，可管理所有异步任务的运行状态、并捕捉错误抛给组件、插件
- 内置 `sync` 系列 api，支持**双向绑定**，轻松应对表单处理
- 内置 `reactive` 响应式对象，支持数据变更直接驱动关联 ui 渲染
- 内置 `define` 系列 api，方便对状态模块化抽象，轻松驾驭大型前端应用架构
- 内置事件系统
- 支持可变派生，适用于当共享对象 a 部分节点变化需引起其他节点自动变化的场景，数据更新粒度更小
- 支持全量派生，适用于不需要对数据做细粒度更新的场景
- 全量派生、可变派生均支持异步任务
- 全量派生、可变派生除数据变更驱动执行外，还支持人工重新触发运行
- 支持中间件、插件系统，可无缝对接 redux 生态相关工具库
- 100% ts 编码，类型安全

> 为了方便用户理解`helux`核心逻辑，我们提供了[how-helux-was-born](https://github.com/fantasticsoul/how-helux-was-born)项目用于辅助用户做 helux 源码调试。

## 30s 上手

使用 npm 命令`npm i helux`安装`helux`，然后调用`atom`创建共享状态，调用`useAtom`使用共享状态，that's all，你已接入`helux`来提升局部状态为共享状态. ✨

```diff
import React from 'react';
+ import { atom, useAtom } from 'helux';
+ const [sharedState] = atom({ a: 100, b: { b1: 1 } });

function HelloHelux(props: any) {
-   const [state, setState] = React.useState({ a: 100, b: { b1: 1, b2: 2 } });
+   const [state, setState] = useAtom(sharedState);

-   const change = setState((prev) => ({ ...prev, b: { ...prev.b, b1: 100 } }));
+   const change = setState((draft) => { draft.b.b1 = 100 });

  // 收集到当前组件依赖为 a，仅当 a 变更时才触发重渲染
  return <div>{state.a}</div>;
}
```

## 部分特性简介

以下是一些常见特性，更多特性可查阅文档里的[Atom](https://heluxjs.github.io/helux/guide/atom)、[Signal](https://heluxjs.github.io/helux/guide/signal)、[依赖追踪](https://heluxjs.github.io/helux/guide/dep-tracking)、[响应式](https://heluxjs.github.io/helux/guide/reactive)、[双向绑定](https://heluxjs.github.io/helux/guide/sync)、[派生](https://heluxjs.github.io/helux/guide/derive)、[观察](https://heluxjs.github.io/helux/guide/watch)、[Action](https://heluxjs.github.io/helux/guide/action)、[模块化](https://heluxjs.github.io/helux/guide/modular) 等章节做深入了解

### atom

```tsx
import { atom, useAtom } from 'helux';
const [numAtom] = atom(1); // { val: 1 }

function Demo() {
  const [num, setAtom] = useAtom(numAtom); // num 自动拆箱
  return <h1 onClick={setAtom(Math.random())}>{num}</h1>;
}
```

### dep collection

**依赖收集**，组件渲染期间将实时收集到数据依赖

```tsx
import { useAtom } from 'helux';
const [objAtom, setObj] = atom({ a: 1, b: { b1: 1 } });

// 修改草稿，生成具有数据结构共享的新状态，当前修改只会触发 Demo1 组件渲染
setObj((draft) => (draft.a = Math.random()));

function Demo1() {
  const [obj] = useAtom(objAtom);
  // 仅当 obj.a 发生变化时才触发重渲染
  return <h1>{obj.a}</h1>;
}

function Demo2() {
  const [obj] = useAtom(objAtom);
  // 仅当 obj.b.b1 发生变化时才触发重渲染
  return <h1>{obj.b.b1}</h1>;
}
```

### signal

**信号响应**，可将共享状态原始值直接绑定到视图

原始值响应

```tsx
// 只会引起h1标签内部重渲染
<h1>${numAtom}</h1>
```

块响应

```tsx
import { block } from 'helux';
const [objAtom] = atom({ a: 1, b: { b1: 1 } });

const UserBlock = block(() => (
  <div>
    <h1>{objAtom.a}</h1>
    <h1>{objAtom.b.b1}</h1>
  </div>
));

// 依赖是 obj.val.a, obj.val.b.b1
<UserBlock />;

// 如使用 share 创建共享对象，则 UserBlock 实例的依赖是 obj.a, obj.b.b1
const [objAtom] = share({ a: 1, b: { b1: 1 } });
```

### mutate derive

**可变派生**，响应共享状态自身某些节点变化，派生自身其他节点结果

```ts
import { share, mutate } from 'helux';
const [shared] = share({ a: 1, b: 0, c: 0 });

mutate(shared)({
  changeB: (draft) => (draft.b = shared.a + 1),
  changeC: (draft) => (draft.c = shared.a + 2),
});
```

响应其他共享状态某些节点变化，派生自身其他节点结果

```ts
import { share, mutate } from 'helux';
const [shared] = share({ a: 1 });
const [sharedB] = share({ b: 0, c: 0 });

mutate(sharedB)({
  changeB: (draft) => (draft.b = shared.a + 1),
  changeC: (draft) => (draft.c = shared.a + 2),
});
```

### full derive

**全量派生**，响应其他共享状态某些节点变化，全量派生新结果

```ts
import { share, derive, deriveAtom, useDerived, useDerivedAtom } from 'helux';
const [shared] = share({ a: 1 });

const resultDict = derive(() => ({ num: shared.a + 100 })); // { num: number }
const resultAtom = deriveAtom(() => shared.a + 100); // 自动装箱：{ val: number }

const [result] = useDerived(resultDict); // { num: number}
const [result] = useDerivedAtom(resultAtom); // 自动拆箱：number
```

### watch

通过 watch 观察数据变化

主动定义依赖，首次不执行

```ts
import { watch } from 'helux';

// 仅观察到a变化才通知回调执行
watch(() => {
  console.log('a change');
}, [shared.a]);

// shared任意节点变化就通知回调执行
watch(() => {
  console.log('shared change');
}, [shared]);
```

设置 `immediate=true`，立即执行，自动收集到依赖

```ts
watch(
  () => {
    console.log('a change', shared.a);
  },
  { immediate: true },
);
```
