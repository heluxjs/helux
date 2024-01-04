---
order: 7
---

# useService

使用服务功能，该函数有两个作用。

1 可替代`useCallback`，返回稳定的单个函数或多个函数集合，同时函数内部始终可以读取到外部的最新值，无闭包陷阱。

2 可替代`forwardRef`，无需`forwardRef`层层ref也能实现祖先组件调孩子组件方法。

## 基础用法

### 稳定的多函数

:::info
点击来自孩子组件的`call change`按钮，父亲组件重渲染了而被`memo`的孩子组件不会被重渲染，说明`srv.change`是稳定的，然后再点击`seeNum`按钮，弹出最新值说明无闭包陷阱
:::

```tsx
/**
 * defaultShowCode: true
 */
import React from 'react';
import { useService } from 'helux';

const Child = React.memo((props)=>{
  return <h3>
    <span>update at {Date.now()}</span>
    <button onClick={props.change}>call change</button>
  </h3>;
});

export default function Father() {
  const [num, setNum] = React.useState(1);
  const srv = useService({
    change: () => setNum(prev => prev + 1),
    seeNum: () => alert(num),
  });
  return <h1>
    <span>num {num}</span>
    <button onClick={srv.seeNum}>seeNum</button>
    <Child change={srv.change} />
  </h1>;
}
```

### 稳定的单函数

```tsx
/**
 * defaultShowCode: true
 */
import React from 'react';
import { useService } from 'helux';

const Child = React.memo((props)=>{
  return <h3>
    <span>update at {Date.now()}</span>
    <button onClick={props.change}>call change</button>
  </h3>;
});

export default function Father() {
  const [num, setNum] = React.useState(1);
  const change = useService(() => setNum(prev => prev + 1));
  return <h1>
    <span>num {num}</span>
    <Child change={change} />
  </h1>;
}
```

### 祖先调用孩子方法

使用`useService`让祖先调用孩子方法只需完成以下步骤即可

- 1 祖先组件使用`useRef`生成`ref`后传递给`srvRef={storeSrv(srvRef)}`

- 2 中间组件继续透传`props.srvRef`即可

- 3 孩子组件将`props`传递给`useService`方法第二位参数，则祖先组件可调用`useService`配置的所有方法

```tsx
/**
 * defaultShowCode: true
 */
import { share, useService, useAtom, storeSrv } from 'helux';
import React from 'react';

function GrandFather(props: any) {
  const srvRef = React.useRef<any>(null);

  return <div style={{border:'1px solid blue', padding: '12px'}}>
    <h3>GrandFather</h3>
    <button onClick={() => { srvRef.current?.change() }}>call child change</button>
    <Father a={1} srvRef={storeSrv(srvRef)} />
  </div>
}

function Father(props: any) {
  return <div style={{border:'1px solid red', padding: '12px'}}>
    Father comp:
    <Comp a={1} srvRef={props.srvRef} />
  </div>
}

function Comp(props) {
  const [num, setNum] = React.useState(1);
  const srv = useService({
    change: () => setNum(prev => prev + 1),
    seeNum: () => alert(num),
  }, props);
  return <div style={{border:'1px solid purple', padding: '12px'}}>num {num}</div>;
}

const Demo = () => <GrandFather />;

export default Demo;
```
