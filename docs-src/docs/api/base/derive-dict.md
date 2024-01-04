---
group:
  title: 全量派生
  order: 2
order: 1
---

# deriveDict

使用`deriveDict`定义[全量派生](/reference/glossary#全量派生)函数，仅当函数内的依赖发生变化时才会触发重计算，使用方式和[derive](/api/base/derive)完全一样，区别仅在于`deriveDict`生成的结果强制要求返回结果为字典对象结构，生成的派生结果无`{val:T}`装箱行为，故使用结果时无需拆箱。

## 基础使用

为`atom`返回结果定义派生函数

```ts
import { deriveDict, atom } from 'helux';

const [numAtom] = atom(1);
// { result: 101 }
const plus100Result = deriveDict(() => ({ result: numAtom.val + 100 }));
```

为`share`返回结果定义派生函数

```ts
import { deriveDict, share } from 'helux';

const [state] = share({ name: 'helux', author: 'fantasticsoul' });
// { fullName: ' hellow helux', fullAuthor: 'hello fantasticsoul' }
const plus100Result = deriveDict(() => ({
  fullName: `hello ${state.name}`,
  fullAuthor: `hello ${state.author}`,
}));
```
