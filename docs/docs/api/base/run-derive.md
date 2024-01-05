---
group:
  title: 全量派生
  order: 2
order: 4
---

# runDerive

全量派生函数除了观察到数据依赖变化后被触发执行的方式，还可使用 `runDerive` 接口人工触发对应的派生函数

## 基础使用

```ts
import { derive, atom, runDerive } from 'helux';

const [numAtom] = atom(1);
const plus100Result = derive(() => numAtom.val + Date.now());

// 打印两次结果，已经不相同
const [ret1] = runDerive(plus100Result);
console.log(ret1.val);
const [ret2] = runDerive(plus100Result);
console.log(ret2.val);
```

`runDerive`第二位为`throwErr`，表示是否抛出错误，默认 `false`，此时错误传地给元组第二位参数

```ts
const [ret1, err] = runDerive(plus100Result, true);
if (err) {
  // handle err
}
```

可设置`throwErr`为`true`，表示抛出错误，此时用户需要自己`try catch`并处理错误

```ts
try {
  const [ret1] = runDerive(plus100Result, true);
} catch (err) {
  // handle err
}
```
