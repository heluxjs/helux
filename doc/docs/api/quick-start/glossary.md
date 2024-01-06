---
sidebar_position: 0
---

# 基础术语

helux 相关的基础术语解释，阅读此章节可帮助用户加深理解相关 api 重复提及的词汇

## 依赖收集

### 组件渲染依赖收集

`useAtom`或`useShared`返回的对象将在组件渲染期间动态收集到视图对数据的具体依赖项

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

有条件语句存在时，收集到的依赖是实时变化的

```tsx
function Comp2() {
  const [obj] = useAtom(objAtom);
  // 当前组件仅对 obj.a > 1 时，依赖是 obj.a obj.b，反之则是 obj.b obj.c
  return <h1>{obj.a > 1 ? obj.b : obj.c}</h1>;
}
```

### signal 依赖收集

使用`$`接口创建信号响应区域时，会收集到数据依赖

```tsx
// 收集到 h1 标签内对 numAtom 有依赖
<h1>{$(numAtom)}</h1>
// 收集到 h2 标签内对 shared.a.b 有依赖
<h2>{$(shared.a.b)}</h2>
```

使用`block`接口创建信号响应块时，会收集到数据依赖

```tsx
const [user] = share({ name: 'helux', age: 1 });

// 收集到当前块对 user.name user.age 有依赖
const UserBlock = block(() => (
  <div>
    {user.name}
    {user.age}
  </div>
));
```

### 可变派生依赖收集

通过 `mutate` 接口定义可变派生函数时，运行函数后自动搜集到依赖

```ts
const numAtom = atom(100);

const witness = mutate(someObj)(
  // 首次运行同步函数收集到 numAtom.val 依赖
  (draft) => {
    draft.a = numAtom.val + 1;
  },
);

const witness = mutate(someObj)({
  // 运行 deps 函数收集到 numAtom.val 依赖
  deps: () => [numAtom.val],
  task: async ({ setState, input: [num] }) => {
    await delay(1000);
    setState((draft) => (draft.a = num + 1));
  },
});
```

### 全量派生依赖收集

通过 `derive` 接口定义全量派生函数时，运行函数后将自动搜集到依赖

```ts
const numAtom = atom(100);

// 同步函数，运行后收集到 numAtom.val 依赖
const result = derive(() => ({ val: numAtom.val + 100 }));

const asyncResult = derive({
  // 运行 deps 函数收集到 numAtom.val 依赖
  deps: () => [numAtom.val],
  fn: ({ input: [num] }) => num + 100,
  task: async ({ input: [num] }) => {
    await delay(1000);
    setState((draft) => (draft.a = num + 1));
  },
});
```
