---
group:
  title: 进阶
  order: 1
order: 3
---

# 模型

## model

提供 `model` 函数，帮助用户按业务功能聚合管理相关状态与操作

```ts
import 'model' from 'helux';

const userModel = model((api) => {
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
import 'modelFactory' from 'helux';

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
