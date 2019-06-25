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

