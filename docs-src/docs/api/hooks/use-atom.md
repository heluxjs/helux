---
order: 0
---

# useAtom

组件中使用共享状态，只接受`atom`，`share`返回的共享状态，传入其他对象则会报错。

## 基础用法

使用`atom` 返回的共享状态时，会自动拆箱，会返回`[state, setState]`结构提供个用户读状态或改状态。

### 使用原始类型 atom

```tsx
/**
 * defaultShowCode: true
 */
import { atom, useAtom } from 'helux';
const [numAtom] = atom(1);

export default function () {
  const [num, setNum] = useAtom(numAtom);
  return <h1 onClick={() => setNum(num + 1)}>useAtom: {num}</h1>;
}
```

使用`ctx.useState`，写法更简便，无绑定目标共享状态步骤。

```tsx
/**
 * defaultShowCode: true
 */
import { atom } from 'helux';
const [numAtom, , ctx] = atom(1);

export default function () {
  const [num, setNum] = ctx.useState();
  return <h1 onClick={() => setNum(num + 1)}>ctx.useState: {num}</h1>;
}
```

### 使用非原始类型 atom

```tsx
/**
 * defaultShowCode: true
 */
import { atom, useAtom } from 'helux';
const [dictAtom, , ctx] = atom({ a: 1, b: { b1: 1 } });

export default function () {
  // 或写为
  // const [ dict, setDict ] = ctx.useState();
  const [dict, setDict] = useAtom(dictAtom);
  const change = () => {
    setDict((draft) => {
      draft.a += 1;
      draft.b.b1 += 10;
    });
  };
  return (
    <div>
      <h1>{dict.a}</h1>
      <h1>{dict.b.b1}</h1>
      <button onClick={change}>change</button>
    </div>
  );
}
```

### 使用 share 共享状态

```tsx
/**
 * defaultShowCode: true
 */
import { share, useAtom } from 'helux';
const [dictAtom, , ctx] = share({ a: 1, b: { b1: 1 } });

export default function () {
  // 或写为
  // const [ dict, setDict ] = ctx.useState();
  const [dict, setDict] = useAtom(dictAtom);
  const change = () => {
    setDict((draft) => {
      draft.a += 1;
      draft.b.b1 += 10;
    });
  };
  return (
    <div>
      <h1>{dict.a}</h1>
      <h1>{dict.b.b1}</h1>
      <button onClick={change}>change</button>
    </div>
  );
}
```

## 参数

`useAtom`支持透传`IUseSharedStateOptions`可选参数，类型描述如下

````ts
  /**
   * default: every ，设置依赖收集策略
   */
  collectType?: 'no' | 'first' | 'every';
  /**
   * 设置视图id
   */
  id?: NumStrSymbol;
  /**
   * default: true ，是否以 pure 模式使用状态，此参数只影响字典数据的依赖收集规则
   */
  pure?: boolean;
  /**
   * 设置固定的依赖项
   */
  deps?: (readOnlyState: T) => any[] | void;
  /**
   * default: true，是否记录数组自身依赖
   */
  arrDep?: boolean;
  /**
   * default: true，是否记录数组下标依赖
   * ```
   */
  arrIndexDep?: boolean;
````

### collectType

默认值: `every` ，设置为 `first` 或 `no` 可以进一步提高组件渲染性能，但需要注意为 `first` 时如果组件的依赖是变化的，会造成依赖丢失的情况产生，触发组件不会重渲染的 bug，设为 `no` 时不会从 ui 渲染里收集到依赖，需 `deps` 函数补充依赖

```txt
1 no ，此时依赖仅靠 deps 提供
2 first ，仅首轮渲染收集依赖，后续渲染流程不收集
3 every ，每一轮渲染流程都实时收集，允许不同的渲染结果有不同的依赖项
```

```tsx
/**
 * defaultShowCode: true
 */
import { atom, useAtom } from 'helux';
const [dictAtom, , ctx] = atom({ a: 1, b: { b1: 1 } });

export default function () {
  // or ctx.useState({ collectType: 'no' });
  const [dict, setDict] = useAtom(dictAtom, { collectType: 'no' });
  const change = () => {
    setDict((draft) => {
      draft.a += 1;
      draft.b.b1 += 10;
    });
  };
  return (
    <div>
      <h1>{dict.a}</h1>
      <h1>{dict.b.b1}</h1>
      <h3 style={{ color: 'red' }}>不收集依赖，点击change无反应</h3>
      <button onClick={change}>change</button>
    </div>
  );
}
```

### id

在 ICreateOptionsFull.rules 里配置更新的 ids 包含的值指的就是此处配置的 id，此 id 属于传入的 sharedState ，即和共享状态绑定了对应关系，意味着组件使用不同的 sharedState 时传入了相同的 id，是相互隔离的

```tsx
/**
 * defaultShowCode: true
 */
import { atom, useAtom } from 'helux';
const [dictAtom, , ctx] = atom(
  { a: 1, b: { b1: 1 } },
  {
    rules: [
      // state.b.b1 变化时，触发这些 ids 视图更新
      { when: (state) => state.b.b1, ids: ['up1'] },
    ],
  },
);
const change = () => {
  ctx.setState((draft) => {
    draft.b.b1 += 10;
  });
};

export default function () {
  // or ctx.useState({ id: 'up1' });
  useAtom(dictAtom, { id: 'up1' });
  return (
    <div>
      <h1>update at {Date.now()}</h1>
      <h3>
        因配置的id满足了rules配置的变更规则，当前组件对数据无依赖也将被渲染
      </h3>
      <button onClick={change}>change</button>
    </div>
  );
}
```

### deps

如需补充一些组件渲染过程中不体现的额外依赖时，可设置`deps`函数，此时组件的依赖是 deps 返回依赖和渲染完毕收集到的依赖合集

```tsx
/**
 * defaultShowCode: true
 */
import { atom, useAtom } from 'helux';
const [dictAtom, , ctx] = atom({ a: 1, b: { b1: 1 } });
const change = () => {
  ctx.setState((draft) => {
    draft.b.b1 += 10;
  });
};

export default function () {
  // or ctx.useState({ id: 'up1' });
  useAtom(dictAtom, { deps: (state) => [state.b.b1] });
  return (
    <div>
      <h1>update at {Date.now()}</h1>
      <button onClick={change}>change</button>
    </div>
  );
}
```

:::success{title=依赖锁定}
`deps`依赖函数仅在组件首次渲染时执行，后续不再执行，同时设置`collectType`为`no`不会影响`deps`收集依赖，可以把`deps`当做依赖锁定功能实用。
:::

### arrDep

默认 `true`，是否记录数组自身依赖，当确认是孩子组件自己读数组下标渲染的场景，可设置为 `false`

```ts
// 默认 true: 记录数组自身依赖
const [dict] = useAtom(dictAtom);
// 以下读值操作，收集到依赖有 2 项，是 dict, dict.list[0]
dict.list[0];

// 重置 list，引发当前组件重渲染
setDictAtom((draft) => (draft.list = draft.list.slice()));

// false: 不记录数组自身依赖，适用于孩子组件自己读数组下标渲染的场景
const [dict] = useAtom(dictAtom, { arrDep: false });
// 以下读值操作，收集到依赖只有 1 项，是 dict.list[0]
dict.list[0];

// 重置 list，不会引发当前组件重渲染
setDictAtom((draft) => (draft.list = draft.list.slice()));
```

### arrIndexDep

默认` true`，是否记录数组下标依赖，当通过循环数组生成孩子的场景，可设置为 `false`，减少组件自身的依赖记录数量，此参数在 arrDep=true 时设置有效，arrDep=false 时，`arrIndexDep` 被自动强制设为 `true`

```ts
 arrDep=true arrIndexDep = true
 // deps: list list[0] list[...]

 arrDep=true arrIndexDep = false
 // deps: list

 arrDep=false
 // deps: list[0] list[...]
```

### pure

默认` true`，是否以 pure 模式使用状态，此参数只影响字典数据的依赖收集规则

```txt
1 为 true，表示状态仅用于当前组件ui渲染，此模式下不会收集中间态字典依赖，只记录字典最长依赖
2 为 false，表示状态不只是用于当前组件ui渲染，还会透传给 memo 的子组件，透传给 useEffect 依赖数组，
此模式下会收集中间态字典依赖，不丢弃记录过的字典依赖
```

示例演示 `pure`为 true 和 false 时，收集到的依赖对比结果
<code src="./demos/setting-pure.tsx"></code>

pure = true ，拥有更好的重渲染命中精准度

```ts
// 重新赋值了 extra，但其实 extra.list, extra.mask 孩子节点没变化，
// helux 内部经过比较 extra.list, extra.mask 值发现无变化后不会重渲染 Demo
setState(draft=> draft.extra = { ...draft.extra });

// 👻 但要注意，此时如果 extra 传给了 useEffect，并不会因为 extra的变化而引起 Effect 重新执行
useEffect(()=>{//...logic}, [state.extra]);
// 如执行了则是因为其他依赖引起组件重渲染刚好顺带触发了 Effect 执行

// 所以这里如需要中间态依赖也能正常收集到，有以下两种方式
// 1 【推荐】人工补上 extrta 依赖（相当于固定住依赖）
useAtom(dictAtom, { deps: state=>state.extra });
// 2 设置 pure 为 false
useAtom(dictAtom, { pure: false });
```
