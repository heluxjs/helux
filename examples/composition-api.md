## About composition api 🎉

With composition api, user can easily separate ui and logic.

![](https://raw.githubusercontent.com/fantasticsoul/assets/master/img/cc-re-render-process.png)


Concent use `setup` param to support `composition api` feature, why we should use `setup`, look the code below

- without `setup`
```jsx
run({
  counter: {
    state: { num: 1, numBig: 100 },
  }
}

function FnCounter(){
  const { state, setState } = useConcent('counter');
  const inc = ()=> setState({num: state.num + 1});
  const dec = ()=> setState({num: state.num - 1});

  // ui code that bind state and methods ...
}
```
no matter you care about it or not, the `inc` and `dec` function will be re-generate in every render period.

- with `setup`
```jsx
function setup(ctx){// here we get ins render context that supplied by concent
  const { state, setState } = ctx;
  return {
    inc : ()=> setState({num: state.num + 1}),
    dec : ()=> setState({num: state.num - 1}),
  };
}

function FnCounter(){
  const { state, settings } = useConcent({module:'counter', setup});
  // now we can get two methods from settings
  const { inc, dec } = settings;
}
```
`setup` function will only been executed one time in component ins's first render period, so it will help for reducing gc pressure .

👉 [try edit this demo](https://codesandbox.io/s/composition-api-1-rw95j)

___

### call module reducer
if you have put some logic into reducer, you can call `mr.{methodName}` to change state

```jsx
function setup(ctx){
  const { state, mr } = ctx;
  return {
    inc : mr.inc,
    dec : mr.dec,
    complexInc: ()=>{
      if(state.num>300){
        return alert('inc forbidden');
      }
      mr.inc();
    }
  };
}
```

👉 try edit this demo](https://codesandbox.io/s/composition-api-2-1f53x)

### Use setup in class component
Of course `setup` can be used in class component with 2 ways.

- pass to register options
```jsx
import { register } from '';

@register({module:'counter', setup})
class ClsComp extends React.Component{
  render(){
    const { state, settings } = this.ctx;
  }
}
```

- define it in class component inner block
```jsx
@register('counter')
class ClsComp extends React.Component{
  $$setup(ctx){
    // your setup logic
    // ...

    // or just reuse exited setup function here
    // return setup(ctx)
  }
}
```
> attention that you can not pass setup to register options and define `$$setup` in class inner block both.

👉 [try edit this demo](https://codesandbox.io/s/composition-api-3-ykv9p)

____

## Another 2 simple demos

```jsx
import { run, useConcent } from "concent";

run();// startup concent

const setup = ctx => {
  const { initState, computed, watch, setState, sync } = ctx;
  
  initState({ greeting: 'hello concent' });
  computed("reversedGreeting", n => n.greeting.split('').reverse());
  watch("greeting", (n, o) => alert(`from ${o.greeting} to ${n.greeting}`));
  
  return {
    changeGreeting: (e) => setState({ greeting: e.target.value }),
    changeGreeting2: sync('greeting'),
  };
};

function HelloConcent(){
  const { state, refComputed, settings } = useConcent({ setup });
  return (
    <>
      <h1>{state.greeting}</h1>
      <h1>{refComputed.reversedGreeting}</h1>
      <input value={state.greeting} onChange={settings.changeGreeting}/>
      <input value={state.greeting} onChange={settings.changeGreeting2}/>
    </>
  );
}
```

👉 [try edit this demo](https://codesandbox.io/s/hello-concent-djxxh)

![hello-concent](https://github.com/fantasticsoul/assets/blob/master/img/cc-intro-1.gif?raw=true)

👉 [try edit this pic demo](https://stackblitz.com/edit/react-wpzgqd)
