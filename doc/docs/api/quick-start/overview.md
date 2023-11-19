---
sidebar_position: 0
---

# 特性一览

helux 是一个集`atom`、`signal`、`依赖收集`为一体的 react 状态库，相比`recoil`和`jotai`，它拥有以下优势

- 基于最快的不可变 js 库[limu](https://github.com/tnfe/limu)开发，拥有超强性能
- atom 支持依赖收集，意味着 atom 不用拆分的很细，atom 就可以等同于 model，天然对 `DDD` 领域驱动设计友好
- 内置 signal 响应机制，可直接将共享对象的值交给 signal 或 block 视图与数据关系的绑定，实现 0 hook 编码，实现 dom 粒度的更新
- 内置 loading 模块，可对所有异步任务做运行状态、错误捕捉做管理
- 支持可变派生，当共享对象 a 的发生变化后需要自动引起共享状态 b 的某些节点变化时，可定义 mutate 函数来完成这种变化的连锁反应关系，对数据做最小粒度的更新
- 支持全量派生，不需要对数据做细粒度更新时使用全量派生更合适
- 全量派生、可变派生均支持异步任务
- 全量派生、可变派生处数据变更驱动执行外，还支持人工重新触发运行
- 内置事件系统
- 支持中间件、插件系统，可无缝对接 redux 生态相关工具库
- 100% ts 编码，类型提示优化

## 状态定义

### share

通过 `share` 接口创建全局共享状态，share 必须传入 普通 json 对象，返回一个只可读的代理对象，是一个全局可使用的稳定引用，可总是读取到最新值。

```ts
import { share } from 'helux';

const [sharedNum] = share({ num: 1 }); // { num: 1 }
```

### atom

如需共享原始值类型的值，可通过 `atom` 接口创建全局共享状态，atom 支持传入所有类型的值，返回一个代理对象，返回结果被自动装箱为 `{ val: T }` 结构，，也是一个全局可使用的稳定引用，可总是读取到最新值，但需要多做一次`.val`取值操作

```ts
import { atom } from 'helux';

const [numAtom] = atom(1); // { va: 1 }
console.log(numAtom.val); // print: 1
```

:::tip

优先考虑 share 共享对象由于`share`接口没有装箱`{val: T}` 的操作，当共享对象为 `object` 时，可优先使用`share`来共享对象，避免一些无自动拆箱的场景多做一次`.val`取值操作

:::

### 模块化标签

`helux` 允许用户按自己代码组织习惯存放状态，当需要中心化管理管理状态时，配置 `moduleName` 名称即可，方便后期接入开发插件按模块分类查看各个状态。

```ts
const [sharedNum] = share({ num: 1 }, { moduleName: 'A' });
const [numAtom] = atom(1, { moduleName: 'B' });
```

:::tip 模块名重复

因 `helux` 维护了一套自增 id 管理各个状态，如果模块名重复，并不会对 `helux` 本身的运行造成任何影响，只会影响状态的快照透传给开发插件时，重复的会被丢弃，查看到的状态树可能有缺失

:::

## 状态使用

`atom` 和 `share` 返回的是一个稳定的代理对象，可全局任意地方使用并总是读取到最新值

### 组件内使用

组件内通过`useAtom`使用`atom`返回的共享对象，从而产生数据变更后重渲染的订阅行为，`useAtom`的返回值会对`atom`做自动拆箱操作

:::tip 自动拆箱

`{ val: T }` 被拆为 `T` 返回

:::

```tsx
function DemoUseAtom() {
  // num 是自动拆箱后返回的值
  const [num] = useAtom(numAtom);
  return <h1>{num}</h1>;
}
```

通过`useShared`使用`share`返回的共享对象

```tsx
function DemoUseShared() {
  const [obj] = useShared(sharedNum);
  return <h1>{obj.num}</h1>;
}
```

除了顶层 hook api + 具体状态对象的方式使用状态，也可以使用返回的上下文对象暴露的钩子，内部自动绑定了对应的状态

```ts
const [shared, setShared, sharedCtx] = share({ num: 1 });
const [numAtom, setAtom, numCtx] = atom(1, { moduleName: 'B' });

sharedCtx.useState();
numCtx.useState();
```

:::tip no provider

`helux` 采用无 `Provider` 模式，用户只需要调用钩子函数`useAtom`、`useShared`即可使用共享状态

:::

### 组件外使用

其他地方使用直接读取返回的代理对象即可，可总是获取到最新值

```ts
setTimeout(() => {
  console.log(numAtom.val); // 注意 atom 对象这里需要自己调用 .val 拆箱来读到原始值
  console.log(numShared.num);
}, 1000);
```

## signal

`signal`响应机制可以用户逃离`hook`，直接将数据绑定到视图，并建立起视图对数据变化的依赖关系，让 react 的渲染粒度从**组件粒度**降低到**dom 粒度**，极致的缩小视图渲染范围，大幅提高应用整体渲染性能！

### signal 响应

使用`signal`接口绑定 atom 对象原始值到视图，原始值变化时，可直接让绑定部分产生响应并重渲染

```tsx
// $ 是 signal 接口的缩写，方便视图绑定数据时更方便
import { $, atom, signal } from 'helux';

const [numAtom] = atom(1);

// numAtom 变化时，仅渲染<h1>标签内部的那一部分
function Demo() {
  return (
    <div>
      <div>... very very long staic content</div>
      <h1>{$(numAtom)}</h1>
      <h1>{signal(numAtom)}</h1>
    </div>
  );
}
```

使用`signal`接口绑定 shared 对象原始值到视图

```tsx
const [ sharedObj ] = share({a:{a1:1}})
// 绑定到视图里
<h1>{$(sharedObj.a.a1)}</h1>
```

:::caution 仅支持响应原始值

jsx 插入 object 对象本身也是不允许的，例如 `<div>{obj}</div>` 会引起报错，所以 signal 接口`<div>{$(obj)}</div>`同样也会报错

:::

:::tip signal 自动拆箱

atom 如 atom 对象包裹是原始值，将原始值或 atom 对象传给 signal 接口均能做出响应，`<div>{atom}</div>`和`<div>{atom.val}</div>`是等效的

:::

### block 响应

需要同时响应一个状态或多个状态的多个值时，可以使用`block`接口创建一个块组件，该组件自动对渲染函数里用到的值建立起依赖追踪关系

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

block 渲染函数里可以绑定 signal 原始值响应，拆分出更细的渲染粒度

```tsx
// user.name 变化时渲染整理 UserBlock 组件，numAtom 变化时仅渲染插值部分节点
const UserBlock = block(() => (
  <div>
    name: {user.name}
    other num: {$(numAtom)}
  </div>
));
```

## 状态修改

### 浅层次修改

使用`useAtom`返回的修改句柄去修改

```ts
function Demo() {
  const [num, setAtom] = useAtom(numAtom);
  return <button onClick={() => setAtom(num + 1)}>{num}</button>;
}
```

使用`atom`返回的修改句柄去修改，此时可将修改函数定义外定义到组件外部

```ts
const [numAtom, setAtom] = atom(1);
function change() {
  setAtom(numAtom.val + 1);
}
function Demo() {
  const [num] = useAtom(numAtom);
  return <button onClick={setAtom}>{num}</button>;
}
```

### 深层次修改

当对`atom`或`share`返回的对象修改时，可使用**可变数据**做修改

:::tip 可变数据

可变数据基于**最快的**不可变数据 js 库[limu](https://github.com/tnfe/limu)生成，修改结束后，会生成一份具有结构共享特性的新状态

:::

```ts
const [numAtom, setAtom] = atom({ num: 1 }); // { va: { num: 1 } }
const [numState, setState] = share({ num: 1 }); // { num: 1 }

// 基于可变数据修改生成新状态
setAtom((draft) => {
  draft.val.num += 1;
});
setState((draft) => {
  draft.num += 1;
});
```

:::tip setAtom 回调里 draft 未拆箱

为何 `setAtom` 内部未对 `draft` 做拆箱操作呢，形如：`setAtom(draft => { draft.num += 1 })`

> 主要是考虑到需要对原始值 atom 赋值 `undefined` 的场景，  
> 基于 `draft.val` 方便且没有歧义：`setAtom(draft => { draft.val = undefined })`;

:::

### 定义 action 修改

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

定义有业务含义的同步 action 并约束入参类型

```ts
const normalAction = atomAction(numAtom)<[number, string]>(({ setState, args, draft }) => {
  const val = args[0] && Number.isInteger(args[0]) ? args[0] : random();
  draft.val = val; // 可直接修改 draft
}, 'normalAction');
normalAction(1, 1); // ❌ 第二位参数将提示：类型“number”的参数不能赋给类型“string”的参数
```

定义有业务含义的异步 action 并约束入参类型

```ts
const asyncAction = atomActionAsync(numAtom)<[number, string]>(async ({ setState, args }) => {
  await delay(2000);
  const val = args[0] && Number.isInteger(args[0]) ? args[0] : random();
  setState((draft) => (draft.val = val)); // 异步函数里必须使用 setState 同步修改状态
}, 'asyncAction');
```

### 使用 sync&syncer 修改

`syncer` 和 `sync` 可从对象上下文获取，内部自动完成了使用对象的绑定，只有一层 json path 的对象，可以基于 `syncer` 对象获取具体的数据同步器来直接修改表单数据，达到**双向绑定**的效果！

```tsx
const [numState, setState, { syncer }] = share({ a: 1, b: { b1: 1 } });

<input value={state.a} onChange={syncer.a} />;
```

`syncer`会自动分享是否是事件对象，是就提取值不是就直接传值，所以也可以很方便的绑定 ui 组件库

```tsx
<Select value={ctx.syncer.a} />
```

有多层级 json path 的对象，或需要对提交草稿做二次修改的情况，可基于 `sync` 函数去操作

```tsx
// 数据自动同步到 to.b.b1 下，
<Select onChange={ctx.sync(to=> to.b.b1)} value={to.b.b1} />

// 对提交作拦截操作
<Select
  onChange={ctx.sync(to=> to.b.b1, (val, draft)=> { to.b.b1.time = `${b}_${Date.now()}` } )}
  value={to.b.b1}
/>
```

:::tip 同步函数自动缓存

多次对同一个路径调用返回的同步函数，指向的是同一个：  
`ctx.sync(to=> to.b.b1) === ctx.sync(to=> to.b.b1)`

:::

## watch 监听

`helux`在内部为实现更智能的自动观察变化做了大量优化工作，同时也暴露了相关接口支持用户在一些特殊场景做人工的观察变化。

### 组件外观察变化

观察函数立即执行，收集到相关依赖

```ts
import  share, watch, getPrevSnap } from 'helux';

const [priceState, setPrice] = share({ a: 1 });

watch(() => {
  // 首次执行日志如下
  // price change from 1 to 1
  //
  // 反复调用 changePrice，日志变化如下
  // price change from 1 to 101
  // price change from 101 to 201
  console.log(`price change from ${getPrevSnap(priceState).a} to ${priceState.a}`);
}, { immediate: true });

const changePrice = ()=>setPrice(draft => { draft.a += 100 });
```

观察函数不立即执行，通过 deps 函数定义需要观察的数据，观察的粒度可以任意定制

```ts
const [priceState, setPrice] = share({ a: 1 });
const [numAtom, setNum] = atom(3000);

//
watch(
  () => {
    console.log(`found price.a changed: () => [priceState.a]`);
  },
  () => [priceState.a],
); // 或写为 { deps: () => [priceState.a]  }

// 观察整个 priceState 的变化
watch(
  () => {
    console.log(`found price changed: [ priceState ]`);
  },
  () => [priceState],
);

// 观察整个 priceState 和 numAtom 的变化
watch(
  () => {
    console.log(`found price or numAtom changed: ()=>[ priceState, numAtom ]`);
  },
  () => [priceState, numAtom],
);
```

即设置依赖函数也设置立即执行，此时的依赖由 `deps` 和 `watch` 共同收集到并合并而得。

```ts
watch(
  () => {
    const { a } = priceState;
    console.log(`found one of them changed: [ priceState.a, numAtom ]`);
  },
  { deps: () => [numAtom], immediate: true },
);
```

### 组件内观察变化

提供`useWatch`让客户在组件内部观察变化，预备有以下两个特性

- 组件销毁自动取消观察行为

```ts
import { useWatch } from 'helux';

function Comp(props: any) {
  // watch 回调随组件销毁会自动取消监听
  useWatch(
    () => {
      console.log('priceState.a changed');
    },
    () => [priceState.a],
  );
}
```

- 无闭包陷阱，总能感知闭包外的最新值

```tsx
function Comp(props: any) {
  const [obj, setObj] = useObject({ num: 1 });
  useWatch(
    () => {
      console.log('sharedState.a changed, here can read the latest num', obj.num);
    },
    () => [sharedState.a],
  );

  return (
    <MarkUpdate>
      <button onClick={() => setObj({ num: random() })}>change local num</button>
      <div> num is {obj.num}</div>
      shared.xxx {$(sharedState.a)}
    </MarkUpdate>
  );
}
```

## 依赖收集

`helux`对共享对象实现了依赖收集功能，可做到更精准的重渲染，上文里提到`signal`和`block`内部实现本身也依赖到了此功能

### 普通对象

组件在渲染函数里读取对象时的具体值时，就收集到了数据依赖

```tsx
const [obj, setState] = share({ a: 1, b: { b1: 2 }, c: 100 });

function change() {
  // 基于草稿修改，回调执行结束后，内部会生成一份结构共享特性的新状态
  // 当前修改只会引起下面的 Comp2 组件实例重渲染
  setState((draft) => (draft.b.b1 = Math.random()));
}

function Comp1() {
  const [obj] = userShared(objAtom);
  // 当前组件仅对 obj.a 有依赖
  return <h1>obj.a {obj.a} </h1>;
}

function Comp2() {
  const [obj] = userShared(objAtom);
  // 当前组件仅对 obj.b.b1 有依赖
  return <h1>obj.b.b1 {obj.b.b1} </h1>;
}
```

### 数组对象

对于数组结构的数据，默认只追踪到下标位置，可配合工具函数`shallowCompare`做精准渲染

```tsx
import { atom, shallowCompare, useAtom } from 'helux';
// 因 share 直接受 object 数据，此处刻意用 atom
const [listAtom, setAtom] = atom([
  { id: 1, name: 11 },
  { id: 2, name: 22 },
]);

function change(idx: number) {
  // 当前修改仅会引起 List 和 Item1 重渲染
  setAtom((draft) => {
    draft.val[idx].name = Date.now();
  });
}

const Item = React.memo((props) => {
  const { item } = props;
  return (
    <div>
      id: {item.id} name: {item.name}
    </div>
  );
  // 透传 shallowCompare 函数，用于比较item代理对象前后是否一致，内部会比较数据版本号
}, shallowCompare);

function List() {
  const [list] = useAtom(listAtom);
  return (
    <div>
      <button onClick={() => change(1)}>change idx 1</button>
      <div>
        {list.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

### 动态依赖收集

`helux`默认对组件开启动态的依赖收集行为，可实时收集到组件实例的每一轮渲染所需依赖，做到更智能的精确更新

```tsx
const [obj, setState] = share({ a: 1, b: { b1: 2 }, c: 100 });

function Comp1() {
  const [obj] = userShared(objAtom);
  // 在 obj.a>10 时，当前组件依赖时 obj.a，obj.b.b1
  // 反之则是 obj.a，obj.c
  return <h1>dynamic dep colletion {obj.a > 10 ? obj.b.b1 : obj.c} </h1>;
}
```

如不需要，可设置为仅首轮渲染需要收集依赖，进一步提高渲染性能

```ts
import { WAY } from 'helux';

useShared(numAtom, { way: WAY.FIRST_RENDER });
```

### 自定义收集规则

默认情况下，对象的依赖收集的深度值为`6`，在不操过深度值的情况下，针对数组只收集到下标位置，可通过配置依赖收集规则来改变默认的收集策略

- `stopDepth` 控制依赖收集深度，默认`6`
- `stopArrDep` 控制数组是否只收集到下标位置，默认 `true`

```ts
const [state, setState, ctx] = share(
  {
    a: {
      b: {
        list: [
          { name: 1, age: 2, info: { street: 'u_road' } },
          { name: 2, age: 22, info: { street: 'u_road_2' } },
        ],
      },
    },
    a1: { a2: { a3: { a4: { a5: { a6: { a7: { a8: 1 } } } } } } },
  },
  {
    stopDepth: 12, // 改为 12
    stopArrDep: false, // 对象里的所有数组都继续向下收集（即关闭只收集到下标位置规则）
  },
);
```

可针对状态某些节点设置收集规则

```ts
const [state, setState, ctx] = share({ ... }, {
  rules: [
    // 当读取或写入 a.b.list 数据时，停止依赖收集，即依赖只记录到下标，此设定优先级高于顶层的 stopArrDep
    { when: state => state.a.b.list, stopDep: true },
  ],
  stopArrDep: false, // 对象里的所有数组都继续向下收集（即关闭只收集到下标位置规则）
});
```

## 可变派生

由于 `atom` 和 `share` 返回的对象天生自带依赖追踪特性，当共享对象 a 的发生变化后需要自动引起共享状态 b 的某些节点变化时，可定义 `mutate` 函数来完成这种变化的连锁反应关系，对数据做最小粒度的更新

### 单变化函数

只修改共享状态的单个值时，定义一个 `mutate` 函数即可

```ts
const [numAtom] = atom(3000);

const [finalPriceState] = share(
  { finalPrice: 0, otherInfo: { desc: 'other' } },
  {
    // 当 numAtom 变化时，重计算 finalPrice 节点的值
    mutate: (draft) => (draft.finalPrice = numAtom.val - 600),
  },
);
```

### 多变化函数

需要响应多个不同上游状态的值变化，计算多个节点新值时，定义 `mutate` 为对象即可

```tsx
const [priceState] = share({ base1: 1, base2: { forStudent: 1, forTeacher: 2 } });
const [finalPriceState] = share(
  // 这里仅负责定义初始值，变化规则见 options.mutate 定义
  { final1: 0, final2: { student: 0, teacher: 0 } },
  {
    // 定义 mutate 配置，完成相关的数据变化监听和修改函数定义，名字可按场景定义，方便配合 devtool 工具做变化追踪
    mutate: {
      // 仅当 priceState 的 base1 变化时，计算 finalAtom 的 final1 值
      changeFinal1: (draft) => (draft.final1 = priceState.base1 + 20),
      // 仅当 priceState 的 base2.forStudent 变化时，计算 finalAtom 的 final2.student 值
      changeFinal2: (draft) => (draft.final2.student = priceState.base2.forStudent + 100),
    },
  },
);

function Demo() {
  const [final] = useAtom(finalPriceState);
  // 当 priceState 的 base1 变化后，会此处重渲染
  return <h1>final.final2.student {final.final2.student}</h1>;
}
```

也可定义 `mutate` 为数组

```ts
{
  mutate: [
    { desc: 'changeFinal1', fn: (draft) => (draft.final1 = priceState.base1 + 20) },
    { desc: 'changeFinal2', fn: (draft) => (draft.final2.student = priceState.base2.forStudent + 100) },
  ];
}
```

### 异步派生函数

如存在异步的计算场景，对 `mutate` 函数新增 `task` 异步计算函数配置即可。

- 首次计算结果不需要异步任务才能得出时，依赖可在 fn 里确定

```ts
const [finalPriceState] = share(
  { retA: 0, time: 0 },
  {
    mutate: {
      retA: {
        // 计算出 retA 值并写入
        fn: (draft, [a, b]) => (draft.retA = priceState.a + numAtom.val),
        task: async ({ setState }) => {
          // 默认首次不执行
          await delay(1000);
          // some async logic here ...
          setState((draft) => {
            draft.retA = priceState.a + numAtom.val;
          });
        },
      },
    },
  },
);
```

- 首次计算结果需要异步任务才能得出时，依赖可在 deps 里确定

```ts
const [finalPriceState] = share({ retA: 0, time: 0 }, {
  mutate: {
    retA: {
      // 定义好上游数据依赖
      deps: [priceState.a , numAtom.val],
      task: async ({ setState }) => { ... },
      // 触发task立即执行，默认情况 task 首次不执行
      immediate: true,
    },
  },
});
```

- deps、fn 、task 可同时定义，存在有 task 的情况下， fn 只会首次执行一次，task 要不要执行取决于 immediate 值

```ts
const [finalPriceState] = share({ retA: 0, time: 0 }, {
  mutate: {
    retA: {
      // 定义好上游数据依赖
      deps: [priceState.a , numAtom.val],
      // 这里通过第二位参数 input 可拿到 deps 的返回值并复用
      fn: (draft, [a, b]) => draft.retA = a + b,
      task: async ({ setState }) => { ... },
      immediate: true,
    },
  },
});
```

`mutate`的异步派生函数也可写为数组，数组里可同时包含同步计算函数、异步计算函数。

```ts
const [finalPriceState] = share({ retA: 0, time: 0 }, {
  mutate: [ { fn, desc, task, immediate }, ... ]
});
```

### 外部定义可变派生

上述例子都是在定义`share`或`atom`共享对象时同时定义的可变派生函数，也可先定义共享对象，再通过顶层 api `mutate` 或共享对象上下文 api `mutate` 对共享对象定义**可变派生**

- 通过顶层 api 定义**可变派生**

```ts
import { atomMutate, atom, share, mutate } from 'helux';

const [baseAtom] = atom(1);
const [numAtom] = atom(3000);
const [obj] = share({ a: 1 });

// 为 atom 对象创建 mutate 函数
atomMutate(numAtom)({
  fn: (draft) => (draft.val = baseAtom.val + 100),
  desc: 'mutateNumAtomVal',
});

// 为 shared 对象创建 mutate 函数
mutate(obj)({
  fn: (draft) => (draft.a = baseAtom.val + 100),
  desc: 'mutateObjVal',
});
```

- 通过共享对象上下文 api 定义**可变派生**

```ts
const [numAtom, , numCtx] = atom(3000); // 返回元组为 [ atom, setAtom, ctx ]
const [obj, , objCtx] = share({ a: 1 }); // 返回元组为 [ shared, setState, ctx ]

// 传入的参数一样，相比顶层 api，少了一次共享对象的绑定
// before: mutate(sharedState)(fnItem)
// after:  ctx.mutate(fnItem)
ctx.mutate({ ... });
objCtx.mutate({ ... });
```

### 人工触发重运行

`mutate`函数默认运行时机是基于监听的数据变更后被触发运行的，也支持人工调用的方式主动触发重运行

- 触发`options.mutate`里的可变派生函数重运行

```ts
import { runInnerMutate, runInnerMutateTask } from 'helux';

// 触发 someState 的 retA mutate 配置的同步函数
runInnerMutate(someState, 'retA');

// 触发 someState 的 retA mutate 配置的异步函数
runInnerMutateTask(someState, 'retA');
```

- 触发外部定义的可变派生函数重运行

```ts
import { runMutate, runInnerMutateTask } from 'helux';

// 触发 someState 的外部 mutate 配置的 retA 同步函数，如存在才会执行
runMutate(someState, 'retA');

// 触发 someState 的外部 mutate 配置的 retA 异步函数，如存在才会执行
runMutateTask(someState, 'retA');
```

也可以基于 `mutate`接口返回的对象触发重运行

```ts
const witness = mutate(idealPriceState)(fnItem);

// 呼叫 fnItem 配置的同步函数
witness.call();
// 呼叫 fnItem 配置的异步函数
witness.callTask();
```

## 全量派生

不需要细粒度更新派生数据的场景，使用 `derive` 系列接口即可，该接口接受一个派生函数实现，返回一个全新的派生值对象，该对象是一个只可读的稳定引用，全局使用可总是读取到最新值。

### 同步全量派生

```ts
import { atom, share, derive, driveAtom } from 'helux';

const [numAtom] = atom(5);
const [info] = share({ a: 50, c: { c1: 100, c2: 1000 }, list: [{ name: 'one', age: 1 }] });

// 派生返回对象，派生函数首次运行后，仅在 numAtom.va 或 info.c.c1 发生变化后才会重运行计算出新的 result
const result = derive(() => {
  return { val: numAtom.val + info.c.c1 };
});

// driveAtom 返回原始值，result 会自动装箱为 { val: T }
const result = driveAtom(() => {
  return numAtom.val + info.c.c1;
});
```

### 异步全量派生

支持配置 `task` 异步计算任务来实现异步派生结果

```ts
const [sharedState, setState] = share({ a: 1, b: { b1: { b2: 200 } } });

const result = deriveAsync({
  // 定义依赖项
  deps: () => [sharedState.a, sharedState.b.b1.b2] as const,
  // 定义初始值计算函数
  fn: ({ input: [a, b2] }) => ({ val: a + b2 }),
  // 定义异步计算任务，默认首次不执行，可设置 immediate 触发首次执行
  task: async ({ input: [a, b2] }) => {
    await delay(1000);
    return { val: a + b2 + 1 };
  },
  // immediate: true,
});

// 可使用 deriveAtomAsync 定义异步计算任务并返回原始值
// const resultAtom = deriveAtomAsync();
```

派生结果是支持复用，形成派生链

```ts
// 以下为伪代码
const result1 = derive(...);
const result2 = driveAtom(...);
const result3 = deriveAsync(...);

const result4 = derive(()=>{
  return { num: result.a + 1, plus: result2.val + 100, final: result3.num + 100 };
});
```

### 组件使用全量派生结果

组件内部使用`useDerived`钩子函数使用`derive`派生结果

```tsx
const result1 = derive(...);

function Demo(){
  const [ result ] = useDerived(result1);
}
```

使用`useDerivedAtom`钩子函数使用`driveAtom`派生结果

```tsx
const resultAtom = driveAtom(...);

function Demo(){
  // reulst 会被自动从 { val: T } 拆箱为 T
  const [ result ] = useDerivedAtom(resultAtom);
}
```

### 人工触发重运行

派生函数除了观察到数据依赖变化后被触发执行的方式，还可使用 `runDerive` 接口人工触发对应的派生函数

## loading 管理

`helux` 为**异步全量派生**，**异步可变派生**和**异步动作行为**内置了优雅且强大的 `loading` 管理机制，让用户可轻松处理异步流程 3 个关键点

- 是否执行中
- 是否有错
- 是否正常展示

全局统一使用标准 `LoadingStatus` 协议来处理异步任务执行结果并传达给组件使用。

```ts
type LoadingStatus = {
  /** true：正在执行异步任务中 */
  loading: boolean;
  /** err 存在表示有错误发生 */
  err: Error | null;
  /** ok 为 true 表示可正常展示内容，ok=(!loading && !err) */
  ok: boolean;
};
```

`helux`还对`loading`做了安全读取优化，用户传入任意字符串均均返回 status 对象，对应对于不存在的 key，返回的 status 是不变的

```ts
const [loading] = useMutateLoading(); // useActionLoading
const ok = loading['whatever-key'].ok; // 对象取值操作是恒安全的
```

### 异步全量派生 loading

使用钩子函数`useDerived`时，如果传入结果对象自身带有异步计算任务或者该对象的计算结果依赖有上游存在有异步计算结果，均可从第二位参数`status`获取到异步状态。

```jsx
const [sharedState, setState] = share({ a: 1, b: { b1: { b2: 200 } } });
const changeA = () => setState(draft => { draft.a = random() });

const result = deriveAsync({
  deps: () => [sharedState.a, sharedState.b.b1.b2] as const,
  fn: () => ({ a: 0, b2: 0 }),
  task: async ({ input: [a, b2] }) => {
    await delay(1000);
    if (a < 80) {
      throw new Error(`a ${a} < 80`);
    }
    return { a: a + 100, b2: b2 + 200 };
  },
});

function Comp() {
  const [data, status] = useDerived(result);
  return (
    <div>
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
      {status.ok && <h1>{data.a}</h1>}
    </div>
  );
}
```

### 异步可变派生 loading

通过`useMutateLoading`读取可变派生异步任务状态，以下两种方式调用皆可

```ts
import { useMutateLoading, share } from 'helux';
const [sharedState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 } } });

// 使用顶层 api 传入目标共享状态，表示要使用目标共享状态的 loading 对象
useMutateLoading(sharedState);
// 使用 share 返回的上下文里提供的 useMutateLoading，内部自动绑定了对应的状态
ctx.useMutateLoading();
```

定义 mutate 函数，读取对应 loading

```tsx
const [sharedState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 } } });

const witness = mutate(sharedState)({
  deps: () => [sharedState.a] as const,
  task: async ({ setState, input }) => {
    await delay(2000);
    setState((draft) => {
      draft.a += input[0] + random();
    });
  },
  desc: 'mutateFn',
});

function Comp() {
  const [state] = ctx.useState();
  const [loading, , info] = ctx.useMutateLoading();
  const status = loading['mutateFn'];

  return (
    <div>
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
      {status.ok && <h1>{state.a}</h1>}
    </div>
  );
}
```

`useMutateLoading` 也能读取伴随状态一起定义的 mutate 函数的 status，且能感知到具体名称的提示

```ts
const [numAtom] = atom(3000);
const [priceState, setPrice] = share({ a: 1, b: 100 }, { moduleName: 'MutateTask' });
const [idealPriceState, , ctx] = share(
  { loading: false, retA: 0, retB: 1 },
  {
    moduleName: 'idealPrice',
    mutate: {
      retB: (draft) => (draft.retB = priceState.b + 2 + numAtom.val),
    },
  },
);

const [loading] = ctx.useMutateLoading();
loading.retB.loading; // 这里IDE将提示出 loading 上 retB 有属性
```

### action 函数 loading

通过`action`工厂定义出来的 action 异步函数，可通过 `useActionLoading` 钩子在组件里查询

```ts
const [sharedState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 } } });

const myAsyncAction = actionAsync(sharedState)(async ({ setState }) => {
  await delay(2000);
  setState((draft) => {
    draft.a += 100;
  });
}, 'myAsyncAction');

function Comp() {
  const [loading] = ctx.useActionLoading();
  console.log(loading['myAsyncAction']);

  return (
    <MarkUpdate>
      <h1>{loading['myAsyncAction'].loading && 'loading...'}</h1>
      shared.xxx {$(sharedState.a)}
    </MarkUpdate>
  );
}
```

### 组件外部读取 loading

可使用 `getMutateLoading` 、 `getActionLoading` 、`getDeriveLoading` 获取相对于的 loading 状态

```ts
import { getMutateLoading, getActionLoading, getDeriveLoading } from 'helux';

// loading.xxx 获取某个 mutate 函数的具体 loading 状态
const loading = getMutateLoading(someShared);

// loading.xxx 获取某个 action 函数的具体 loading 状态
const loading = getActionLoading(someShared);

// 获取某个全量派生结果的具体 loading 状态
const status = getDeriveLoading(someDerivedResult);
```

## 模块克隆

### model

提供 `model` 函数，帮助用户按业务功能聚合管理相关状态与操作

```ts
const model = createModel((api) => {
  // api对象 有详细的类型提示
  const userCtx = api.shareState({ a: 1, b: 2 });
  const { state, setState } = userCtx;
  const someResult = api.deriveAtom(() => state.a + 100);

  function changeA() {
    setState((draft) => {
      draft.a += 1;
    });
  }

  return {
    changeA,
    state,
    someResult,
    setState,
  };
});
```

### modelFactory

提供更高阶的 `modelFactory` 函数，帮助用户创建可克隆使用的 model 工厂函数，做到逻辑复用但状态隔离的效果

```ts
const factory = modelFactory((api, extra) => {
  const userCtx = api.shareState({ a: 1, b: 2 }, { moduleName: extra });
  const { state, setState } = userCtx;
  const someResult = api.deriveAtom(() => state.a + 100);

  function changeA() {
    setState((draft) => {
      draft.a += 1;
    });
  }

  return {
    changeA,
    state,
    someResult,
    setState,
  };
});
const model1 = factory.build('Model1');
const model2 = factory.build('Model2');
```

## 事件系统

内部提供事件总线让用户可以全局使用

### 发射事件

```ts
import { emit } from 'helux';

emit('xxx_event', 1, 2, 3);
```

### 组件外监听事件

```ts
import { on } from 'helux';

const off = on('xxx_event', (...args) => {
  console.log('received args ', args);
});
off(); // 取消监听
```

### 组件内监听事件

组件内使用 `useOnEvent` 钩子函数监听，再组件销毁后会自动取消监听

```tsx
import { useOnEvent } from 'helux';

function Demo() {
  useOnEvent('xxx_event', (...args) => {
    console.log('received args ', args);
  });
}
```

## 中间件

中间件是一个同步函数，在状态提交前被调用，可通过中间件函做一些统一操作，例如数修改草稿的时间属性

### 定义中间件

```ts
import { Middleware } from 'helux';

const markTimeMiddleWare: Middleware = (params) => {
  const { sharedKey, moduleName, draft } = params;
  draft.time = Date.now();
};
```

### 使用中间件

```ts
import { addMiddleware } from 'helux';

addMiddleware(markTimeMiddleWare);
```

## 插件

插件是一个普通对象，包含有`install`属性，其值对应一个函数，`helux`调用该函数后，会将一个插件上下文对象透传给用户，用户可使用该上下文监听来自`helux`内部的各种行为事件并做对应的处理，例如[helux-plugin-redux-devtoo](https://github.com/heluxjs/helux/tree/master/packages/helux-plugin-redux-devtool)插件接收状态已改变事件，并将其对应的快照写入到 redux 开发工具的状态中，方便用户可视化查看整个应用的状态树。

![](https://tnfe.gtimg.com/image/akpc29z24n_1699705611085.png)

### 开发插件

```ts
import { IPlugin } from 'helux';

const MyPlugin: IPlugin = {
  install(ctx) {
    ctx.on(EVENT_NAME.ON_DATA_CHANGED, (dataInfo) => {
      // do some staff here
    });
    ctx.on(EVENT_NAME.ON_SHARE_CREATED, (dataInfo) => {
      // do some staff here
    });
  },
  name: pluginName,
};
```

### 安装插件

```ts
import { addPlugin } from 'helux';

addPlugin(MyPlugin);
```
