---
order: 4
---

# useWatchEffect

`useWatchEffect` 功能同 `watchEffect``一样，区别在于 `useWatchEffect` 会立即执行回调，自动对首次运行时函数内读取到的值完成变化监听。

:::info
其他使用方式可参考[watchEffect](/api/hooks/use-effect)
:::


## 基础用法

:::info
`useWatchEffect`回调的首次运行的执行时机是在组件挂载完毕后才执行
:::

```tsx
/**
 * defaultShowCode: true
 */
import { share, useMutable, useWatchEffect, getSnap } from 'helux';

const [priceState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 } } });

function changeA() {
  setState((draft) => {
    draft.a += 1;
  });
}

export default function Comp(props: any) {
  const [ state, setState] = useMutable({tip:'1'})
  useWatchEffect(() => {
    setState(draft=>{
      draft.tip = `priceState.a changed from ${getSnap(priceState).a} to ${priceState.a}`;
    });
  });

  return (
    <div>
      <button onClick={changeA}>changeA</button>
      <h1>tip: {state.tip}</h1>
    </div>
  );
}
```