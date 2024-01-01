---
group:
  title: 进阶
  order: 1
order: 3
---

# 模块化

尽管`atom`共享上下文提供了`action`、`derive`、`mutate`、`userState`、`userActionLoading`、`userMutateLoading`等一系列 api 方便用户使用各项功能，但这些 api 比较零碎，处理大型前端应用时用户更希望面向领域模型对状态的`state`、`derive`、`action`建模，故共享上下文还提供`define`系列 api 来轻松驾驭此类场景

## Define

### defineActions

批量定义状态对应的修改函数，返回 `{ actions, eActions, getLoading, useLoading }`， 组件中可通过 useLoading 读取异步函数的执行中状态 loading、是否正常执行结束 ok、以及执行出现的错误 err， 其他地方可通过 getLoading 获取

```ts
// 【可选】约束各个函数入参 payload 类型
type Payloads = {
  changeA: [number, number];
  foo: boolean | undefined;
  // 其他可以需要时在补充，不强制要求为每一个action key 都定义 payload 类型约束，但为了可维护性建议都补上
};

// 不约束 payloads 类型时写为 ctxp.defineActions()({ ... });
const { actions, eActions, useLoading, getLoading } =
  ctxp.defineActions<Payloads>()({
    // 同步 action，直接修改草稿
    changeA1({ draft, payload }) {
      draft.a.b.c = 200;
    },
    // 同步 action，返回结果
    changeA2({ draft, payload }) {
      draft.a.b.c = 200;
      return true;
    },
    // 同步 action，直接修改草稿深节点数据，使用 merge 修改浅节点数据
    changeA3({ draft, payload }) {
      draft.a.b.c = 200;
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

多个 action 组合为一个新的 action

```ts
const { actions, eActions, useLoading, getLoading } =
  ctxp.defineActions<Payloads>()({
    foo() {},
    bar() {},
    baz() {
      actions.foo();
      actions.bar();
    },
  });
```

调用 `actions.xxx` 执行修改动作，actions 方法调用只返回结果，如出现异常则抛出，同时也会发送给插件和伴生 loading 状态

```ts
// 调用同步action函数
const result = actions.changeA([1, 1]);

// 调用异步action函数
actions.foo2().then(console.log);
```

:::info{title=查看执行历史}
如安装了[helux-devtool 插件]，可观察到 action 提交记录，可很方便地对状态变更历史做回溯
:::

kk

```ts
// 【可选】约束各个函数入参 payload 类型
type Payloads = {
  changeA: [number, number];
  foo: boolean | undefined;
  // 其他可以需要时在补充，不强制要求为每一个action key 都定义 payload 类型约束，但为了可维护性建议都补上
};

// 不约束 payloads 类型时写为 ctxp.defineActions()({ ... });
const { actions, useLoading, getLoading } = ctxp.defineActions<Payloads>()({
  // 同步 action，直接修改草稿
  changeA1({ draft, payload }) {
    draft.a.b.c = 200;
  },
  // 同步 action，返回结果
  changeA2({ draft, payload }) {
    draft.a.b.c = 200;
    return true;
  },
  // 同步 action，直接修改草稿深节点数据，使用 merge 修改浅节点数据
  changeA3({ draft, payload }) {
    draft.a.b.c = 200;
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

// actions 方法调用只返回结果，如出现异常则抛出，同时也会发送给插件和伴生loading状态
const result = actions.changeA([1, 1]);

// eActions 方法调用返回格式如 {result, snap, err}，
// 它的异常默认被拦截掉不再继续抛出，只是并发送给插件和伴生loading状态
const { result, snap, err } = eActions.changeA([1, 1]);
// eAction 支持调用方法并抛出错误，此时错误既发给插件和伴生loading状态，也也向上抛出，用户需自己 catch
const { result, snap, err } = eActions.changeA([1, 1], true);
```

```ts
const model = createModel((api) => {
  // api对象 有详细的类型提示
  const userCtx = api.shareState({ a: 1, b: 2 });
  const { state, setState } = userCtx;
  const someResult = api.deriveAtom(() => state.a + 100);

  function changeA() {
    setState((draft) => {
      draft.a += 1;
    });
  }

  return {
    changeA,
    state,
    someResult,
    setState,
  };
});
```

## modelFactory

提供更高阶的 `modelFactory` 函数，帮助用户创建可克隆使用的 model 工厂函数，做到逻辑复用但状态隔离的效果

```ts
const factory = modelFactory((api, extra) => {
  const userCtx = api.shareState({ a: 1, b: 2 }, { moduleName: extra });
  const { state, setState } = userCtx;
  const someResult = api.deriveAtom(() => state.a + 100);

  function changeA() {
    setState((draft) => {
      draft.a += 1;
    });
  }

  return {
    changeA,
    state,
    someResult,
    setState,
  };
});
const model1 = factory.build('Model1');
const model2 = factory.build('Model2');
```
