English | [简体中文](./README.zh-CN.md)

## [concent](https://concentjs.github.io/concent-doc)
❤️ Build-in **dependency collection**, a predictable、zero-cost-use、progressive、high performance's react develop framework 

## Examples

### Key features demo
- [Dep collection of state](./examples/dep-collection-of-state.md)
- [Dep collection of computed](./examples/dep-collection-of-computed.md)
- [Composition api](./examples/dep-collestion-of-state.md) 
- [Combine reducers](./examples/dep-collestion-of-state.md)

## Docs
visit official website [https://concentjs.github.io/concent-doc](https://concentjs.github.io/concent-doc) to learn more.

<p align="center">
  <a href="#">
    <img width="500" src="https://raw.githubusercontent.com/concentjs/concent-site/master/img/banner.png">
  </a>
</p>

<br/>

<!--- 额外包一个p标签，防止某些md解析器自己包一个p标签，进而破坏样式 --->
<div style="display:flex; flex-wrap: wrap">

  <a href='https://www.npmjs.com/package/concent' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/github/package-json/v/concentjs/concent/master.svg?label=npm%20version' alt='npm version' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/github/issues/concentjs/concent.svg' alt='issues open' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/npm/dw/concent.svg?label=downloads' alt='downloads' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/github/last-commit/concentjs/concent.svg' alt='last commit' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/github/commit-activity/m/concentjs/concent.svg' alt='commit activity' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/npm/l/concent.svg' alt='license:MIT' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <!--   i don't konw why this badge message is wrong -->
  <!--   <img src='https://img.shields.io/bundlephobia/minzip/concent/1.4.1.svg' alt='mini bundle size' height='18'> -->
  <img src='https://img.shields.io/badge/minzipped-18kb-brightgreen' alt='mini bundle size' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/github/package-json/dependency-version/concentjs/concent/co.svg' alt='co version' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/github/followers/fantasticsoul.svg?style=social' alt='followers' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/github/stars/concentjs/concent.svg?style=social' alt='concent star' height='18'>
  </a>

</div>
    
![hello-concent](https://github.com/fantasticsoul/assets/blob/master/img/cc-intro-1.gif?raw=true)

[review this gif source code](https://stackblitz.com/edit/react-wpzgqd?file=index.js) or [see a full demo](https://xvcej.csb.app/#/)

## 📦Quick start
Make sure you have installed [nodejs](http://nodejs.cn/download/)。

### Install concent
Install `concent` with npm command in your project directory.

```sh
$ npm i --save concent
```

or yarn command

```sh
$ yarn add concent
```

### Define module
Use `run` to define a module.

```js
import { run } from 'concent';

run({
  counter: {// declare a moudle named 'counter'
    state: { num: 1, numBig: 100 }, // define state
  },
  // you can also put another module here.
});
```

### Cosume state & change state
Use `register` to specify a module for class component, or `useConcent`for function component.
> it will let concent konw which module current component belong to.

```js
import { register, useConcent } from 'concent';

@register('counter')
class DemoCls extends React.Component{
  // now setState can commit state to store 
  // and broadcast state to other refs which also belong to counter module
  inc = ()=> this.setState({num: this.state.num + 1})
  render(){
    // here if read num, it means current ins render dep keys is ['num']
    const { num } = this.state;
    // render logic
  }
}

function DemoFn(){
  const { state, setState } = useConcent('counter');
  const inc = ()=> setState({num: state.num + 1});
  // render logic
}
```

Attention that `state` is a proxy object, for helping concent collect every instantce's dep keys in every render period, that makes [exact update](https://codesandbox.io/s/dep-collection-uiqzn?file=/src/App.js) become true

![](https://raw.githubusercontent.com/fantasticsoul/assets/master/article-img/recoil-vs-concent/r5.gif)

### Initialize component
There is no need to wrap with the root component with a `Provider`, you can just initialize the concent component any where you want, [here](https://codesandbox.io/s/rvc-demo2-vg3uh?file=/src/index.js) you can view the demo.

```jsx
const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <div>
      <ClsComp />
      <FnComp />
    </div>
  </React.StrictMode>,
  rootElement
);
```

### Define reducer
If you have many logic code before changing state, we recommend put them to `reducer`
> concent emphasize user should always return a partial state instead of whole state, it will let concent working in best performance mode, so just return what you changed in the reducer function.

```js
run({
  counter: { 
    state: {/** ... */},
    reducer: {
      inc(payload, moduleState) {
        return { num: moduleState.num + 1 };
      },
      async asyncInc(payload, moduleState) {
        await delay();
        return { num: moduleState.num + 1 };
      }
    },
  },
});
```

now you can call reducer funtion in your component instead of `setState`

```js
//  --------- for class component -----------
changeNum = () => this.setState({ num: 10 })
// ===> modify as below (attention that mr is alias of moduleReducer)
changeNum = () => this.ctx.mr.inc(10);// or this.ctx.mr.asynInc(10)

// of course you can call dispatch, but we think moduleReducer is better
//this.ctx.dispatch('inc', 10); // or this.ctx.dispatch('asynInc', 10)

//  --------- for function component -----------
const { state, mr } = useConcent("counter");// useConcent returns ref ctx
const changeNum = () => mr.inc(20); // or ctx.mr.asynInc(10)
```

infact concent allow user change state with top api `setState`、`dispatch` and `reducer`.
 
- with `setState`    

```js
import { getState, setState } from "concent";

console.log(getState('counter').num);// log: 1
setState('counter', {num:10});// change counter module's num state
console.log(getState('counter').num);// log: 10
```

- with `dispatch`   
`dispatch` return a promise, so we should wrap the logic with `async`

```js
import { getState, dispatch } from "concent";

(async ()=>{
  console.log(getState("counter").num);// log 1
  await dispatch("counter/inc");// call counter reducer inc method
  console.log(getState("counter").num);// log 2
  await dispatch("counter/asyncInc");// call counter reducer asyncInc method
  console.log(getState("counter").num);// log 3
})()
```

- with `reducer`    
infact concent collect all module's reducer to its internal `reducer` map to let user call reducer method directly!
```js
import { getState, reducer as ccReducer } from "concent";

(async ()=>{
  console.log(getState("counter").num);// log 1
  await ccReducer.counter.inc();
  console.log(getState("counter").num);// log 2
  await ccReducer.counter.asyncInc();
  console.log(getState("counter").num);// log 3
})()
```

### Define computed
If you want to compute another state with module state, we recommend put them to `computed`

```js
run({
  counter: { 
    state: { /** ... */},
    reducer: { /** ... */},
    computed: {
      numx2: ({num})=> num * 2,
      numBigx2: ({numBig})=> numBig * 2,
      numSumBig: ({num, numBig})=> num + numBig,
    }
  },
});

// get computed result in funtion component
const { moduleComputed } = useConcent('counter');

// get computed result in class component
const { moduleComputed } = this.ctx;
```

Attention that when you deconstruct the state for a computed function, you are also declare the dep keys for the function at the same time.

```js
 // current function will only been execute when num or numBig changed.
 const numSumBig = ({num, numBig})=> num + numBig,
```

**async comoputed** is also supported, [here](https://codesandbox.io/s/async-computed-35byz?file=/src/App.js:1378-2042) see the online demo.

## 🖥Online examples
Review the [online example](https://codesandbox.io/s/green-tdd-g2mcr), you can copy any file's content to `App.js` to see the more effect.

Or click below examples to learn more.
- todo app:   
**written with concent, there is another one written with hook&redux, you can visit it and compare how different they are**
<p>
<a href="https://codesandbox.io/s/todoapp-react-concent-fvgvc" rel="nofollow">
<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;"></a></p>

> [todo app with hook&redux (author:Gábor Soós@blacksonic)](https://codesandbox.io/s/github/blacksonic/todoapp-react-hooks)


- standard enterprise project with concent eco-lib(js):
<p>
<a href="https://codesandbox.io/s/concent-guide-xvcej" rel="nofollow">
<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;"></a></p>

- standard enterprise project with concent eco-lib(ts):
<p>
<a href="https://codesandbox.io/s/concent-guide-ts-zrxd5" rel="nofollow">
<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;"></a></p>
source code see here：https://github.com/fantasticsoul/concent-guid-ts

## ✨Advanced fetures
* **support dependency collection**，use `Proxy`&`defineProperty` in v2.3+ to support dependency collection
* **simple core api**，use `run` to load model configuration, use `register` to decorate class component, or use `useConcent` in function component。
* **zero-cost-use**，no `Provider` any more, the decorated component can be interactive with store by `setState` directly.；[hello-concent](https://stackblitz.com/edit/cc-course-hello-concent-simple)
* **friendly model configuration**，except state, you can also define reducer、computed、watch and init optionally to cover all your scene。
* **flexible data consumption granularity**，your can consume multi model data with state key level dependency.。
* **progressive**，except `setState`, you can also use `dispatch` or `invoke` to change state, separate your business logic and ui completely.。[from class to function](https://stackblitz.com/edit/cc-multi-ways-to-wirte-code)
* **enhance component ability**，support ref level computed 、watch、emit&on、setup etc(setup is is inspired by vue3)。
* **highly consistent coding experience**，no matter class component or function component, they can enjoy the same api calling。[multi ways to define component](https://stackblitz.com/edit/cc-4-render-mode)
* **high performance rendering mechanism**，working based on dependency mark、ref collection and state broadcast，built-in renderKey、lazyDispatch、delayBroadcast feature.。[long list exact upate](https://stackblitz.com/edit/concent-render-key?file=BookItem.js)、[state batch commit](https://stackblitz.com/edit/concent-lazy-dispatch?file=runConcent.js)、[high frequency input&delay broadcast](https://stackblitz.com/edit/concent-delay-broadcast)
* **clean dom hierarchy**，use reverse inheritance strategy for class component by default, to let your react dom tree keep clean。
* **middleware and plugin is supported**，allow user customize middleware to intercept data changing behavior to do something else, allow user customize plugin to enhance concent ability.。
* **de-centralization model configuration**，except for configuring models with `run`, user can also call `configure` api to configure you model definition near your component, that means you can publish your component to npm with your component model。
* **model clone**，allow user clone new model by existed model, to meet the abstract factory need.。
* **fully typescript support**，writing [elegant ts code](https://codesandbox.io/s/concent-guide-ts-zrxd5) with concent is easy.。


### 🎇Enjoy composition api🎊 🎉

with composition api, user can easily separate ui and logic.
[view this demo](https://codesandbox.io/s/hello-concent-djxxh)

![](https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cc-re-render-process.png)

```js
import { run, useConcent } from "concent";

run();// startup concent

const setup = ctx => {
  const { initState, computed, watch, setState, sync } = ctx;
  
  initState({ greeting: 'hello concent' });
  computed("reversedGreeting", n => n.greeting.split('').reverse());
  watch("greeting", (n, o) => alert(`from ${o.greeting} to ${n.greeting}`));
  
  return {
    changeGreeting: (e) => setState({ greeting: e.target.value }),
    changeGreeting2: sync('greeting'),
  };
};

function HelloConcent(){
  const { state, refComputed, settings } = useConcent({ setup });
  return (
    <>
      <h1>{state.greeting}</h1>
      <h1>{refComputed.reversedGreeting}</h1>
      <input value={state.greeting} onChange={settings.changeGreeting}/>
      <input value={state.greeting} onChange={settings.changeGreeting2}/>
    </>
  );
}
```

[simple demo 1](https://codesandbox.io/s/hello-concent-egb4d)
[simple demo 2](https://codesandbox.io/s/dep-collection-uiqzn)


### 🎆Unified coding of class components and function components
`setup` can be used in both class and function component, that means user can easily share logic (even including life cycle logic) between the 2 kinds of component. 

![](https://raw.githubusercontent.com/fantasticsoul/assets/master/article-img/rmc-comparison/cc-unified-lifecycle-en.png)

```js
// for class
@register({setup})
class ClsComp extends React.Component{...}

// for function
function FnComp(){
  useConcent({setup});
}
```
[view demo](https://codesandbox.io/s/nifty-cdn-6g3hh)

## Eco system

With middleware and plugin mechanism, you can easily cutomize your common handler for non logic code, or migrate `redux` eco lib.

![](https://raw.githubusercontent.com/concentjs/concent-site/master/img/cc-core.png)

### Use with react router
Details see here [react-router-concent](https://github.com/concentjs/react-router-concent)，expose `history`，you can call it anywhere in your app to enjoy the imperative navigation jump.

[react-router-concent online demo](https://stackblitz.com/edit/cc-multi-ways-to-wirte-code)

### Use with redux-dev-tool
Details see here [concent-plugin-redux-devtool](https://github.com/concentjs/concent-plugin-redux-devtool)，track your state changing history。
![redux-dev-tool](https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cc-eco/cc-pic1.png)

###  Use with plugin-loading
Details see here [concent-plugin-loading](https://github.com/concentjs/concent-plugin-loading)，control all your reducer function's loading status easily。

[concent-plugin-loading online demo](https://stackblitz.com/edit/cc-plugin-loading?file=models%2Fstudent%2Freducer.js)
___

## ❤️Dependency collection
concent use `Proxy`&`defineProperty` to support dependency collection
### module level computed dependency collection
```js
run({
  counter:{
    state:{
      modCount: 10,
      modCountBak: 100,
      factor: 1,
    },
    computed:{
      xxx(n){
        return n.modCount + n.modCountBak;
      },// for xxx computed retKey, the depKeys is ['modCount', 'modCountBak']
      yyy(n){
        return n.modCountBak;
      },// for yyy computed retKey, the depKeys is ['modCountBak']
      zzz(n, o, f){// n means newState, o means oldState, f means fnCtx
        return f.cuVal.xxx + n.factor;
      },// for zzz computed retKey, the depKeys is ['factor', 'modCount', 'modCountBak']
    },
    watch:{
      xxx:{
        fn(n){
          console.log('---> trigger watch xxx', n.modCount);
        },// for xxx watch retKey, the depKeys is ['modCount']
        immediate: true,
      },
    }
  }
});
```
### ref level computed dependency collection
```js
const setup = ctx => {
  ctx.computed('show', (n)=>{
    return n.show + n.cool + n.good;
  });// for show retKey, the depKeys is ['show', 'cool', 'good']

  ctx.computed('show2', (n)=>{
    return n.show + '2222' + n.cool;
  });// for show2 retKey, the depKeys is ['show', 'cool', 'good']
};
```
### state dependency collection
```js
import {register, useConcent} from 'concent';

const iState = ()=>({show:true});
function FnComp(){
  const {state, syncBool} = useConcent({module:'counter', state:iState, setup});
  return (
    <div>
      {/** if show is true, current ins's dependency is ['modCount']*/}
      {state.show? <span>{state.modCount}</span> : ''}
      <button onClick={syncBool('show')}>toggle</button>
    </div>
  );
}

@register({module:'counter', state:iState, setup})
class ClassComp extends React.Component{
  // state = iState(); //or write private state here
  render(){
     const {state, syncBool} = this.ctx;
    return (
      <div>
        {/** if show is true, current ins's dependency is ['modCount']*/}
        {state.show? <span>{state.modCount}</span> : ''}
        <button onClick={syncBool('show')}>toggle</button>
      </div>
  }
}
```
**[edit this demo on CodeSandbox](https://codesandbox.io/s/dep-collection-uiqzn)**

## 🔨Code practice
- run concent，load model configuration

```js
import React, { Component, Fragment } from 'react';
import { register, run } from 'concent';

run({
  counter: {// define counter module
    state: {// 【necessary】，define state
      count: 0,
      products: [],
      type: '',
    },
    reducer: {// 【optional】define reducer，write logic code to change the state
      inc(payload=1, moduleState) {
        return { count: moduleState.count + payload };
      },
      dec(payload=1, moduleState) {
        return { count: moduleState.count - payload };
      },
      async inc2ThenDec3(payload, moduleState, actionCtx){
        await actionCtx.dispatch('inc', 2);
        await actionCtx.dispatch('dec', 3);
      }
    },
    computed:{// 【optional】define computed，the function will be triggered when stateKey changed，and the return result will be cached.
      count(newState, oldState){
        return newState.count * 2;
      }
    },
    watch:{// 【optional】define watch，the function will be triggered when stateKey changed，usually for some async tasks
      count(newState, oldState){
        console.log(`count changed from ${oldState.count} to ${newState.count}`);
      }
    },
    init: async ()=>{//【optional】async state init process, attention this process has nothing to do with whether the component is mounted or not, but the result can effect all the components belong to this module.
      const state = await api.fetchState();
      return state;
    }
  }
})
```
recommend user put every part of model configure to separate files，because they have clear responsibilities.
```
|____models             # business models
| |____index.js
| |____counter
| | |____index.js
| | |____reducer.js     # change state methods(optional)
| | |____computed.js    # computed methods(optional)
| | |____watch.js       # watch methods(optional)
| | |____init.js        # async state initialization function(optional)
| | |____state.js       # module init state(required)
```
now reducer functions can call each other with function ref directly(not only string)
```js
export function inc(payload=1, moduleState) {
  return { count: moduleState.count + payload };
}

export function dec(payload=1, moduleState) {
  return { count: moduleState.count - payload };
}

// combine other reducer functions to complete a logic
export async function inc2ThenDec3(payload, moduleState, actionCtx){
  await actionCtx.dispatch(inc, 2);
  await actionCtx.dispatch(dec, 3);
}
```
you can also call `setState` in reducer function block, it is a promisified api.
```js
export updateLoading(loading){
  return { loading }
}

export async function inc2ThenDec3(payload, moduleState, actionCtx){
  await actionCtx.dispatch(inc, 2);
  //equivalent actionCtx.dispatch(updateLoading, true);
  await actionCtx.setState({loading: true});
  await actionCtx.dispatch(dec, 3);
  //equivalent actionCtx.dispatch(updateLoading, false);
  await actionCtx.setState({loading: false});
  
  //if you return a new partial state here, it will trigger view updated also, but this is optional.
  return { tip: 'you can return some new value in current reducer fn ot not' };
}
```

- define setup   
setup will only been executed before first render, usually for defining some effects or return methods that user can get them from ctx.settings later, so there is no **temporary closure method** any more in your render function block,
and setup can pass to class and function both, that means you can switch your component definition way between class and function as you like，reuse business logic elegantly。
```js
const setup = ctx => {
  console.log('setup only execute one time before first render period');
  
  ctx.on('someEvent', (p1, p2)=> console.log('receive ', p1, p2));
  
  ctx.effect(() => {
    fetchProducts();
  }, ["type", "sex", "addr", "keyword"]);//only pass state key
  /** equivalent code below in function component
    useEffect(() => {
      fetchProducts(type, sex, addr, keyword);
    }, [type, sex, addr, keyword]);
  */

  ctx.effect(() => {
    return () => {
      // clear up
      // equivalent componentWillUnmout
    };
  }, []);// pass zero length array, to let effect only execute one time after first render period
  /** equivalent code below in function component
    useEffect(()=>{
      return ()=>{
        // clear up
      }
    }, []);
  */

  ctx.effectProps(() => {
    // write effect handler for props value change，it is different with ctx.effect which works for state value changing
    const curTag = ctx.props.tag;
    if (curTag !== ctx.prevProps.tag) ctx.setState({ tag: curTag });
  }, ["tag"]);//only pass props key
  /**  equivalent code below in function component
    useEffect(()=>{
      if(tag !== propTag)setTag(tag);
    }, [propTag, tag]);
  */


  // define ref computed, the function will been triggered when count changed, user can get the function result from ctx.refComputed.doubleTen later in render block
  ctx.computed('doubleTen', (newState, oldState)=>{
    return newState.count * 10;
  }, ['count']);
  // but mostly you should think about module computed first if you want to share the computed logic between all refs and only want the computed function only been triggered one time when state state changed, cause every ref will trigger its own computed function;


  // if retKey is equal to stateKey, you can write like below
  ctx.computed('count', ({count})=>count*2);

  // define ref watch, and just like reason of module computed, you should think about module watch first
  ctx.watch('retKey', ()=>{}, ['count']);

  const fetchProducts = () => {
    const { type, sex, addr, keyword } = ctx.state;
    api.fetchProducts({ type, sex, addr, keyword })
      .then(products => ctx.setState({ products }))
      .catch(err => alert(err.message));
  };

  const inc = () => {
    ctx.setState({ count: this.state.count + 1 });
  }
  const dec = () => {
    ctx.setState({ count: this.state.count - 1 });
  }
  //dispatch can commit state to store, and broadcast state to other refs(which belongs to module counter) also
  const incD = () => {
    ctx.dispatch('inc');// or better way: this.ctx.moduleReducer.inc()
  }
  const decD = () => {
    ctx.dispatch('dec');// or better way: this.ctx.moduleReducer.dec()
  }

  // return result will been collected to ctx.settings
  return {
    inc,
    dec,
    incD,
    decD,
    fetchProducts,
    //sync type value, sync method can extract value from event automatically
    changeType: ctx.sync('type'),
  };
};
```

- register as a concent component base on class、renderProps, hook
```jsx
// base on class
@register({module:'counter', setup})
class Counter extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {tag: props.tag};// private state
  }
  render() {
    // now the state is a combination of private state and module state
    const { count, products, tag } = this.state;
    // this.state can replace with this.ctx.state 
    //const { count, products, tag } = this.ctx.state;

    const {inc, dec, indD, decD, fetchProducts, changeType} = this.ctx.settings;    

    return 'your ui xml...';
  }
}

// base on renderProps
const PropsCounter = registerDumb({module:'counter', setup})(ctx=>{
  const { count, products, tag } = ctx.state;
  const {inc, dec, indD, decD, fetchProducts, changeType} = ctx.settings;    
  return 'your ui xml...';
});

// base on hook
function HookCounter(){
  const ctx = useConcent({module:'counter', setup});
  const { count, products, tag } = ctx.state;
  const {inc, dec, indD, decD, fetchProducts, changeType} = ctx.settings;    

  return 'your ui xml...';
}
```

## ⚖️Some online comparative examples
* [concent todo mvc](https://codesandbox.io/s/todoapp-react-concent-fvgvc) **vs** [redux&hook todo mvc](https://codesandbox.io/s/github/blacksonic/todoapp-react-hooks)
* [concent calculator](https://codesandbox.io/s/react-calculator-8hvqw) **vs** [traditional hook calculator](https://codesandbox.io/s/react-calculator-84f2m)
* [concent query list](https://codesandbox.io/s/query-react-list-00mkd)& [concent shared query list](https://codesandbox.io/s/query-react-list-shared-state-l3fhb) **vs** [traditional hook query list](https://codesandbox.io/s/elastic-dhawan-qw7m4)


## 💻Some online examples
* [progressive way to write react app](https://stackblitz.com/edit/cc-multi-ways-to-wirte-code?file=index.js)
* [funny counter](https://stackblitz.com/edit/funny-counter)
* [stackblitz demo collection](https://stackblitz.com/@fantasticsoul)
* [run api demo](https://stackblitz.com/edit/cc-awesome)


## ⌨️Some git repo
* [concent ant-design-pro](https://github.com/concentjs/antd-pro-concent)


## 📰Some articles
* [redux、mobx、concent特性大比拼, 看后生如何对局前辈](https://juejin.im/post/5e7c18d9e51d455c2343c7c4)
* [聊一聊状态管理&Concent设计理念](https://juejin.im/post/5da7cb9cf265da5bbb1e4f8c)
* [应战Vue3 setup，Concent携手React出招了！](https://juejin.im/post/5dd123ec5188253dbe5eeebd)
* [深度挖掘Concent的effect，全面提升useEffect的开发体验](https://juejin.im/post/5deb43256fb9a0166316c3e9)
* [concent 骚操作之组件创建&状态更新](https://juejin.im/post/5dbe3f18f265da4d3429a439)
* [使用concent，体验一把渐进式地重构react应用之旅](https://juejin.im/post/5d64f504e51d4561c94b0ff8)
___
## Pic introduction
### cc component working process
![](https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cc/cc-component-lifecycle.png)
