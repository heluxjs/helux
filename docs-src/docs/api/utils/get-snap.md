---
group:
  title: 获取
  order: 6
order: 1
---

# getSnap

获取atom对象的快照

```ts
/**
 * isPrevSnap 默认值为 true，表示返回前一刻的快照，设为 false 表示返回最新快照
 */
function getSnap<T = Dict>(state: T, isPrevSnap?: boolean): T;
```

## 基础使用

### 获取前一刻快照

```ts
import { getSnap, share } from 'helux';

const { state, setDraft } = share({a:1, b:2});

console.log(getSnap(state)); // {a:1, b:2}
console.log(state); // {a:1, b:2}

setDraft(draft=>draft.a=100);

console.log(getSnap(state)); // {a:1, b:2}
console.log(state); // {a:100, b:2}
```

### 获取最新快照

```ts
import { getSnap, share } from 'helux';

const { state, setDraft } = share({a:1, b:2});

console.log(getSnap(state)); // {a:1, b:2}
console.log(state); // {a:1, b:2}

setDraft(draft=>draft.a=100);

console.log(getSnap(state, false)); // {a:100, b:2}
```
