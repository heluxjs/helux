---
group:
  title: 基础
  order: 0
order: 0
---

# 状态

## Share

通过 `share` 接口创建全局共享状态，share 必须传入 普通 json 对象，返回一个只可读的代理对象，是一个全局可使用的稳定引用，可总是读取到最新值。

```tsx
import { $, share } from 'helux';
const [state, setState] = share({ a: 1, b: { b1: 1, b2: 2 } });
export default () => {
  return (
    <div>
      <div>state.a={$(state.a)}</div>
      <button type="button" onClick={() => setState((draft) => (draft.a += 1))}>
        使用setState更新
      </button>
    </div>
  );
};
```

## Atom

如需共享原始值类型的值，可通过 `atom` 接口创建全局共享状态，atom 支持传入所有类型的值，返回一个代理对象，返回结果被自动装箱为 `{ val: T }` 结构，，也是一个全局可使用的稳定引用，可总是读取到最新值，但需要多做一次`.val`取值操作

```ts
import { atom } from 'helux';

const [numAtom] = atom(1); // { va: 1 }
console.log(numAtom.val); // print: 1
```

:::tip

优先考虑 share 共享对象由于`share`接口没有装箱`{val: T}` 的操作，当共享对象为 `object` 时，可优先使用`share`来共享对象，避免一些无自动拆箱的场景多做一次`.val`取值操作

:::
