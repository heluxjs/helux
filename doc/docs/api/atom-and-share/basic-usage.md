---
sidebar_position: 0
---

# 基本用法

### 基于钩子使用共享对象

通过 `atom` 创建共享对象，并提供给 react 组件配合`useAtom`使用

```tsx
import { atom, useAtom } from 'helux';

const [numAtom] = atom(1);

// 组件内配合 useAtom 钩子使用 atom，产生数据变更通知组件重渲染的关系
function Demo() {
  const [num, setNum] = useAtom(numAtom); // 自动拆箱 num: 1
  return <h1 onClick={() => setNum(num + 1)}>hello helux atom {num}</h1>;
}
```

:::tip useAtom 自动拆箱

useAtom 会自动做 .val 拆箱操作，用户在组件里无需再次拆箱

:::

通过 `share` 创建共享对象，并提供给 react 组件配合`useShared`使用

```tsx
import { share, useShared } from 'helux';

const [sharedState] = share({ name: 'helux' });

// 组件内配合 useShared 钩子使用 state，产生数据变更通知组件重渲染的关系
function Demo() {
  const [state, setState] = useShared(sharedState);
  return <h1 onClick={() => setState((draft) => (draft.name = 'newName'))}>hello helux shared {state.name}</h1>;
}
```

:::danger useAtom 和 useShared 不可混用

不可将 atom 对象传给 useShared，不可将 shared 对象传给 useAtom，否则会引起运行时报错

:::

### 基于 signal 使用共享对象

`signal`响应机制允许用户跳过`useAtom`和`useShared`直接将数据绑定到视图，`helux`内部会自动建立起视图对数据变化的依赖关系，让 react 的渲染粒度从**组件粒度**降低到**dom 粒度**，极致的缩小视图渲染范围，大幅提高应用整体渲染性能！

`helux`提供`signal`以及别名接口`$`来完成绑定，需注意和 `jsx` 花括号绑定值语法一样，`signal`只支持绑定原始值

```tsx
import { signal, $ } from 'helux';

<h1>{signal(numAtom)}</h1> // 包含原始值的atom可安全绑定
<h1>{signal(objAtom.val.b.b1)}</h1> // 对象型需自己取到原始值绑定
<h1>{signal(shared.b.b1)}</h1>

// 以上可简写为
<h1>{$(numAtom)}</h1>
<h1>{$(objAtom.val.b.b1)}</h1>
<h1>{$(shared.b.b1)}</h1>

// 需注意：绑定对象将报错
<h1>{objAtom}</h1> // ❌ jsx 不支持绑定对象
<h1>{$(objAtom)}</h1> // ❌ signal 不支持绑定对象

```

静态部分多，动态部分少的组件非常适合用`signal`绑定

```tsx
// 当 numAtom 变化时，只会导致 h3 标签内部区域重渲染
function Comp1() {
  return (
    <div>
      <div>very very long content</div>
      <h3>{$(numAtom)}</h3>
      <h3>{$(shared.name)}</h3>
    </div>
  );
}
```

还可使用`block`完成多值绑定，复杂对象绑定

```tsx
import { share } from 'helux';
const [user] = share({
  name: 'helux',
  detail: { desc: 'a fatanstic state lib for react like framework' },
});

const UserBlock = block(() => (
  <div>
    name: {user.name}
    desc: {user.detail.desc}
  </div>
));

// 其他地方使用 UserBlock
<UserBlock />;
```

更多使用方式见[signal](/helux/docs/api/signal)介绍

### 修改共享对象

除了基于钩子函数返回的 set 句柄在组件内定义修改函数，调用并触发修改以外

```ts
const [state, setState] = useShared(sharedState);
const handelChange = () => setState((draft) => (draft.name = 'newName'));
```

可以使用`atom`或者`share`接口返回的 set 句柄定义修改函数，这样可将修改函数提升到组件外部

```ts
const [sharedState, setShared] = share({ name: 'helux' });

// 这是一个组件外部的函数，可全局任意地方使用
function handelChange() {
  setShared((draft) => (draft.name = 'newName'));
}
```

### 依赖收集

当传入的值为对象时，`useAtom`返回的对象将在组件渲染期间动态收集到数据依赖

```tsx
const [objAtom, setObjAtom] = atom({ a: 1, b: { b1: 2 }, c: 100 });

// 可以将修改方法置于组件外部
function change() {
  // 基于草稿修改，回调执行结束后，内部会生成一份结构共享特性的新状态
  // 当前修改只会引起下面的 Comp2 组件实例重渲染
  setObjAtom((draft) => (draft.val.b.b1 = Math.random()));
}

function Comp1() {
  const [obj] = useAtom(objAtom);
  // 当前组件仅对 obj.a 有依赖
  return <h1>obj.a {obj.a} </h1>;
}

function Comp2() {
  const [obj] = useAtom(objAtom);
  // 当前组件仅对 obj.b.b1 有依赖
  return <h1>obj.b.b1 {obj.b.b1} </h1>;
}
```

:::tip setAtom 回调里 draft 未拆箱

为何 `setAtom` 内部未对 `draft` 做拆箱操作呢，形如：`setAtom(draft => { draft.num += 1 })`

> 主要是考虑到需要对原始值 atom 赋值 `undefined` 的场景，  
> 基于 `draft.val` 方便且没有歧义：`setAtom(draft => { draft.val = undefined })`;

:::

### 接口简介

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

`atom` 接口返回的元组结果完整信息如下

```ts
const [numAtom, setAtom, atomCtx] = atom(1);

// atomCtx.state === numAtom
// atomCtx.setState === setAtom

// atomCtx 还包含以下属性，我们此处过一下作用即可，后续会逐步介绍
//    mutate              <-- 创建可变派生函数
//    runMutate           <-- 运行指定的可变派生函数
//    runMutateTask       <-- 运行指定的可变派生函数异步任务
//    action              <-- 创建修改状态的动作函数
//    asyncAction         <-- 创建修改状态的异步动作函数
//    call                <-- 定义并呼叫一个动作函数
//    asyncCall           <-- 定义并呼叫一个异步动作函数
//    useState            <-- 是用当前状态的钩子函数，供react组件调用
//    getMutateLoading    <-- 组件外获取 mutate 可变派生函数的运行状态
//    useMutateLoading    <-- 组件内使用 mutate 可变派生函数运行状态的钩子
//    getActionLoading    <-- 组件外获取 action 动作函数的运行状态
//    useActionLoading    <-- 组件内使用 action 动作函数运行状态的钩子
//    sync                <-- 当前状态的多层级路径值的自动同步函数，通常用于表单双向绑定
//    syncer              <-- 当前状态的单层级路径值的自动同步函数，通常用于表单双向绑定
```

除`atom`之外，还提供一个功能完全相同的`shareAtom`接口，和`atom`的不同之处在于：`atom`返回元组，`shareAtom`返回字典

```ts
import { atom, shareAtom } from 'helux';

const [numAtom, setAtom, atomCtx] = atom(1);
const atomCtx = shareAtom(1); // 返回对象就是元组结果的第三位值
```

## share

通过 `share` 接口创建全局共享状态，share 必须传入 普通 json 对象，返回一个只可读的代理对象，是一个全局可使用的稳定引用，可总是读取到最新值。

```ts
import { share } from 'helux';

const [sharedNum] = share({ num: 1 }); // { num: 1 }
```

## atom

如需共享原始值类型的值，可通过 `atom` 接口创建全局共享状态，atom 支持传入所有类型的值，返回一个代理对象，返回结果被自动装箱为 `{ val: T }` 结构，，也是一个全局可使用的稳定引用，可总是读取到最新值，但需要多做一次`.val`取值操作

```ts
import { atom } from 'helux';

const [numAtom] = atom(1); // { va: 1 }
console.log(numAtom.val); // print: 1
```

:::tip

优先考虑 share 共享对象由于`share`接口没有装箱`{val: T}` 的操作，当共享对象为 `object` 时，可优先使用`share`来共享对象，避免一些无自动拆箱的场景多做一次`.val`取值操作

:::

## 创建共享对象

### atom

`atom`支持包括原始类型在内的所有类型，但会被装箱为`{ val: any }` 结构，直接读取时需要取`.val`做拆箱操作

```ts
import { atom } from 'helux';

const [numAtom] = atom(1);
const [objAtom] = atom({ info: { born: 2023 } });
console.log(numAtom); // numAtom: { val: 1 }
console.log(objAtom); // objAtom: { val: {info: { born: 2023 }} }
```

### share

`share`支持对象类型，因本身是对象，无装箱行为，可以直接读取目标任意节点值

```ts
import { share } from 'helux';

const [sharedObj] = share({ info: { born: 2023 } });
console.log(sharedObj); // sharedObj: {info: { born: 2023 }}
```

:::tip share 优先

优先考虑 share 共享对象由于`share`接口没有装箱`{val: T}` 的操作，当共享对象为 `object` 时，可优先使用`share`来共享对象，避免一些无自动拆箱的场景多做一次`.val`取值操作

:::

## 使用共享对象

### hook

基于`useShared`或`useAtom`钩子函数在组件内使用共享对象，会实时收集到[数据依赖](/helux/docs/api/quick-start/glossary#组件渲染依赖收集)，数据变更后自动通知组件重渲染

```tsx
import { useAtom, useShared } from 'helux';

function Demo() {
  const [state] = useShared(sharedState);
  return <h1>hello helux shared {state.info.born}</h1>;
}

function Demo2() {
  const [num] = useAtom(numAtom); // useAtom 返回结果已对 numAtom 自动拆箱
  return <h1>hello helux shared {num}</h1>;
}
```

:::tip useAtom 自动拆箱

useAtom 会自动做 .val 拆箱操作，用户在组件里无需再次拆箱

:::

:::danger useAtom 和 useShared 不可混用

不可将 atom 对象传给 useShared，不可将 shared 对象传给 useAtom，否则会引起运行时报错

:::

### signal

`signal`响应机制允许用户跳过`useAtom`和`useShared`直接将数据绑定到视图，更多使用方式可查看[signal 章节](/helux/docs/api/signal)。

#### $绑定

使用`$`符号绑定单个原始值

```tsx
import { $ } from 'helux';

// 数据变更仅触发 $符号区域内重渲染
<h1>{$(numAtom)}</h1> // 包含原始值的atom可安全绑定
<h1>{$(shared.b.b1)}</h1>// 对象型需自己取到原始值绑定
```

原始值 atom 拆箱以否均能正常绑定

```tsx
<h1>{$(numAtom)}</h1> // ✅ ok
<h1>{$(numAtom.val)}</h1> // ✅ ok
```

#### block 绑定

使用`block`创建局部响应块

```tsx
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

```tsx
const UserBlock = block(() => (
  <div>
    name: {user.name}
    price: <h1>{$(numAtom)}</h1>
  </div>
));
```

#### 错误的绑定方式

因`jsx`花括号内部本身也是不支持绑定对象的，如果`$()`传入对象将报错

```tsx
// 需注意：绑定对象将报错
<h1>{objAtom}</h1> // ❌ jsx 不支持绑定对象
<h1>{$(objAtom)}</h1> // ❌ signal 不支持绑定对象
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
const [shared, setShared] = atom({ info: { name: 'helux', age: 1 }, desc: 'awesome lib' });

// 这是一个组件外部的函数，可全局任意地方使用
function changName(name) {
  // 回调里基于草稿修改，修改结束后，生成一份新的具有结构共享特性的状态
  setShared((draft) => {
    draft.info.name = name;
  });
}
```

浅层次修改，可在回调里**返回部分对象**或直接传入**部分对象**

```ts
// 以下两句运行结束后，内部均会转变为 draft.desc = 'new desc' 赋值
setShared(() => ({ desc: 'new desc' })); // 回调返回
setShared({ desc: 'new desc' }); // 直接传入
```

支持对`draft`修改，同时也返回部分状态的修改方式

```ts
// 以下调用结束后，内部会分析到有返回值并自动补上 draft.desc = 'new desc' 操作
setShared((draft) => {
  draft.info.name = 'new name'; // 深层次对象基于draft
  return { desc: 'new desc' }; // 返回部分状态
});
```

特别注意，总是保持对最小目标做数据修改可让`helux`缩小渲染范围，如非必须不用替换整个对象

```tsx
// 💢 此修改是重新生成整个 info 对象，会造成以下两个组件都重渲染（尽管 age 没有发生变化 ）
setShared((draft) => {
  draft.info = { ...draft.info, name: 'new name' };
});

function Name() {
  const [state] = useShared(shared);
  return <h1>{state.info.name}</h1>;
}

function Age() {
  const [state] = useShared(shared);
  return <h1>{state.info.age}</h1>;
}
```

#### atom 修改

修改`atom`返回的共享原始值

```ts
const [numAtom, setAtom] = atom(1);

// 回调里基于草稿修改
setAtom((draft) => {
  draft.val = Math.random();
});
// 直接传入最新值修改
setAtom(Math.random());
```

修改`atom`返回的共享对象

```ts
const [dictAtom, setDictAtom] = atom({ desc: 'helux atom', info: { born: 2023 } });
// 回调里基于草稿修改
setDictAtom((draft) => {
  draft.val.info.born = 2022;
});
```

`setShared`里可以返回部分新状态，但`setAtom`如果要返回则必须是整个全新对象，因为内部会对`setAtom`返回结果做装箱操作

```ts
// 返回新的原始数值，返回结果会自动装箱为 { val: 1 }
setAtom(() => 1);
// 等效于以下两种写法
setAtom(1);
setAtom((draft) => (draft.val = 1));

// 返回新的对象，确保是完整的新对象
setAtom((draft) => {
  const val = { ...draft.val };
  val.desc = 'new desc';
  return val;
});
// 上诉写法仅为了演示必须返回完整状态，更好的替代写法应是
setAtom((draft) => {
  draft.desc = 'new desc';
});
```

:::tip setAtom 回调 draft 未拆箱

`setAtom` 内部未对 `draft` 做类似 `setAtom(draftVal => { draftVal.info.born = 2022 })` 的拆箱操作，即回调参数直接给 `draft.val` 的值

> 主要是考虑到需要对原始值 atom 赋值 `undefined` 的场景，  
> 基于 `draft.val` 方便且没有歧义：`setAtom(draft => { draft.val = undefined })`;

:::

### action

使用`action`工厂函数接口创建修改共享对象的方法，更多使用方式可查看[action 章节](/helux/docs/api/action)。

#### 同步 action

```ts
const normalAction = atomAction(numAtom)(({ setState, args, draft }) => {
  const val = args[0] && Number.isInteger(args[0]) ? args[0] : random();
  draft.val = val; // 可直接修改 draft
}, 'normalAction');
normalAction(1); // 参数将透传给 args
```

#### 异步 action

```ts
const asyncAction = atomActionAsync(numAtom)(async ({ setState, args }) => {
  await delay(2000);
  const val = args[0] && Number.isInteger(args[0]) ? args[0] : random();
  setState((draft) => (draft.val = val)); // 异步函数里必须使用 setState 同步修改状态
}, 'asyncAction');
```

### mutate

配置 `mutate` 可观察自身或者其他共享状态的 a 节点变化来自动引起当前共享状态的 b 节点变化，更多使用方式可查看[mutate 章节](/helux/docs/api/mutate)。

#### 同步 mutate

```ts
const [share1] = share({ desc: 'helux atom', info: { born: 2023 } });
const [share2] = share(
  { suffixedDesc: '' },
  {
    mutate: {
      // share1.desc 变化时自动触发 share2.suffixedDesc 计算
      suffixedDesc: (draft) => {
        draft.suffixedDesc = `${share1.desc}_${Date.now()}`;
      },
    },
  },
);
```

#### 异步 mutate

异步 mutate 需要通过`deps`函数显式定义依赖

```ts
const [share1] = share({ desc: 'helux atom', info: { born: 2023 } });
const [share2] = share(
  { suffixedDesc: '' },
  {
    mutate: {
      // share1.desc 变化时自动触发 share2.suffixedDesc 计算
      suffixedDesc: {
        // 定义依赖项
        deps: () => [share1.desc],
        // 异步计算任务
        task: async ({ setState }) => {
          await delay(1000);
          setState((draft) => {
            draft.suffixedDesc = `${share1.desc}_${Date.now()}`;
          });
        },
      },
    },
  },
);
```
