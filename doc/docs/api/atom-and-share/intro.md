---
sidebar_position: 0
---

# 简介

`atom` 支持传入所有类型的值（包括原值类型值），返回结果被自动装箱为 `{ val: T }` 结构，取值需做一次`.val`操作

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

支持传入初始值工厂函数

```ts
const [numAtom] = atom(() => 66); // numAtom: { val: 66 }
const [numAtom] = atom(() => [1, 2, 3]); // numAtom: { val: [1,2,3] }
```

组件外取值或修改值需做一次`.val`操作

```tsx
const [numAtom, setAtom] = atom(1);
const [dictAtom, setDict] = atom({ desc: 'helux atom', info: { born: 2023 } });

// 原始值读取
console.log(numAtom.val);

setAtom(() => Math.random()); // 回调返回最新值
setAtom((draft) => draft + Math.random()); // 复用回调草稿返回最新值
setAtom(Math.random()); // 直接传入最新值

// 对象值读取
console.log(dictAtom.val.info.born);
// 对象值修改，修改结束后，会生成一份具有结构共享特性的新状态
setDict((draft) => (draft.info.born = 2022));
```

:::tip setAtom 回调 draft 已拆箱

`setAtom` 回调已对 `draft` 已做拆箱操作，如果是原始值 atom，draft 也是原始值

:::

`share`接口直接受字典类型值（object），因本身就是对象，就没有`.val`装箱和拆箱操作了，其他特性和使用方式均和`atom`一样

```tsx
import { share } from 'helux';

// 传入对象
const [sharedDict, setDict] = share({ desc: 'helux atom', info: { born: 2023 } });
// 传入对象工厂函数
const [sharedDict, setDict] = share(() => ({ desc: 'helux atom', info: { born: 2023 } }));

// 读取，区别于 atom，无 .val 取值操作
console.log(sharedDict.info.born);
// 修改直接修改草稿
setDict((draft) => (draft.info.born = 2022));
// 会返回整个状态的全新值
setDict(() => aTotallyNewState);
```

:::tip share 优先

优先考虑 share 共享对象由于`share`接口没有装箱`{val: T}` 的操作，当共享对象为 `object` 时，可优先使用`share`来共享对象，避免一些无自动拆箱的场景多做一次`.val`取值操作

:::

`atom` 和`share`接口返回的元组结果完整信息如下

```ts
// 元组返回数据可贴近实际业务场景命名
const [numAtom, setAtom, atomCtx] = atom(1);
const [shared, setShared, sharedCtx] = share({ name: 'helux' });

// atomCtx.state === numAtom , atomCtx.setState === setAtom
// sharedCtx.state === shared , atomCtx.setState === setShared

// atomCtx sharedCtx 还包含以下属性，我们此处过一下目录，后续会逐步介绍
//    mutate              <-- 创建可变派生函数
//    runMutate           <-- 运行指定的可变派生函数
//    runMutateTask       <-- 运行指定的可变派生函数异步任务
//    action              <-- 创建修改状态的动作函数
//    actionAsync         <-- 创建修改状态的异步动作函数
//    call                <-- 定义并呼叫一个动作函数
//    callAsync           <-- 定义并呼叫一个异步动作函数
//    useState            <-- 是用当前状态的钩子函数，供react组件调用
//    getMutateLoading    <-- 组件外获取 mutate 可变派生函数的运行状态
//    useMutateLoading    <-- 组件内使用 mutate 可变派生函数运行状态的钩子
//    getActionLoading    <-- 组件外获取 action 动作函数的运行状态
//    useActionLoading    <-- 组件内使用 action 动作函数运行状态的钩子
//    sync                <-- 当前状态的多层级路径值的自动同步函数，通常用于表单双向绑定
//    syncer              <-- 当前状态的单层级路径值的自动同步函数，通常用于表单双向绑定
```

除`atom`和`share`之外，还提供一个功能完全相同的`shareAtom`和`shareState`接口，区别在于：`atom`和`share`返回元组，`shareAtom`和`shareState`返回元组第三位的共享上下文对象，上下文里的`state`和`setState`属性值即是元组的第一和第二位参数

```ts
import { atom, shareAtom, share, shareState } from 'helux';

const [numAtom, setAtom, atomCtx] = atom(1);
const atomCtx = shareAtom(1); // 返回对象就是元组结果的第三位值

const [state, setState, stateCtx] = share({ name: 'helux' });
const stateCtx = shareState({ name: 'helux' }); // 返回对象就是元组结果的第三位值
```
