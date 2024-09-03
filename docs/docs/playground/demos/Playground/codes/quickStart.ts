const HelloHelux = `
const [str, setStr, ctx] = atom('hello helux'); // define atom, str is boxed with {val:T} strcture
const reversedStr = derive(() => str.val.split('').reverse().join('')); // define derive

function HelloHelux(){
  const [strVal] = useAtom(str); // strVal is auto unboxed
  const [reversedStrVal] = useDerived(reversedStr);
  return (<div>
    <input value={strVal} onChange={e=>setStr(e.target.value)} />
    <input value={strVal} onChange={ctx.syncer} />
    <h1>reversed: {reversedStrVal}</h1>
  </div> );
}

render(<HelloHelux />);
`;

const HelloHeluxDict = `
// no { val: T } wrapped with share api, so using share is better than atom at this situation
const [dict, setDict, ctx] = share({str: 'hello helux'}); // define share
const reversedStr = derive(() => dict.str.split('').reverse().join('')); // define derive

function HelloHeluxDict(){
  const [dictState] = useAtom(dict);
  const [reversedStrVal] = useDerived(reversedStr);
  return (<div>
    <input value={dictState.str} onChange={e=>setDict(draft=>draft.str=e.target.value)} />
    <input value={dictState.str} onChange={ctx.syncer.str} />
    <h1>reversed: {reversedStrVal}</h1>
  </div> );
}

render(<HelloHeluxDict />);
`;

const DataBindWidthHook = `
const [num, setNum] = atom(1);
const numDouble = derive(() => num.val * 2); // derive num
const change = () => { // change num
  setNum(prev => prev + 1);
};

function DataBindWidthHook() {
  const [numVal] = useAtom(num);
  const [numDoubleVal] = useDerived(numDouble);

  return (
    <div>
      <h3>numVal {numVal}</h3>
      <h3>numDoubleVal {numDoubleVal}</h3>
      <button onClick={change}> change num </button>
    </div>
  );
}

render(<><DataBindWidthHook /><DataBindWidthHook /></>);
`;

const DataBindWidthNoHook = `
const [num, setNum] = atom(1);
const numDouble = derive(() => num.val * 2); // derive num
const change = () => { // change num
  setNum(prev => prev + 1);
};
// pass primitive data to ui with $
function DataBindWidthNoHook() { // DOM granularity update
  return (
    <div>
      <h3>numVal {$(num)} </h3>
      <h3 > numDoubleVal {$(numDouble)} </h3>
      <button onClick={change}> change num </button>
    </div>
  );
}

render(<><h1 style={{color:'red'}}>dom粒度更新</h1><DataBindWidthNoHook/></>);
`;

const DictDataBindWidthHook = `
// const [dict, setState] = atom({ a: 1, b: { b1: 1, b2: { b2_1: 'cool' } } });
// const numDouble = derive(() => dict.val.a + 100 ); // dict.val.a

// no { val: T } wrapped with share api, so using share is better than atom at this situation
const [dict, setState] = share({ a: 1, b: { b1: 1, b2: { b2_1: 'cool' } } });
const aPlus = derive(() => dict.a + 100 ); // dict.a

const change = () => { // change num
  setState(prev => prev.a += 100 );
};

function DictDataBindWidthHook() {
  const [dictState] = useAtom(dict);
  const [aPlusVal] = useDerived(aPlus);

  return (
    <div>
      <h3>dictState {dictState.a}</h3>
      <h3>aPlusVal {aPlusVal}</h3>
      <button onClick={change}> change num </button>
    </div>
  );
}

render(<DictDataBindWidthHook />);
`

const DictDataBindWidthNoHookUsingBlock = `
const [dict, setState] = share({ a: 1, b: { b1: 1, b2: { b2_1: 'cool' } } });
const aPlus = derive(() => dict.a + 100 ); // dict.a

const change = () => { // change num
  setState(prev => prev.a += 100 );
};
// create a block component
const DictDataBindWidthNoHookUsingBlock = block(()=>(
  <div>
    <h3>dictState {dict.a}</h3>
    <h3>aPlusVal {aPlus.val}</h3>
    <button onClick={change}> change num </button>
  </div>
));

render(<><h1 style={{color:'red'}}>block粒度更新</h1><DictDataBindWidthNoHookUsingBlock/></>);
`


const ChangeStateWithActions = `
const ctx = sharex({str: 'hello helux', asyncClicked: 0});
const delay = (ms=1000)=> new Promise(r=>setTimeout(r, ms));
const { actions, useLoading } = ctx.defineActions()({
  // sync action
  changeStr({ draft }) {
    draft.str = \`changed at \${Date.now()}\`;
  },
  // async action
  async changeStrAsync({ draft }) {
    await delay();
    draft.str = \`async changed at \${Date.now()}\`;
    draft.asyncClicked += 1;
    if(draft.asyncClicked === 3){
      throw new Error('a fake error occurred!');
    }
  },
});

function ChangeStateWithActions(){
  const [state] = ctx.useState();
  const ret = useLoading();
  const { changeStrAsync } = useLoading();

  return (<div>
    {changeStrAsync.loading && 'loading'}
    {changeStrAsync.ok && <h1>str: {state.str}</h1>}
    {changeStrAsync.err && <h1 style={{color:'red'}}>err: {changeStrAsync.err.message}</h1>}
    <button onClick={actions.changeStr}>changeStr</button>
    <button onClick={actions.changeStrAsync}>changeStrAsync( try click me 3 times )</button>
  </div> );
}

render(<ChangeStateWithActions />);
`;

export default {
  HelloHelux,
  HelloHeluxDict,
  DataBindWidthHook,
  DataBindWidthNoHook,
  DictDataBindWidthHook,
  DictDataBindWidthNoHookUsingBlock,
  ChangeStateWithActions,
} as Record<string, string>;
