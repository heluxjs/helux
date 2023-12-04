简体中文 | [English](./README.en.md)

# helux 简介

[helux](https://github.com/heluxjs/helux) 是一个集`atom`、`signal`、`依赖收集`为一体的 react 状态库，它拥有以下特性：

- 基于最快的不可变 js 库[limu](https://github.com/tnfe/limu)开发，拥有超强性能
- atom 支持依赖收集，意味着 atom 不用拆分的很细，atom 就可以等同于 model，天然对 `DDD` 领域驱动设计友好
- 内置 signal 响应机制，可实现 0 hook 编码 + dom 粒度的更新
- 内置 loading 模块，可对所有异步任务做运行状态、错误捕捉做管理
- 支持可变派生，对数据做最小粒度的更新
- 支持全量派生，不需要对数据做细粒度更新时使用全量派生更合适
- 全量派生、可变派生均支持异步任务
- 全量派生、可变派生处数据变更驱动执行外，还支持人工重新触发运行
- 内置事件系统
- 支持中间件、插件系统，可无缝对接 redux 生态相关工具库
- 100% ts 编码，类型提示优化

> 为了方便用户理解`helux`核心逻辑，我们提供了[how-helux-was-born](https://github.com/fantasticsoul/how-helux-was-born)项目用于辅助用户做 helux 源码调试。

## 快速开始

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
