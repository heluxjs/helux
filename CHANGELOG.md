
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

