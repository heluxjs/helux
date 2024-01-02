---
group:
  title: 信号
  order: 1
order: 1
---

# block
`block`允许用户将绑定了共享状态的jsx片段抽象为组件，方便其它地方复用。

## 定义block组件

block组件和普通react组件一样，支持透传`props`

```tsx
/**
 * defaultShowCode: true
 */
import { block, share } from 'helux';

const [ obj, setObj ] = share({ a: { a1: 1 }, b: 1 });
const changeA1 = ()=> setObj(draft=>void(draft.a.a1+=100));

const User = block((props)=>(
  <div style={{border:'1px solid green', padding: '6px', margin: '6px'}}>
    <div>props.mark: {props.mark || 'no mark'}</div>
    <div>obj.a.a1 {obj.a.a1}</div>
    <div>obj.b {obj.b}</div>
  </div> 
));

export default function Demo(){
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User />
      <User mark="second user" />
      <button onClick={changeA1}>changeA1</button>
    </div>
  );
}
```

## 组件内部使用钩子

`block`组件内部支持使用其他钩子函数

```tsx
/**
 * defaultShowCode: true
 */
import { useState } from 'react';
import { block, share } from 'helux';

const [ obj, setObj ] = share({ a: { a1: 1 }, b: 1 });
const changeA1 = ()=> setObj(draft=>void(draft.a.a1+=100));

const User = block(()=>{
  const [ tip, setTip ] = useState('');
  const changeTip = ()=>setTip(`${Date.now()}`);
  return (
    <div style={{border:'1px solid green', padding: '6px', margin: '6px'}}>
      <div>tip: {tip}</div>
      <div>obj.a.a1 {obj.a.a1}</div>
      <div>obj.b {obj.b}</div>
      <button onClick={changeTip}>changeTip</button>
    </div>
  );
});

export default function Demo(){
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User />
      <button onClick={changeA1}>changeA1</button>
    </div>
  );
}
```

## ref转发
block组件回调的第二位BlockParams参数格式为`{ props; status; read; ref?}`，用户定义的ref可从第二位参数获取到

```tsx
/**
 * defaultShowCode: true
 */
import { useState, useRef, useImperativeHandle } from 'react';
import { block, share } from 'helux';

const [ obj, setObj ] = share({ a: { a1: 1 }, b: 1 });
const changeA1 = ()=> setObj(draft=>void(draft.a.a1+=100));

const User = block((props, params)=>{
  const [ tip, setTip ] = useState('');
  const changeTip = ()=>setTip(`${Date.now()}`);
  useImperativeHandle(params.ref, ()=>({
    changeTip,
  }));

  return (
    <div style={{border:'1px solid green', padding: '6px', margin: '6px'}}>
      <div>tip: {tip}</div>
      <div>obj.a.a1 {obj.a.a1}</div>
      <div>obj.b {obj.b}</div>
      <button onClick={changeTip}>changeTip</button>
    </div>
  );
});

export default function Demo(){
  const ref = useRef();
  const callChildFn = ()=> ref.current?.changeTip();

  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User ref={ref} />
      <button onClick={changeA1}>changeA1</button>
      <button onClick={callChildFn}>callChildFn</button>
    </div>
  );
}
```

## 感知派生结果变化

如存在异步修改的派生值，设置`block`调用的第二位参数为true开启感知派生结果状态变化功能后，可直接读取`params.status`获得派生结果变化状态来渲染组件

```tsx
/**
 * defaultShowCode: true
 */
import { useState } from 'react';
import { block, share, derive } from 'helux';

const delay = (ms = 1000)=> new Promise(r=> setTimeout(r, ms));
const [ obj, setObj, ctx ] = share({ a: { a1: 1 }, b: 1 });
const result = derive({
  fn: ()=> obj.a.a1 + 1,
  task: async()=>{
    await delay();
    return obj.a.a1 + 100;
  },
})

const { actions, useLoading } = ctx.defineActions()({
  changeA({draft}){
    draft.a.a1+=100;
  },
});

const User = block((props, params)=>{
  const { status } = params; // 读取派生结果变化状态
  console.log(status);
  const [ b ] =params.read(result.val); // 通过 read 锁定依赖
  return (
    <div style={{border:'1px solid green', padding: '6px', margin: '6px'}}>
      {status.ok && <div>b {b}</div>}
      {status.loading && <div>loading...</div>}
      {status.err && <div>{status.err.message}</div>}
    </div>
  );
}, true);

export default function Demo(){
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User />
      <button onClick={actions.changeA}>changeA</button>
    </div>
  );
}
```


## 感知共享状态变化

如存在异步修改的状态值，可调用`useLoading`读取`status`获得变化状态来渲染组件

```tsx
/**
 * defaultShowCode: true
 */
import { useState } from 'react';
import { block, share } from 'helux';
const delay = (ms = 1000)=> new Promise(r=> setTimeout(r, ms));
const [ obj, setObj, ctx ] = share({ a: { a1: 1 }, b: 1 });
const { actions, useLoading } = ctx.defineActions()({
  async changeA({draft}){
    await delay();
    draft.a.a1+=100;
  }
});

const User = block((props, params)=>{
  const { changeA: status } = useLoading();
  return (
    <div style={{border:'1px solid green', padding: '6px', margin: '6px'}}>
      {status.ok && <div>obj.a.a1 {obj.a.a1}</div>}
      {status.loading && <div>loading...</div>}
      {status.err && <div>{status.err.message}</div>}
    </div>
  );
});

export default function Demo(){
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User />
      <button onClick={actions.changeA}>changeA</button>
    </div>
  );
}
```
