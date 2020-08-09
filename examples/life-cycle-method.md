
## About life cycle method

![](https://raw.githubusercontent.com/fantasticsoul/assets/master/article-img/rmc-comparison/cc-unified-lifecycle-en.png)

We know that we can use `useEffect` in function component, and use `componentDidMount`、`componentDidUpdate`、`componentWillUnmount` in class component for life cyle methods.

But `setup` can be used in both class and function component, that means user can easily share logic (even including life cycle logic) between the 2 kinds of component, so that you can reuse life cycle method in function component and class component both!

```jsx
function setup(ctx){
  const { initState, effect, effectProps, setState, state } = ctx;
  initState({privNum: 0, another: 100});

  effect(()=>{
    console.log('didMount');
    return ()=>{
      console.log('clear up');
    }
  }, []);

  effect(()=>{
    console.log('only privNum change will trigger this cb');
  }, ['privNum']);

  effect((ctx, isFirstCall)=>{
    // do not trigger this cb in first period
    if(!isFirstCall){
      console.log('only another change will trigger this cb');
    }
  }, ['another']);

  effectProps(()=>{
    console.log('only props.tag change will trigger this cb');
  }, ['tag']);

  return {
    addPriv: ()=> setState({privNum:state.privNum + 1}),
    addAnother: ()=> setState({another:state.another + 100}),
  }
} 

const Demo = React.memo((props)=>{
  const { state, settings:se } = useConcent({setup, props});
  return (
    <div>
      {state.privNum} {state.another} tag:{props.tag}
      <button onClick={se.addPriv}>addPriv</button>
      <button onClick={se.addAnother}>addAnother</button>
    </div>
  );
});

function App(){
  const [tag, setTag] = useState('hi');
  return (
    <div>
      <button onClick={()=>setTag(Date.now())}>change tag</button>
      <Demo tag={tag} />
      <Demo tag={tag} />
    </div>
  );
}
```

## 👉[try edit this online demo](https://codesandbox.io/s/life-cycle-method-im9iq)
