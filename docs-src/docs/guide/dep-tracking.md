---
group:
  title: 开始
  order: 0
order: 4
---

# 依赖追踪

除了对`$`、`block`这些静态节点建立起视图对数据变化的依赖关系，使用`useAtom`方式的组件渲染期间将实时收集到数据依赖

## 依赖收集

组件时读取数据节点值时就产生了依赖，这些依赖被收集到`helux`内部为每个组件创建的实例上下文里暂存着，作为更新凭据来使用。

```tsx | pure
const { state, setDraft, useState } = atomx({ a: 1, b: { b1: 1 } });

// 修改草稿，生成具有数据结构共享的新状态，当前修改只会触发 Demo1 组件渲染
const changeObj = () => setDraft((draft) => (draft.a = Math.random()));

function Demo1() {
  const [obj] = useState();
  // 仅当 obj.a 发生变化时才触发重渲染
  return <h1>{obj.a}</h1>;
}

function Demo2() {
  const [obj] = useState();
  // 仅当 obj.b.b1 发生变化时才触发重渲染
  return <h1>{obj.b.b1}</h1>;
}
```

```tsx
import { Entry, MarkUpdate } from '@helux/demo-utils';
import { atomx } from 'helux';

const { state, setDraft, useState } = atomx({ a: 1, b: { b1: 1 } });
const changeObj = () => setDraft((draft) => (draft.a = Math.random()));

function Demo1() {
  const [obj, , info] = useState();
  return <MarkUpdate info={info}>{obj.a}</MarkUpdate>;
}

function Demo2() {
  const [obj, , info] = useState();
  return <MarkUpdate info={info}>{obj.b.b1}</MarkUpdate>;
}

export default () => (
  <Entry fns={{ changeObj }}>
    <Demo1 />
    <Demo1 />
    <Demo2 />
    <Demo2 />
  </Entry>
);
```

## 依赖变更

存在 `if` 条件时，每一轮渲染期间收集的依赖将实时发生变化

```tsx | pure
import { atomx } from 'helux';

const { state, setDraft, useState } = atomx({ a: 1, b: { b1: 1 } });
const changeA = () => setDraft((draft) => (draft.a += 1));
const changeB = () => setDraft((draft) => (draft.a.b1 += 1));

function Demo1() {
  const [obj] = useState();
  // 大于 3 时，依赖为 a, b.b1
  if (obj.a > 3) {
    return (
      <h1>
        {obj.a} - {obj.b.b1}
      </h1>
    );
  }

  return <h1>{obj.a}</h1>;
}
```

:::tip
先点击下述示例`changeB1`按钮，发现并不会触发重渲染，然后再点击`plusA`按钮，待到`a`值大于 3 时，点击`changeB1`按钮，此时组件将被重渲染，点击`minusA`按钮，待到`a`值小于 3 时，点击`changeB1`按钮，此时组件将被不被重渲染
:::

```tsx
import { Entry, MarkUpdate } from '@helux/demo-utils';
import { atomx } from 'helux';

const { state, setDraft, useState } = atomx({ a: 1, b: { b1: 1 } });
const plusA = () => setDraft((draft) => (draft.a += 1));
const minusA = () => setDraft((draft) => (draft.a -= 1));
const changeB1 = () => setDraft((draft) => (draft.b.b1 = Date.now()));

function Demo1() {
  const [obj, , info] = useState();
  if (obj.a > 3) {
    return (
      <MarkUpdate info={info}>
        {obj.a} - {obj.b.b1}
      </MarkUpdate>
    );
  }

  return <MarkUpdate info={info}>{obj.a}</MarkUpdate>;
}

export default () => (
  <Entry fns={{ plusA, minusA, changeB1 }}>
    <Demo1 />
    <Demo1 />
  </Entry>
);
```

## 依赖比较

得益于[limu](https://github.com/tnfe/limu)产生的结构共享数据，`helux`内部可以高效的比较快照变更部分，当用户重复设置相同的值组件将不被渲染

```tsx | pure
import { atomx } from 'helux';

const { state, setDraft, useState } = atomx({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});
const changeB1 = () => setDraft((draft) => (draft.b.b1 = { ...draft.b.b1 }));
const changeB1_Ok_oldValue = () =>
  setDraft((draft) => (draft.b.b1.ok = draft.b.b1.ok));
const changeB1_Ok_newValue = () =>
  setDraft((draft) => (draft.b.b1.ok = !draft.b.b1.ok));

// 调用 changeB1_Ok_oldValue changeB1 Demo1 不会被重渲染
// 调用 changeB1_Ok_newValue ，Demo1 被重渲染
function Demo1() {
  const [obj] = useState();
  return <h1>obj.b.b1.ok {`${obj.b.b1.ok}`}</h1>;
}
```

```tsx
import { Entry, MarkUpdate } from '@helux/demo-utils';
import { atomx } from 'helux';

const { state, setDraft, useState } = atomx({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});
const changeB1 = () => setDraft((draft) => (draft.b.b1 = { ...draft.b.b1 }));
const changeB1_Ok_oldValue = () =>
  setDraft((draft) => (draft.b.b1.ok = draft.b.b1.ok));
const changeB1_Ok_newValue = () =>
  setDraft((draft) => (draft.b.b1.ok = !draft.b.b1.ok));

function Demo1() {
  const [obj, , info] = useState();
  return <MarkUpdate info={info}>obj.b.b1.ok {`${obj.b.b1.ok}`}</MarkUpdate>;
}

export default () => (
  <Entry fns={{ changeB1, changeB1_Ok_oldValue, changeB1_Ok_newValue }}>
    <Demo1 />
    <Demo1 />
  </Entry>
);
```
