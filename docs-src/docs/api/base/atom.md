---
group:
  title: 状态
  order: 0
order: 0
---

# atom

`atom`支持包括原始类型在内的所有类型，但会被装箱为`{ val: any }` 结构，直接读取时需要取`.val`做拆箱操作

## 基础使用

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

支持传入初始值工厂函数，推荐使用此方式

```ts
const [numAtom] = atom(() => 66); // numAtom: { val: 66 }
const [numAtom] = atom(() => [1, 2, 3]); // numAtom: { val: [1,2,3] }
```

组件外取值或修改值需做一次`.val`操作

```ts
const [numAtom, setAtom] = atom(1);
const [dictAtom, setDict] = atom({ desc: 'helux atom', info: { born: 2023 } });

// 原始值读取
console.log(numAtom.val);
// 对象值读取
console.log(dictAtom.val.info.born);
```

`atom` 返回元组完整结构为`[ state, setter, ctx ]`，分别是状态，修改句柄，和包含了其他功能的[共享上下文](/api/atom-ctx)

```ts
import { atom } from 'helux';

// 返回元组 [ state, setter, ctx ]
const [numAtom, setAtom, atomCtx] = atom(1);
```

## 修改状态

### 修改原始值

使用元组第二位参数`setter`修改原始值数据类型状态

```ts
const [numAtom, setAtom] = atom(1);

setAtom(() => Math.random()); // 回调返回最新值
setAtom((draft) => draft + Math.random()); // 复用回调草稿返回最新值
setAtom(Math.random()); // 直接传入最新值
```

### 修改非原始值

使用元组第二位参数`setter`修改非原始值数据类型状态

:::success{title=自动拆箱}
回调里 draft 已自动拆箱，无需`.val`取值
:::

```ts
const [dictAtom, setDict] = atom({
  desc: 'helux atom',
  info: { born: 2023 },
  extra: { author: 'fantasticsoul' },
});

// 对象值修改，修改结束后，会生成一份具有结构共享特性的新状态
setDict((draft) => {
  draft.info.born = 2022;
  draft.desc = 'hello helux';
});
```

注意箭头函数里一行代码给 draft 赋值时，箭头函数存在隐含返回值导致 ts 编译不通过的问题

:::warning
元组第二位 setter 是会处理返回值的，箭头函数的隐含返回值类型和 atom 对象类型不匹配，此时导致编译报错
:::

```ts
const [, setState, ctx] = atom({ a: 1, b: 2 });
// ❌ ts 校验失败，这里返回了 1，和 atom 类型 Partial<T> 不匹配
setState((draft) => (draft.a = 1));

// ✅ 以下3种方式 ts 校验通过
// 1 使用void包裹，消除隐式返回值
setState((draft) => void (draft.a = 1));
// 2 使用 {} 包裹箭头函数体
setState((draft) => {
  draft.a = 1;
});
// 或使用共享上下文的 setDraft 接口
ctx.setDraft((draft) => (draft.a = 1));
```

## 可选参数

创建`atom`对象支持传入`ICreateOptions`可选参数，包含以下属性可以设置

### moduleName

**模块名称**，方便用户可以查看到语义化的状态树，`@helux/dev-tool`插件也仅接受设置了模块名的状态来做可视化呈现，推荐按业务名设置。

:::success{title=设置以否不影响 helux 运行}
不设置的话内部会以生成的自增序号作为 key，如果设置重复了，目前仅控制台做个警告，helux 内部始终以生成的自增序号作为模块命名空间控制其他逻辑
:::

```ts
atom({ a: 1, b: 2 }, { moduleName: 'user' });
```

### recordLoading

默认值 `private` ，表示 loading 对象记录的位置

不记录`loading`状态

```ts
import { cst } from 'helux';
atom({ a: 1, b: 2 }, { recordLoading: cst.RECORD_LOADING.NO });
```

记录`loading`状态到共享状态对应的伴生 loading 状态上

```ts
import { cst } from 'helux';
atom({ a: 1, b: 2 }, { recordLoading: cst.RECORD_LOADING.PRIVATE });
```

记录`loading`状态到共享状态对应的全局 loading 状态上

:::warning
此模式需要小心规划`action`、`mutate`各个函数的名称，多个状态对应`action`、`mutate`各个函数名称重复时，会相互覆盖各自的 loading 状态
:::

```ts
import { cst } from 'helux';
atom({ a: 1, b: 2 }, { recordLoading: cst.RECORD_LOADING.GLOBAL });
```

### stopDepth

控制字典对象的依赖收集深度，默认`6`

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
  },
);
```

### stopArrDep

控制数组是否只收集到下标位置，默认 `true`，表示针对数组只收集到下标位置

```ts
const [state, setState, ctx] = share(
  {
    /** ... */
  },
  {
    stopArrDep: false, // 对象里的所有数组都继续向下收集（即关闭只收集到下标位置规则）
  },
);
```

:::info{title=大量依赖产生额外性能损耗}
由于数组时动态变化的结构，开启后如遇到长度很大的数组，会收集到大量依赖，用户需自己评估额外的性能损耗造成的影响是否主应用
:::

### rules

**`stopDep`**：针对状态某些节点设置收集规则，值为`true`依赖收集到这一层后就停止，可干预`stopDepth`的结果，例如共享状态的`stopDepth`是`6`，但某个深度为`4`的节点设置`stopDep`为`true`，就达成了针对这个数据节点独立干预的效果。

```ts
const [state, setState, ctx] = atom(
  {
    /** ... */
  },
  {
    rules: [
      // 当读取或写入 a.b.list 数据时，停止依赖收集，即依赖只记录到下标，此设定优先级高于顶层的 stopArrDep
      { when: (state) => state.a.b.list, stopDep: true },
    ],
    stopArrDep: false, // 这个配置针对 state.a.b.list 将无效
  },
);
```

**`ids`**：当 a.b.list 变化时，通知设定了 id 为 `up1`，`up2` 的组件重渲染，尽管`up1`，`up2`对应组件可能对 state.a.b.list 无依赖，也会被重渲染。

```ts
const [state, setState, ctx] = share({ ... }, {
  rules: [
    { when: state => state.a.b.list, ids: ['up1', 'up2']},
  ],
});

// 使用了 id 的组件
function Demo(){
  useAtom(someAtom, { id: 'up1' });
}
```

### checkDeadCycle

默认 `true`，是否来自`mutate`或`watch`的死循环，设置为 `false` 表示不检查

:::info
`helux`会在运行时探测出死循环存在的情况，并提前阻断无限调用产生，同时给弹窗警告和控制台警告，防止应用崩溃，控制台会输出引起死循环的起源函数，方便用户定位问题
:::

```ts
const [state, setState, ctx] = atom(
  {
    /** ... */
  },
  {
    checkDeadCycle: false, // 不检查死循环
  },
);
```

### alertDeadCycleErr

是否调用`window.alert`强弹来自`mutate`或`watch`的死循环提示，默认`undefined`，不配置此项时，开发环境弹死循环提示，生产环境不弹

```ts
const [state, setState, ctx] = atom(
  {
    /** ... */
  },
  {
    alertDeadCycleErr: false, // 不弹死循环提示，只通过控制台打印
  },
);
```

### enableMutate

default: `true`，是否允许 `mutate` 执行，可以创建 atom 时设置，也可以中途通过 `setEnableMutate` 反复设置

:::info
此参数偏向于提供给开发者使用，业务层面大多数用不到此特性
:::

### mutate

定义当前状态的[可变派生函数](/reference/glossary#可变派生)，推荐通过 [defineMutateSelf]、[mutate]、[mutateDict] 在外部定义 mutate 函数，以便获得更好的类型推导

定义一个同步可变派生函数

```ts
const [state, setState, ctx] = atom({ a: 1, b: 0 }, {
  // a 变化时计算 b
  mutate: draft => draft.b = draft.a + 1;
});
```

数组方式定义多个同步可变派生函数

```ts
const [state, setState, ctx] = atom({ a: 1, b: 0, c: 0 }, {
  mutate: [
     draft => draft.b = draft.a + 1,
     draft => draft.c = draft.a + 10,
  ];
});
```

数组方式定义多个带描述的同步可变派生函数

```ts
const [state, setState, ctx] = atom({ a: 1, b: 0, c: 0 }, {
  mutate: [
     {
       fn: draft => draft.b = draft.a + 1,
       desc: 'changeB',
     },
     {
       fn: draft => draft.c = draft.a + 10,
       desc: 'changeC',
     },
  ];
});
```

字典方式定义多个带描述的同步可变派生函数

```ts
const [state, setState, ctx] = atom({ a: 1, b: 0, c: 0 }, {
  mutate: {
    changeB: draft => draft.b = draft.a + 1,
    changeC: draft => draft.c = draft.a + 10,
  };
});
```

定义一个异步可变派生函数，通过`fn`收集到依赖，首次运行不触发异步任务执行

```ts
const [state, setState, ctx] = atom({ a: 1, b: 0 }, {
  mutate: {
    fn: draft => draft.b = draft.a + 1,
    task: async({ draft })=>{
      await delay(1000);
      draft.b = draft.a + 1000,
    },
  }
});
```

定义一个异步可变派生函数，通过`deps`确定依赖，首次运行不触发异步任务执行

```ts
const [state, setState, ctx] = atom({ a: 1, b: 0 }, {
  mutate: {
    deps: ()=>[state.a],
    task: async({ draft, input })=>{
      await delay(1000);
      // 等效于 draft.b = state.a + 1000,
      draft.b = input[0] + 1000,
    },
  }
});
```

定义一个异步可变派生函数，设置`immediate`为 true，首次运行触发异步任务执行

```ts
const [state, setState, ctx] = atom(
  { a: 1, b: 0 },
  {
    mutate: {
      fn: (draft) => (draft.b = draft.a + 1),
      task: async () => {
        /** */
      },
      immediate: true,
    },
  },
);

const [state, setState, ctx] = atom(
  { a: 1, b: 0 },
  {
    mutate: {
      deps: () => [state.a],
      task: async () => {
        /** */
      },
      immediate: true,
    },
  },
);
```

### before

`action`、`mutate`、`setState`、`sync` 提交状态之前会触发执行的函数，可在此函数里再次修改 draft，该函数执行时机是在中间件之前

```ts
const [state, setState, ctx] = atom(
  { a: 1, b: 0, time: 0 },
  {
    before({ draft }) {
      draft.time = Date.now();
    },
  },
);
```
