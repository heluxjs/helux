---
sidebar_position: 4
---

# 规则

可通过`rules`配置**依赖收集策略**、**组件重渲染策略**相关规则

## 依赖收集策略

默认情况下，对象的依赖收集的深度值为`6`，在不超过深度值的情况下，针对数组只收集到下标位置，可通过配置依赖收集规则来改变默认的收集策略

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
    // 当读取或写入 a.b.list 数据时，停止依赖收集，即依赖只记录到下标，此设定优先级高于外层的 stopArrDep
    { when: state => state.a.b.list, stopDep: true },
  ],
  stopArrDep: false, // 对象里的所有数组都继续向下收集（即关闭只收集到下标位置规则）
});
```

## 组件重渲染策略

正常情况下，数据变更后 helux 会取出相关数据依赖的组件重渲染，支持用户定制额外的**组件重渲染策略**

### ids

配置 当 a.b.list 变化时，通知设定了 id 为 up1, up2 的组件重渲染，这些组件依赖 state 状态其他节点值，但对 state.a.b.list 无依赖。

```ts
const [state, setState, ctx] = share({ ... }, {
  rules: [
    { when: state => state.a.b.list, ids: ['up1', 'up2']},
  ],
});

// 此组件依赖仅是 desc， 但配置了id 为 up1，当 state.a.b.list 变化时，会通知 Demo 示例重渲染
function Demo(){
  const [ stateObj ] = useShared(state, { id: 'up1' });
  const { desc } = stateObj;
}
```

:::tip 不同的状态里 id 重复是互不影响的

使用方通过`useAtom`和`useShared`配置的 id 是指向所属的共享状态的，不同的共享状态配置了相同的 id 名称互不影响。

:::

以下 3 种方法不通过 rules ids 也能达到此效果

```ts
// 使用 useWatch
function Demo() {
  const [stateObj] = useShared(state);
  useWatch(
    () => {
      // forceUpdate
    },
    () => [stateObj.a.b.list],
  );
}

// 或者单纯的使用 deps 固定住依赖
function Demo() {
  const [stateObj] = useShared(state, { deps: () => [stateObj.a.b.list] });
}

// 也可以组件里读一下list依赖，但啥也不做
function Demo() {
  const [stateObj] = useShared(state);
  noop(stateObj.a.b.list);
}
```

### globalIds

配置 当 a.b.list 变化时，通知设定了 globalId 为 up1, up2 的组件重渲染，这些组件不依赖任何共享状态

```ts
const [state, setState, ctx] = share({ ... }, {
  rules: [
    { when: state => state.a.b.list, globalIds: ['up1', 'up2']},
  ],
});

// 此组件设定了 globalId 为 up1
function Demo(){
  useGlobalId('up1');
}
```

独立使用 useWatch 也能达到此效果

```ts
// 使用 useWatch
function Demo() {
  useWatch(
    () => {
      // forceUpdate
      // 注意此次传递的是外层的 state，而非 useAtom 导出的 stateObj
    },
    () => [state.a.b.list],
  );
}
```
