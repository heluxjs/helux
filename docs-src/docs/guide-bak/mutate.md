---
group:
  title: 基础
  order: 1
order: 1
---

# 派生 - Mutate

由于 `atom` 和 `share` 返回的对象天生自带依赖追踪特性，当共享对象 a 的发生变化后需要自动引起共享状态 b 的某些节点变化时，可定义 `mutate` 函数来完成这种变化的连锁反应关系，对数据做最小粒度的更新

## 单变化函数

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

## 多变化函数

需要响应多个不同上游状态的值变化，计算多个节点新值时，定义 `mutate` 为对象即可

```ts
const [priceState] = share({
  base1: 1,
  base2: { forStudent: 1, forTeacher: 2 },
});
const [finalPriceState] = share(
  // 这里仅负责定义初始值，变化规则见 options.mutate 定义
  { final1: 0, final2: { student: 0, teacher: 0 } },
  {
    // 定义 mutate 配置，完成相关的数据变化监听和修改函数定义，名字可按场景定义，方便配合 devtool 工具做变化追踪
    mutate: {
      // 仅当 priceState 的 base1 变化时，计算 finalAtom 的 final1 值
      changeFinal1: (draft) => (draft.final1 = priceState.base1 + 20),
      // 仅当 priceState 的 base2.forStudent 变化时，计算 finalAtom 的 final2.student 值
      changeFinal2: (draft) =>
        (draft.final2.student = priceState.base2.forStudent + 100),
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
    {
      desc: 'changeFinal1',
      fn: (draft) => (draft.final1 = priceState.base1 + 20),
    },
    {
      desc: 'changeFinal2',
      fn: (draft) => (draft.final2.student = priceState.base2.forStudent + 100),
    },
  ];
}
```

## 异步派生函数

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

## 外部定义可变派生

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

## 人工触发重运行

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
const [info] = share({
  a: 50,
  c: { c1: 100, c2: 1000 },
  list: [{ name: 'one', age: 1 }],
});

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

// 以下为伪代码

<!-- const result1 = derive(...);
const result2 = driveAtom(...);
const result3 = deriveAsync(...);

const result4 = derive(()=>{
  return { num: result.a + 1, plus: result2.val + 100, final: result3.num + 100 };
}); -->

### 组件使用全量派生结果

组件内部使用`useDerived`钩子函数使用`derive`派生结果

<!-- ```tsx
const result1 = derive(...);

function Demo(){
  const [ result ] = useDerived(result1);
}
``` -->

使用`useDerivedAtom`钩子函数使用`driveAtom`派生结果

```ts
const resultAtom = driveAtom(...);

function Demo(){
  // reulst 会被自动从 { val: T } 拆箱为 T
  const [ result ] = useDerivedAtom(resultAtom);
}
```

### 人工触发重运行

派生函数除了观察到数据依赖变化后被触发执行的方式，还可使用 `runDerive` 接口人工触发对应的派生函数
