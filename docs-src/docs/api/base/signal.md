---
group:
  title: 信号
  order: 1
order: 0
---

# signal

`signal`接口允许用户直接将共享状态的数据直接绑定到视图，首次渲染完毕即收集并锁定对应的数据依赖。

## 绑定单个值

绑定`atom`单个值

```tsx
/**
 * defaultShowCode: true
 */
import { atom, signal } from 'helux';

const [numAtom, setAtom] = atom(1);
const changeNum = () => setAtom((prev) => prev + 1);

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <div>primitive atom: {signal(numAtom)}</div>
      <button onClick={changeNum}>changeNum</button>
    </div>
  );
}
```

## 使用$别名

提供别名`$`让代码书写更简洁

```tsx
/**
 * defaultShowCode: true
 */
import { $, atom } from 'helux';

const [numAtom, setAtom] = atom(1);
const changeNum = () => setAtom((prev) => prev + 1);

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <div>primitive atom: {$(numAtom)}</div>
      <button onClick={changeNum}>changeNum</button>
    </div>
  );
}
```

## 单值格式化

支持`$(val, format)`调用来个性化渲染结果

```tsx
/**
 * defaultShowCode: true
 */
import { $, atom } from 'helux';

const [numAtom, setAtom] = atom(1);
const changeNum = () => setAtom((prev) => prev + 1);

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <div>{$(numAtom)}</div>
      <div>{$(numAtom, (val) => `hello signal: ${val}`)}</div>
      <button onClick={changeNum}>changeNum</button>
    </div>
  );
}
```

## 绑定多个值

一次 signal 调用绑定`atom`、`share`多个值，传入一个回调函数，返回一个 jsx 片段即可，如需抽象为组件可使用[block](api/base/block)。

```tsx
/**
 * defaultShowCode: true
 */
import { $, atom, share } from 'helux';

const [obj1, setObj1] = atom({ a: { a1: 1 }, b: 1 });
const [obj2, setObj2] = share({ a: { a1: 1 }, b: 1 });

const changeAtomA1 = () => setObj1((draft) => void (draft.a.a1 += 100));
const changeShareA1 = () => setObj2((draft) => void (draft.a.a1 += 100));

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <div>
        {$(() => (
          <div>
            {/* 注意此次 atom 对象需要自己 .val 拆箱 */}
            <div>obj1.a.a1 {obj1.val.a.a1}</div>
            <div>obj1.b {obj1.val.b}</div>
            <div>obj2.a.a1 {obj2.a.a1}</div>
          </div>
        ))}
      </div>
      <button onClick={changeAtomA1}>changeAtomA1</button>
      <button onClick={changeShareA1}>changeShareA1</button>
    </div>
  );
}
```
