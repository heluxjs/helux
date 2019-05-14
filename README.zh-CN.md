# react-control-center [C_C]
## without redux、mobx, writing react app with cc is a funny way also, it's definitely worth doing!

#### 介绍
* cc是一个渐进式的、弱入侵的状态管理框架，可以和已有的redux混合使用，也可以独立使用，对现有的代码改造成本微乎其微；可以当做一种组件间通信的辅助工具使用，也可以当做整个项目的功能性组件服务转态管理。
* cc精确的状态广播使得渲染的组件使得渲染效率异常高效，只渲染该渲染的片段；
* cc的渲染理念认为，功能型组件，一切渲染皆应由state的改变而触发，弱化props的地位，props只需要在contructor里感知存在；
* cc为state key划分了四种类型：temporary , stored , shared，global, 配上模块化的设计、sharedToGlobalMapping等高级功能，可以让开发探索更多的有趣的、简单的、高效的管理你的应用状态的可能！

<h1 style="text-align:center;color:#4EB899">react-control-center</h1>
<ul>
<li style="font-size:16px;color:#4EB899">更优雅的兄弟组件间或者父子组件间通信</li>
cc内建了一个CC_CONTEXT管理所有的CC组件，可以方便你直接呼叫任意CC组件的任意方法
<li style="font-size:16px;color:#4EB899">全局状态同步，高效渲染</li>
 受控于cc管理的组件，可以选择共享的state key，所有共享了相同state key的组件，能够自动同步state并触发渲染，从而达到更优的渲染效率
<li style="font-size:16px;color:#4EB899">state就是唯一的数据源</li>
忘记props吧，组件的state就是唯一的数据源，不需要层层穿透数据. cc实例一共可以拥有四种状态，

>temporaryState,随着CC组件销毁就丢失

>storedState,即refState,在ccOption里设置了storedStateKeys里的每一cc实例拥有的属于自己的state，组件销毁再次挂载也会被cc还原

>sharedState,如果在CCClass里设置了module并指定了sharedStateKeys(备注：sharedStateKeys最好根据需求制定模块名字，如果不指定的话，cc默认使用的是$$default模块的数据)，表示该CCClass的所以实例都关注此state的变化，大家会共享此state，任何一个实例改变了此state，cc都会将这份state传播到此CCClass类其他CC实例，除非某个CCInstance在ccOption设置了syncState=false,则该CCInstance不会受到影响

>globalState,可以为所有CCClass根据自己的需求设置需要关心的globalStateKeys,任何CCInstance关心的globalStateKeys里发生变化时，会被cc触发渲染

>简而言之，四种状态根据自己需求组合使用，一种属于CC实例的临时状态，一种属于CC实例的可持久化状态，一种属于单个CC类的可持久化状态，一种属于所有CC类的可持久化状态

>by using sharedStateKeys,不同的CC实例可以关注不同模块(register CCClass时不指定模块但是设置了sharedStateKeys，表示关注$$default模块)的key的值变化

>by using storedState,不同的CC实例可以存储管理自己的状态

>by using globalStateKeys,不同的CC实例实例可以关注$$global模块里不同的key的值变化
<li style="font-size:16px;color:#4EB899">类redux的变成体验</li>
支持类redux模式的store、reducer、action、dispatch等概念的编程体验，但是更容易与现有项目集成，不需要顶层包裹Provider来提供redux上下文，但是如果你的项目不需要这些概念的引入，你仅仅只需要setState，数据从this.state获取，其他的都交给cc去完成吧,cc本身也可以在redux使用，并不会入侵redux现有的模式，可以局部引入cc，渐进式的体验它的优雅。
<li style="font-size:16px;color:#4EB899">可模块化管理的store、reducer</li>
cc内置的store和reducer可以被模块化拆分，方便你的视图逻辑和业务逻辑组织得更低耦合高内聚
<li style="font-size:16px;color:#4EB899">支持cc实例定义$$computed属性</li>
computed属性计算出的值会被缓存，如果对应的key的原始值不发生变化，computed对应的值不会再次计算
<li style="font-size:16px;color:#4EB899">支持cc实例方法内通过调用$$emit, $$on和其他cc示例完成通信 </li>
</ul>

<h2 style="text-align:left;color:#4EB899">其他</h2>

- 示例项目: https://github.com/fantasticsoul/rcc-simple-demo
- 更多信息请参考 待添加。
- ![工作示意图](http://cdn.boldseas.com/img/cc-1.png)
---
## 核心api -- 顶层api

  ### startup
> 启动cc后，才能在项目其他任何地方使用cc的所有功能，通常将cc的启动操作放在整个应用的入口文件的第一行
> * 非模块化模式，直接启动cc，cc默认将所有cc实例的状态存储到$$default模块，可以在console里通过ccc.store.getState()查看cc管理的所有状态，注册一个ccClass时，如果设置了sharedStateKeys标记想要共享的状态key，则该ccClass的所有实例都共享这些key对应的值，不设置sharedStateKeys则表示该ccClass的所有实例里的状态都是各自独立的，并不会相互共享。
随着应用规模越来越大，组件越来越多，组件间的状态都应该属于各自专有领域对应的模块，所以生产环境建议使用模块的方式来使用cc。
```
import cc from 'react-control-center';

cc.startup()

```
> * 非模块化模式，配置store，reducer, init 启动cc, store和reducer都将默认归属到$$default模块
```
import cc from 'react-control-center';

cc.startup(
  {
    store:{
      bookList:[],
      readCount:200,
      cardList:[],
    },
    reducer:{
      'setBookList':(setState, payload, [dispatchContext])=>{
        //your code here
        const newBookList = payload;
        setState({bookList:newBookList});
      }
    },
    init: setState=>{
      api.getBooks(books=>{
        setState({books})
      });
    }
  }
)

```
> * 配置模块化的store，reducer, init启动cc,
>> {Object} [startOption]
>> {Boolean} [startOption.isStoreModuleMode] 设置为true，表示以模块化的方式启动cc
>> {Object} [startOption.store] 配置的store, key代表名，value代表整个模块对应的初始化state
>> {Object} [startOption.reducer] 配置的reducer， key代表reducerModule, 可以让reducerModule和store的名称保持一致，这样在ccInstance里调用this.$$dispatch时只需要指定type，cc自动会寻找同一个模块的type对应函数去处理action，当然你也可以自定义reducerModule为别的值，dispatch时设置reducerModule和type，表示寻找指定的reducerModule下的指定type的函数去处理action.
value代表reducer function -- rfn.
cc支持rfn为普通函数，生成器函数，async函数
```
import cc from 'react-control-center';

cc.startup(
  {
    isStoreModuleMode:true,
    store:{
      user:{

      },
      product:{

      }
    },
    reducer:{
      user:{
          serUser:({state, payload:user, dispatch, effect, xeffect})=>{
          //your code here
          return {user}
         }
      }
      product:{
          setProducts:({payload:products})=>{
          //your code here
          setState({products});
         }
      }
    }
  }
)

```

### register
在cc startup后，任意地方可以向cc注册想要被cc控制的组件
```
import cc from 'react-control-center';
import react from 'react';

class BookMenu extends react.Component{
  constructor(props, context){
    super(props, context);
    this.state = {books:[], color:'red', readCount:0};
  }
  makeBooks = ()=>{
    const books = this.state.books;
    books.push({name:'book_setState', author:Date.now()});
    return books;
  }
  setBooks = (books)=>{
    this.setState({books});
  }
  addBookBySetState = ()=>{
    const books = makeBooks();
    //cc接管了setState函数，这里的setState是cc自己实现的setState函数，但是最终调用触发渲染的函数式react的setState,cc保留了react.setState的引用
    this.setState({books});//该数据会同步到其他所有BookMenu实例

    //this.setState({books},()=>{});//支持传入回调
  }
  addBookByDispatch = ()=>{
    const books = makeBooks();
    this.$$dispatch({type:'setBooks',payload:books});
    //如果是模块化的cc，需要传入module
    //this.$$dispatch({module:'book',type:'setBooks',payload:books});
    //支持传入回调，最终触发的是 reactSetState(state, cb);
    //this.$$dispatch({module:'book',type:'setBooks',payload:books,cb=>{this.setState({color:'yellow'})}});
  }
  addBookByInvoke = ()=>{
    //cc的CC_CONTEXT管理着所有cc实例的引用，可以直接调用实例的任何方法
    cc.invoke('BookMenu','bm1','setBooks', books);
  }
  render(){
    return (
      <div>
        <button onClick={this.addBookBySetState}>通过setState添加一本书</button>
        <button onClick={this.addBookByDispatch}>通过dispatch添加一本书</button>
        <button onClick={this.addBookByInvoke}>通过invoke添加一本书</button>
        {
          books.map(b=><div>{b.name} --- {b.author}</div>)
        }
      </div>
    );
  }
}

//处于非模块化模式的cc组件，自动关注的是cc内建的$$global模块的数据
export default register('BookMenu')(BookMenu);

//通过非模块化模式启动的cc，所有cc组件自动关注的是cc内建的$$global模块的数据, 选择共享的stateKeys,这样所有BookMenu的实例化组件，只要有任何一个组件通过setState改变了books，都会将books数据同步到其他所有同样关注此books数据的组件，从而触发他们的渲染
//export default register('BookMenu', {sharedStateKeys:['books']})(BookMenu);

//通过模块化模式启动的cc，注明模块名称book，表示关注的是book模块的数据的变化。支持不同的类关注同一个模块的数据，共享同样的stateKeys，cc会精确的通知这些不同类的组件示例触发渲染
//export default register('BookMenu', {module:'book',sharedStateKeys:['books']})(BookMenu);
```
```
import BookMenu from './BookMenu';
import react from 'react';

export default class App extends react.Component{
  render(){
    <div>
      {/*每一个CC示例都要标记不重复的ccKey，如果不提供的话，cc会自动的生成一个，cc示例默认都拥有同步state的功能，在所有cc实例都销毁后，再次实例化的话，数据会从cc的store恢复回来*/}
      <BookMenu ccKey="bm1" />
      <BookMenu ccKey="bm2" />
      {/*默认都是接受同步数据行为或者同步数据到其他组件，通过标记ccOption.syncState=false, 该实例不再产生数据同步行为，它的setState仅仅影响自己，它实例化时，cc不会的把store的数据注入到它的state*/}
      <BookMenu ccKey="bm3" ccOption={{syncState:false}} />
    </div>
  }
}

```

### invoke
starup后，cc的CC_CONTEXT管理着所有cc实例的引用，可以直接调用实例的任何方法

---
## 核心api -- cc实例定义的函数

### cc实例的自定义生命周期函数 
```
$$beforeSetState, $$beforeBroadcastState，$$afterSetState 各自的触发时机处于以下位置

$$beforeSetState
$$beforeBroadcastState（如果存在要广播的状态，此方法被调用）
componentWillReceiveProps
shouldComponentUpdate
componentWillUpdate
render
componentDidUpdate
$$afterSetState
```
### cc实例的自定义$$computed函数 
```
@cc.register('Foo');
class Foo extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state = {
      foo: 'foo',
      bar: 'bar',
    };
  }
  $$computed = ()=>{
    return {
      foo: foo=> `wrapped foo:${foo}`,
      bar: bar=> `reversed bar:${bar.split('').reverse().join('')}`
    }
  }
  render(){
    const {foo, bar} = this.state;
    const {foo:cFoo, bar:cBar} = this.$$refComputed;
    return (
      <div>
        <p>foo {foo}</p>
        <p>bar {bar}</p>
        <p>computed foo {cFoo}</p>
        <p>computed bar {cBar}</p>
      </div>
    );
  }
}
```
---
## 核心api -- cc实例运行时可以调用的函数
### cc实例的自定义$$computed函数 

---
### 结语
* 此项目启发于redux的高阶函数，在脑海里构思了一周左右，觉得通过控制引用接管setState函数，可以精确的控制想要渲染的组件，数据都从state降低编程的复杂度
* 所有cc组件都具有相互感知到共享的key的数据变化，且组件销毁后数据能够存储的store里，使得再次实例化组件时数据能够自动恢复，让state能够变得更智能
* 有了具体的思路，整个核心源码的实现一共花了2天左右，个人的目的是让react-control-center能够在已有项目中能够局部的渐进式的使用，所以设计的非常弹性，核心api非常少，不需要你为了react-control-center而让现有项目改动特别大，使用期待大家能够给我更多的star，提出更多的issues，让react-control-center 成为一种新的状态管理工具的可选项
* 也欢迎fork和提PR，让我们为react-control-center的成长一起贡献力量，如有兴趣讨论更多有意思的功能或者给予我更多的帮助，可以直接加我QQ 624313307。
* 更多代码演示，参见我的示例项目 https://github.com/fantasticsoul/rcc-simple-demo
* 第一次写README, 比较简陋，而且时间比较紧张，个人还有公司的是要开发任务要处理，所以文档目前也没有建立起来，index.d.ts也还没有添加，后期等得到更多的反馈后会逐步完善起来，期待大家通过我的示例项目体会到
react-control-center的简单与美妙，