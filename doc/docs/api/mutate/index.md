---
sidebar_position: 0
---

# mutate

`mutate`接口用于定义**可变派生**函数，由于 `atom` 和 `share` 返回的对象天生自带依赖追踪特性，当共享对象 a 的发生变化后需要自动引起共享状态 b 的某些节点变化时，可定义 `mutate` 函数来完成这种变化的连锁反应关系，对数据做最小粒度的更新

## 定义方式

### options.mutate

创建`share`或`atom`对象时定义

#### 定义一个可变派生函数

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

#### 定义多个可变派生函数

字典方式定义

```ts
const [numAtom] = atom(1);

// numAtom 变化时，计算 obj.c obj.b 值
const [obj] = share(
  { a: 1, b: 2, c: 0 },
  {
    mutate: {
      changeB: (draft) => {
        draft.b = numAtom.val + 2;
      },
      changeC: (draft) => {
        draft.c = numAtom.val + 1;
      },
    },
  },
);

// 此处仅为了举例，更合适的方式是合并到一起
const [obj] = share(
  { a: 1, b: 2, c: 0 },
  {
    mutate: {
      changeBC: (draft) => {
        draft.b = numAtom.val + 2;
        draft.c = numAtom.val + 1;
      },
    },
  },
);
```

数组方式定义，写法 1：匿名箭头函数

```ts
const [obj] = share(
  { a: 1, b: 2, c: 0 },
  {
    mutate: [
      (draft) => {
        draft.b = numAtom.val + 2;
      },
      (draft) => {
        draft.c = numAtom.val + 1;
      },
    ],
  },
);
```

数组方式定义，写法 2：携带`desc`的可变函数描述对象

```ts
const [obj] = share(
  { a: 1, b: 2, c: 0 },
  {
    mutate: [
      {
        fn: (draft) => {
          draft.b = numAtom.val + 2;
        },
        desc: 'changeB',
      },
      {
        fn: (draft) => {
          draft.c = numAtom.val + 1;
        },
        desc: 'changeC',
      },
    ],
  },
);
```

### sharedCtx.mutate

基于`sharedCtx`返回的`mutate`接口定义

```diff
const [numAtom] = atom(1);

const [ obj, setObj, sharedCtx ] = share({a:1, b:2, c:0},
-  {
-    mutate: {
-      changeB: (draft)=>{draft.b = numAtom.val + 2},
-      changeC: (draft)=>{draft.c = numAtom.val + 1},
-    },
-  }
);

sharedCtx.mutate(
+  {
+    mutate: {
+      changeB: (draft)=>{draft.b = numAtom.val + 2},
+      changeC: (draft)=>{draft.c = numAtom.val + 1},
+    },
+  }
)

```

### topApi.mutate

基于`helux`导出的顶层 api`mutate`定义

```ts
import { mutate } from '';

// 是一个柯里化函数，先传入需要定义mutate的共享对象，再传入具体的mutate配置
const [obj] = mutate(shared)({
  changeB: (draft) => {
    draft.b = numAtom.val + 2;
  },
  changeC: (draft) => {
    draft.c = numAtom.val + 1;
  },
});
```

## 单个变化函数

只修改共享状态的单个值时，定义一个 `mutate` 函数即可

```ts
const [numAtom] = atom(3000);

const [finalPriceState] = share(
  { finalPrice: 0, otherInfo: { desc: 'other' } },
  {
    // 当 numAtom 变化时，重计算 finalPrice 节点的值
    mutate: (draft) => (draft.finalPrice = numAtom.val - 600),
  },
);
```
