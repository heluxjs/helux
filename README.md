English | [简体中文](./README.zh-CN.md)

## [concent](https://concentjs.github.io/concent-doc)
a predictable、zero-cost-use、progressive、high performance's enhanced state management solution，work based on **dependency mark**、**ref collection** and **state broadcast**，power you react!   

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
    
![hello-concent](https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cc/hello.gif)

[review this gif](https://xvcej.csb.app/#/)


## 🖥Online experience
- simple quick start project:   
**here you can have a quick look on concent's powerful features!!**
<p>
<a href="https://codesandbox.io/s/green-tdd-g2mcr" rel="nofollow">
<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;"></a></p>

- standard enterprise project with concent eco-lib(js):
<p>
<a href="https://codesandbox.io/s/concent-guide-xvcej" rel="nofollow">
<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;"></a></p>

- standard enterprise project with concent eco-lib(ts):
<p>
<a href="https://codesandbox.io/s/concent-guide-ts-zrxd5" rel="nofollow">
<img src="https://camo.githubusercontent.com/416c7a7433e9d81b4e430b561d92f22ac4f15988/68747470733a2f2f636f646573616e64626f782e696f2f7374617469632f696d672f706c61792d636f646573616e64626f782e737667" alt="Edit" data-canonical-src="https://codesandbox.io/static/img/play-codesandbox.svg" style="max-width:100%;"></a></p>
source code see here：https://github.com/fantasticsoul/concent-guid-ts

## ✨Fetures
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

## Use with react router
Details see here [react-router-concent](https://github.com/concentjs/react-router-concent)，expose `history`，you can call it anywhere in your app to enjoy the imperative navigation jump.

[react-router-concent online demo](https://stackblitz.com/edit/cc-multi-ways-to-wirte-code)

## Use with redux-dev-tool
Details see here [concent-plugin-redux-devtool](https://github.com/concentjs/concent-plugin-redux-devtool)，track your state changing history。
![redux-dev-tool](https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cc-eco/cc-pic1.png)

##  Use with plugin-loading
Details see here [concent-plugin-loading](https://github.com/concentjs/concent-plugin-loading)，control all your reducer function's loading status easily。

[concent-plugin-loading online demo](https://stackblitz.com/edit/cc-plugin-loading?file=models%2Fstudent%2Freducer.js)
___
## 📦Quick start
Make sure you have installed [nodejs](http://nodejs.cn/download/)。
### Create an app
In your computer，use [create-react-app](https://github.com/facebookincubator/create-react-app) to create an app
```sh
$ npm i -g create-react-app
$ create-react-app cc-app
```
### Install concent
After app created，go to the app's root directory，install `concent` with npm command.
```sh
$ cd cc-app
$ npm i --save concent
```
or yarn command
```sh
$ yarn add concent
```

### Replace App.js file content with the code below
> you can also review the [online example](https://codesandbox.io/s/green-tdd-g2mcr).
```javascript
import React, { Component } from 'react';
import { register, run, useConcent } from 'concent';

// run concent with a module named counter
run({
  counter:{
    state:{count:1}
  }
})

// define a class component that belong to 'counter' module
@register('counter')
class Counter extends Component{
  render(){
    // now setState can commit state to store and broadcast state to other refs which also belong to counter module
    const add = ()=>this.setState({count:this.state.count+1});
    return (
      <div>
        {this.state.count}
        <button onClick={add}>add</button>
      </div>
    )
  }
}

// define a function component that belong to 'counter' module
function FnCounter(){
  const ctx = useConcent('counter');
  const add = ()=>ctx.setState({count:ctx.state.count+1});
  return (
    <div>
      {ctx.state.count}
      <button onClick={add}>add</button>
    </div>
  )
}

export default function App() {
  return (
    <div className="App">
      <Counter />
      <FnCounter />
    </div>
  );
}
```


## 🔨Examples with some advanced features
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
    // write effect handler to props value change，it is different with ctx.effect which works for state value changing
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
* [traditional hook calculator](https://codesandbox.io/s/react-calculator-84f2m) **vs** [concent calculator](https://codesandbox.io/s/react-calculator-8hvqw)
* [traditional hook query list](https://codesandbox.io/s/elastic-dhawan-qw7m4) **vs** [concent query list](https://codesandbox.io/s/query-react-list-00mkd)& [concent shared query list](https://codesandbox.io/s/query-react-list-shared-state-l3fhb)


## 💻Some online examples
* [progressive way to write react app](https://stackblitz.com/edit/cc-multi-ways-to-wirte-code?file=index.js)
* [funny counter](https://stackblitz.com/edit/funny-counter)
* [stackblitz demo collection](https://stackblitz.com/@fantasticsoul)
* [run api demo](https://stackblitz.com/edit/cc-awesome)


## ⌨️Some git repo
* [concent ant-design-pro](https://github.com/concentjs/antd-pro-concent)


## 📰Some articles
* [聊一聊状态管理&Concent设计理念](https://juejin.im/post/5da7cb9cf265da5bbb1e4f8c)
* [应战Vue3 setup，Concent携手React出招了！](https://juejin.im/post/5dd123ec5188253dbe5eeebd)
* [深度挖掘Concent的effect，全面提升useEffect的开发体验](https://juejin.im/post/5deb43256fb9a0166316c3e9)
* [concent 骚操作之组件创建&状态更新](https://juejin.im/post/5dbe3f18f265da4d3429a439)
* [使用concent，体验一把渐进式地重构react应用之旅](https://juejin.im/post/5d64f504e51d4561c94b0ff8)
___
## Pic introduction
### cc state broadcast process
![](https://raw.githubusercontent.com/concentjs/concent-site/master/img/cc-core.png)
### cc component working process
![](https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cc/cc-component-lifecycle.png)
