---
group:
  title: Define
  order: 1
order: 0
---

# defineActions

批量定义状态对应的修改函数，返回 `{ actions, eActions, getLoading, useLoading, useLoadingInfo }`， 组件中可通过 useLoading 读取异步函数的执行中状态 loading、是否正常执行结束 ok、以及执行出现的错误 err， 组件外可通过 `getLoading` 获取

:::info
本章节展示基础用法，更多用法查阅[模块化/defineActions](/guide/modular#defineactions)
:::

```ts
// 【可选】约束各个函数入参 payload 类型
type Payloads = {
  changeA1: number;
  foo: boolean | undefined;
  // 不强制要求为每一个action key 都定义 payload 类型约束，但为了可维护性建议都补上
};

// 不约束 payloads 类型时写为 ctx.defineActions()({ ... });
const { actions, eActions, useLoading, getLoading } =
  ctx.defineActions<Payloads>()({
    // 同步 action，直接修改草稿
    changeA1({ draft, payload }) {
      draft.a.b.c += payload;
    },
    // 同步 action，返回结果
    changeA2({ draft, payload }) {
      draft.a.b.c += payload;
      return true;
    },
    // 同步 action，直接修改草稿深节点数据，使用 merge 修改浅节点数据
    changeA3({ draft, payload, merge }) {
      draft.a.b.c += payload;
      merge({ c: 'new desc' }); // 等效于 draft.c = 'new desc';
      return true;
    },
    // 异步 action，直接修改草稿
    async foo1({ draft, payload }) {
      await delay(3000);
      draft.a.b.c += 1000;
    },
    // 异步 action，多次直接修改草稿，合并修改多个状态，同时返回一个结果
    async foo2({ draft, payload, merge }) {
      draft.a.b.c += 1000;
      await delay(3000); // 进入下一次事件循环触发草稿提交
      draft.a.b.c += 1000;
      await delay(3000); // 再次进入下一次事件循环触发草稿提交
      const { list, total } = await fetchList();
      merge({ list, total }); // 等价于 draft.list = list, draft.tatal = total
      return true;
    },
  });
```
