## About top api

Concent allow user change state with top api `setState`、`dispatch` and `reducer` out of instance block.

when you have many logic code before changing state, we recommend put them to `reducer`
> concent emphasize user should always return a partial state instead of whole state, it will let concent working in best performance mode, so just return what you changed in the reducer function.

```js
run({
  counter: { 
    state: {/** ... */},
    reducer: {
      inc(payload, moduleState) {
        return { num: moduleState.num + 1 };
      },
      async asyncInc(payload, moduleState) {
        await delay();
        return { num: moduleState.num + 1 };
      }
    },
  },
});
```

now you can call reducer funtion in your component instead of `setState`

```js
//  --------- for class component -----------
changeNum = () => this.setState({ num: 10 })
// ===> modify as below (attention that mr is alias of moduleReducer)
changeNum = () => this.ctx.mr.inc(10);// or this.ctx.mr.asynInc(10)

// of course you can call dispatch, but we think moduleReducer is better
//this.ctx.dispatch('inc', 10); // or this.ctx.dispatch('asynInc', 10)

//  --------- for function component -----------
const { state, mr } = useConcent("counter");// useConcent returns ref ctx
const changeNum = () => mr.inc(20); // or ctx.mr.asynInc(10)
```

but in some scenes, for example in a normal react component inner block, it don't read module state to render ui, but just want to change some module's state in some button click event callback, although it has now concent render ctx, and it can use `top api` to do that.
 
- with `setState`    

```js
import { getState, setState } from "concent";

console.log(getState('counter').num);// log: 1
setState('counter', {num:10});// change counter module's num state
console.log(getState('counter').num);// log: 10
```

- with `dispatch`   
`dispatch` return a promise, so we should wrap the logic with `async`

```js
import { getState, dispatch } from "concent";

(async ()=>{
  console.log(getState("counter").num);// log 1
  await dispatch("counter/inc");// call counter reducer inc method
  console.log(getState("counter").num);// log 2
  await dispatch("counter/asyncInc");// call counter reducer asyncInc method
  console.log(getState("counter").num);// log 3
})()
```

- with `reducer`    
infact concent collect all module's reducer to its internal `reducer` map to let user call reducer method directly!
```js
import { getState, reducer as ccReducer } from "concent";

(async ()=>{
  console.log(getState("counter").num);// log 1
  await ccReducer.counter.inc();
  console.log(getState("counter").num);// log 2
  await ccReducer.counter.asyncInc();
  console.log(getState("counter").num);// log 3
})()
```