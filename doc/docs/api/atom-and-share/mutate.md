---
sidebar_position: 2
---

# 可变派生

`createOptions.mutate`用于配置**可变派生**函数

```ts
atom(someObj, {
  mutate: ... // 配置mutate
})

share(someObj, {
  mutate: ... // 配置mutate
})
```

更多使用方式查看[mutate](/helux/docs/api/mutate)文档

- [mutate 定义方式](/helux/docs/api/mutate/definition-ways)
- [同步可变派生](/helux/docs/api/mutate/sync-mutate)
- [异步可变派生](/helux/docs/api/mutate/async-mutate)

## 配置 mutate

### 监听其他共享对象变化

```ts
const [numAtom] = atom(1);

// numAtom 变化时，计算 obj.c 值
const [ obj ] = share({a:1, b:2, c:0}, {
  mutate: (draft)=>draft.c = numAtom.val;
})

// numAtom 变化时，计算 plus100Atom 值
const [ plus100Atom ] = atom(0, {
  mutate: (draft)=>{draft.val = numAtom.val + 100},
})
```

### 监听自身变化

```ts
// a,b变化时，计算c
const [ obj ] = share({a:1, b:2, c:0}, {
  mutate: {
    changeA: {
      deps: (state)=> [state.a, state.b],
      fn:(draft,[a,b])=> {draft.c = a+b};
    }
  }
});
```

也可写为数组方式

```ts
// a,b变化时，计算c
const [ obj ] = share({a:1, b:2, c:0}, {
  mutate: [
    {
      deps: (state)=> [state.a, state.b],
      fn:(draft,[a,b])=> {draft.c = a+b};
      desc: 'changeA', // desc 可选，描述mutate作用，建议添加，方便后期接入插件系统追溯状态变更流程
    }
  ]
});
```
