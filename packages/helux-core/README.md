# helux

helux 是一个鼓励服务注入，并支持响应式变更 react 的全新数据流方案，为了更符合现在流行的 DDD 围绕业务构建领域模型而生。

> 它的前身是[concent](https://github.com/concentjs/concent)，经过抛弃面向 class 组件的 api 处理并做大量裁剪后，诞生了`helux`.

它拥有以下优势：

- 轻量，压缩后 2kb
- 简单，仅暴露 6 个 api
- 高性能，自带依赖收集
- 响应式，支持创建响应式对象，在视图之外变更对象将同步更新视图
- 服务注入，配合`useService`接口轻松控制复杂业务逻辑，返回稳定的方法引用
- 状态提升 0 改动，所以地方仅需将`useObject`换为`useSharedObject`即可提升状态共享到其他组件
- 避免 forwordRef 地狱，内置的`exposeService`模式将轻松解决父调子时的`ref`转发晦涩理解问题和传染性（隔代组件需要层层转发）
- ts 友好，100% ts 编写，为你提供全方位类型提示

![2](https://user-images.githubusercontent.com/7334950/232248704-95532231-ae99-4555-adcd-8d5999a0c5d4.gif)

see oneline [demo1](https://codesandbox.io/s/helux-effect-qyv6xz?file=/src/App.tsx)，[demo2](https://codesandbox.io/p/sandbox/use-service-to-replace-ref-e5mgr4?file=%2Fsrc%2FApp.tsx)

## 30s 上手

使用 npm 命令`npm i helux`安装`helux`，然后调用`createShared`创建共享状态，调用`useShared`使用共享状态，that's all，你已接入`helux`来提升局部状态为共享状态. ✨

```diff
import React from 'react';
+ import { createShared, useShared } from 'helux';
+ const { state: sharedObj } = createShared({a:100, b:2});

function HelloHelux(props: any) {
-  const [state, setState] = React.useState({ a: 100, b: 2 });
+  const [state, setState] = useShared(sharedObj);
   return <div>{state.a}</div>; // 当前组件仅依赖a变更才触发重渲染
}
```

创建响应式对象

```ts
const { state: sharedObj, setState } = createShared({ a: 100, b: 2 }, true);
// or
const { state: sharedObj, setState } = createShared({ a: 100, b: 2 }, { enableReactive: true });

// 以下两种写法均可以更新所有使用 `sharedObj.a` 值的组件实例
sharedObj.a++;
setState({ a: sharedObj.a + 1 });
```

## api 详解

极致的简单是 helux 最大的优势，了解以下 6 个 api 后，你可以轻松应付任何复杂场景，最大的魅力在于`useSharedObject`和`useService`两个接口，且看如下 api 介绍

> 以下所有 api 均对应有在线[示例 1](https://codesandbox.io/s/demo-show-service-dev-mode-ikybly?file=/src/App.tsx)和[示例 2](https://codesandbox.io/p/sandbox/use-service-to-replace-ref-e5mgr4?file=%2Fsrc%2FApp.tsx),欢迎 fork 并修改体验。

### useObject

使用 useObject 有两个好处

- 1 方便定义多个状态值时，少写很多 useState
- 2 内部做了 unmount 判断，让异步函数也可以安全的调用 setState，避免 react 出现警告 : "Called SetState() on an Unmounted Component" Errors

```ts
// 基于对象初始化一个视图状态
const [state, setState] = useObject({ a: 1 });
// 基于函数初始化一个视图状态
const [state, setState] = useObject(() => ({ a: 1 }));
```

### useForceUpdate

强制更新当前组件视图，某些特殊的场景可以使用它来做视图重刷新

```ts
const forUpdate = useForceUpdate();
```

### createSharedObject

创建一个共享对象，可透传给 `useSharedObject`，具体使用见 useSharedObject

```ts
// 初始化一个共享对象
const sharedObj = createSharedObject({ a: 1, b: 2 });
// 基于函数初始化一个共享对象
const sharedObj = createSharedObject(() => ({ a: 1, b: 2 }));
```

### createReactiveSharedObject

创建一个响应式的共享对象，可透传给 useSharedObject

```ts
// 初始化一个共享对象
const [reactiveObj, setState] = createReactiveSharedObject({ a: 1, b: 2 });

sharedObj.a = 111; // 任意地方修改 a 属性，触发视图渲染
setSharedObj({ a: 111 }); // 使用此方法修改 a 属性，同样也能触发视图渲染，深层次的数据修改可使用此方法
```

### createShared

函数签名

```ts
function createShared<T extends Dict = Dict>(
  rawState: T | (() => T),
  strBoolOrCreateOptions?: ICreateOptionsType,
): {
  state: SharedObject<T>;
  call: <A extends any[] = any[]>(
    srvFn: (ctx: { args: A; state: T; setState: (partialState: Partial<T>) => void }) => Promise<Partial<T>> | Partial<T> | void,
    ...args: A
  ) => void;
  setState: (partialState: Partial<T>) => void;
};
```

创建一个响应式的共享对象，可透传给 useSharedObject，它是`createReactiveSharedObject`和`createSharedObject`的结合体，当需要调用脱离函数上下文的服务函数时（即不需要感知组件 props 时），可使用该接口，第二位参数为是否创建响应式状态，为 true 时效果同 `createReactiveSharedObject` 返回的 sharedObj

```ts
const ret = createShared({ a: 100, b: 2 });
const ret2 = createShared({ a: 100, b: 2 }, true); // 创建响应式状态
// ret.state 可透传给 useSharedObject
// ret.setState 可以直接修改状态
// ret.call 可以调用服务函数，并透传上下文
```

以下将举例两种具体的定义服务函数的方式，之后用户便可在其他其他地方任意调用这些服务函数修改共享状态了，如需感知组件上下文（例如 props），则需要用到下面介绍的`useService`接口去定义服务函数。

```ts
// 调用服务函数第一种方式，直接调用定义的函数，配合 ret.setState 修改状态
function changeAv2(a: number, b: number) {
   ret.setState({ a, b });
}
*
// 第二种方式，使用 ret.call(srvFn, ...args) 调用定义在call函数参数第一位的服务函数
function changeA(a: number, b: number) {
   ret.call(async function (ctx) { // ctx 即是透传的调用上下文，
     // args：使用 call 调用函数时透传的参数列表，state：状态，setState：更新状态句柄
     // 此处可全部感知到具体的类型
     // const { args, state, setState } = ctx;
     return { a, b };
   }, a, b);
 }
```

### useShared

函数签名

```ts
function useShared<T extends Dict = Dict>(sharedObject: T, enableReactive?: boolean): [SharedObject<T>, (partialState: Partial<T>) => void];
```

接收一个共享对象，多个视图里将共享此对象，内部有依赖收集机制，不依赖到的数据变更将不会影响当前组件更新

> `useSharedObject` 和 `useShared` 是同一个函数

```ts
const [obj, setObj] = useShared(sharedObj);
```

`useShared`默认返回非响应式状态，如需要使用响应式状态，透传第二位参数为 true 即可

```ts
const [obj, setObj] = useShared(sharedObj);
// now obj is reactive
setInterval(() => {
  state.a = Date.now(); // 触发视图更新
}, 2000);
```

### useService

函数签名

```ts
/**
 * 使用用服务模式开发 react 组件：
 * @param compCtx
 * @param serviceImpl
 */
function useService<P extends Dict = Dict, S extends Dict = Dict, T extends Dict = Dict>(
  compCtx: {
    props: P;
    state: S;
    setState: (partialState: Partial<S>) => void;
  },
  serviceImpl: T,
): T & {
  ctx: {
    setState: (partialState: Partial<S>) => void;
    getState: () => S;
    getProps: () => P;
  };
};
```

它可搭配`useObject`和`useSharedObject`一起使用，会创建服务对象并返回，该服务对象是一个稳定的引用，且它包含的所有方法也是稳定的引用，可安全方法交给其它组件且不会破会组件的 pros 比较规则，避免烦恼的`useMemo`和`useCallback`遗漏相关依赖

搭配`useObject`时

```ts
function DemoUseService(props: any) {
  const [state, setState] = useObject({ a: 100, b: 2 );
  // srv本身和它包含的方法是一个稳定的引用，
  // 可安全的将 srv.change 方法交给其它组件且不会破会组件的pros比较规则
  const srv = useService({ props, state, setState }, {
    change(a: number) {
      srv.ctx.setState({ a });
    },
  });

  return <div>
    DemoUseService:
    <button onClick={() => srv.change(Date.now())}>change a</button>
  </div>;
}
```

搭配`useSharedObject`时，只需替换`useObject`即可，其他代码不用做任何改变

```diff
+ const sharedObj = createSharedObject({a:100, b:2})

function DemoUseService(props: any) {
-  const [state, setState] = useObject({ a: 100, b: 2 );
+  const [state, setState] = useSharedObject(sharedObj);
```

#### getState 和 getProps

因 `state` 和 `props` 是不稳定的，所以服务内部函数取的时候需从`srv.ctx.getState`或`srv.ctx.getProps`

```ts
// 抽象服务函数
export function useChildService(compCtx: { props: IProps; state: S; setState: (partialState: Partial<S>) => void }) {
  const srv = useService<IProps, S>(compCtx, {
    change(label: string) {
      // !!! do not use compCtx.state or compCtx.state due to closure trap
      // console.log("expired state:", compCtx.state.label);

      // get latest state
      const state = srv.ctx.getState();
      console.log('the latest label in state:', state.label);
      // get latest props
      const props = srv.ctx.getProps();
      console.log('the latest props when calling change', props);

      // your logic
      compCtx.setState({ label });
    },
  });
  return srv;
}

export function ChildComp(props: IProps) {
  const [state, setState] = useObject(initFn);
  const srv = useChildService({ props, state, setState });
}

return (
  <div>
    i am child <br />
    <button onClick={() => srv.change(`self:${Date.now()}`)}>change by myself</button>
    <h1>{state.label}</h1>;
  </div>
);
```

#### exposeService

当孩子组件 props 上透传了`exposeService`函数时，`useService` 将自动透传服务对象给父亲组件，是一种比较方便的逃离`forwardRef`完成父调子的模式

```ts
import { ChildSrv, Child } from './Child';

function App() {
  // 保存孩子的服务
  const childSrv = React.useRef<{ srv?: ChildSrv }>({});
  const seeState = () => {
    console.log('seeState', childSrv.current.srv?.ctx.getState());
  };

  return (
    <div>
      <button onClick={() => childSrv.current.srv?.change(`${Date.now()}`)}>call child logic</button>
      <Child unstableProp={`${Date.now()}`} exposeService={(srv) => (childSrv.current.srv = srv)} />
    </div>
  );
}
```
