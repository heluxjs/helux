---
group:
  title: 可变派生
  order: 3
order: 1
---

# mutateDict

使用`mutateDict`批量定义[可变派生](/reference/glossary#可变派生)函数，仅当函数内的依赖发生变化时才会触发重计算。

## 基础使用

为了更好的类型推导，接口调用采用了柯里化风格，定义可变派生的使用方式和[mutate](/api/base/mutate)一样，区别是`mutateDict`仅支持传入字典来配置多个可变派生函数。

```tsx
/**
 * defaultShowCode: true
 */
import { mutateDict, share } from 'helux';

const [info, , infoCtx] = share(
  { name: 'helux', age: 1 },
  { moduleName: 'M1' },
);
const [foo, , fooCtx] = share(
  { a: 1, b: { b1: { b2: 200 } }, c: 2, d: 4, e: '' },
  { moduleName: 'M2' },
);

const infoAc = infoCtx.defineActions()({
  changeName({ draft }) {
    draft.name = `${draft.name}s`;
  },
  changeAge({ draft }) {
    draft.age += 1;
  },
});

const witnessDict = mutateDict(foo)({
  changeA: (draft) => (draft.a = info.age + 10),
  changeD: {
    deps: () => [foo.a, info.age],
    fn: (draft, { input: [a, age] }) => {
      draft.d = a + age;
    },
  },
  changeE: {
    deps: () => [info.name],
    task: async ({ draft, input: [name] }) => {
      draft.e = name + Date.now();
    },
  },
});

export default function () {
  const [foo] = fooCtx.useState();
  return (
    <div>
      <h3>foo.a {foo.a}</h3>
      <h3>foo.d {foo.d}</h3>
      <h3>foo.e {foo.e}</h3>
      <button onClick={infoAc.actions.changeName}>changeName</button>
      <button onClick={infoAc.actions.changeAge}>changeAge</button>
    </div>
  );
}
```

## 人工触发执行

```ts
// 触发 changeA 的 mutate fn 函数执行
witnessDict.changeA.run();

// 触发 changeE 的 mutate task 函数执行
witnessDict.changeE.runTask();
```
