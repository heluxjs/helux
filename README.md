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
    <img src='https://raw.githubusercontent.com/fantasticsoul/static/master/img/cc-svg/build.png' alt='build:passing' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/npm/l/concent.svg' alt='license:MIT' height='18'>
  </a>

  <a href='#' style='margin: 0 0.5rem;'>
  <img src='https://img.shields.io/david/dev/concentjs/concent.svg' alt='dev dependencies' height='18'>
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




## concent是什么，（注：以下有的地方简称为cc）
concent是一个专为`react`提供状态管理服务的框架，重新定义`state`和`component`之间的关系，同时也为你的`react`组件提供更多有趣且强大的特性，保持渲染性能最优化，让你专注于业务代码编写😎，让你的`react`工程代码变得更加简约、优雅，并容易维护与扩展。

## ✨concent的特点
* 核心api少且简单，功能强大，上手容易，入侵小，容易调试；
* 提供全局模块化的单一数据源；
* 共享数据可直接注入到state，也可注入props，[点我查看](https://stackblitz.com/edit/concent-state-inject-way?file=index.js)。
* 修改共享数据的方式灵活多样且简单直接，[点我查看](https://stackblitz.com/edit/concent-state-modify-way)；
* 对组件扩展了事件总线、computed、watch、双向绑定等特性，[点我查看](https://stackblitz.com/edit/concent-vue-like-programming)；
* 内置与react16一样的使用方式但却更有趣的hook，[点我查看](https://stackblitz.com/edit/concent-hook?file=index.js)；
* 默认采用反向继承包裹你的组件，让react dom tree层级更少，保持干净和清爽；
* 基于引用定位和状态广播，支持细粒度的状态订阅，渲染效率出众，[点我查看](https://stackblitz.com/edit/concent-why-it-is-high-performance?file=index.js)；
* 支持中间件，可以扩展你的个性化插件处理数据变更，[点我查看](https://stackblitz.com/edit/concent-middleware?file=index.js)；
* 支持react 0.10+任意版本；

## 搭配react-router使用
请移步阅读和了解[react-router-concent](https://github.com/concentjs/react-router-concent)，搭配使用非常的简单和容易。

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
```
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
```
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

/将Counter类注册为CcFnCounter，属于counter模块
const CcFnCounter = registerDumb({module:'counter', setup, mapProps})(UI);
```
--- 基于hook注册为组件
```
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
```
import { useConcent } from 'concent';

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
### [cc版本的ant-design-pro](https://github.com/fantasticsoul/rcc-antd-pro)
### [一个相对完整的示例](https://stackblitz.com/edit/cc-awesome)
### [有趣的counter](https://stackblitz.com/edit/funny-counter)
### [增强的counter](https://stackblitz.com/edit/dva-example-count-1saxx8)
### [Jsrun playground](http://jsrun.net/fLXKp/play) 
### [Jsrun video](http://jsrun.net/vLXKp/play)
### [示例集合](https://github.com/fantasticsoul/rcc-simple-demo)
___
## 图文介绍
### cc渲染流程
![](https://raw.githubusercontent.com/concentjs/concent-site/master/img/cc-core.png)
### cc组件工作流程
![](https://raw.githubusercontent.com/concentjs/concent-site/master/img/cc-process.png)

### [concent是什么](https://concentjs.github.io/concent-site/docs/doc-intro-what-is-concent)
### [在cc里用class和function实现counter](https://juejin.im/post/5c8f77bdf265da60ec2812f7)
### [聊一聊cc的变化侦测和hook实现](https://juejin.im/post/5c8d99f4e51d4555816d6335)
### [在cc里玩转无状态组件](https://juejin.im/post/5c838107f265da2dca389593)
### [对话 redux(家族)，后生何以挑战前辈？](https://juejin.im/post/5c8479316fb9a049ba42635c)
### [为什么不用redux](https://www.zhihu.com/question/263928256/answer/274963347)
