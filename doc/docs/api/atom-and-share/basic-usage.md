---
sidebar_position: 1
---

# 基本用法

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
import { block } from 'helux';

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

注意，helux 总是会对所有使用方比较新旧值确定是否要重运行相关依赖函数（包含派生函数、渲染函数），如非必须不用替换整个对象，总是保持对最小目标做数据修改可缩小依赖函数运行范围。

```tsx
const [shared, setShared] = share({ info: { name: 'helux', age: 1 }, desc: 'awesome lib' });

// 💢 此修改是重新生成整个 info 对象，但仅会造成 Info 重新渲染
setShared((draft) => {
  draft.info = { ...draft.info, name: 'new name' };
});

// 💢 触发执行，因为 info 引用已变化
function Info() {
  const [state] = useShared(shared);
  console.log(state.info);
  return <h1>just read info</h1>;
}

// ✅ 不被执行
watch(() => {
  console.log('name changed');
}, [shared.info.name]);
// ✅ 不被执行
const nameResult = deriveAtom(() => `prefix:${shared.info.name}`);
// ✅ 不被执行
function Name() {
  const [state] = useShared(shared);
  return <h1>{state.info.name}</h1>;
}
// ✅ 不被执行
function Age() {
  const [state] = useShared(shared);
  return <h1>{state.info.age}</h1>;
}
```

#### atom 修改

修改`atom`共享原始值，返回结果均会被自动装箱为 `{ val: T }`

```ts
const [numAtom, setAtom] = atom(1);

// 回调里返回最新值
setAtom(() => Math.random());
// 回调里基于草稿修改，回调里已对atom拆箱，因atom是原始值，此刻的草稿也是原始值
setAtom((draft) => draft + Math.random());
// 直接传入最新值修改
setAtom(Math.random());
```

修改`atom`共享原始值为 `undefined`

> 内部默认忽略 setAtom 返回的有歧义的 undefined 值，如需设置 undefined 值，可使用 `setAtomVal` 或 `currentDraftRoot`

```ts
import { setAtomVal, currentDraftRoot } from 'helux';

setAtom(() => setAtomVal(undefind));
setAtom(() => (currentDraftRoot().val = undefind));
```

修改`atom`字典型共享对象

- 深层次修改

```ts
const [dictAtom, setDictAtom] = atom({ desc: 'helux atom', info: { born: 2023 } });
// 回调里基于草稿修改
setDictAtom((draft) => {
  draft.info.born = 2022;
});
```

- 浅层次修改

```ts
const [dictAtom, setDictAtom] = atom({ desc: 'helux atom', info: { born: 2023 } });
// 回调里基于草稿修改
setDictAtom((draft) => {
  draft.desc = 'helux atom';
});

// 也可返回部分状态，和上面写法等效
setDictAtom(() => ({ desc: 'helux atom' }));
```

- 混合修改

既基于草稿修改，也返回部分状态

```ts
// 内部会自动将返回的部分字典补到草稿上 draft.desc = 'helux atom';
setDictAtom((draft) => {
  draft.info.born = 2022;
  return { desc: 'helux atom' };
});
```

修改`atom`非字典型共享对象，通常指`Array`、`Map`、`Set` 数据结构

- 修改部分节点

```ts
const [listAtom, setListAtom] = atom([{ name: 1 }, { name: 2 }]);

// 返回的对象为字典对象，可以是部分对象
setListAtom((draft) => (draft[1].name = 3));
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

配置 `mutate` **可变派生函数**可观察自身或者其他共享状态的 a 节点变化来自动引起当前共享状态的 b 节点变化，更多使用方式可查看[mutate 章节](/helux/docs/api/mutate)。

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

`mutate`函数是基于数据变化自动驱动的，也支持人工重运行

```ts
import { runMutate } from 'helux';

// 重运行 share2 的 suffixedDesc 可变派生函数
const snap = runMutate(share2, 'suffixedDesc');
```

#### 异步 mutate

异步 mutate 需要通过`deps`函数显式定义依赖，更多使用方式可查看[sync 章节](/helux/docs/api/sync)。

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

异步可变派生函数也支持人工重运行

```ts
import { runMutateTask } from 'helux';

// 重运行 share2 的 suffixedDesc 可变派生异步函数
const snap = runMutateTask(share2, 'suffixedDesc');
```

### sync

基于 `sync` 工厂函数生成获取具体的数据同步器来直接修改表单数据，达到**双向绑定**的效果！

```ts
import { share, syncer, sync } from 'helux';

const [sharedState, , ctx] = share({ a: 1 });

// 基于顶层 api 创建 syncer
const mySyncer = syncer(sharedState);
const mySync = sync(sharedState);

// 或者基于共享上下文导出当前共享状态的 syncer sync
const { syncer: mySyncer, sync: mySync } = ctx;
```

#### 一层路径

提供 `syncer` 或 `sync` 生成数据同步函数

```tsx
function Demo() {
  const [shared] = useShared(sharedState);
  return <input value={shared.a} onChange={mySyncer.a} />;
  // or
  return <input value={shared.a} onChange={mySync((to) => to.a)} />;
}
```

#### 多层路径

使用 `sync` 生成数据同步函数

```tsx
function Demo() {
  const [shared] = useShared(sharedState);
  return <input value={shared.b.c.d} onChange={mySync((to) => to.a.b.d)} />;
}
```

:::tip 自动提取 event 值

sync 生成的函数会自动尝试提取 event 值，如果不是 event 对象，则继续透传原始值，可放心使用 sync 绑定任意 ui 框架组件

:::
