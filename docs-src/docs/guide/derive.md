---
group:
  title: 开始
  order: 0
order: 7
---

# 派生

## 全量派生

`derive` 接口该接受一个派生函数实现，返回一个全新的派生值对象，该对象是一个只可读的稳定引用，全局使用可总是读取到最新值。

### 同步全量派生

`derive`接受任意数据类型的返回结果，自动装箱为`{val:T}`结构，派生函数首次运行后会收集到相关数据依赖，后续仅在这些依赖发生变化后才会重运行并计算出新结果

```ts
import { atom, derive } from 'helux';

const [numAtom] = atom(5);
const [info] = share({
  a: 50,
  c: { c1: 100, c2: 1000 },
  list: [{ name: 'one', age: 1 }],
});

// 仅在 numAtom.val 或 info.c.c1 发生变化后才会重运行计算出新的 result
const result = derive(() => {
  return numAtom.val + info.c.c1;
});
```

组件中可使用`useDerived`获取到派生结果，传入的是`derive`返回结果则会自动拆箱

```tsx
import { Entry } from '@helux/demo-utils';
import { atom, share, derive, useDerived } from 'helux';

const [numAtom, setAtom] = atom(5);
const [info, setInfo] = share({
  a: 50,
  c: { c1: 100, c2: 1000 },
  list: [{ name: 'one', age: 1 }],
});

const result = derive(() => {
  return numAtom.val + info.c.c1;
});

const changeNum = ()=>setAtom(prev=>prev+10);
const changeC1 = ()=>setInfo(draft=>void(draft.c.c1+=20));

function Demo(){
  const [ num ] = useDerived(result); // 自动拆箱
  return <h1>{num}</h1>
}

export default ()=><Entry fns={{changeNum,changeC1}}><Demo/></Entry>
```

返回结果为字典对象类型时，可使用`driveDict`来免去自动装箱过程

```ts
import { driveDict } from 'helux';

const result = driveDict(() => {
  return { plusValue: numAtom.val + info.c.c1 };
});
```

### 异步全量派生

支持配置 `task` 异步计算任务来实现异步派生结果

```ts
const [sharedState, setState] = share({ a: 1, b: { b1: { b2: 200 } } });

const result = derive({
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
```

组件中可使用`useDerived`获取到异步派生结果和派生函数执行状态

```tsx | pure
function Demo(){
  const [num, status] = useDerived(result);
  if(status.loading) return <h1>loading...</h1>;
  if(!status.ok) return <h1>{status.err.message}</h1>;
  return <h1>num</h1>;
}
```

:::info
点击`changeA`3次后，将触发task抛出异常到组件中
:::

```tsx
import { Entry, demoUtils } from '@helux/demo-utils';
import { atom, share, derive, useDerived } from 'helux';

const [sharedState, setState] = share({ a: 1, b: { b1: { b2: 200 } } });
const changeA = ()=>setState(draft=>void(draft.a+=100));

const result = derive({
  deps: () => [sharedState.a, sharedState.b.b1.b2] as const,
  fn: ({ input: [a, b2] }) =>  a + b2 ,
  task: async ({ input: [a, b2] }) => {
    await demoUtils.delay(1000);
    const ret = a + b2 + 1;
    if(ret > 500) throw new Error('>500');
    return ret;
  },
});

function Demo(){
  const [num, status] = useDerived(result);
  if(status.loading) return <h1>loading...</h1>;
  if(!status.ok) return <h1 style={{color:'red'}}>{status.err.message}</h1>;
  return <h1>{num}</h1>;
}

export default ()=><Entry fns={{changeA}}><Demo/></Entry>;
```

### 人工触发重运行

派生函数除了观察到数据依赖变化后被触发执行的方式，还可使用 `runDerive` 接口人工触发对应的派生函数

```ts
import { runDerive } from 'helux'
const result = derive(() => {
  return numAtom.val + info.c.c1;
});

runDerive(result);
```

```tsx
import { Entry, demoUtils } from '@helux/demo-utils';
import { share, derive, useDerived, runDerive } from 'helux';

const [sharedState, setState] = share({ a: 1 });
const result = derive(() => {
  return sharedState.a + demoUtils.random();
});
function rerun(){
  runDerive(result);
}

function Demo(){
  const [num, status] = useDerived(result);
  return <h1>{num}</h1>;
}

export default ()=><Entry fns={{rerun}}><Demo/></Entry>;
```

异步任务可使用`runDeriveTask`触发重执行

```ts
import { runDeriveTask } from 'helux'
const result = derive({ task: ... });

runDeriveTask(result);
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
witness.run();
// 呼叫 fnItem 配置的异步函数
witness.runTask();
```
