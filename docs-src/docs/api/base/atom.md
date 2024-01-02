---
group:
  title: 状态
  order: 0
order: 0
---

# atom

`atom`支持包括原始类型在内的所有类型，但会被装箱为`{ val: any }` 结构，直接读取时需要取`.val`做拆箱操作

## 基础使用

```ts
import { atom } from 'helux';

const [numAtom] = atom(1); // { val: 1 }
const [boolAtom] = atom(true); // { val: true }
const [listAtom] = atom([1, 2, 3]); // { val: [1,2,3] }
const [dictAtom] = atom({ desc: 'helux atom' }); // { val: { desc: 'helux atom'} }

// 也支持 Map Set 结构，但不建议使用，不利于后期做数据持久化
const [numAtom] = atom(
  new Map([
    [1, 1],
    [2, 2],
  ]),
);
```

支持传入初始值工厂函数，推荐使用此方式

```ts
const [numAtom] = atom(() => 66); // numAtom: { val: 66 }
const [numAtom] = atom(() => [1, 2, 3]); // numAtom: { val: [1,2,3] }
```

组件外取值或修改值需做一次`.val`操作

```ts
const [numAtom, setAtom] = atom(1);
const [dictAtom, setDict] = atom({ desc: 'helux atom', info: { born: 2023 } });

// 原始值读取
console.log(numAtom.val);
// 对象值读取
console.log(dictAtom.val.info.born);
```

`atom` 返回元组完整结构为`[ state, setter, ctx ]`，分别是状态，修改句柄，和包含了其他功能的[共享上下文](/api/atom-ctx)

```ts
import { atom } from 'helux';

// 返回元组 [ state, setter, ctx ]
const [numAtom, setAtom, atomCtx] = atom(1);
```

## 修改状态

### 修改原始值

使用元组第二位参数`setter`修改原始值数据类型状态

```ts
const [numAtom, setAtom] = atom(1);

setAtom(() => Math.random()); // 回调返回最新值
setAtom((draft) => draft + Math.random()); // 复用回调草稿返回最新值
setAtom(Math.random()); // 直接传入最新值
```

### 修改非原始值

使用元组第二位参数`setter`修改非原始值数据类型状态

:::success{title=自动拆箱}
回调里 draft 已自动拆箱，无需`.val`取值
:::

```ts
const [dictAtom, setDict] = atom({
  desc: 'helux atom',
  info: { born: 2023 },
  extra: { author: 'fantasticsoul' },
});

// 对象值修改，修改结束后，会生成一份具有结构共享特性的新状态
setDict((draft) => {
  draft.info.born = 2022;
  draft.desc = 'hello helux';
});
```

注意箭头函数里一行代码给 draft 赋值时，箭头函数存在隐含返回值导致ts编译不通过的问题

:::warning
元组第二位 setter 是会处理返回值的，箭头函数的隐含返回值类型和 atom 对象类型不匹配，此时导致编译报错
:::

```ts
const [ , setState, ctx ] = atom({ a: 1, b: 2 });
// ❌ ts 校验失败，这里返回了 1，和 atom 类型 Partial<T> 不匹配
setState((draft) => draft.a = 1);

// ✅ 以下3种方式 ts 校验通过
// 1 使用void包裹，消除隐式返回值
setState((draft) => void (draft.a = 1));
// 2 使用 {} 包裹箭头函数体
setState((draft) => {
  draft.a = 1;
});
// 或使用共享上下文的 setDraft 接口
ctx.setDraft((draft) => (draft.a = 1));
```

## 可选参数

创建`atom`对象支持传入`ICreateOptions`可选参数，包含以下属性可以设置

### moduleName

**模块名称**，方便用户可以查看到语义化的状态树，`@helux/dev-tool`插件也仅接受设置了模块名的状态来做可视化呈现，推荐按业务名设置。

:::success{title=设置以否不影响helux运行}
不设置的话内部会以生成的自增序号作为 key，如果设置重复了，目前仅控制台做个警告，helux 内部始终以生成的自增序号作为模块命名空间控制其他逻辑
:::


```ts
 atom({ a: 1, b: 2 }, {moduleName:'user'});
```

### recordLoading

default: 'private' ，表示 loading 对象记录的位置

