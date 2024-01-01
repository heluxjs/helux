---
group:
  title: 开始
  order: 0
order: 5
---

# 响应式

因`atom` 返回的 `state` 是只可读数据，变更必须配合`setState`，同时 `atom` 也提供响应式对象，可直接操作修改，变化部分数据会在下一次事件循环微任务开始前执行

## 直接修改

```ts
import { atom } from 'helux';
import { delay } from '@helux/demo-utils';

// reactive 已自动拆箱
const { state, reactive } = atomx({ a: 1, b: { b1: { b2: 1, ok: true } } });

async function change() {
  reactive.a = 100;
  console.log(state.val.a); // 1
  await delay(1);
  console.log(state.val.a); // 100
}
```

或使用`share`返回的`reactive`修改

```ts
import { share } from 'helux';
import { delay } from '@helux/demo-utils';

const [state, , { reactive }] = share({ a: 1, b: { b1: { b2: 1, ok: true } } });
// or
const { state, reactive } = sharex({ a: 1, b: { b1: { b2: 1, ok: true } } });

// 相比 atom.state，少了主动拆箱的过程
async function change() {
  reactive.a = 100;
  console.log(state.a); // 1
  await delay(1);
  console.log(state.a); // 100
}
```

## 组件中使用

组件中可使用`useReactive`钩子来获得响应式对象

```tsx | pure
import { sharex } from 'helux';

const { reactive, useReactive } = sharex({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});

// 定时修改 a b2
setTimeout(() => {
  reactive.a += 1;
  reactive.b.b1.b2 += 1;
}, 2000);

// 组件外部修改 ok
function toogleOkOut() {
  reactive.b.b1.ok = !reactive.b.b1.ok;
}

function Demo() {
  const [reactive] = useReactive();
  return <h1>{reactive.a}</h1>;
}
function Demo2() {
  const [reactive] = useReactive();
  return <h1>{reactive.b.b1.b2}</h1>;
}
function Demo3() {
  const [reactive] = useReactive();
  // 组件内部切换 ok
  const toogle = () => (reactive.b.b1.ok = !reactive.b.b1.ok);
  return <h1>{`${reactive.b.b1.ok}`}</h1>;
}
```

```tsx
import { Entry, MarkUpdate } from '@helux/demo-utils';
import { sharex } from 'helux';

const { reactive, useReactive } = sharex({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});

setInterval(() => {
  reactive.a += 1;
  reactive.b.b1.b2 += 5;
}, 2000);

function toogleOkOut() {
  reactive.b.b1.ok = !reactive.b.b1.ok;
}

function Demo() {
  const [reactive, , info] = useReactive();
  return <MarkUpdate info={info}>a: {reactive.a}</MarkUpdate>;
}
function Demo2() {
  const [reactive, , info] = useReactive();
  return <MarkUpdate info={info}>b.b1.b2: {reactive.b.b1.b2}</MarkUpdate>;
}
function Demo3() {
  const [reactive, , info] = useReactive();
  const toogle = () => (reactive.b.b1.ok = !reactive.b.b1.ok);
  return (
    <MarkUpdate info={info}>
      <div onClick={toogle}>b.b1.ok: {`${reactive.b.b1.ok}`}</div>
    </MarkUpdate>
  );
}

export default () => (
  <Entry fns={{ toogleOkOut }}>
    <Demo />
    <Demo />
    <Demo2 />
    <Demo2 />
    <Demo3 />
  </Entry>
);
```

## signal 中使用

可直接将 `reactive` 值传给 `$`原始值响应或`block`块响应

```tsx | pure
import { $, block, sharex } from 'helux';

const { reactive } = sharex({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});

function InSignalZone() {
  return <h1>{$(reactive.a)}</h1>;
}

const InBlockZone = block(() => {
  return (
    <div>
      <h3>{reactive.a}</h3>
      <h3>{reactive.b.b1.b2}</h3>
    </div>
  );
});
```

```tsx
import { Entry, MarkUpdate } from '@helux/demo-utils';
import { $, block, sharex } from 'helux';

const { reactive } = sharex({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});
function change() {
  reactive.a += 1;
  reactive.b.b1.b2 += 5;
}

function InSignalZone() {
  return <MarkUpdate>{$(reactive.a)}</MarkUpdate>;
}

const InBlockZone = block(() => {
  return (
    <MarkUpdate>
      <h3>{reactive.a}</h3>
      <h3>{reactive.b.b1.b2}</h3>
    </MarkUpdate>
  );
});

export default () => (
  <Entry fns={{ change }}>
    <InSignalZone />
    <InBlockZone />
  </Entry>
);
```
