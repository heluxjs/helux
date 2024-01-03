---
group:
  title: 基础
  order: 0
order: 0
---

# 属性

## state
共享状态根值，对于`atom`返回结果，会装箱为 `{val:T}`结构，对于`share`返回结果，无装箱行为，该值时一个只可读的稳定引用，总是可以读取最新值，任何修改都将无效。

```ts
// 元组第一位获得
const [ state ] = atom(1);
const [ state ] = share({a:1});

// 元组第3位获得
const [ ,,{state} ] = atom(1);
const [ ,,{state} ] = share({a:1});

// atomx、sharex 返回结果解构获得
const { state } = atomx(1);
const { state } = sharex({a:1});
```

## stateVal

共享状态真实值引用，对于非原始值`atom`返回结果，stateVal 为拆箱后的代理对象，对于原始值`atom`返回结果，stateVal 为拆箱后的原始值。

对于`share`返回结果，`stateVal`和`state`相等，指向同一个引用。

## reactive

`reactive`是全局可用的响应式对象真实值引用，对于非原始值`atom`返回结果，`reactive`是拆箱后的代理对象，可直接对`reactive`修改，默认数据变更在下一次事件循环微任务开始执行前提交

```ts
const { reactive } = sharex({a:1});
setTimeout(()=>{
  reactive.a+=1;
}, 1000);
```

## reactiveRoot

`reactiveRoot`是全局可用的响应式对象根值引用，对于非原始值`atom`返回结果，`reactiveRoot`是拆箱前的代理对象。

对于`share`返回结果，`reactiveRoot`和`reactive`相等，指向同一个引用。

## sharedKey

共享对象的唯一key数字，由内部生成

## sharedKeyStr

共享对象的唯一key字符串

## rootValKey

共享对象的真实值key

## isAtom

共享对象是否有 `atom` 接口创建
