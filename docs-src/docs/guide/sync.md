---
group:
  title: 开始
  order: 0
order: 6
---

# 双向绑定

提供`syncer` 和 `sync`函数生成数据同步器，可直接绑定到表达相关`onChange`事件，同步器会自动提取事件值并修改共享状态，达到**双向绑定**的效果！

## 浅层数据绑定

只有一层 json path 的对象，可以使用 `syncer` 生成数据同步器来绑定

```tsx | pure
const { syncer, state } = sharex({ a: 1, b: { b1: 1 }, c: true });

<input value={state.a} onChange={syncer.a} />;
<input type="checkbox" checked={state.c} onChange={syncer.c} />;
```

`syncer`会自动分析是否是事件对象，是就提取值不是就直接传值，所以也可以很方便的绑定 ui 组件库

```tsx | pure
import { Select } from 'antd';

<Select value={state.a} onChange={syncer.a} />;
```

```tsx
import { sharex } from 'helux';

const { syncer, useState } = sharex({ a: 1, b: { b1: 1 }, c: true, desc: '' });

function Demo1() {
  const [state] = useState();
  return (
    <div>
      <input value={state.desc} onChange={syncer.desc} />
      <input type="checkbox" checked={state.c} onChange={syncer.c} />
    </div>
  );
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
  </div>
);
```

原始值 atom 绑定时，传递`syncer`自身即可

```tsx | pure
import { atomx } from 'helux';
const { syncer, useState } = atomx('');

function Demo1() {
  const [state] = useState();
  return <input value={state} onChange={syncer} />;
}
```

```tsx
import { atomx } from 'helux';

const { syncer, useState } = atomx('');

function Demo1() {
  const [state] = useState();
  return <input value={state} onChange={syncer} />;
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
  </div>
);
```

## 深层数据绑定

多层 json path 的对象，使用 `sync` 生成数据同步器来绑定，可通过回调设定绑定节点

```tsx | pure
// 数据自动同步到 to.b.b1 下
<input value={state.b.b1} onChange={sync((to) => to.b.b1)} />
```

```tsx
import { sharex } from 'helux';

const { sync, useState } = sharex({ b: { b1: 1 } });

function Demo1() {
  const [state] = useState();
  return <input value={state.b.b1} onChange={sync((to) => to.b.b1)} />;
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
  </div>
);
```

可传递路径字符串数组定义绑定目标节点

```tsx | pure
<input value={state.b.b1} onChange={sync(['b', 'b1'])} />
```

```tsx
import { sharex } from 'helux';

const { sync, useState } = sharex({ b: { b1: 1 } });

function Demo1() {
  const [state] = useState();
  return <input value={state.b.b1} onChange={sync(['b', 'b1'])} />;
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
  </div>
);
```

## 拦截修改

`sync` 函数提供 `before` 回调给用户，支持数据提交前做二次修改

```tsx | pure
<input
  value={num}
  onChange={sync(
    (to) => to.b.b1,
    (val) => {
      return val === '888' ? 'boom' : val;
    },
  )}
/>
```

:::info{title=before 拦截}
输入 `888` 将触发篡改数据逻辑
:::

```tsx
import { sharex } from 'helux';

const { sync, useState } = sharex({ b: { b1: 1 } });

function Demo1() {
  const [state] = useState();
  return (
    <input
      value={state.b.b1}
      onChange={sync(
        (to) => to.b.b1,
        (val) => {
          return val === '888' ? 'boom' : val;
        },
      )}
    />
  );
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
  </div>
);
```
