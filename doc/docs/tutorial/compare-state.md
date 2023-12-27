---
sidebar_position: 3
---

# 比较状态

对象值修改，回调提供的一个可直接修改的草稿代理对象，可基于该对象修改任意节点数据，生成的新状态和旧状态是结构共享的数据，

## isDiff

对象型节点可借助`isDiff`函数比较是否相等

```ts
import { isDiff } from 'helux';

const { b, c } = state1.val;
setAtom((draft) => (draft.b.b1 = 100));
const { b: newB, c: newC } = state1.val;

// 👉 此时 b，c 节点是代理对象，直接比较的话，它们始终是不相等的，
// 而 isDiff 函数内部会比较数据版本号并给出正确的结果
isDiff(b, newB); // true
isDiff(c, newC); // false，c 节点未发生过变化
```

## getSnap

也可以借助`getSnap`函数获取快照对象来直接比较

```ts
import { getSnap } from 'helux';

const snap1 = getSnap(state1); // 修改前的快照
setAtom((draft) => (draft.b.b1 = 100));
const snap2 = getSnap(state1); // 修改后的快照
const { b: newB, c: newC } = state1.val;

console.log(snap1.val.b !== snap2.val.b); // true
console.log(snap1.val.c !== snap2.val.c); // false，c 节点未发生过变化
```

其余文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/heluxjs/helux/issues) ....
