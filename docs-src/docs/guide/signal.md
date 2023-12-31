---
group:
  title: 开始
  order: 0
order: 3
---

# signal

`signal`响应机制允许用户跳过`useAtom`直接将数据绑定到视图，实现 **0 hook**编码、**dom粒度**或**块粒度**更新。

## dom 粒度更新

使用`$`符号绑定单个原始值创建信号响应块，实现 dom 粒度更新

```tsx | pure
import { $ } from 'helux';

// 数据变更仅触发 $符号区域内重渲染
<h1>{$(numAtom)}</h1> // 包含原始值的atom可安全绑定
<h1>{$(shared.b.b1)}</h1>// 对象型需自己取到原始值绑定
```

:::info
点击下述示例`click me`按钮，包装块颜色未变，`update at`值未变，表示整个组件除了`$()`包裹区域被重渲染之外，其他地方都没有被重渲染
:::


```tsx
import { share, $ } from 'helux';
import { MarkUpdate } from '@helux/demo-utils';
const [state, setState] = share({
  a: 1,
  b: 2,
  info: { born: '2023-12-31', age: 2 },
});
const change = ()=>setState((draft) => void (draft.info.born = `${Date.now()}`));
// or 箭头函数包 {}，消除隐式返回值
// change = ()=> setState((draft) => { draft.info.born = `${Date.now()}` });

export default function Demo() {
  return (
    <MarkUpdate>
      <h2>update at {Date.now()}</h2>
      <h2>a very very long static content...</h2>
      <button onClick={change}>click me</button>
      <h1>state.info.born: {$(state.info.born)}</h1>
    </MarkUpdate>
  );
}
```

## 块粒度更新

使用`block`绑定多个原始值创建局部响应块，实现块粒度更新

```ts
// UserBlock 已被 memo
const UserBlock = block(() => (
  <div>
    name: {user.name}
    desc: {user.detail.desc}
  </div>
));

// 其他地方使用 UserBlock
<UserBlock />;
```


```tsx
import { share, $, block } from 'helux';
import { MarkUpdate, Entry } from '@helux/demo-utils';
const [state, setState] = share({
  name: 'helux',
  age: 1,
  detail: { desc: 'a powerful state engine' },
});
function changeName(){
  setState(draft=>{
    draft.name = `helux_${Date.now()}`;
    draft.detail.desc = `desc_${Date.now()}`;
  });
}

const Block1 = block(()=>{
  return (
    <MarkUpdate>
      <h3>name: {state.name}</h3>
      <h3>desc: {state.detail.desc}</h3>
    </MarkUpdate>
  );
});
const Block2 = block(()=>{
  return  <MarkUpdate><h3>age: {state.age}</h3> </MarkUpdate>;
});

export default ()=>(
  <Entry fns={[changeName]}>
    <Block1 />
    <Block2 />
  </Entry>
);
```
