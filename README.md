# [concent, 点击了解更多](https://concentjs.github.io/concent-site/)
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
  <img src='https://img.shields.io/bundlephobia/minzip/concent/1.4.1.svg' alt='mini bundle size' height='18'>
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




## concent
一个可预测、0入侵、渐进式、高性能的增强型状态管理方案，基于**依赖标记**、**引用收集**和**状态分发**原理，power you react!

## ✨特性
* **极简的核心api**，`register`&`run`；
* **0入侵成本接入**，不改造代码的情况下直接接入；
* **贴心的模块配置**，除了`state`，还提供`reducer`、`computed`、`watch`和`init`四项可选定义。
* **灵活的数据消费粒度**，支持跨多个模块场景，以及模块内stateKey级别的细粒度控制。
* **渐进式构建react应用**，除了`setState`,支持`dispatch`、`invoke`调用来让ui视图与业务逻辑彻底解耦；
> [从class到function](https://stackblitz.com/edit/cc-multi-ways-to-wirte-code)
* **组件能力增强**，支持实例级别`computed`、`watch`定义,支持`emit&on`,以及支持`setup`特性，让函数组件拥有定义静态api的能力。
* **高度一致的编程体验**，`hoc`、`render props`和`hook`3种方式定义的组件均享有一致的api调用体验，相互切换代价为0。
> [多种方式定义组件](https://stackblitz.com/edit/cc-4-render-mode)
* **渲染性能出众**，内置`renderKey`、`lazyDispatch`、`delayBroadcast`等特性，保证极速的渲染效率。
> [长列表精准渲染](https://stackblitz.com/edit/concent-render-key?file=BookItem.js)
* **干净的dom层级**，对于class组件，默认采用反向继承策略，让react dom树的层级结构保持简洁与干净。
* **扩展中间件与插件**，允许用户定义中间件拦截所有的数据变更提交记录，做额外处理，也可以自定义插件，接收运行时的发出的各种信号，按需增强concent自身的能力。
* **去中心化配置模块**，除了`run`接口一次性配置模块，还提供`configure`接口在任意地方动态配置模块
* **模块克隆**，支持对已定义模块进行克隆,满足你高维度抽象的需要。

## 搭配react-router使用
请移步阅读和了解[react-router-concent](https://github.com/concentjs/react-router-concent)，暴露`history`对象，可以全局任意地方使用，享受编程式的导航跳转。

## 搭配redux-dev-tool使用
请移步阅读和了解[concent-plugin-redux-devtool](https://github.com/concentjs/concent-plugin-redux-devtool)，全流程追溯你的状态变更过程。

## 搭配loading插件使用
请移步阅读和了解[concent-plugin-loading](https://github.com/concentjs/concent-plugin-loading)，轻松控制concent应用里所有reducer函数的loading状态。
___
## 📦 快速开始
确保你本地机器上安装有[nodejs](http://nodejs.cn/download/)。
### 创建一个app
在你的电脑上，选择一个合适的目录并进入，使用[create-react-app](https://github.com/facebookincubator/create-react-app) 创建一个app
```sh
$ npm i -g create-react-app
$ create-react-app cc-app
```
### 安装cc
创建好app后，进入你的app根目录，使用npm安装`concent`
```sh
$ cd cc-app
$ npm i --save concent
```
或者使用yarn安装
```sh
$ yarn add concent
```

### 新手counter示例
将以下代码复制粘贴到`cc-app`目录下的`src/App.js`文件里(注：是完全覆盖掉原来的内容)。
- 运行concent，载入模块配置
```javascript
import React, { Component, Fragment } from 'react';
import { register, run } from 'concent';

run({
  counter: {//定义counter模块
    state: {//定义state
      count: 0,
    },
    reducer: {
      inc(payload, moduleState) {
        return { count: moduleState.count + 1 };
      },
      dec(payload, moduleState) {
        return { count: moduleState.count - 1 };
      }
    }
  }
})
```
- 基于react class注册成为cc类组件
```jsx
class Counter extends Component {
  //setState 能够将数据将同步到store，广播到其他实例
  inc = () => {
    this.setState({ count: this.state.count + 1 });
  }
  dec = () => {
    this.setState({ count: this.state.count - 1 });
  }
  //调用dispatch, 同样的能够将数据将同步到store，广播到其他属于counter模块或者连接到counter模块的实例
  incD = () => {
    this.ctx.dispatch('inc');
  }
  decD = () => {
    this.ctx.dispatch('dec');
  }
  render() {
    //concent注入counter模块的数据到state
    const { count } = this.state;
    return (
      <div style={{ padding: '12px', margin: '6px' }}>
        <div>count: {count}</div>
        <button onClick={this.inc}>inc by setState</button>
        <button onClick={this.dec}>dec by setState</button>
        <br />
        <button onClick={this.incD}>inc by dispatch</button>
        <button onClick={this.decD}>dec by dispatch</button>
      </div>
    );
  }
}
//将Counter类注册为CcClazzCounter，属于counter模块
const CcClazzCounter = register('counter')(Counter);
```
- 基于renderProps注册为cc类组件
```jsx
import { registerDumb } from 'concent';

const UI = ({count, inc, dec, incD, decD})=>{
    return (
      <div style={{ padding: '12px', margin: '6px' }}>
        <div>count: {count}</div>
        <button onClick={inc}>inc by setState</button>
        <button onClick={dec}>dec by setState</button>
        <br />
        <button onClick={incD}>inc by dispatch</button>
        <button onClick={decD}>dec by dispatch</button>
      </div>
    );
}

//定义setup，该函数只会在ui初次渲染前执行一次，通常用于定义一些方法，结果会收集到ctx.settings里
const setup = ctx=>{
  const inc = () => {
    ctx.setState({ count: ctx.state.count + 1 });
  };
  const dec = () => {
    ctx.setState({ count: ctx.state.count - 1 });
  };
  const incD = () => {
    ctx.dispatch('inc');
  };
  const decD = () => {
    ctx.dispatch('dec');
  };
  return {inc, dec, incD, decD};
}

//定义mapProps，该函数在ui每次渲染前被执行，结果将映射到组件的props上
const mapProps = ctx=>{
  return {count:ctx.state.count, ...ctx.settings};
}

//将Counter类注册为CcFnCounter，属于counter模块
const CcFnCounter = registerDumb({module:'counter', setup, mapProps})(UI);
```
--- 基于hook注册为组件
```jsx
import { useConcent } from 'concent';

function HookCounter(){
  const {state, setState, dispatch} = useConcent('counter');
  const inc = () => {
    setState({ count: ctx.state.count + 1 });
  };
  const dec = () => {
    setState({ count: ctx.state.count - 1 });
  };
  const incD = () => {
    dispatch('inc');
  };
  const decD = () => {
    dispatch('dec');
  };
   return (
      <div style={{ padding: '12px', margin: '6px' }}>
        <div>count: {count}</div>
        <button onClick={inc}>inc by setState</button>
        <button onClick={dec}>dec by setState</button>
        <br />
        <button onClick={incD}>inc by dispatch</button>
        <button onClick={decD}>dec by dispatch</button>
      </div>
   );
}

```
--- 更优的hook写法，将函数提升为静态api
```jsx
import { useConcent } from 'concent';

//同样的，该函数只在ui首次渲染前被执行一次！！！
const setup = ctx =>{
  const {state, setState, dispatch} = ctx;
  const inc = () => {
    setState({ count: ctx.state.count + 1 });
  };
  const dec = () => {
    setState({ count: ctx.state.count - 1 });
  };
  const incD = () => {
    dispatch('inc');
  };
  const decD = () => {
    dispatch('dec');
  };
  return {inc, dec, incD, decD};
}

function HookCounter(){
  const {settings, state} = useConcent({module:'counter', setup});
  const {inc, dec, incD, decD} = settings;

   return (
      <div style={{ padding: '12px', margin: '6px' }}>
        <div>count: {state.count}</div>
        <button onClick={inc}>inc by setState</button>
        <button onClick={dec}>dec by setState</button>
        <br />
        <button onClick={incD}>inc by dispatch</button>
        <button onClick={decD}>dec by dispatch</button>
      </div>
   );
}

```

### [0入侵，渐进式实例](https://stackblitz.com/edit/cc-multi-ways-to-wirte-code?file=index.js)

___
## 🔨更多精彩示例
### [stackblitz在线练习示例集合](https://stackblitz.com/@fantasticsoul)
### [concent版本的ant-design-pro](https://github.com/concentjs/antd-pro-concent)
### [一个相对完整的示例](https://stackblitz.com/edit/cc-awesome)
### [有趣的counter](https://stackblitz.com/edit/funny-counter)
___
## 图文介绍
### cc渲染流程
![](https://raw.githubusercontent.com/concentjs/concent-site/master/img/cc-core.png)
### cc组件工作流程
![](https://raw.githubusercontent.com/concentjs/concent-site/master/img/cc-process.png)
