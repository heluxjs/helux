
## 🔨Best practice

- run concent，load model configuration

```js
import React, { Component, Fragment } from 'react';
import { register, run } from 'concent';

run({
  counter: {// define counter module
    state: {// 【necessary】，define state
      count: 0,
      products: [],
      type: '',
    },
    reducer: {// 【optional】define reducer，write logic code to change the state
      inc(payload=1, moduleState) {
        return { count: moduleState.count + payload };
      },
      dec(payload=1, moduleState) {
        return { count: moduleState.count - payload };
      },
      async inc2ThenDec3(payload, moduleState, actionCtx){
        await actionCtx.dispatch('inc', 2);
        await actionCtx.dispatch('dec', 3);
      }
    },
    computed:{// 【optional】define computed，the function will be triggered when stateKey changed，and the return result will be cached.
      count(newState, oldState){
        return newState.count * 2;
      }
    },
    watch:{// 【optional】define watch，the function will be triggered when stateKey changed，usually for some async tasks
      count(newState, oldState){
        console.log(`count changed from ${oldState.count} to ${newState.count}`);
      }
    },
    init: async ()=>{//【optional】async state init process, attention this process has nothing to do with whether the component is mounted or not, but the result can effect all the components belong to this module.
      const state = await api.fetchState();
      return state;
    }
  }
})
```
recommend user put every part of model configure to separate files，because they have clear responsibilities.
```
|____models             # business models
| |____index.js
| |____counter
| | |____index.js
| | |____reducer.js     # change state methods(optional)
| | |____computed.js    # computed methods(optional)
| | |____watch.js       # watch methods(optional)
| | |____init.js        # async state initialization function(optional)
| | |____state.js       # module init state(required)
```
now reducer functions can call each other with function ref directly(not only string)
```js
export function inc(payload=1, moduleState) {
  return { count: moduleState.count + payload };
}

export function dec(payload=1, moduleState) {
  return { count: moduleState.count - payload };
}

// combine other reducer functions to complete a logic
export async function inc2ThenDec3(payload, moduleState, actionCtx){
  await actionCtx.dispatch(inc, 2);
  await actionCtx.dispatch(dec, 3);
}
```
you can also call `setState` in reducer function block, it is a promisified api.
```js
export updateLoading(loading){
  return { loading }
}

export async function inc2ThenDec3(payload, moduleState, actionCtx){
  await actionCtx.dispatch(inc, 2);
  //equivalent actionCtx.dispatch(updateLoading, true);
  await actionCtx.setState({loading: true});
  await actionCtx.dispatch(dec, 3);
  //equivalent actionCtx.dispatch(updateLoading, false);
  await actionCtx.setState({loading: false});
  
  //if you return a new partial state here, it will trigger view updated also, but this is optional.
  return { tip: 'you can return some new value in current reducer fn ot not' };
}
```