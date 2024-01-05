---
group:
  title: 判断
  order: 6
order: 7
---

# markRaw

标记对象为原始对象，被标记后的对象不会被代理，有助于集成一些第三方特殊的复杂对象，避免额外的性能损耗，但是需要注意的是，被标记后该对象失去了**结构共享**特性，读取时不再会被浅复制，后果是多份快照里的此对象指向的是同个一引用

:::info
此特性来自于[limu-3.12.0](https://github.com/tnfe/limu/blob/main/CHANGELOG.md)提供的新接口`markRaw`
:::

## 基础使用

```ts
import { markRaw, atom } from 'helux';

const [ state, setState, ctx ] = atom({ a: { } });

setState(draft=>{
  draft.a.k1 = markRaw(AComplexThridObject);
});

function Demo(){
  const [ state ] = ctx.useState();
  // 由于 state.a.k1 返回值不再转变为代理，
  // 故依赖不会继续向下收集，当前组件收集到依赖为 state.a.k1
  const k5 = state.a.k1.k2.k3.k4.k5;
}
```
