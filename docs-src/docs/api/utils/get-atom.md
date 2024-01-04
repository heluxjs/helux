---
group:
  title: 获取
  order: 6
order: 0
---

# getAtom

获取atom对象的真实值引用，对`atom`返回结果自动拆箱，对`share`返回结果则不拆箱

## 基础使用

```ts
import { atom, share, getAtom } from 'helux';

const [ state1 ] = atom({a:1, b:2});
const [ state2 ] = share({a:1, b:2});

console.log(state1); // { val: {a:1, b:2} }
console.log(state2); // {a:1, b:2}

console.log(getAtom(state1)); // {a:1, b:2}
console.log(getAtom(state2)); // {a:1, b:2}
```
