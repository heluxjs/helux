English | [简体中文](./README.zh-CN.md)

<p align="center">
  <a href="https://concentjs.github.io/concent-doc">
    <img width="380" src="https://raw.githubusercontent.com/concentjs/concent-site/master/img/concent-logo.png">
  </a>
</p>

<p align="center">
⚡️ State management that tailored for react, it is simple, predictable, progressive and efficient.
</p>


<!--- 额外包一个p标签，防止某些md解析器自己包一个p标签，进而破坏样式 --->
<div style="display:flex; flex-wrap: wrap;">
  <a href='https://www.npmjs.com/package/concent' style='margin: 0 0.2rem;'>
  <img src='https://img.shields.io/github/package-json/v/concentjs/concent/master.svg?label=npm%20version' alt='npm version' height='18'>
  </a>
  <a href='https://travis-ci.org/concentjs/concent' style='margin: 0 0.2rem;'>
  <img src='https://travis-ci.org/concentjs/concent.svg?branch=master' alt='build' height='18'>
  </a>
  <a href='#' style='margin: 0 0.2rem;'>
  <img src='https://img.shields.io/github/issues/concentjs/concent.svg' alt='issues open' height='18'>
  </a>
  <a href='#' style='margin: 0 0.2rem;'>
  <img src='https://img.shields.io/npm/dw/concent.svg?label=downloads' alt='downloads' height='18'>
  </a>
  <a href='#' style='margin: 0 0.2rem;'>
  <img src='https://img.shields.io/github/last-commit/concentjs/concent.svg' alt='last commit' height='18'>
  </a>
  <a href='#' style='margin: 0 0.2rem;'>
  <img src='https://img.shields.io/github/commit-activity/m/concentjs/concent.svg' alt='commit activity' height='18'>
  </a>
  <a href='#' style='margin: 0 0.2rem;'>
  <img src='https://img.shields.io/npm/l/concent.svg' alt='license:MIT' height='18'>
  </a>
  <a href='#' style='margin: 0 0.2rem;'>
  <!--   i don't konw why this badge message is wrong -->
  <!--   <img src='https://img.shields.io/bundlephobia/minzip/concent/1.4.1.svg' alt='mini bundle size' height='18'> -->
  <img src='https://img.shields.io/badge/minzipped-18kb-brightgreen' alt='mini bundle size' height='18'>
  </a>
  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/github/followers/fantasticsoul.svg?style=social' alt='followers' height='18'>
  </a>
  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/github/stars/concentjs/concent.svg?style=social' alt='concent star' height='18'>
  </a>
</div>

## 🐮Introduction

Concent is an amazing state management tool, supported by a healthy middleware ecosystem and excellent devtools. It is a predictable, zero-invasive, progressive, high-performance react development framework!

Concent encourages simplicity. It saves you the hassle of creating boilerplate code and gives powerful tools with a moderate learning curve, suitable for both experienced and inexperienced developers alike.

![](https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cc-re-render-process.png)

## ✨Features
* Render context injected automatically (no any annoying boilerplate code)
* [Dependency collection](https://codesandbox.io/s/dep-collection-uiqzn) at runtime (state & computed)
* Unified logic reuse of class and function components
* Optional [Compostion api](https://github.com/concentjs/concent/blob/master/examples/composition-api.md) support
* Optional [modular development](https://codesandbox.io/s/concent-guide-xvcej) support(state、reducer、computed、watch、lifecycle)
* High performance [renderKey mechanism](https://codesandbox.io/s/render-key-dwrx1)
* Centralization and De-centralization module configuration both support
* Dynamic module configuration support
* [Reducer combination](https://github.com/concentjs/concent/blob/master/examples/combine-reducers.md) support
* [React Devtools](https://github.com/concentjs/concent-plugin-redux-devtool) support
* Hot-reload support
* [SSR&Nextjs](https://github.com/concentjs/ssr-demo-1) support
* React-native support

## 💻 Playground

### Templates
- [cra-template-concent-ts](https://github.com/concentjs/cra-template-concent-ts)

install by npx command
```sh
$ npx create-react-app my-app --template concent-ts
```
or clone its source code by git command
```sh
$ git clone https://github.com/concentjs/cra-project-concent-ts
```
see [online demo](https://codesandbox.io/s/cra-template-concent-ts-2x347)


### Key features snippet
- [Dep collection of state](./examples/dep-collection-of-state.md)
- [Dep collection of computed](./examples/dep-collection-of-computed.md)
- [Combine reducers](./examples/combine-reducers.md)
- [Composition api](./examples/composition-api.md) 
- [Ref lifecycle method](./examples/life-cycle-method.md) 
- [Flexible top api](./examples/flexible-top-api.md)

### Online case
- [A standard js project with concent-eco lib](https://codesandbox.io/s/concent-guide-xvcej)
- [A standard ts project with concent-eco lib](https://codesandbox.io/s/concent-guide-ts-zrxd5)
- [Todo-mvc-concent](https://codesandbox.io/s/todoapp-react-concent-fvgvc) **vs** [Todo-mvc-redux](https://codesandbox.io/s/github/blacksonic/todoapp-react-hooks)
- [Calculator-concent](https://codesandbox.io/s/react-calculator-8hvqw) **vs** [Calculator-hook](https://codesandbox.io/s/react-calculator-84f2m)
- [Concent query list](https://codesandbox.io/s/query-react-list-00mkd) & [Concent Shared query list](https://codesandbox.io/s/query-react-list-shared-state-l3fhb) **vs** [Hook query list](https://codesandbox.io/s/elastic-dhawan-qw7m4)
- [Concent-nextjs-ssr](https://github.com/concentjs/ssr-demo-1)

## 👨🏽‍Docs
Visit official website [https://concentjs.github.io/concent-doc](https://concentjs.github.io/concent-doc) to learn more.

## 📦Quick start
Make sure you have installed [nodejs](http://nodejs.cn/download/)。

### Install

```sh
$ npm i --save concent
```

or yarn command

```sh
$ yarn add concent
```

### Minimal example
See how easy it is to use concent to manage react state.
```js
import { run, register, useConcent } from 'concent';

// 1️⃣ Configure models
run({
  counter: {// declare a moudle named 'counter'
    state: { num: 1, numBig: 100 }, // define state
  },
  // you can also put another module here.
});

// 2️⃣  Now the react component can work with concent
@register('counter') // 👈 decorate your component with register
class DemoCls extends React.Component{
  // commit state to store and broadcast to other refs which also belong to counter module
  inc = ()=> this.setState({num: this.state.num + 1})
  render(){
    // here if read num, it means current ins render dep keys is ['num']
    return <button onClick={this.inc}>{this.state.num}</button>
  }
}
function DemoFn(){
  const { state, setState } = useConcent('counter'); // 👈 call useConcent hook in fn component
  const inc = ()=> setState({num: state.num + 1});
  return <button onClick={inc}>{state.num}</button>
}
```

### Complete example

> Move logic to `reducer` and define `computed`,`watch`,`lifecycle`  
> try edit [this demo](https://codesandbox.io/s/example-modular-1-rw95j)、 👉[better js demo](https://codesandbox.io/s/example-modular-2-czn17)、👉[better ts demo](https://codesandbox.io/s/example-modular-3-zl57s)

```js
import { run, register, useConcent, defWatch } from 'concent';

run({
  counter: {
    state: { num: 1, numBig: 100 },
    computed: {
      numx2: ({ num }) => num * 2, // only num changed will trigger this fn
      numx2plusBig: ({ numBig }, o, f) => f.cuVal.numx2 + numBig // reuse computed reslult
    },
    reducer: {
      initState: () => ({ num: 8, numBig: 800 }),
      add: (payload, moduleState, actionCtx) => ({ num: moduleState.num + 1 }),
      addBig: (p, m, ac) => ({ numBig: m.numBig + 100 }),
      asyncAdd: async (p, m, ac) => {
        await delay(1000);
        return { num: m.num + 1 };
      },
      addSmallAndBig: async (p, m, ac) => {
        // hate string literal? see https://codesandbox.io/s/combine-reducers-better-7u3t9
        await ac.dispatch("add"); 
        await ac.dispatch("addBig");
      }
    },
    watch: {
      numChange: defWatch(({ num }, o) => console.log(`from ${o.num} to ${num}`), {immediate:true}),
      numChangeWithoutImmediate: ({ num }, o) => console.log(`from ${o.num} to ${num}`),
    },
    lifecycle: {
      // loaded: (dispatch) => dispatch("initState"), // [optional] triggered when module loaded
      // initState: async (moduleState) => {/** async logic */ return{num:666}}, // [optional] allow user load state async
      // initStateDone: (dispatch) => dispatch("addSmallAndBig"), // [optional] call any reducer fn after initState done
      mounted: (dispatch) => dispatch("initState"), // [optional] triggered when the first ins of counter module mounted
      willUnmount: (dispatch) => dispatch("initState") // [optional] triggered when the last ins of counter module unmount
    }
  }
});

@register("counter")
class DemoCls extends React.Component {
  render() {
    // mr is short of moduleReducer, now you can call counter module's all reducer fns by mr
    return <button onClick={this.ctx.mr.add}>{this.state.num}</button>;
  }
}

function DemoFn() {
  const { moduleComputed, mr } = useConcent("counter");
  return <button onClick={mr.add}>numx2plusBig: {moduleComputed.numx2plusBig}</button>;
}
```

## 🐚Architecture diagram

#### How concent component ins works

![](https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cc/cc-core-process.png)

#### With middleware and plugin mechanism, you can easily cutomize your common handler for non logic code, or migrate `redux` eco lib.

![](https://raw.githubusercontent.com/concentjs/concent-site/master/img/cc-core.png)

## 🎲Eco-lib examples

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

## Who is using it

<table>
  <tr>
      <td align="center">
        <a href="https://github.com/TencentCloudBase/cloudbase-extension-cms" target="_blank">
          <img width="140px;" src="https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cloudbase.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://github.com/TencentCloudBase/cloudbase-extension-cms">
          <img width="15px;" src="https://emojipedia-us.s3.amazonaws.com/content/2020/04/05/octocat-github-emojipedia.png"></img>
          <b>tcb-admin</b>
        </a> 
      </td>
      <td align="center">
         <a href="https://wink.org/" target="_blank">
          <img width="140px;" src="https://raw.githubusercontent.com/fantasticsoul/assets/master/img/winvlogo.png"></img>
        </a>
        <br/>
        <a target="_blank" href="https://wink.org">
          <b>Win V</b>
        </a> 
      </td>
    </tr>
</table>


## 👅License

concent is released under the MIT License. [http://www.opensource.org/licenses/mit-license](http://www.opensource.org/licenses/mit-license)
