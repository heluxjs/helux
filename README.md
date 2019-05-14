# concent [C_C]
<p align="center">
  <a href="#">
    <img width="500" src="https://raw.githubusercontent.com/fantasticsoul/static/master/img/cc/banner.png">
  </a>
</p>

## concent是什么，（注：以下有的地方简称为cc）
concent是一个专为`react`提供状态管理服务的框架，重新定义`state`和`component`之间的关系，同时也为你的`react`组件提供更多有趣且强大的特性，保持渲染性能最优化，让你专注于业务代码编写😎，让你的`react`工程代码变得更加简约、优雅，并容易维护与扩展。

## ✨concent的特点
* 核心api少且简单，功能强大，上手容易，入侵小，容易调试；
* 提供全局模块化的单一数据源；
* 共享数据可直接注入到state，也可注入props，[点我查看](https://stackblitz.com/edit/concent-state-inject-way?file=index.js)。
* 修改共享数据的方式灵活多样且简单直接，[点我查看](https://stackblitz.com/edit/concent-state-modify-way)；
* 对组件扩展了事件总线、computed、watch等特性，[点我查看](https://stackblitz.com/edit/concent-vue-like-programming)；
* 内置与react16一样的使用方式但却更有趣的hook，[点我查看](https://stackblitz.com/edit/concent-hook?file=index.js)；
* 默认采用反向继承包裹你的组件，让react dom tree层级更少，保持干净和清爽；
* 基于引用定位和状态广播，支持细粒度的状态订阅，渲染效率出众，[点我查看](https://stackblitz.com/edit/concent-why-it-is-high-performance?file=index.js)；
* 支持中间件，可以扩展你的个性化插件处理数据变更，[点我查看](https://stackblitz.com/edit/concent-middleware?file=index.js)；
* 支持react 0.10+任意版本；
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
### counter示例
将以下代码复制粘贴到`cc-app`目录下的`src/App.js`文件里(注：是完全覆盖掉原来的内容)。
然后执行`npm start`运行起来，在浏览器里开始体验`cc`的神奇效果吧。
> 该示例主要演示了将一个普通的`reactClass`注册成为`ccClass`，多个`ccClass`的实例将共享`store`的数据。
```javascript
import React, {Component} from 'react';
import { register, startup } from 'concent';

startup({
  store:{
    count:1,
  }
});

class Counter extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { count: 0 }
  }
  inc = () => this.setState({ count: this.state.count + 1 })
  dec = () => this.setState({ count: this.state.count - 1 })
  render(){
    return (
      <div style={{padding:'12px', margin:'6px'}}>
        <span>{this.state.count}</span>
        <button onClick={this.inc}>+</button>
        <button onClick={this.dec}>-</button>
      </div>
    );
  }
}
const CcCounter = register('Counter', {sharedStateKeys:'*'})(Counter);

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { isShowCounter: true }
  }
  render() {
    return (
      <div>
        <Counter />
        <Counter />
        <CcCounter />
        <CcCounter />
      </div>
    )
  }
}

export default App;
```
___
## 🔨更多精彩示例
### [cc版本的ant-design-pro](https://github.com/fantasticsoul/rcc-antd-pro)
### [有趣的counter](https://stackblitz.com/edit/funny-counter)
### [增强的counter](https://stackblitz.com/edit/dva-example-count-1saxx8)
### [Jsrun playground](http://jsrun.net/fLXKp/play) 
### [Jsrun video](http://jsrun.net/vLXKp/play)
### [示例集合](https://github.com/fantasticsoul/rcc-simple-demo)
___
## 图文介绍
### cc渲染流程
![](https://raw.githubusercontent.com/fantasticsoul/static/master/img/cc/cc-core.png)
### `react类`、`cc类`和`cc实例`三者之间的关系
![](https://raw.githubusercontent.com/fantasticsoul/static/master/img/cc/cc2.png)
### cc组件的`state`和`$$propState`是怎么来的
![](https://raw.githubusercontent.com/fantasticsoul/static/master/img/cc/cc-class-and-ins.png)
### [在cc里用class和function实现counter](https://juejin.im/post/5c8f77bdf265da60ec2812f7)
### [聊一聊cc的变化侦测和hook实现](https://juejin.im/post/5c8d99f4e51d4555816d6335)
### [在cc里玩转无状态组件](https://juejin.im/post/5c838107f265da2dca389593)
### [对话 redux(家族)，后生何以挑战前辈？](https://juejin.im/post/5c8479316fb9a049ba42635c)
### [为什么不用redux](https://www.zhihu.com/question/263928256/answer/274963347)
