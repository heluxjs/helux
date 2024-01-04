---
group:
  title: 判断
  order: 6
order: 0
---

# isAtom

判断是否是`atom`接口返回的对象

## 基础使用

```ts
import { atom, share } from 'helux';

const [ state1 ] = atom(1);
const [ state2 ] = share({a:1, b:2});

isAtom(state1); // true
isAtom(state2); // false
```

传入其他非`atom`返回的值都会返回 `false`

```ts
isAtom(1); // false
isAtom(); // false
isAtom([]); // false
isAtom({a:1}); // false
```
