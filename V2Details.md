
### dependency collection
In concent `v2`, support dependency collection automatically, so now there are two ways to let concent know your component dependency.

- Specify param `watchedKeys` when your declare a component
```js
import { register, useConcent } from 'concent';

// run concent with a module named 'foo'
run({
  foo:{
    state:{ f1:'f1', f2:'f2', f3:'f3' }
  }
});

// class component
@register({module:'foo', watchedKeys:['f1', 'f2']})
class ClassComp extends React.Component{
  state = {hiddenF1: false, hiddenF2:false};
  render(){
    const { state, syncBool } = this.ctx;// this.ctx.state === this.state
    const { hiddenF1, hiddenF2 } = state;

    // no mather how this ins use f1 value or not, will be trigger re-rendered when f1 value changed
    return (
      <div>
        {hiddenF1?'':<span>{state.f1}</span>}
        {hiddenF2?'':<span>{state.f2}</span>}
        <button onClick={syncBool('hiddenF1')}>toggle f1</button>
      </div>
    );
  }
}

// function component
function FnComp{
  const { state, syncBool } = useConcent({module:'foo', watchedKeys:['f1', 'f2']});
  const { hiddenF1, hiddenF2 } = state;

 // no mather how this ins use f1 value or not, will been trigger re-rendered when f1 value changed
  return (
    <div>
      {hiddenF1?'':<span>{state.f1}</span>}
      {hiddenF2?'':<span>{state.f2}</span>}
      <button onClick={syncBool('hiddenF1')}>toggle f1</button>
    </div>
  );
}
```
- Recommend don't specify `watchedKeys`, concent will collect dependency automatically!
```js
// class component
@register('foo')
class ClassComp extends React.Component{
  state = {hiddenF1: false, hiddenF2:false};
  render(){
    const { state, syncBool } = this.ctx;// this.ctx.state === this.state
    const { hiddenF1, hiddenF2 } = state;

    // if hiddenF1 is true, hiddenF2 is false, current ins will only been trigger re-rendered when f2 value changed
    return (
      <div>
        {hiddenF1?'':<span>{state.f1}</span>}
        {hiddenF2?'':<span>{state.f2}</span>}
        <button onClick={syncBool('hiddenF1')}>toggle f1</button>
      </div>
    );
  }
}

// function component
function FnComp{
  const { state, syncBool } = useConcent('foo');
  const { hiddenF1, hiddenF2 } = state;

  // if hiddenF1 is true, hiddenF2 is false, current ins will only been trigger re-rendered when f2 value changed
  return (
    <div>
      {hiddenF1?'':<span>{state.f1}</span>}
      {hiddenF2?'':<span>{state.f2}</span>}
      <button onClick={syncBool('hiddenF1')}>toggle f1</button>
    </div>
  );
}
```
[show-v2-new-feature](https://codesandbox.io/s/show-cocnent-v2-wvzwh)
attention if you change state value will fail silently and give you a warning in console
```js
function FnComp{
  const { state, syncBool } = useConcent('foo');
  const { hiddenF1, hiddenF2 } = state;

  state.f1 = 'new value';// this op will be fail
}
```

### lazy computed
in v1, user should get lazy computed value by call function, in v2 can get ti by property directly.
```js
import React, { Component } from "react";
import { register, run, useConcent, defComputed } from "concent";
import "./styles.css";

// run concent with a module named counter
run({
  counter: {
    state: { count: 12, msg: "--" },
    reducer: {
      inc(payload, moduleState, actionCtx) {
        const curCount = payload !== undefined ? payload : moduleState.count;
        return { count: curCount + 1 };
      },
    },
    computed: {
      // when count changed trigger will this fn execute
      count(n, o, f) {
        return n.count * 10;
      },
      // when count changed and read heavyCount will trigger this fn execute
      heavyCount:defComputed((n)=>{
        return n.count * 1000000;
      }, {lazy:true}),
    }
  }
});

// define a class component that belong to 'counter' module
@register("counter")
class Counter extends Component {
  add = () => this.ctx.dispatch("inc");
  render() {
    const { moduleComputed } = this.ctx;
    return (
      <div>
        count: {this.state.count}<br/>
        {/** in v1 */}
        {/** heavy count: {moduleComputed.heavyCount()}<br/> */}
        heavy count: {moduleComputed.heavyCount}<br/>
        ten*count: {moduleComputed.count}  <br />
        <button onClick={this.add}>add</button>
      </div>
    );
  }
}

// define a function component that belong to 'counter' module
function FnCounter() {
  const ctx = useConcent("counter");
  const add = () => ctx.dispatch("inc");
  const {state, moduleComputed} = ctx;
  return (
    <div>
      count: {state.count}<br/>
      {/** in v1 */}
      {/** heavy count: {moduleComputed.heavyCount()}<br/> */}
      heavy count: {moduleComputed.heavyCount}<br/>
      ten*count: {moduleComputed.count}  <br />
      <button onClick={add}>add</button><br/>
      msg: {ctx.state.msg}
    </div>
  );
}
```
