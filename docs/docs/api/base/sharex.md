---
group:
  title: 状态
  order: 0
order: 1
---

# sharex

`sharex` 返回共享上下文 `ctx`，`share` 返回元组结构 `[ state, setState, ctx ]`， 将 `ctx.state` 和 `ctx.setState` 放置到元组的第一位和第二次参数处。

```ts
import { share, sharex } from 'helux';

// 返回元组，元组的第一位和第二次参数即是 state setState
const [obj, setObj, sharedCtx] = share({ a: 1, b: 2 });

// 返回字典对象，对象里可解构出 state setState
const sharedCtx = sharex(1);
const { state: obj, setState: setObj } = sharedCtx;
```

其他使用方式均和[atom](/api/base/atom)保持一致。
