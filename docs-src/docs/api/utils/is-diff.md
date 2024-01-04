---
group:
  title: 判断
  order: 6
order: 2
---

# isDiff

比较两个值是否一样

## 基础使用

### 比较原始值

```ts
import { isDiff } from 'helux';

isDiff(1, 1); // true
isDiff(1, 2); // false
```

### 比较atom子节点

`atom`对象型节点可借助`isDiff`函数比较是否相等，因节点是代理对象，直接比较的话，它们始终是不相等的，而 isDiff 函数内部会比较数据版本号并给出正确的结果

```ts
import { isDiff } from 'helux';

const { b, c } = state1.val;
setAtom((draft) => (draft.b.b1 = 100));
const { b: newB, c: newC } = state1.val;

// 👉 此时 b，c 节点是代理对象，直接比较的话，它们始终是不相等的，需借助 isDiff 比较
isDiff(b, newB); // true
isDiff(c, newC); // false，c 节点未发生过变化
```

