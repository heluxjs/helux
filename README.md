English | [简体中文](./README.zh-CN.md)

## [concent](https://concentjs.github.io/concent-doc)
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

❤️ Build-in **dependency collection**, a predictable、zero-cost-use、progressive、high performance's react develop framework 

## 💻 Playground

### Key features snippet
- [Dep collection of state](./examples/dep-collection-of-state.md)
- [Dep collection of computed](./examples/dep-collection-of-computed.md)
- [Combine reducers](./examples/combine-reducers.md)
- [Composition api](./examples/composition-api.md) 
- [Ref lifecycle method](./examples/life-cycle-method.md) 
- [Flexible top api](./examples/flexible-top-api.md)

### Real world
- [A standard js project with concent-eco lib](https://codesandbox.io/s/concent-guide-xvcej)
- [A standard ts project with concent-eco lib](https://codesandbox.io/s/concent-guide-ts-zrxd5)
- [Todo-mvc-concent](https://codesandbox.io/s/todoapp-react-concent-fvgvc) **vs** [Todo-mvc-redux](https://codesandbox.io/s/github/blacksonic/todoapp-react-hooks)
- [Calculator-concent](https://codesandbox.io/s/react-calculator-8hvqw) **vs** [Calculator-hook](https://codesandbox.io/s/react-calculator-84f2m)
- [Concent query list](https://codesandbox.io/s/query-react-list-00mkd) & [Concent Shared query list](https://codesandbox.io/s/query-react-list-shared-state-l3fhb) **vs** [Hook query list](https://codesandbox.io/s/elastic-dhawan-qw7m4)
- [Concent-nextjs-ssr](https://github.com/concentjs/ssr-demo-1)

## Docs
visit official website [https://concentjs.github.io/concent-doc](https://concentjs.github.io/concent-doc) to learn more.


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

### Initialize component
There is no need to wrap the root component with a `Provider`, you can just initialize the concent component any where you want, [here](https://codesandbox.io/s/rvc-demo2-vg3uh?file=/src/index.js) you can view the demo.

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

## ✨Advanced fetures
* **support dependency collection**，use `Proxy`&`defineProperty` in v2.3+ to support dependency collection
* **simple core api**，use `run` to load model configuration, use `register` to decorate class component, or use `useConcent` in function component.
* **zero-cost-use**，no `Provider` any more, the decorated component can be interactive with store by `setState` directly.[hello-concent](https://stackblitz.com/edit/cc-course-hello-concent-simple)
* **friendly model configuration**，except state, you can also define reducer、computed、watch and init optionally to cover all your scene.
* **flexible data consumption granularity**，your can consume multi model data with state key level dependency.
* **progressive**，except `setState`, you can also use `dispatch` or `invoke` to change state, separate your business logic and ui completely.[from class to function](https://stackblitz.com/edit/cc-multi-ways-to-wirte-code)
* **enhance component ability**，support ref level computed 、watch、emit&on、setup etc(setup is is inspired by vue3).
* **highly consistent coding experience**，no matter class component or function component, they can enjoy the same api calling.[multi ways to define component](https://stackblitz.com/edit/cc-4-render-mode)
* **high performance rendering mechanism**，working based on dependency mark、ref collection and state broadcast，built-in renderKey、lazyDispatch、delayBroadcast feature.。[long list exact upate](https://stackblitz.com/edit/concent-render-key?file=BookItem.js)、[state batch commit](https://stackblitz.com/edit/concent-lazy-dispatch?file=runConcent.js)、[high frequency input&delay broadcast](https://stackblitz.com/edit/concent-delay-broadcast)
* **clean dom hierarchy**，use reverse inheritance strategy for class component by default, to let your react dom tree keep clean。
* **middleware and plugin is supported**，allow user customize middleware to intercept data changing behavior to do something else, allow user customize plugin to enhance concent ability.
* **de-centralization model configuration**，except for configuring models with `run`, user can also call `configure` api to configure you model definition near your component, that means you can publish your component to npm with your component model.
* **model clone**，allow user clone new model by existed model, to meet the abstract factory need.
* **fully typescript support**，writing [elegant ts code](https://codesandbox.io/s/concent-guide-ts-zrxd5) with concent is easy.

[simple demo 1](https://codesandbox.io/s/hello-concent-egb4d)
[simple demo 2](https://codesandbox.io/s/dep-collection-uiqzn)

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


## 📰 Articles
* [redux、mobx、concent特性大比拼, 看后生如何对局前辈](https://juejin.im/post/5e7c18d9e51d455c2343c7c4)
* [聊一聊状态管理&Concent设计理念](https://juejin.im/post/5da7cb9cf265da5bbb1e4f8c)
* [应战Vue3 setup，Concent携手React出招了！](https://juejin.im/post/5dd123ec5188253dbe5eeebd)
* [深度挖掘Concent的effect，全面提升useEffect的开发体验](https://juejin.im/post/5deb43256fb9a0166316c3e9)
* [concent 骚操作之组件创建&状态更新](https://juejin.im/post/5dbe3f18f265da4d3429a439)
* [使用concent，体验一把渐进式地重构react应用之旅](https://juejin.im/post/5d64f504e51d4561c94b0ff8)
___
## How concent component ins works
![](https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cc/cc-component-lifecycle.png)

## Welcome to join in Qgroup to konw more
![](https://raw.githubusercontent.com/fantasticsoul/assets/master/article-img/rmc-comparison/17.png)
