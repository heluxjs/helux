---
group:
  title: 全量派生
  order: 2
order: 5
---

# runDeriveTask

全量派生函数的异步任务除了观察到数据依赖变化后被触发执行的方式，还可使用 `runDeriveTask` 接口人工触发对应的派生函数异步任务

## 基础使用

```ts
import { derive, atom, runDeriveTask } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom] = atom(1);
const plus100Result = derive({
  fn: () => 0,
  // 在 deps 返回结果里锁定依赖
  deps: () => [numAtom.val],
  // input 数组即 deps 函数返回结果
  task: async ({ input }) => {
    await delay();
    return input[0] + 100;
  },
});

async function test() {
  // 打印两次结果，已经不相同
  const [ret1] = await runDeriveTask(plus100Result);
  console.log(ret1.val);
  const [ret2] = await runDeriveTask(plus100Result);
  console.log(ret2.val);
}
```

```tsx
import { atom, derive, runDeriveTask, useDerived } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom, setAtom] = atom(1);
const plus100Result = derive({
  fn: () => 0,
  deps: () => [numAtom.val],
  task: async ({ input }) => {
    await delay();
    return input[0] + Date.now();
  },
});
const rerunTask = () => runDeriveTask(plus100Result);

export default function Demo() {
  const [result, status] = useDerived(plus100Result);
  return (
    <div>
      {status.ok && <h1>{result}</h1>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1>{status.err.message}</h1>}
      <button onClick={rerunTask}>rerunTask</button>
    </div>
  );
}
```

`runDeriveTask`第二位为`throwErr`，表示是否抛出错误，默认 `false`，此时错误传地给元组第二位参数

```ts
const [ret1, err] = await runDeriveTask(plus100Result, true);
if (err) {
  // handle err
}
```

可设置`throwErr`为`true`，表示抛出错误，此时用户需要自己`try catch`并处理错误

```ts
try {
  const [ret1] = await runDeriveTask(plus100Result, true);
} catch (err) {
  // handle err
}
```

如目标派生结果对应派生函数定义里没有`task`异步计算任务，则执行`runDeriveTask`无任何作用，只是返回上最近一次生成的派生结果

```ts
// 如 plus100Result 无 task，ret1 表示最近一次生成的派生结果
const [ret1] = await runDeriveTask(plus100Result);
```
