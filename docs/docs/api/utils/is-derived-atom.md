---
group:
  title: 判断
  order: 6
order: 1
---

# isDerivedAtom

判断是否是`derive`接口返回的结果

## 基础使用

```ts
import { atom, derive, deriveDict, isDerivedAtom } from 'helux';

const [state1] = atom(1);

const result1 = derive(() => state1.val + 1); // { val: 2 }
const result2 = deriveDict(() => ({ num: state1.val + 1 })); // { num: 2 }

isDerivedAtom(result1); // true
isDerivedAtom(result2); // false
```

传入其他非`derive`返回的值都会返回 `false`

```ts
isDerivedAtom(1); // false
isDerivedAtom(); // false
isDerivedAtom([]); // false
isDerivedAtom({ a: 1 }); // false
```
