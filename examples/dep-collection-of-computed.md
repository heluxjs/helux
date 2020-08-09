
## About dep collection of computed
just like state dep collection, concent will collect all component ins's data dep in their every render period when component ins read `moduleComputed`.

> Attention that when you deconstruct the state for a computed function, you are also declare the dep keys for the function at the same time.

```jsx
import React, { Component } from "react";
import { run, useConcent, register } from "concent";

run({
  counter: {
    state: { num: 1, numBig: 100 },
    computed: {// n:newState o:oldState f:fnCtx
      // only num change will trigger this computed fn re-compute
      numx10: (n) => n.num * 10,
      // only numBig change will trigger this computed fn re-compute
      numBigx10: (n) => n.numBig * 10,
      // reuse computed result, this fn dep is ['num', 'numBig']
      sumNumx10AndBigx10: (n, o, f) => f.cuVal.numx10 + f.cuVal.numBigx10
    }
  }
});

const View = ({ state, moduleComputed, renderCount, toggle, add, addBig }) => (
  <div style={{ margin: "12px", padding: "12px", border: "1px solid blue" }}>
    {/* here is show is true, will generate dep of state keys ['num', 'numBig'] */}
    numx10: {state.show ? moduleComputed.numx10 : "hide"}
    <span style={{ paddingLeft: "12px" }}>
      numBigx10: {state.show ? moduleComputed.numBigx10 : "hide"}
    </span>
    <br />
    <span>renderCount: {renderCount}</span>
    <button onClick={toggle}>toggle</button>
    <button onClick={add}>add</button>
    <button onClick={addBig}>addBig</button>
  </div>
);

function FnCounter() {
  // useConcent returns render ctx
  const { state, moduleComputed, setState, syncBool, renderCount } = useConcent(
    {
      module: "counter",
      state: { show: true }
    }
  );
  const add = () => setState({ num: state.num + 1 });
  const addBig = () => setState({ numBig: state.numBig + 10 });

  return (
    <View
      {...{
        state,
        moduleComputed,
        toggle: syncBool("show"),
        renderCount,
        add,
        addBig
      }}
    />
  );
}

// or @register({module:'counter'})
@register("counter")
class ClsCounter extends Component {
  state = { show: true };
  // this.state === this.ctx.state
  add = () => this.setState({ num: this.state.num + 1 });
  addBig = () => this.setState({ numBig: this.state.numBig + 10 });
  render() {
    const { syncBool, renderCount, moduleComputed, state } = this.ctx;
    const { add, addBig } = this;
    return (
      <View
        {...{
          state,
          moduleComputed,
          toggle: syncBool("show"),
          renderCount,
          add,
          addBig
        }}
      />
    );
  }
}

function ShowSum() {
  const { moduleComputed } = useConcent("counter");
  return <div>{moduleComputed.sumNumx10AndBigx10}</div>;
}

function App() {
  return (
    <div>
      <FnCounter />
      <ClsCounter />
      <ShowSum />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

### 👉[try edit this online demo](https://codesandbox.io/s/dep-collection-of-computed-4nwlf)

___

## async computed

**async comoputed** is also supported, 

### 👉[try edit this async computed demo](https://codesandbox.io/s/async-computed-35byz)


## module level computed dependency collection

```js
run({
  counter:{
    state:{
      modCount: 10,
      modCountBak: 100,
      factor: 1,
    },
    computed:{
      xxx(n){
        return n.modCount + n.modCountBak;
      },// for xxx computed retKey, the depKeys is ['modCount', 'modCountBak']
      yyy(n){
        return n.modCountBak;
      },// for yyy computed retKey, the depKeys is ['modCountBak']
      zzz(n, o, f){// n means newState, o means oldState, f means fnCtx
        return f.cuVal.xxx + n.factor;
      },// for zzz computed retKey, the depKeys is ['factor', 'modCount', 'modCountBak']
    },
    watch:{
      xxx:{
        fn(n){
          console.log('---> trigger watch xxx', n.modCount);
        },// for xxx watch retKey, the depKeys is ['modCount']
        immediate: true,
      },
    }
  }
});
```

## ref level computed dependency collection

```js
const setup = ctx => {
  ctx.computed('show', (n)=>{
    return n.show + n.cool + n.good;
  });// for show retKey, the depKeys is ['show', 'cool', 'good']

  ctx.computed('show2', (n)=>{
    return n.show + '2222' + n.cool;
  });// for show2 retKey, the depKeys is ['show', 'cool', 'good']
};
```
