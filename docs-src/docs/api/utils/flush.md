---
group:
  title: 帮助
  order: 6
order: 3
---

# flush

主动触发提交`reactive`对象变更数据

## 基础使用

### 触发 reactive 提交

```tsx
/**
 * defaultShowCode: true
 */
import { $, atomx, flush } from 'helux';

const ctx = atomx({ a: 1, b: 2 });
const { reactive } = ctx;

async function changeA() {
  reactive.a += 100;
  // or ctx.flush('changeA');
  flush(reactive, 'changeA');
  reactive.a += 100;
  flush(reactive, 'changeA');
}

export default function Demo() {
  return (
    <div>
      <h3>update at {Date.now()}</h3>
      {$(reactive.a)}
      <div>
        <button onClick={changeA}>changeA</button>
      </div>
    </div>
  );
}
```

### 触发 action draft 提交

```tsx
/**
 * defaultShowCode: true
 */
import { $, atomx, flush } from 'helux';

const ctx = atomx({ a: 1, b: 2 });
const { reactive } = ctx;

const ac = ctx.defineActions()({
  changeA: async function ({ draft }) {
    draft.a += 100;
    // or ctx.flush('changeA');
    flush(draft, 'changeA');
    draft.a += 100;
    flush(draft, 'changeA');
  },
});

export default function Demo() {
  return (
    <div>
      <h3>update at {Date.now()}</h3>
      {$(reactive.a)}
      <div>
        <button onClick={ac.actions.changeA}>changeA</button>
      </div>
    </div>
  );
}
```
