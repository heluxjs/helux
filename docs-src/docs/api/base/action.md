---
group:
  title: 帮助
  order: 4
order: 0
---

# action

通过 `action` 工厂函数创建专用于修改状态的 `action` 同步或异步函数

---

:::info
更多用法查阅[指南/Action](/guide/action)
:::

## 基础用法

### 创建同步action

```ts
import { share, action } from 'helux';

const { state } = sharex({a:1, b:2});

const hiAction = action(state)()(({ draft, payload }) => {
  draft.a += 100;
}, 'hiAction');
```

约束`payload`类型

```ts
const hiAction = action(state)<[number, string]>()(({ draft, payload }) => {
  draft.a += 100;
}, 'hiAction');
```

### 创建异步action

和创建同步action方式一样，只需将函数声明为异步函数即可，草稿变更后，会在下一次事件循环的微任务开始前提交变更数据

```ts
const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const hiAsyncAction = action(state)()(async ({ draft, payload }) => {
  draft.a += 100;
  await delay(); // 触发 drart 提交
  draft.a += 100;
}, 'hiAsyncAction');
```


