---
group:
  title: 可变派生
  order: 3
order: 2
---

# runMutate

重新触发`mutate`定义的`fn`函数执行

## 基础使用

```tsx
/**
 * defaultShowCode: true
 */
import { mutateDict, runMutate, share } from 'helux';

const [info, , infoCtx] = share({ name: 'helux', age: 1, a: 0 });

const witnessDict = mutateDict(info)({
  changeA: (draft) => (draft.a = draft.age + Math.random()),
});

const rerun = () => runMutate(info, 'changeA');
// 和下面写法等效
const rerun2 = () => witnessDict.changeA.run();

export default function () {
  const [info] = infoCtx.useState();
  return (
    <div>
      <h3>info.a {info.a}</h3>
      <button onClick={rerun}>rerun</button>
      <button onClick={rerun2}>rerun2</button>
    </div>
  );
}
```
