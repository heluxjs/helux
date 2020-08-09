
## About reducer
`effect function` and `pure function` are not distinguished in concent, they are all `reducer` that just return a new partial state or combine other reducers.

- `effect function` is Asynchronous function
- `pure function` is synchronous function

attention that athrough you can change state by `ctx.setState` directly, but if you have many logic code before set new partial state, recommend you put them to reducer

```jsx
import { run, useConcent } from "concent";

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const getToAdd = (p) => (typeof p === "number" ? p : 1);

run({
  counter: {
    state: { num: 1, numBig: 100, loading: false },
    reducer: {
      // p:payload, m:moduleState, ac:actionCtx
      addNum: (p, m, ac) => {
        return { num: m.num + getToAdd(p) };
      },
      addNumBig: (p, m, ac) => {
        return { numBig: m.numBig + 100 };
      },
      addNumAsync: async (p, m, ac) => {
        if (m.loading) {
          console.log("invalid click");
          return;
        }
        await ac.setState({ loading: true });
        await delay();
        return { num: m.num + getToAdd(p), loading: false };
      },
      callTwoReducer: async (p, m, ac) => {
        await ac.dispatch('addNumAsync');
        await ac.dispatch('addNumBig');
      }
    }
  }
});

function FnCounter() {
  // mr is short of moduleReducer
  const { state, mr } = useConcent("counter");
  const add10 = () => mr.addNum(10);

  return (
    <div>
      num: {state.loading ? "loading..." : state.num}
      <br />
      numBig: {state.numBig}
      <br />
      <button onClick={add10}>add10</button>
      <button onClick={mr.addNum}>add</button>
      <button onClick={mr.addNumAsync}>addAsync</button>
      <button onClick={mr.callTwoReducer}>combine 2 reducers</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <FnCounter />
      <FnCounter />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

## 👉 [try edit this online demo](https://codesandbox.io/s/combine-reducers-jcy6h)

___

👇

if you put reducer method in one file first and then expose to run api, you can call other reducer func by ref directly instead of string literial

> put reducer functions in a file
```js
// code in models/counter/reducer.js
export function addNum(p, m, ac){ /** code */}
export function addNumAsync(p, m, ac){ /** code */}

export function callTwoReducer(p, m, ac){
  await ac.dispatch(addNumAsync);
  await ac.dispatch(addNum);
}
```

- expose counter module configuration
```jsx
// code in models/counter/index.js
import * as reducer from './reducer';
import state from './state';

export default { state, reducer };
```

- configure counter module in run api
```jsx
// code in runConcent.js
import { runConcent } from 'concent';
import models from 'models';

runConcent(models);
```

## 👉[try edit this better demo](https://codesandbox.io/s/combine-reducers-better-7u3t9)

___