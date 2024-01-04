---
order: 8
---

# useMutateLoading

组件中使用`mutate`函数的执行状态，此函数是一个恒安全函数，传入任何`desc`均能返回状态，如果传入的是不存在的`mutate desc`则返回一个假的状态

类型描述为

```ts
function useMutateLoading<T = SharedState>(
  target?: T,
): [
  SafeLoading, // 获取各个 mutate desc 的运行状态
  SetState<LoadingState>, // 人工修改执行状态（大多数时候都不需要用到此功能）
  IInsRenderInfo,
];
```

---

:::info
此函数偏向于提供给库开发者，推荐阅读[模块化/defineMutateDerive](/guide/modular#definemutatederive)了解和使用配套生成的`useLoading`会更方便
:::

## 基础用法

```tsx
/**
 * defaultShowCode: true
 */
import { share, useAtom, useMutateLoading } from 'helux';

const [dictAtom, , ctx] = share({ a: 1, b: { b1: 1 } }, { moduleName: 'uml' });
const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const witness = ctx.mutate({
  deps: () => [dictAtom.b.b1],
  task: async ({ draft, input }) => {
    await delay(1000);
    draft.a += input[0];
  },
  immediate: true,
  desc: 'changeA',
});
const changeB1 = () => {
  ctx.setDraft((draft) => (draft.b.b1 += 1));
};

export default function () {
  // 或写为
  // const [ dict, setDict ] = ctx.useState();
  const [dict, setDict] = useAtom(dictAtom);

  // or: ctx.useMutateLoading();
  const [ld] = useMutateLoading(dictAtom);

  return (
    <div>
      {ld.changeA.ok && <h1>{dict.a}</h1>}
      {ld.changeA.loading && <h1>loading...</h1>}
      {ld.changeA.err && <h1>{ld.changeA.err.message}</h1>}
      <button onClick={changeB1}>changeB1</button>
    </div>
  );
}
```
