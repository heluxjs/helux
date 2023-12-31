---
group:
  title: 开始
  order: 0
order: 1
---

# 快速上手

阅读此章节可快速了解`helux`的常用接口，并教会你快速学会使用它们。

## 定义 atom

支持定义任意数据结构 atom 对象，被包装为`{val:T}`结构

```ts
import { atom } from 'helux';

// 原始类型 atom
const [numAtom] = atom(1);
// 字典对象类型 atom
const [objAtom] = atom({ a: 1, b: { b1: 1 } });
```

## 修改 atom

原始值修改

```ts
const [numAtom, setAtom] = atom(1);
setAtom(100);
```

字典对象修改，基于回调的草稿对象直接修改即可

```ts
const [numAtom, setAtom] = atom({ a: 1, b: { b1: 1 } });
setAtom((draft) => {
  // draft 已拆箱 { val: T } 为 T
  draft.b.b1 += 1;
});
```

## 观察 atom

可观察整个根对象变化，也可以观察部分节点变化

```ts
import { atom, watch, getSnap } from 'helux';

watch(
  () => {
    console.log(`change from ${getSnap(numAtom).val} to ${numAtom.val}`);
  },
  () => [atom],
);

watch(
  () => {
    console.log(
      `change from ${getSnap(numAtom).val.b.b1} to ${numAtom.val.b.b1}`,
    );
  },
  () => [objAtom.val.b.b1],
);
```

## 派生 atom

### 全量派生

`derive` 接口接受一个派生函数实现，返回一个全新的派生值对象，该对象是一个只可读的稳定引用，全局使用可总是读取到最新值。

```ts
import { atom, derive } from 'helux';

const [numAtom, setAtom] = atom(1);
const plus100 = derive(() => atom.val + 100);

setAtom(100);
console.log(plus100); // { val: 200 }

setAtom(100); // 设置相同结果，派生函数不会再次执行
```

使用已派生结果继续派生新的结果

```ts
const plus100 = derive(() => atom.val + 100);
const plus200 = derive(() => plus100.val + 200);
```

更多高级功能可阅读[开始/派生](/guide/derive)了解。

### 可变派生

当共享对象 a 的发生变化后需要自动引起共享状态 b 的某些节点变化时，可定义 `mutate` 函数来完成这种变化的连锁反应关系，对数据做最小粒度的更新

```ts
import { atom, derive } from 'helux';

const  [ objAtom1, setAtom ] = atom({a:1,b:{b1:1}});

const [objAtom2] = atom(
  { plusA100: 0 }
  {
    // 当 objAtom1.val.a 变化时，重计算 plusA100 节点的值
    mutate: {
      changePlusA100: (draft) => draft.plusA100 = objAtom1.val.a + 100,
    }
  },
);

setAtom(draft=>{ draft.a=100 });
console.log(objAtom2.val.plusA100); // 200
```

## 使用 atom

react 组件通过`useAtom` 钩子可使用 atom 共享对象，该钩子返回一个元组，使用方式完全对齐 `react.useState` 接口，react 用户可 0 成本上手此方式

```tsx | pure
import { useAtom } from 'helux';
const [numAtom] = atomx(1);

function Demo() {
  const [num, setAtom] = useAtom(numAtom); // 返回结果自动拆箱
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}
```

```tsx
import { atom, useAtom } from 'helux';
const [numAtom] = atom(1);

export default function Demo() {
  const [num, setAtom] = useAtom(numAtom);
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}
```
