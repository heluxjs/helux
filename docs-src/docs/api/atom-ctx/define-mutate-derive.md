---
group:
  title: Define
  order: 1
order: 4
---

# defineMutateDerive

全新定义一个状态对象并对其批量定义派生函数，这些函数的计算依赖源可以是当前`ctx.state`也可以是其他状态，返回结果形如  
 `{ derivedState, useDerivedState, witnessDict, getLoading, useLoading, useLoadingInfo }`

___
 :::info
更多用法查阅[模块化/defineFullDerive](/guide/modular#definemutatederive)
:::

