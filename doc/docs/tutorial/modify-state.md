---
sidebar_position: 2
---

# 修改状态

`helux`严格遵循读写分离原则，`atom`，`share` 创建的共享状态是只读状态

```ts
const [state] = atom({ a: 1, b: { b1: 1, b2: 2 } });
state.b.b1 = 100; // ❌ 修改失败，控制会给出警告
console.log(state.b.b1); // 1
```

可通过以下方式修改共享状态

- 使用`atom`，`share`接口返回的修改句柄修改
- 使用 `reactive` 响应式对象修改
- 使用 `action` 定义方法后触发对应方法去修改

## setState

`atom`，`share`接口返回的元组第二位是修改状态的句柄

```ts
//                👇 修改状态句柄
const [state1, setAtom] = atom({ a: 1, b: { b1: 1, b2: 2 } });
//                👇 修改状态句柄
const [state1, setState] = share({ a: 1, b: { b1: 1, b2: 2 } });
```

也可以通过 ctx 对象获得`setState`句柄

```ts
const [, , ctx] = atom({ a: 1, b: { b1: 1, b2: 2 } });
const [, , ctx] = share({ a: 1, b: { b1: 1, b2: 2 } });
ctx.setState; // 👈 修改状态句柄

// 或者
const ctx = atomx({ a: 1, b: { b1: 1, b2: 2 } });
const ctx = sharex({ a: 1, b: { b1: 1, b2: 2 } });
ctx.setState; // 👈 修改状态句柄
```

### 直接传递新状态

原始值修改

```ts
const [state1, setAtom] = atom(1);

console.log(state1.val); // 1
setAtom(100);
console.log(state1.val); // 100
```

对象修改

```ts
const [state1, setAtom] = atom({ a: 1, b: { b1: 1, b2: 2 } });
const [state2, setShared] = share({ a: 1, b: { b1: 1, b2: 2 } });

// 注：此处 state1 需来自 atom 创建，需 .val 取值
console.log(state1.val.a); // 1
console.log(state2.a); // 1

// set 句柄内部会自动装箱，故 setAtom、setShared 调用方式一样
setAtom({ a: 100, b: { b1: 1, b2: 2 } });
setShared({ a: 100, b: { b1: 1, b2: 2 } });

console.log(state1.val.a); // 100
console.log(state2.a); // 100
```

### 回调里返回新状态

原始值修改，返回新值

```ts
const [state1, setAtom] = atom(1);

// 返回新值
setAtom(() => 100);
// 返回新值（基于上一刻的值）
setAtom((prev) => prev + 100);
```

对象值修改，返回部分值，内部会做浅合并操作

```ts
const [state1, setAtom] = atom({ a: 100, b: { b1: 1, b2: 2 }, c: { c1: 1, c2: 2 } });

// 内部会完成 newState = { ...prevState, b: { b1: 100, b2: 200 } } 操作
setAtom(() => ({ b: { b1: 100, b2: 200 } }));
```

对象值修改，返回新值，替换整个状态（相当于内部的浅合并把整个状态之前的值都覆盖了）

```ts
const [state1, setAtom] = atom({ a: 100, b: { b1: 1, b2: 2 }, c: { c1: 1, c2: 2 } });

// 内部会完成 newState = { ...prevState, ...newPartial } 操作
setAtom(() => ({ a: 1, b: { b1: 100, b2: 200 }, c: { c1: 100, c2: 200 } }));
```

### 回调里修改部分状态

针对对象值修改部分数据的场景，回调参数列表同事提供了一个可直接修改的草稿代理对象，可基于该草稿对象修改任意节点数据，生成的新状态和旧状态是结构共享的数据，可阅读[比较对象](/docs/tutorial/compare-state)了解更多。

```ts
const [state1, setAtom] = atom({ a: 100, b: { b1: 1, b2: 2 }, c: { c1: 1, c2: 2 } });

// 仅修改 b.b1 的值，（注此处的 draft 已自动拆箱）
setAtom((draft) => {
  draft.b.b1 = 100;
});
```

:::caution 箭头函数隐式返回值

这样的写法`setAtom((draft)=>draft.b.b1 = 100)` ts 是编译不通过的，因为箭头函数隐含返回了`100`，这个值时不能不作为部分状态合并到字典里的，故此处使用了``setAtom((draft)=>{draft.b.b1 = 100})` 带花括号的箭头函数写法来消除这个隐式返回值

:::

除了带花括号的箭头函数写法，还可以使用`setDraft`接口来消除这个编译错误，`setDraft`内部忽略函数任意返回值

```ts
const [state1, setAtom, ctx] = atom({ a: 100, b: { b1: 1, b2: 2 }, c: { c1: 1, c2: 2 } });
// ctx.setDraft((draft) => draft.b.b1 = 100); // 👈 此处箭头函数体无花括号包裹也能正常编译通过

// 也可使用 atomx 获得 ctx，此时可写为 const ctx = atomx(...); ctx.setDraft(...)
```

Map 对象值修改

```ts
const [state1, setAtom] = atom(
  new Map([
    [1, { id: 1, name: '1' }],
    [2, { id: 2, name: '2' }],
  ]),
);

// 仅修改 key 为 1 对应的值，（注此处的 draft 已自动拆箱）
setAtom((draft) => (draft.get(1).name = 'new'));
```

List 对象值修改

```ts
const [state1, setAtom] = atom([
  { id: 1, name: '2' },
  { id: 1, name: '2' },
]);
setAtom((draft) => (draft[0].name = 'new'));
```

### 回调里修改、返回部分状态
`setState`接口支持回调里修改既修改部分状态，同时也返回部分状态

```ts
const [state1, setAtom] = atom({ a: 100, b: { b1: 1, b2: 2 }, c: { c1: 1, c2: 2 } });

setAtom(draft=>{
  draft.b.b1 = 100;
  return { a: 1 }; // 👈 等效于写为：draft.a = 1
});

```

## reactive

helux 提供全局响应式对象做修改，修改值会在下一次微任务循环开始时提交并同步到只读代理上

```ts
// 此处使用 atomx 替代 atom，方便一次解构即可获取 reactive 对象
const { state, reactive } = atomx({ a: 100, b: { b1: 1, b2: 2 }, c: { c1: 1, c2: 2 } });

async function modStateByReactive(){
  reactive.b.b1 = 100;
  reactive.c.c1 = 100;
  console.log(reactive.b.b1); // 100
  console.log(reactive.c.c1); // 100
  console.log(state.b.b1); // 1
  console.log(state.c.c1); // 1
  await Promise.resolve(1);
  console.log(state.b.b1); // 100
  console.log(state.c.c1); // 100
}

```


其余文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/heluxjs/helux/issues) ....
