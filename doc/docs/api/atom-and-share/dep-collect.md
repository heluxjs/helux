---
sidebar_position: 0
---

# 依赖收集

`helux`对共享对象实现了依赖收集功能，可做到更精准的重渲染，`signal`和`block`内部实现本身也依赖到了此功能

## 普通对象

组件在渲染函数里读取对象时的具体值时，就收集到了数据依赖

```tsx
const [obj, setState] = share({ a: 1, b: { b1: 2 }, c: 100 });

function change() {
  // 基于草稿修改，回调执行结束后，内部会生成一份结构共享特性的新状态
  // 当前修改只会引起下面的 Comp2 组件实例重渲染
  setState((draft) => (draft.b.b1 = Math.random()));
}

function Comp1() {
  const [obj] = userShared(objAtom);
  // 当前组件仅对 obj.a 有依赖
  return <h1>obj.a {obj.a} </h1>;
}

function Comp2() {
  const [obj] = userShared(objAtom);
  // 当前组件仅对 obj.b.b1 有依赖
  return <h1>obj.b.b1 {obj.b.b1} </h1>;
}
```

## 数组对象

对于数组结构的数据，默认只追踪到下标位置，可配合工具函数`shallowCompare`做精准渲染

```tsx
import { atom, shallowCompare, useAtom } from 'helux';
// 因 share 直接受 object 数据，此处刻意用 atom
const [listAtom, setAtom] = atom([
  { id: 1, name: 11 },
  { id: 2, name: 22 },
]);

function change(idx: number) {
  // 当前修改仅会引起 List 和 Item1 重渲染
  setAtom((draft) => {
    draft.val[idx].name = Date.now();
  });
}

const Item = React.memo((props) => {
  const { item } = props;
  return (
    <div>
      id: {item.id} name: {item.name}
    </div>
  );
  // 透传 shallowCompare 函数，用于比较item代理对象前后是否一致，内部会比较数据版本号
}, shallowCompare);

function List() {
  const [list] = useAtom(listAtom);
  return (
    <div>
      <button onClick={() => change(1)}>change idx 1</button>
      <div>
        {list.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```

## 动态依赖收集

`helux`默认对组件开启动态的依赖收集行为，可实时收集到组件实例的每一轮渲染所需依赖，做到更智能的精确更新

```tsx
const [obj, setState] = share({ a: 1, b: { b1: 2 }, c: 100 });

function Comp1() {
  const [obj] = userShared(objAtom);
  // 在 obj.a>10 时，当前组件依赖时 obj.a，obj.b.b1
  // 反之则是 obj.a，obj.c
  return <h1>dynamic dep colletion {obj.a > 10 ? obj.b.b1 : obj.c} </h1>;
}
```

如不需要，可设置为仅首轮渲染需要收集依赖，进一步提高渲染性能

```ts
// 仅首轮渲染收集依赖
useShared(numAtom, { collect: false });
```

:::caution 依赖丢失

关闭动态依赖收集后，如果出现条件语句读取值的场景，例如：`<h1>{state.a?state.b:state.c}</h1>`，则会造成依赖丢失，可提前全部读取再使用来避免此问题

:::

## 自定义收集规则

默认情况下，对象的依赖收集的深度值为`6`，在不操过深度值的情况下，针对数组只收集到下标位置，可通过配置依赖收集规则来改变默认的收集策略

- `stopDepth` 控制依赖收集深度，默认`6`
- `stopArrDep` 控制数组是否只收集到下标位置，默认 `true`

```ts
const [state, setState, ctx] = share(
  {
    a: {
      b: {
        list: [
          { name: 1, age: 2, info: { street: 'u_road' } },
          { name: 2, age: 22, info: { street: 'u_road_2' } },
        ],
      },
    },
    a1: { a2: { a3: { a4: { a5: { a6: { a7: { a8: 1 } } } } } } },
  },
  {
    stopDepth: 12, // 改为 12
    stopArrDep: false, // 对象里的所有数组都继续向下收集（即关闭只收集到下标位置规则）
  },
);
```

可针对状态某些节点设置收集规则

```ts
const [state, setState, ctx] = share({ ... }, {
  rules: [
    // 当读取或写入 a.b.list 数据时，停止依赖收集，即依赖只记录到下标，此设定优先级高于顶层的 stopArrDep
    { when: state => state.a.b.list, stopDep: true },
  ],
  stopArrDep: false, // 对象里的所有数组都继续向下收集（即关闭只收集到下标位置规则）
});
```
