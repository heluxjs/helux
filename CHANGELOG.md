#### 2020-08-07
2.8.3 发布
optimize: 利用模块状态版本号确保无论实例是否失去模块依赖，`ctx.state`总是能够获取到最新值
```js

function setup(ctx){
  const { state } = ctx;

  // before v2.8.3, state.num可能为旧值，如果实例失去了num依赖
  // after v2.8.3, state.num一定会是最新值
  const inc = ()=> ({num: state.num + 1});
}

```

#### 2020-08-06
2.8.1 发布
fix: 已失去模块状态依赖的组件，自己触发修改模块状态还会触发自己渲染
fix: 存在`synthetic event is reused`警告
optimize: 优化`ctx.state`赋值流程，减少不必要的assign过程，同时支持setup反复提前解构`ctx.state`并反复使用了，因为现在ctx.state是一个固定引用
```js
function setup(ctx){
  // before v2.8, 
  const inc = ()=> ({num: ctx.state.num + 1});

  // after v2.8
  const { state } = ctx;
  const inc = ()=> ({num: state.num + 1});// 这样写也是ok的了
}
```

#### 2020-07-26
2.7.28 发布
fix: makeDispatchHandler处理paramObj类型逻辑错误

#### 2020-07-26
2.7.26 发布
fix: effect 依赖数组无效
> prevState指向了代理state导致的问题

#### 2020-07-20
2.7.25 发布
fix: async reducer编译后多一层保证判断失败

#### 2020-07-16
2.7.22 发布
fix: dispatch调用方法修改state时，input框输入中文出现抖动
optimize: 对ActionCtx新增callInfo
optimize: 添加读取id为renderKey的机制

#### 2020-06-25
2.7.15 发布
optimize: 针对既属于模块a也连接到模块a的组件做优化，从而减少一次冗余的渲染
> broadcastState过程里通过renderedInBelong记录已触发渲染的实例

#### 2020-06-23
2.7.12 发布
fix: 人工标记depKeys的computed元数据维护错误
optimize: 针对strictMode的双调用机制，利用`effectFlag`标记来删除一个多余维护的hookRef

#### 2020-06-13
2.7.2 发布
feature: 新增`SIG_ASYNC_COMPUTED_***`相关信号

#### 2020-06-03
2.7.1 发布
feature: support async computed
@ee https://codesandbox.io/s/async-computed-35byz
```
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

run({
  counter: {
    state: { num: 1, numBig: 100 },
    computed: {
      numx10({ num }) {
        return num * 10;
      },
      async numx10_2({ num }, o, f) {
        // 必需调用setInitialVal给numx10_2一个初始值，
        // 该函数仅在初次computed触发时执行一次
        f.setInitialVal(num * 55);
        await delay();
        return num * 100;
      },
      async numx10_3({ num }, o, f) {
        f.setInitialVal(num * 1);
        await delay();
        return num * f.cuVal.numx10_2;
      },
    }
  }
});
```

#### 2020-06-03
2.6.4 发布
feature: support setState((prevState, props)=> newState)

#### 2020-06-02
2.6.1 发布
fix: 重构`find-dep-fns-to-execute`，支持更复杂的链路
> https://codesandbox.io/s/complex-cu-watch-chain-in-ref-l9nh7?file=/src/App.js

#### 2020-05-27
2.5.12 发布
fix: `refCtx`调用`initState`丢失`privStateKeys`
feature: 对`sync`函数提供`cachedBoundFns`支持

2.5.11 发布
fix: `beforeRender`里反复用代理对象生成代理对象，最终导致maximum call问题
> 新增`unProxyState`解决此问题

#### 2020-05-27
2.5.1 发布
refactor: 适配`react-native`，去`react-dom`依赖，重构`dispatcher`初始化方式

#### 2020-05-15
2.4.22 发布
refactor: `triggerReactSetState`里当触发`RENDER_NO_OP`时，不再执行`reactCallback`
fix: class的`setState`的第二位callback参数未能向function一样能够传递最新的state

#### 2020-05-15
2.4.21 发布
fix: 遗漏了`ctx.initState`新的私有状态stateKey
> 见示例 https://codesandbox.io/s/hello-concent-pzde3，<=2.4.20版本里未能正确触发watch

#### 2020-05-13
2.4.20 发布
fix: initPost回调里模块状态不是最新结果

#### 2020-05-11
2.4.19 发布
fix: 极端情况反复对同一个组件一直频繁渲染会触发Maximum call stack size exceeded
> 见示例 https://codesandbox.io/s/happy-bird-rc1t7?file=/src/App.js 在2.4.18之前的确会 Maximum call stack size exceeded，2.4.19已不会

#### 2020-05-03
2.4.16 发布
fix: globalComputed未正确收集到依赖

#### 2020-04-12
2.4.2 发布
* 支持`useConcent`渲染期间改变参数`module`和`connect`, [在线示例](https://codesandbox.io/s/dynamic-module-and-connect-xevsp?file=/src/App.js)
- `Ob`组件可以动态更新`module`参数或`connect`参数
```jsx
run({
  counter: {
    state: { count: 999 }
  },
  counter2: {
    state: { count: 100000 },
  },
});

export default function App() {
  const [mod, setMod] = React.useState('counter');
  const changeMod = ()=> setMod(mod==='counter'? 'counter2': 'counter');
  console.log(`now mod is ${mod}`);

  return (
    <div className="App">
      <h3>
      <button onClick={changeMod}>change mod</button>
      <Ob module={mod}>{([state]) => <div>xx: {state.count}</div>}</Ob>
    </div>
  );
}
```
- `useConcent`接口支持动态更新`module`参数或`connect`参数
```js
const setup = ctx=>{
  ctx.effect(()=>{
    return ()=>{
      console.log('trigger unmount');
    }
  }, [])
}

function SetupFnCounter() {
  const [mod, setMod] = React.useState('counter');
  const changeMod = ()=> setMod(mod==='counter'? 'counter2': 'counter');

  // 需要小心的是，模块变更意味着setup会重新执行一次，之前的setup定义的卸载逻辑会被触发
  const ctx = useConcent({ module: mod, setup });
  // return ui
}
```

#### 2020-03-25
2.4.0 发布
* 新增组件`Ob`
```js
// 可以在任意地方使用
import { Ob } from 'concent'

//局部的订阅某个模块的数据
render(){
  return (
    <div>
      ob module state
      <Ob module="foo">{([state, computed])=><h1>{state.name}</h1>}</Ob>
    </div>
  );
}

//局部的订阅多个模块的数据
render(){
  return (
    <div>
      ob module state
      <Ob connect="foo,bar">{([state, computed])=><h1>{state.foo.name} {state.bar.key1}</h1>}</Ob>
    </div>
  );
}
```

#### 2020-03-25
2.3.23 发布
* optimize: 为`ctx`相关联的`reducer`新增别名，方便用户简写调用
- crx.r` for `ctx.reducer`
- crx.mr` for `ctx.moduleReducer`
- crx.cr` for `ctx.connectedReducer`
* fix: 为`middleware function`的第一个参数`midInfo`新增`modState`接口类型描述

#### 2020-03-24
2.3.21 发布
* refactor: 精简`defComputed`、`defWatch`，删除top接口`defLazyComputed`,`defImmediateWatch`
```js
// old:  defComputed(fn, depKeys: DepKeys, options: DefOptions)
// new:  defComputed(fn, depKeys: DepKeys | DefOptions )

// 定义lazy computed
export const fullName = defComputed(()=>{
  // code here
}, {lazy:true})

// 定义immediate watch
export const fullName = defWatch(()=>{
  // code here
}, {immediate:true})
```

#### 2020-03-21
2.3.19 发布
* refactor: 新增`retKeyDep`来关闭同名结果键的依赖收集规则
```js
// code in models/foo/reducer.js
export function firstName(n){
  console.log('trigger this when firstName or lastName changed');
  return n.lastName + Date.now();
}

// ----------> 改为如下形式，则不再对firstName有依赖
import { defComputed } from 'concent';

export const firstName = defComputed((n)=>{
  console.log('trigger this only when lastName changed');
  return n.lastName + Date.now();
}, '-', {retKeyDep:true});
```

#### 2020-03-20
2.3.18 发布
* fix: computed&watch静态依赖未记录
新增`waKey_staticUKeyMap_`记录静态依赖
* feature: 支持 computed&watch 同名字段结果key自动记录静态依赖
```js
// for ref
ctx.watch('name', ()=>{
  console.log('when name changed, trigger this');
})

// for module
export function name(){
  console.log('when name changed, trigger this');
}
```
* refactor: del StartOption.alwaysGiveState param

#### 2020-03-18
2.3.8 发布
* fix: moduleComputed, effect 依赖未能正确更新

#### 2020-03-16
2.3.5 发布
* refactor: 重构中间件流程，支持`modState`
修改或新增状态值并不会再次触发compute&watch过程，修改前请明确你要修改的目的，比如新增一些记录时间戳的行为是安全的
```js
run({
  counter:{ state:{ modCount:1 } },
},{
  middlewares:[
    (updateInfo, next)=>{
      updateInfo.modState('modCount', 1000)
      next();
    }
  ]
})
```

#### 2020-03-15
2.3.0 发布
* feature: 支持computed&watch依赖收集
对于computed&watch，默认开启依赖收集，除非人工设定依赖标记, 特别注意，对于watch来说只有设置immediate为true才会自动启用依赖收集
```js
//实例级别
const setup = ctx => {
  ctx.computed('show', (n)=>{
    return n.show + n.cool + n.good;
  });// 收集到的依赖为['show', 'cool', 'good']

  // 等同于写为 ctx.computed('show', ()=>{...}, '-')
  // depKeys设置为'-'表示启用依赖收集

  ctx.computed('show2', (n)=>{
    return n.show + '2222' + n.cool;
  });// 收集到的依赖为['show', 'cool']
};

//模块级别
run({
  counter:{
    state:{
      modCount: 10,
      modCountBak: 100,
    },
    computed:{
      xxx(n){
        return n.modCount + n.modCountBak;
      },// 默认启用依赖收集
      yyy(n){
        return n.modCountBak;
      },// 默认启用依赖收集
    },
    watch:{
      xxx:{
        fn(n){
          console.log('---> trigger watch xxx', n);
        },
        immediate: true,//启用依赖收集
      },
    }
  }
});
```

#### 2020-03-14
2.2.8 发布
* refactor: 给事件描述对象添加`canPerform`参数，可以拿到将要执行事件回调的实例引用，控制是否要继续执行
```js
cc.emit({name:'someEvent', canPerform: ref=>{
  return true;
}}, 'value1', 'value2', 'value3')
```
* refactor: 删除`aux`相关

#### 2020-03-10
2.2.1 发布
* fix: 在`componentDidMount`里调用`setState`失效
* refactor: 删除`register`的`render`块里多余的`watchedKeys=='*'`判断

#### 2020-03-09
2.2.0 发布
* refactor: 重构依赖收集运行机制，从`module_ccUKeys_`映射替换为`waKey_uKeyMap_`映射

#### 2020-03-08
2.1.0 发布
* feature: 支持动态依赖收集`watchedKeys`
```
// in 1.5.*
function Comp(){
   // the watchedKeys will be ['f1', 'f2', 'hidden'] in every render
  const ctx = useConcent({module:'foo', watchedKeys:['f1', 'f2', 'hidden']})
  const {f1, f2} = ctx.state;
}

// in 2.1.*
function Comp(){
  const ctx = useConcent({module:'foo'})

 
  if(ctx.state.hidden){
    // the watchedKeys will be ['f1','hidden'] in this render
    const {f1} = ctx.state;
  }else{
    // the watchedKeys will be ['f2','hidden'] in this render
    const {f2} = ctx.state;
  }

  // is nextuser write like this, the watchedKeys will be ['f1', 'f2']
  const {f1, f2} = ctx.state;
}
```


#### 2020-03-07
2.0.0 发布
* feature: 利用`defineProperty`改造`defLazyComputed`
```
// in 1.5.*, if xxx is lazyComputed, user must get value by call function
const xxx = ctx.moduleComputed.xxx()

// in 2.*, if xxx is lazyComputed, user get get value by property directly
const xxx = ctx.moduleComputed.xxx
```

#### 2020-03-06
1.5.180 发布
* feature: 支持`CcFragment`在热加载模式下实时刷新

#### 2020-03-05
1.5.179 发布
* feature: 支持`ctx.effect`设置compare标记，默认是true
> effect(fn:function, depKeys?:string[], compare?:boolean, immediate?:boolean)
```js
const setup = ctx=>{
  // user is object
  ctx.effect(()=>{
    console.log('user changed');
  }, ['user'], false);
}
```
* refactor: 将`setRef`步骤调整到`didMount`阶段，以便更好的适应`async rendering`

#### 2020-03-04
1.5.175 发布
* fix: 在线IDE热加载时，模块依赖描述对象里丢失`retKey_lazy_`属性

#### 2020-03-03
1.5.174 发布
* feature: 新增全局api `defLazyComputed` 和实例api`ctx.lazyComputed`
```js
// 区别于defComputed，defLazyComputed定义的函数只有在用到的时候才会触发计算

// code in models/foo/computed
const normalOne = defComputed(({name})=>{
  return `name_`+Date.now();
}, ['name']);//当name变化时，触发计算

const lazyOne = defLazyComputed(({name})=>{
  return `name_`+Date.now();
}, ['name']);//当name变化时，只是标记需要重计算，但并不会真正触发计算


// code in pages/SomeView.js
function View(){
  const ctx = useConcent('login');
  const { moduleComputed } = ctx;
  const normalOne = moduleComputed.normalOne;//可以直接取到
  const lazyOne = moduleComputed.lazyOne();//是一个函数，必需调用一下
}
```
* feature: 新增实例api `ctx.syncAs`
```js
  //绑定一个固定的值
  <input value={user.name} onChange={syncAs("login/user.name", 'xxxx')} />

  //绑定一个函数，对输入值做处理并返回
  const asCb = (value)=> `${value}_suffix`;
  <input value={user.name} onChange={syncAs("login/user.name", asCb)} />
  // ---注意sync的cb如果需要对具体值做处理，必需返回完整的对象
   const syncCb = (value, keyPath, syncCtx)=> {
     const user = syncCtx.state.user;
     user.name =  `${value}_suffix`;
     return { user };
   };
  <input value={user.name} onChange={sync("login/user.name", asCb)} />

  //特别地当返回值为undefined，则不会触发渲染
  const asCb = (value)=> {
    if(value === '666')return undefined;
    else return `${value}_suffix`;
  }
```

#### 2020-03-01
1.5.173 发布
* feature: 支持实例api `ctx.dispatch`调用`*/{fnName}`来命中所有模块的同名函数
* feature: 支持全局api `cc.configure`在`cc.run`之前调用，配置模块会有放入`pending-modules`里，等待`run`函数启动时来配置模块

#### 2020-02-31
1.5.172 发布
* refactor: 重新整理数据更新流程，ctx新增内置接口__boundSetState __boundForceUpdate，解决function组件在react-dev-tool里点击dom后不再重渲染的bug
> see https://github.com/facebook/react/issues/18190，关键点是锁住setter即可

#### 2020-02-28
1.5.167 发布
* fix: 无reducer定时时, actionCtx.setState报错

#### 2020-02-28
1.5.165 发布
* feature: 添加`ctx.staticExtra`参数，用户静态的在`setup`体内初始化一些额外的数据
> 注`ctx.extra`在`useConcent`接口每次都会传入最新的
* fix: 没有在beforeMount之前对`ctx.extra`赋值

#### 2020-02-27
1.5.165 发布
* feature: useConcent传入state函数时，只会触发一次函数调用
* feature: 模块config配置里支持传入state函数
* break-change: cloneModule接口调用的目标模块state必须提供state函数
* fix: 再次实例化一个携带ccKey的实例是，报错retKey重复
* optimize: 简化一些常量的长度

#### 2020-02-26
1.5.164 发布
* optimize: 补充middleware stateInfo字段
* optimize: 增加middleware function保护判断

#### 2020-02-25
1.5.160 发布
* feature: 新增`ctx.refs`和`ctx.useRef`,统一类组件和函数组件的ref获取方式

#### 2020-02-24
1.5.156 发布
* optimize: 删除额外reducer配置和reducerModule相关逻辑（invoke可替代它的功能且对ts更友好）
* optimize: 添加智能检测run接口调用次数, 优化clearContextIfHot逻辑
* optimize: 删除autoCreateDispatcher参数

#### 2020-02-19
1.5.149 发布
* optimize: 简化configure, 不再允许传入option参数配置global相关的东西
* optimize: 下沉getStoredKeys逻辑至buildRefCtx
* optimize: 删除cc.call接口(后续迁移到concent-ext-call)
* optimize: 精简constant文件描述
* optimize: 重构`commit`和`commitCu`逻辑,现支持depKeys里定义多个模块的stateKey
实例里调用commit只能提交privState片段，模块里调用commit只能提交moduleState片段
实例computed回调里调用committedCu调用提交到refComputed结果容器，模块computed回调里调用committedCu调用提交到moduleComputed结果容器
* optimize: 删除refConnectedComputed

#### 2020-02-19
1.5.126 发布
* feature: 限制`commitCu`提交的computed结果范围，即在模块computed&watch里调用`commitCu`，提交的结果是提到moduleComputed结果容器里，而在实例computed&watch里调用`commitCu`，提交的结果是提到refComputed结果容器里
```js
//code in models/foo/watch.js
export const retKey1 = defWatch((_, __, fnCtx)=>{
  fnCtx.commitCu({bookCount:10});//提交到moduleComputed
}, ['books']);
```

```js
//  code in pages/SomeComp.js belong to book module, connect foo and bar modules;
const setup = ctx=>{
  ctx.computed('bookCount', ()=>10);

  ctx.watch('retKey1', (_, __, fnCtx)=>{
    fnCtx.commitCu({bookCount:10});//提交到refComputed
  }, ['books']);

  ctx.watch('retKey2', (_, __, fnCtx)=>{
    fnCtx.commitCu({'bookCount':10});//提交到refComputed
  }, ['foo/books', 'bar/books']);
}
```
* optimize: 优化内部`extractByStateKeys`效率

#### 2020-02-18
1.5.124 发布
* optimize: 优化`refCtxDispatch`、`refCtxInvoke`、`refCtxComputed`、`refCtxWatch`类型描述
新暴露`GetPromiseT`接口反解promise泛型，`refCtxDispatch`和`refCtxInvoke`也利用`GetPromiseT`获得精确的类型

#### 2020-02-17
1.5.119 发布
* break-change: `refComputed`、`moduleComputed`定义的回调函数始终从`valOfStateKey`变为`state`
为了方便ts类型约束和传递，同时也为了统一depKeys长度为1和不为1的书写方式
```
// before
function books(newBooks, oldBooks){}

// >=1.5.119
function books(newState, oldState){}
// or
function books({books:newBooks}, {books:oldBooks}){}
```

#### 2020-02-17
1.5.118 发布
* fix: `commitCu`提交参数的目标`computedContainer`错误

#### 2020-02-16
1.5.117 发布
* optimize: 调整`IActionCtx`泛型参数顺序

#### 2020-02-16
1.5.116 发布
* optimize: 暴露`IActionCtxBase`

#### 2020-02-15
1.5.115 发布
* optimize: 优化`IActionCtx`类型描述，添加`setState`方法

#### 2020-02-15
1.5.114 发布
* fix: `commitCu`取了refComputedDep的retKey_fn_来参与逻辑
* optimize: `commitCu`针对不正确的retKey只做警告

#### 2020-02-15
1.5.113 发布
* optimize: 新增`CcFragment`类型描述
* optimize: 新增`ICtxCommon`类型描述，方便快速描述一些属于$$default模块的组件

#### 2020-02-15
1.5.111 发布
* optimize: 去掉`generatorReducer`参数配置，去掉`co`依赖，全面拥抱`Promise`
* optimize: `defComputed`回调的val值类型不再由retKey是否等于firstKey控制，由depKeys和stateKeys联合控制
```
// 如下代码位于 models/foo/computed.js

// < 1.5.111
export const addrValidCount = defComputed((val) => {
  // list为整个foo模块state，因为retKey 'addrValidCount' 和 depKey 'addrList' 名字不一样
  return 0;
}, ["addrList"]);

// >= 1.5.111
export const addrValidCount = defComputed((list) => {
  // list为foo模块state.addrList，depKeys长度为1 且'addrList'是foo模块的stateKeys一份子
  return 0;
}, ["addrList"]);

```

#### 2020-02-15
1.5.108 发布
* optimize: 利用`Exclude<T, U>`改进类型约束

#### 2020-02-15
1.5.107 发布
* optimize: 进一步优化`useConcent`、`register`、`registerHookComp`、`registerDumb`的接口类型描述，使其保持一致，并提高对module、state属性是否必需传入的验证

#### 2020-02-14
1.5.106 发布
* feature: `register`也支持传入`options.state`，可以是函数或者对象，保持和`useConcent`、`registerHookComp`、`registerDumb`参数一致
* optimize: 利用条件类型和默认类型参数精简泛型重载函数数量，同时更严格的约束传入的`options`字段和泛型之间的关系
* refactor: rename MODULE_NONE TO MODULE_VOID

#### 2020-02-12
1.5.105 发布
* feature: 新增`MODULE_NONE`常量，可以让组件连接或者属于一个空模块，该模块任何时候设置状态都是无效的，这样同时方便connectModules可以设置默认值`MODULE_NONE`
* optimize: 为了适配`stackblitz`ts服务，在package.json里显式的加上types属性(尽管可以不用加)
* optimize: 优化`refCtx`和`fnCtx`类型，利用默认值减少一些不必要的定义

#### 2020-02-11
1.5.101 发布
* optimize: 完善`refCtx.computed`和`refCtx.watch`的类型推导描述，使其可以约束值类型
* optimize: 新增属性`actionCtx.callerModule`
* break change: 重命名`fnCtx.commitComp`为`fnCtx.commitCu`
* break change: 重命名`actionCtx.targetModule`为`actionCtx.module`

#### 2020-02-07
1.5.100 发布
* feature: `useConcent`的注册参数新增可选参数`layoutEffect`,默认是false，当设置为true时，`concent`使用`useLayoutEffect`来做渲染后的逻辑处理
* optimize: 完善`defComputedVal`和`defComputed`的类型推导描述
* optimize: 改善`register`、`registerHookComp`、`registerDumb`、`useConcent`的类型推导描述

#### 2020-02-07
1.5.99 发布
* feature: 新增顶层接口`defComputedVal`，用于静态定义computed的初始值
```js
// code in models/foo/computed.js
import { defComputed, defComputedVal } from 'concent';

export oneVal = defComputed(()=> {
  return 'init value';
}, []);

// 以上表示定义computed 结果oneVal 初始值为'init value'，因depKeys定义为空数组，初次计算后，再也不会发生变化，可以简写为如下
export oneVal = defComputedVal('init value');
```

* feature: `fnCtx`新增接口`commitComp`，用于动态提交computed值，通常用于watch函数里，观察一个值的变化，修改多个computed结果，方便将分散的各个computed函数里的聚合在一起，是否一定要使用依赖具体场景而定

未使用`commitComp`时
```js
export oneVal = defComputed((newVal)=> {
  //因为depKey1值改变重计算oneVal ......
  if(newVal === 'xxx'){
    return 'new 1';
  }else{
    return 'new new 1';
  }
}, ['depKey1']);

export twoVal = defComputed((newVal)=> {
  // 因为depKey1值改变重计算twoVal ......
  if(newVal === 'xxx'){
    return 'new 2';
  }else{
    return 'new new 2';
  }
}, ['depKey1']);

export threeVal = defComputed((newVal)=> {
  //因为depKey1值改变重计算threeVal ......
  if(newVal === 'xxx'){
    return 'new 3';
  }else{
    return 'new new 3';
  }
}, ['depKey1']);

```

使用`commitComp`搭配`defComputedVal`
```js
// code in models/foo/computed.js
export oneVal = defComputedVal('new 1');
export twoVal = defComputedVal('new 2');
export threeVal = defComputedVal('new 3');

// code in models/foo/watch.js
export computeDepKey1Assoc = defWatch((newVal, oldVal, fnCtx)=>{

  // 计算oneVal的逻辑略...
  if(newVal === 'xxx'){
    fnCtx.commitComp({oneVal:'new 1'});
  }else{
    fnCtx.commitComp({oneVal:'new new 1'});
  }

  // 计算twoVal的逻辑略...
  if(newVal === 'xxx'){
    fnCtx.commitComp({twoVal:'new 1'});
  }else{
    fnCtx.commitComp({twoVal:'new new 2'});
  }

  // 计算threeVal的逻辑略...
  if(newVal === 'xxx'){
    fnCtx.commitComp({threeVal:'new 3'});
  }else{
    fnCtx.commitComp({threeVal:'new new 3'});
  }
  
  }, ['depKey1'], true, true); // 设置第四位参数immediate为true，确保初次就触发计算
```

* feature: 新增顶层接口`defWatchImmediate`，方便书写直接触发的watch函数
```js
// code in models/foo/watch.js
import { defWatch, defWatchImmediate } from 'concent';
export const w1 = defWatch(()=>{
  /** 逻辑略 */
}, ['depKey'], true, true);

// 等同于写为
export const w1 = defWatchImmediate(()=>{
  /** 逻辑略 */
}, ['depKey']);
```

#### 2020-0-31
1.5.98 发布
* fix: 最新版codesandbox编译Concent报错`ReferenceError: Cannot access 'CcFragment' before initialization`
```
//这是编译结果
exports.default = CcFragment;
class CcFragment extends React.Component {...}
```
现修改原来的暴露方式解决此问题

#### 2020-01-17
1.5.97 发布
* fix: configure接口的init函数不执行

#### 2020-01-12
1.5.96 发布
* optimize: 优化renderKey匹配写法

#### 2020-01-10
1.5.95 发布
* bug fix: 热加载模式下，hook卸载和再次挂载其实指向的是同一个引用，但是卸掉逻辑导致引用丢失导致报错
> bug修复关键点：useConcent逻辑里 模拟didMount时，先判断下hookRef.isFirstRendered === false 是否成立，如果成立但是此刻有进入了didMount逻辑，则认为是热加载情况下的hook行为，再次调用setRef记录丢失的ref，而不知走真正的didMount逻辑，因为此时对于react-dom-tree来说，还可以认为是原来的那个组件   
> 查看此链接 https://codesandbox.io/s/react-calculator-8hvqw， 修改App.js任意代码95之后的版本不再报错，95之前的版本会报错。

#### 2020-01-09
1.5.93 发布
* bug fix: connectedModuleName_ccClassKeys_记录了重复的ccClassKey
> bug重现：当使用useConcent注册组件时，组件的反复卸载和重加载导致connectedModuleName_ccClassKeys_记录了重复了ccClassKey，导致broadcastConnectedState触发了冗余的渲染

#### 2020-01-07
1.5.92 发布
* optimize: reducer返回的state为undefined不再产生warning信息
* optimize: 新增`ReducerType`类型，辅助生成正确的reducer类型

#### 2020-01-07
1.5.91 发布
* bug fix: useConcent的setState句柄里的回调参数传递的是`ccHookState`
> 应该和class的setState回调保持一致，现已修正为`ccHookState.state`


#### 2020-01-05
1.5.90 发布
* bug fix: effect连接到其他模块的stateKey时，可能会产生无线循环调用
> 通过给模块状态里修改过的key加版本号来解决此问题，造成无线循环的原因是prevState里和state里某个字段的值始终是不一样的，但是effect回调里触发了修改自己实例的状态，导致effect depKeys一直比较，一直都认为有差异.    
> effectProps不会有此类问题，因为prevProps是用过就指向最新的props   
> effect的depKeys如果是自己实例的stateKey也不会出现此问题，因为prevState是用过就指向最新的state
```js
const setup = ctx => {
  ctx.effect(()=>{
    const typeList = ctx.globalState.typeList;
    if(typeList.length>0){
      // 加了字段版本控制后，现在这样调用时安全的了，不会引起无线循环
      ctx.setState({type: typeList[0].id});
    }
  }, ['$$global/typeList']);
}
```

* optimize: 让computed 和 watch函数的commit状态合并到本轮渲染里，同时限制commit里触发的其他computed&watch函数的调用深度，防止死循环
* optimize: 去掉lazyReducer(包括moduleLazyReducer、connectedLazyReducer等)相关逻辑，通过控制moduleReducer.xxx(payload, rKeyOrOptions)来控制发起调用的更多形态
```js
//renderKeyOrOptions?: string | { silent?: boolean, lazy?: boolean, renderKey?: string, delay?: number }

const setup = ctx =>{
  //  const normalCall = ()=> ctx.dispatch('callFoo', '2')
  const normalCall = ()=> ctx.moduleReducer.callFoo('2');
  
  //  const lazyCall = ()=> ctx.dispatchLazy('callFoo', '2')
  const lazyCall = ()=> ctx.moduleReducer.callFoo('2', {lazy:true});

  //  const silentCall = ()=> ctx.dispatchSilent('callFoo', '2')
  const silentCall = ()=> ctx.moduleReducer.callFoo('2', {silent:true});
}
```
* refactor: 去掉顶层api属性`lazyReducer`，只保留`reducer`
```js
//呼叫lazy模式
cc.reducer.fooModule.barMethod(222, {lazy:true})
//呼叫silent模式
cc.reducer.fooModule.barMethod(222, {silent:true})
```
* refactor: 去掉顶层api属性`lazy-dispatch`，只保留`dispatch`
```js
//呼叫lazy模式
cc.dispatch('fooModule/barMethod', 222, {lazy:true})
//呼叫silent模式
cc.dispatch('fooModule/barMethod', 222, {silent:true})
```
* fix: 将append 修改为 appendChild, 以保持老版本chrome（<=49）创建dispatcher不报错

#### 2019-12-22
1.5.88 发布
* bug fix: broadcastState针对设置的renderKeyClasses失效，因为是否基于renderKey渲染判断错误导致，不该使用renderType作为条件，而应该直接基于传入的renderKey来判断
> see online demo: https://stackblitz.com/edit/concent-render-key?file=BookItem.jsvv

#### 2019-12-11
1.5.83 发布
*  新增fnCtx.commit，支持computed函数里，调用commit接口再次修改state的数据
> cc会收集一轮渲染命中的多个computed里commit的状态并做合并然后调用flush，刷新到store并触发视图渲染更新，注意flush触发的二次渲染并不会在此后触发所有相关的computed&watch函数，以避免死循环产生
```js
export const myF2 = defComputed((nv, ov, { commit })=>{
  commit({f1:'tell'});
  return 'f2_ret';
}, ['f2'])

export const myF1 = defComputed((nv, ov, { commit })=>{
  commit({f2:'me'});
  return 'f1_ret';
}, ['f1'])

// 如下reducer函数，返回了f1、f2，会命中myF1、myF2两个计算函数，在其内部又分别commit了新的f1,f2，不会再次引发计算。
export function foo(){
  return {f1:'f1', f2:'f2'};
}
```
* watch函数也同样支持fnCtx.commit，和computed函数使用方法无区别

#### 2019-12-11
1.5.82 发布
*  给reducerFn打上__ctName标签，方便loading模式判断
*  加上generatorReducer参数选项，默认是false，表示在有Promise环境的情况下，如果强制设置为true的话，就不走co逻辑，而是直接采用Promise保证reducer函数运行，
这意味着，如果你使用生成器函数来书写reducer函数，在有Promise环境的情况下就必须设置generatorReducer为true，才能正常工作
> 这样设计是为了推荐用户首选async来书写副作用reducer函数

#### 2019-12-11
1.5.80 发布
*  新增defComputed、defWatch接口定义模块computed和模块watch，支持用一个非stateKey同名的retKey依赖一个stateKey
```js
export function f1(){
}

// 这个效果和 `export function f1`一样，只不过retKey名为myF1
export const myF1 = {
  fn: ()=>{},
  depKeys: ['f1']
}

//亦可以写为defComputed调用形式
export const myF1 = defComputed(()=>{

}, ['f1'])
```

#### 2019-12-11
1.5.77 发布
*  优化chainState记录和清理方式

#### 2019-12-11
1.5.76 发布
*  透传committedState，committedStateMap给IActionCtx
> 通常用于lazy调用链的最后一个函数里，想取出committedState，分析改变的key来再次计算state其他部分的场景，注意此流程和computed的区别，computed计算放置在moduleComputed里，而reducer里返回的是放moduleState里的。

#### 2019-12-03
1.5.75 发布
*  支持同一个reducer函数对象体被配置到多个模块中(尽管这种场景特别少)
> 依靠检查__fnName来确定是否要做一个包装函数

#### 2019-12-03
1.5.74 发布
*  明确了dispatch invoke直接调用函数引用时的规则  

invoke调用函数引用时      
无论组件有无注册模块，一定走调用方模块
> invoke强调定位调用方的模块，这样某个无模块的组件最初是invoke调用，当调用的函数被提升为模块里的reducer的函数时，这个设计能保证组件的调用依然是正确的

dispatch调用函数引用时
优先走函数引用的模块（此时函数是一个reducer函数），没有(此函数不是reducer函数)则走调用方的模块并降级为invoke调用
> dispatch调用强调的是reducer函数的模块，当reducer函数模块和调用方组件模块一致时，没什么差异，一但是a模块组件调用了b模块的reducer函数时，表示的是把模块的方法修改b模块的数据，这样设计更符合reducer函数的定位，因为reducer函数是隐含有模块元数据信息的。

#### 2019-12-03
1.5.73 发布
* 支持invoke直接调用reducer函数，将拿到__fnName和__stateModule参与上下文做处理

#### 2019-12-03
1.5.71 发布
* 新增方法ctx.effectProps，使用方式和ctx.effect一模一样，唯一不同的是传入的depKeys数组元素值是props的key名称

#### 2019-12-03
1.5.70 发布
* 调整ICtx Props泛型位置，放在第一位，使其和React.Component保持一致
* 新增ctx.prevProps属性（每次渲染之前将ctx.props交给ctx.prevProps时，同时将最新的props交给ctx.props）

#### 2019-12-03
1.5.67 发布
* 支持silentDispatch(别名dispatchSilent), 调用此方法，仅执行reducer函数而不提交状态到store并分发状态到其他实例
* 支持silentInvoke(别名invokeSilent), 作用同silentDispatch
* 为lazyDispatch新增别名dispatchLazy

#### 2019-12-03
1.5.66 发布
* 新增ctx.initState接口，该接口只允许在setup调用，用作动态的初始化组件state
* type新增mapped描述

#### 2019-11-22
1.5.49 发布
* 支持register接口传入setup，注意传入setup后class内部不能定义$$setup，否则会抛出错误

#### 2019-11-20
1.5.48 发布
* 允许syncCb返回undefined来中断同步流程
* syncCb第三位参数里syncContext新增透传参数refCtx

#### 2019-10-19
1.5.29 发布
* optimize: 允许ctx.dispatch直接传递reducer里的函数（reducer函数被打上tag: __stateModule, __reducerModule）
* optimize: cc.set 检查模块存在已否
* optimize: CcFragment使用register传递相关注册信息，和register接口对其

#### 2019-10-12
1.5.22 发布
* optimize: registerHookComp自动使用memo包裹
* optimize: 优化broadcastState renderKey 匹配class写法

#### 2019-08-26
1.5.16 发布
* 重构computed&watch，支持`dependencyStateKeys`机制

#### 2019-07-03
1.4.9 发布
* 重命名sharedStateKeys to watchedKeys, storedStateKeys to storedKeys, 使其更符合上下文语境

#### 2019-07-03
1.4.7 发布
* optimize: 新增属性__$$isUnmounted标记已卸载
* optimize: 去掉顶层api调用里的dispatchForModule逻辑
* optimize: 为CcClass添加$$moduleState属性
* bug fix: 优化CcFragment classKey计算逻辑,防止属于同一个模块但是观察这不同的key的Fragment计算出相同的classKey;

#### 2019-07-01
1.4.0 发布，统一CcFragment和CcClass的使用体验
* CcFragment允许指定专属模块
* CcFragment的state有模块state和私有state合并而来

#### 2019-06-28
1.3.8 发布，做了一下重大更新
* 优化invoke参数列表，和reducer完全保持一致
* 优化链式调用追踪逻辑，现在支持在调用过程中使用lazyDispatch或者lazyInvoke了
* 去掉无意义的syncSharedState标记

#### 2019-06-25
1.3.1发布，优化connectedState更新方式，现connectedState只是一个指向store.state的引用，updateConnectedState逻辑里，只负责检查提交的状态里有没有包含connectSpec里定义的key，有的话直接更新具体的引用

#### 2019-06-25
1.3.0发布，做了如下重要改进
- 不再将$$globalState状态合并到ccClass的state里，将带来如下好处
> 避免做moduleState和GlobalState的key命名冲突检查
> module的reducer提交的状态不会再隐含的去修改globalState，降低bug几率，让各个模块的reducer只能严格修改自己的状态
- 去掉多余的sharedToGlobalMapping逻辑，该逻辑实用性太小，且容易出bug
- connectDumb支持对各个包含的fn组件定义各自独立的state
- 实现了$$attach逻辑，class组件可以通过设置isPropsProxy来让concent用属性代理模式装饰目标react类

#### 2019-06-17
* feature add: connectDumb支持setup，现在你可以将所以的方法提升为静态的属性了，不用在render函数里一遍一遍的声明
> [在线示例](https://stackblitz.com/edit/cc-connect-dumb-setup)

#### 2019-06-03
* feature add: 新增顶层函数connectDumb，支持用户快速连接无状态组件
```
const MyDumd = ({state, cc})=>{
  return (
    <div>
      <h1>{state.age}</h1>
      <h1>{state.name}</h1>
      <h1>{state.cool}</h1>
      <h1>{state.info.addr}</h1>
      <h1>{state.info.f1}</h1>
      <input value={state.name} onChange={cc.sync('foo/name')} />
    </div>
  );
}

const MyDumd_ = connectDumb({
  connect: { foo: '*' },
  mapState:(connectedState, props)=>{
    const foo = connectedState.foo;
    return {a1:foo.age, b1:foo.name, c1:foo.age + foo.name}
  }
})(MyDumd);
```
* feature add: sync函数支持绑定默认值了
```
<Button onClick={this.$$sync('foo/name', 'gogogo')}>
```
* feature add: 新增自动取反函数
```
//每一点点击都会对原值取反
<Button onClick={this.$$toggleBool('foo/isOk')}>
```

#### 2019-06-02
* CcFragment的onUrlChanged从prop里迁移到render的回调参数列表里
```
<CcFragment render={({onUrlChanged, forUpdate})=>{

  onUrlChanged((params, action, history)=>{
    console.log('changed');
    forUpdate();
  });
}}/>
```

#### 2019-05-30
* feature add: clone-module，支持对已存在的模块（包括其state，reducer，init，watch，computed）进行克隆，并重写其中一部分配置
要注意，同样是在concent启动后才支持调用此函数
```
import { run, cloneModule } from 'concent';
const baseModule = {
  state:{
    name:'',
    age:22,
  },
  reducer:{
    incAge({moduleState}){
      return {age:moduleState.age+1};
    }
  }
}

run({
  foo:baseModule,
});

clone('foo2', baseModule, {state:{age:33}});
clone('foo3', baseModule, {state:{age:44}});

```
* feature add: top api dispatch now support call like dispatch('*/doSomeThing', gogo);
会匹配所有名字叫doSomeThing执行，这通常对克隆性的模块可以群派发一个动作
* bug fix: updateConnectedState 漏播$$global的state

#### 2019-05-30
* 新暴露顶层api；getComputed(module:string)
* 更友好的sync函数，支持对已封装的组件提取值
```
/** 老版本写法 */
<input data-ccsync="foo/age" onChange={sync} />

/** 新版本的写法(注：两种写法都同时支持) */
<input onChange={sync('foo/age')} />

/** 对第三方组件绑定同步句柄，因为第三方组件不支持绑定data-*的写法，此时使用sync的动态绑定就可以了（注：需要第三方组件暴露的函数的第一位参数就是要同步的值） */
import { Input, Select } from 'antd';

<Input onChange={sync('foo/age')} />
<Select onChange={sync('foo/age')} />
```
* 支持ccClass定义`$$cache`,值从`$$refCache`里获取
> 通常一些组件挂载完毕后，一些视图或者结果不需要重复计算，就可以定义在`$$cache`里(注：你也可以直接定义在class里，`$$cache`是个可选项功能）
```
@register('Foo')
class Foo extends Component{
  doSomething = ()=>{
    console.log('your logic code here');
  }
  $$cache(){
    const columns = [
      {
        key:'age',
        dataIndex:'age',
        render: value=><span onClick={this.doSomething}>{value}</span>
      }
    ];
    const options = [{id:1,name:'go'},{id:2,name:'jump'}].map(v=><Option key={v.id} value={v.id}>{v.name}</Option>);
    return {columns, options};
  }
  render(){
    const {columns, options} = this.$$refCache;
  }
}

```

#### 2019-05-28
* 对目录结构做优化，方便以后更容易扩展
* 优化util.clearObject，支持传入reset参数

#### 2019-05-20
* 增强CcFragment使用体验
> 支持传入state来初始化localState，render回调传入state、setState来读取或者改变localState的值
> 支持hook的setter可以双向绑定
> sync可根据你的data-ccsync有无模块名前缀，来自动感知是要把数据同步到localState还是sotreModuleState
```
<CcFragment state={{a:1,b:2}} render(p=>{
  const {state, setState, connectedState, connectedComputed, hook, dispatch, sync} = p;
  const [localCount='', setCount] = hook.useState();
  const [localAge='', setAge] = hook.useState('age');
  const {a, b} = state;
  hook.useEffect(()=>{
    // alert('CcFragment挂载完毕');
  },[]);//第二位参数是空数组，让这个副作用只会在CcFragment挂载完毕执行一次而已
  return (
    <div>
      <h3>counter/count: {connectedState.counter.count}</h3>
      <h3>foo/age: {connectedState.foo.age}</h3>
      <h3>foo/name: {connectedState.foo.name}</h3>
      <h3>counter/computed_count: {connectedComputed.counter.count}</h3>
      <h3>a: {a} b: {b}</h3>
      <p>
        输入localCount:<input value={localCount} onChange={setCount} />
        {/** 直接通过dispatch句柄来调用counter模块的uploadCount函数 */}
        <button onClick={()=>dispatch('counter/uploadCount', localCount)}>点击确认，修改foo模块里的count</button>
      </p>
      <p>
        localAge:<input value={localAge} onChange={setAge} />
      </p>
      <input value={a} onChange={e=>setState({a:e.currentTarget.value})}/>
      <input data-ccsync="b" value={b} onChange={sync}/>
      <input data-ccsync="foo/age" value={connectedState.foo.age} onChange={sync}/>
    </div>
  )
}
})/>
```
* 修正`propState`命名(它严重不符合上下文语境表达的含义)，现在统一叫`connectedState`，cc类的连接状态都从`connectedState`读取
* cc类的`xinvoke`或者`xeffect`，现在统一都会注入四种state:`state`、`moduleState`、`globalState`、`connectedState`
* 支持多层key的双向绑定，语法`{module}/{key}.key2}`
```
  <input data-ccsync="foo/info.addr" value={connectedState.foo.info.addr} onChange={sync}/>
```

#### 2019-05-19
* 去掉cc实例内置的 `$$commit`,`$$call`等系列相关的无用函数
* 重构configure函数，让其使用体验和run|load保持一致
* 为cc实例提供新属性`$$connectedComputed`
* 为cc实例提供新方法`$$attach`，只是在存在多重装饰器时，如果不想在类里面通过this.props.***来调用cc注入的方法时，可以在类的`componentWillMount`里调用`this.props.$$attach(this)`
* 为`CcFragment`的render函数参数列表提供新参数: `connectedComputed、on、onIdentity、emitIdentity`

