---
order: 3
---

# useDerived

组件中使用`derive`返回的派生结果

## 基础用法

### 使用同步派生结果

```tsx
/**
 * defaultShowCode: true
 */
import { atomx, derive, useDerived } from 'helux';

const { state, reactiveRoot } = atomx(1);
const result = derive(() => state.val + 100);

const change = () => {
  reactiveRoot.val += 1;
};

function Demo() {
  const [plus100] = useDerived(result);
  return <h1>{plus100}</h1>;
}

export default () => (
  <>
    <Demo />
    <Demo />
    <button onClick={change}>change</button>
  </>
);
```

### 使用异步派生结果

读取第二位`status`参数感知状态变化

```tsx
/**
 * defaultShowCode: true
 */
import { atomx, derive, useDerived } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const { state, reactiveRoot } = atomx(1);
const result = derive({
  deps: () => [state.val],
  fn: () => 0,
  task: async ({ input }) => {
    await delay(100);
    if (input[0] === 3) {
      throw new Error('meet 3');
    }
    return input[0] + 100;
  },
});

const change = () => {
  reactiveRoot.val += 1;
};

function Demo() {
  const [plus100, status] = useDerived(result);
  console.log(plus100, status);
  return (
    <>
      {status.ok && <h1>{plus100}</h1>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
    </>
  );
}

export default () => (
  <>
    <Demo />
    <Demo />
    <button onClick={change}>change</button>
  </>
);
```
