

## About dep collection of state

concent will collect all component's data dep in their every render period.

> try click toggle button and then click add button, see the change of `renderCount`

```jsx
import React, { Component } from "react";
import { run, useConcent, register } from "concent";

run({
  counter: {
    state: { num: 100 }
  }
});

const View = ({state, renderCount, toggle, add})=>(
  <div>
    num: {state.show ? state.num : "hide"}
    <br />
    <span>renderCount: {renderCount}</span>
    <button onClick={toggle}>toggle</button>
    <button onClick={add}>add</button>
  </div>
);

function FnCounter() {
  // useConcent returns render ctx
  const { state, setState, syncBool, renderCount } = useConcent({
    module: "counter",
    state: { show: true }
  });
  const add = () => setState({ num: state.num + 1 });

  return <View {...{state, toggle:syncBool("show"), renderCount, add}} />
}

// or @register({module:'counter'})
@register("counter")
class ClsCounter extends Component {
  state = { show: true };
  // this.state === this.ctx.state
  add = () => this.setState({ num: this.state.num + 1 });
  render() {
    const {syncBool, renderCount, state} = this.ctx;
    return <View {...{state, toggle:syncBool("show"), renderCount, add:this.add}} />
  }
}

function App() {
  return (
    <div>
      <FnCounter />
      <ClsCounter />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

## [try edit this online demo](https://codesandbox.io/s/dep-collection-of-state-3l5mp)
