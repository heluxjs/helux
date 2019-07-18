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

```javascript
import React, { Component, Fragment } from 'react';
import { register, run } from 'concent';

//运行concent，载入模块配置
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

//定义类组件
class Counter extends Component {
  //setState 能够将数据将同步到store，广播到其他实例
  inc = () => {
    this.setState({ count: this.state.count + 1 });
  }
  dec = () => {
    this.setState({ count: this.state.count - 1 });
  }
  //调用dispatch, 同样的能够将数据将同步到store，广播到其他实例
  incD = () => {
    this.$$dispatch('inc');
  }
  decD = () => {
    this.$$dispatch('dec');
  }
  render() {
    //concent注入counter模块的数据到state
    const { count } = this.state;
    return (
      <div style={{ padding: '12px', margin: '6px' }}>
        <div>count: {count}</div>
        <button>inc by setState</button>
        <button>dec by setState</button>
        <br />
        <button>inc by dispatch</button>
        <button>dec by dispatch</button>
      </div>
    );
  }
}
//注册成为属于counter模块的名字为Counter cc类
const CcCounter_ = register('Counter', 'counter')(Counter);

function App() {
  return (
    <Fragment>
      <CcCounter_ />
      <CcCounter_ />
    </Fragment>
  )
}

export default App;
```

### 进阶counter示例
将以下代码复制粘贴到`cc-app`目录下的`src/App.js`文件里(注：是完全覆盖掉原来的内容)。
然后执行`npm start`运行起来，在浏览器里开始体验`cc`的神奇效果吧。
> 探索concent从这里开始，[点我看以下代码的在线示例](https://stackblitz.com/edit/concent-quick-start?file=index.js)

```javascript
import React, {Component} from 'react';
import cc, { register, run, CcFragment } from 'concent';

const sleep = (ms=2000) => new Promise(resolve=> setTimeout(resolve, ms));

//定义两个模块，foo 和 counter
run({
  foo:{
    state:{//定义state
      age:1,
      name:'concent',
      info:{
        addr:'Beijing',
      }
    }
  },
  counter:{
    state:{//定义state
      count:0,
      loading: '',
    },
    watch:{//定义watch，当count值发生变化时，触发此函数执行
      count(val){
        if(val==='love'){
          cc.setState('foo',{name:'now counter/count is '+val});//用cc顶层api修改foo模块的数据
        }else{
          cc.setState('foo',{name:'try input love'});
        }
      }
    },
    computed:{//定义computed，当count值发生变化时，会触发此函数计算，计算的值可以在实例里的this.$$moduleComputed上获得
      count(val){
        if(typeof val==='string') return val.split('').reverse().join('');
        else return val;
      }
    },
    reducer:{//定义reducer函数，用于处理业务逻辑
      setLoading({payload:loading}){
        return {loading};
      },
      updateCount({payload:count}){
        return {count};
      },
      async uploadCount({dispatch, payload:count}){
        dispatch('setLoading', '假兮兮的loading');
        await new Promise(resolve=> setTimeout(resolve, 2000));
        return {count, loading:''};
        //或者写为 
        // dispatch('setLoading', '');
        // dispatch('updateCount', count);
      }
    },
    init: async ()=>{
      await sleep(3900);
      return {count:888}
    },//定义init，模拟从后端异步获取新的初始化数据
  }
})

class Counter extends Component {
  render(){
    const {count, loading} = this.state;
    return (
      <div style={{padding:'12px', margin:'6px'}}>
        <p style={{color:'red'}}>{loading}</p>
        <span>reversed count: {this.$$moduleComputed.count}</span>
        <br/>
        {/** this.$$sync提供双向绑定的能力 */}
        <input data-ccsync="count" onChange={this.$$sync} value={count}/>
      </div>
    );
  }
}
const CcCounter_ = register('Counter', {module:'counter', sharedStateKeys:'*'})(Counter);

function App(){
  return (
    <div>
      <CcCounter_ />
      <CcCounter_ />
      {/** 这是一个CcFragment，可以快速连接store，同时也支持concent专门为CcFragment实现得hook函数, state是自己的state */}
      <CcFragment state={{ a: 1, b: 2, c: { c1: 'c1', c2: 'c2' } }} connect={{ 'foo': '*', 'counter': '*' }} render={(params) => {
        const {state, setState, connectedState, connectedComputed, hook, dispatch, sync} = params;

        //CcFragment实例里hook维护的局部state
        const [localCount='', setCount] = hook.useState();
        const [localAge='', setAge] = hook.useState('age');

        const {a, b, c} = state;//CcFragment实例自己的局部state

        hook.useEffect(()=>{
          alert('CcFragment挂载完毕');
          return ()=>console.log('CcFragment卸载的时候才会执行这个清理函数');
        },[]);//第二位参数是空数组，让这个副作用只会在CcFragment挂载完毕执行一次而已
        return (
          <div>
            <h3>count: {connectedState.counter.count}</h3>
            <h3>age: {connectedState.foo.age}</h3>
            <h3>name: {connectedState.foo.name}</h3>
            <p>
              输入count:<input value={localCount} onChange={e=>setCount(e.currentTarget.value)} />
              {/** 直接通过dispatch句柄来调用counter模块的uploadCount函数 */}
              <button onClick={()=>dispatch('counter/uploadCount', localCount)}>点击确认，修改foo模块里的count</button>
            </p>

            <p>
              {/** hook的setter自动实现了双向绑定 */}
              localAge:<input value={localAge} onChange={setAge} />
            </p>

            <p>
              setState修改本地转态：
              {/** 使用setState句柄修改局部state状态 */}
              <input value={a} onChange={e=>setState({a:e.currentTarget.value})}/>
            </p>

            <p>
              sync双向绑定本地状态：
              {/** 使用sync句柄自动同步转态，data-ccsync里的key不加模块前缀的话，cc只会将和值同步到实例本地状态里 */}
              <input data-ccsync="b" value={b} onChange={sync}/>
            </p>
            <p>
              c1:<input data-ccsync="c.c1" value={c.c1} onChange={sync}/>
              c2:<input data-ccsync="c.c2" value={c.c2} onChange={sync}/>
            </p>

            <p>
              sync双向绑定模块状态：
              {/** 使用sync句柄自动同步转态，data-ccsync里的key加了模块名前缀foo，cc会广播这个状态到其他实例 */}
              <input data-ccsync="foo/age" value={connectedState.foo.age} onChange={sync}/>
            </p>
            <p>
              修改foo模块下的addr值:
              <input data-ccsync="foo/info.addr" value={connectedState.foo.info.addr} onChange={sync}/>
            </p>

          </div>
        )
      }}/>
    </div>
  );
}

export default App;
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
