
## About life cycle method

We know that we can use `useEffect` in function component, and use `componentDidMount`、`componentDidUpdate`、`componentWillUnmount` in class component for life cyle methods.

And concent give you a new way to do that in `setup` block, so that let you can reuse life cycle method in function component and class component both!

```jsx
function setup(ctx){
  ctx.initState({privNum: 0, another: 100});

  ctx.effect(()=>{
    console.log('didMount');
    return ()=>{
      console.log('clear up');
    }
  }, []);

  ctx.effect(()=>{
    console.log('only privNum change will trigger this cb');
  }, ['privNum']);

  ctx.effect((ctx, isFirstCall)=>{
    // do not trigger this cb in first period
    if(!isFirstCall){
      console.log('only another change will trigger this cb');
    }
  }, ['another']);

  ctx.effectProps(()=>{
    console.log('only props.tag change will trigger this cb');
  }, ['tag']);
} 

const Demo = React.memo((props)=>{
  const { state } = useConcent({setup, props});
  return <div>{state.privNum} {state.another}</div>
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