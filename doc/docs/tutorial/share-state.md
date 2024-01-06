---
sidebar_position: 1
---

# 共享状态

使用`atom`，`share`接口定义全局共享状态，该状态是一个引用稳定的只读代理对象，始终可以访问到最新结果

## 创建

### atom

atom 支持传入所有类型的值（包括原值类型值），返回结果是一个元组

```ts
import { atom } from 'helux';

const [atomState, setAtom, atomCtx] = atom(1);
```

可使用工厂函数创建

```ts
const [atomState, setAtom, atomCtx] = atom(() => 1);
```

元组第一位结果即是共享状态

```ts
import { atom } from 'helux';

const [numAtom] = atom(1); // { val: 1 }
const [boolAtom] = atom(true); // { val: true }
const [listAtom] = atom([1, 2, 3]); // { val: [1,2,3] }
const [dictAtom] = atom({ desc: 'helux atom' }); // { val: { desc: 'helux atom'} }

// 也支持 Map Set 结构，但不建议使用，不利于后期做数据持久化
const [numAtom] = atom(
  new Map([
    [1, 1],
    [2, 2],
  ]),
);
```

共享状态被被自动装箱为 { val: T } 结构，取值需做一次.val 操作

```ts
const [dictAtom] = atom({ desc: 'helux atom' }); // { val: { desc: 'helux atom'} }
console.log(dictAtom.val.desc);
```

### atomx

`atomx` 和 `atom` 完全等效，返回结果为对象结构

```ts
// atom返回的元组结果的第三位 atomCtx 即是 atomx 返回结果
const [atomState, setAtom, atomCtx] = atom(1);
atomCtx.state === atomState; // true
atomCtx.setState === setAtom; // true

// 等效于如下写法
const atomCtx = atomx(1);
const { state: atomState, setState: setAtom } = atomCtx;
```

### share

share 和 atom 使用方式完全一样，但只支持传入字典类型的值（`{}`），返回结果是一个元组

```ts
const [sharedDict, setShared, shareCtx] = share({ desc: 'helux atom' }); // ✅ ok
const [sharedDict, setShared, shareCtx] = share(() => ({ desc: 'helux atom' })); // ✅ ok

share(1); // ❌ error
share(() => 1); // ❌ error
```

返回的共享状态无`{ val: T }` 装箱行为，可直接取值

```ts
const [sharedDict] = share({ desc: 'helux atom' });
console.log(sharedDict.desc);
```

### sharex

`sharex` 和 `share` 完全等效，返回结果为对象结构

```ts
// atom返回的元组结果的第三位 atomCtx 即是 atomx 返回结果
const [sharedDict, setShared, shareCtx] = share({ desc: 'helux atom' });
shareCtx.state === sharedDict; // true
atomCtx.setState === setShared; // true

// 等效于如下写法
const shareCtx = sharex({ desc: 'helux atom' });
const { state: sharedDict, setState: setShared } = shareCtx;
```

:::tip

优先考虑 share 和 sharex 创建共享对象由于`share`接口没有装箱`{val: T}` 的操作，当共享对象为 `object` 时，可优先使用`share`来共享对象，避免一些无自动拆箱的场景多做一次`.val`取值操作

:::

## 读取

共享状态是一个引用稳定的只读代理对象，可直接向操作普通对象一样读取代理对象数据节点值

### 直接读取

读取 atom 返回的共享状态，需要手动拆箱，通过`.val`获取

```ts
const [state] = atom({ desc: 'helux atom' });
console.log(state.val.desc);
```

读取 share 返回的共享状态

```ts
const [state] = share({ desc: 'helux atom' });
console.log(state.desc);
```

### 通过 getAtom 读取

`getAtom`内部会自动拆箱 atom 返回共享状态，抹平`share`和`atom`间的读取差异，在一些没有自动拆箱行为的场景，使用`getAtom`较为方便

```ts
import { getAtom } from '';

const [state1] = atom({ desc: 'helux atom' });
const [state2] = share({ desc: 'helux atom' });

console.log(getAtom(state1).desc); // 'helux atom'
console.log(getAtom(state2).desc); // 'helux atom'
```

其余文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/heluxjs/helux/issues) ....
