(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[5746],{87067:function(k,l,n){"use strict";var d=n(70079),p=n(77786),m=n(41393),r=n(35250),c="#e8ae56",h=["quickStart","atom","derive","watch","reactive","signal","modular","useAtom","useDerived"];function v(e,t){e.includes(t)||e.push(t)}function a(e){var t=function(i){return{color:e===i?c:""}},u=m,s=h.slice();return Object.keys(u).forEach(function(o){return v(s,o)}),s.map(function(o){return(0,r.jsx)("div",{className:"menuWrap","data-name":o,style:t(o),children:o},o)})}l.Z=d.memo(function(e){var t=e.onClick,u=e.name,s=function(i){var _=i.target.dataset.name;_&&(t==null||t(_))};return(0,r.jsx)("div",{style:{width:"120px"},onClick:s,children:a(u)})})},74081:function(k,l,n){"use strict";var d=n(12027),p=n.n(d),m=n(93949),r=n.n(m),c=n(6270),h=n.n(c),v=n(28810),a=n.n(v),e=n(77701),t=n.n(e),u=n(28249),s=n.n(u),o=n(29861),i=n.n(o),_=n(70079),A=n(73649),C=n(71635),W=n.n(C),y=n(77786),E=n(35250),M=function(O){t()(x,O);var P=s()(x);function x(){var f;r()(this,x);for(var g=arguments.length,D=new Array(g),b=0;b<g;b++)D[b]=arguments[b];return f=P.call.apply(P,[this].concat(D)),i()(a()(f),"state",{logs:[]}),f}return h()(x,[{key:"componentDidMount",value:function(){var g=this;(0,C.Hook)(window.console,function(D){g.setState(function(b){var R=b.logs;return{logs:[].concat(p()(R),[(0,C.Decode)(D)])}})}),console.log("Welcome to helux playground (helux ver: ".concat(A.cst.VER,")^_^"))}},{key:"render",value:function(){var g=this,D=function(){return g.setState({logs:[]})};return(0,E.jsxs)("div",{className:"liveConsoleWrap",children:[(0,E.jsx)("button",{type:"button",style:{position:"absolute",right:"12px",top:"1px",zIndex:2e3},onClick:D,children:"clear"}),(0,E.jsx)("div",{className:"liveConsole",children:(0,E.jsx)(C.Console,{logs:this.state.logs,variant:"dark"})})]})}}]),x}(_.Component);l.Z=_.memo(M)},71120:function(k,l,n){"use strict";var d=n(70079),p=n(77786),m=n(41393),r=n(35250),c={atom:{dict_atomx:"dict(atomx)",dict_sharex:"dict(sharex)"},reactive:{dict_atomx:"dict(atomx)"},useReactive:{primitive_atomx:"primitive(atomx)"}};function h(a,e){var t;return((t=c[a])===null||t===void 0?void 0:t[e])||e}function v(a,e){var t=function(i){return e===i?{backgroundColor:"rgb(100, 90, 183)",color:"#fff"}:{backgroundColor:"",color:"rgb(100, 90, 183)"}},u=m,s=u[a]||{};return Object.keys(s).map(function(o){return(0,r.jsx)("div",{className:"topBarItem","data-name":o,style:t(o),children:h(a,o)},o)})}l.Z=d.memo(function(a){var e=a.onClick,t=a.name,u=a.subName,s=function(i){var _=i.target.dataset.name;_&&(e==null||e(_))};return(0,r.jsx)("div",{className:"topBar",onClick:s,children:(0,r.jsx)("span",{className:"samples",children:v(t,u)})})})},58638:function(k,l,n){"use strict";n.d(l,{EI:function(){return v},U0:function(){return h}});var d=n(28633),p=n.n(d),m=n(73649),r=(0,m.share)({key:"",code:""}),c=p()(r,3),h=c[0],v=c[1],a=c[2]},41393:function(k,l,n){"use strict";n.r(l),n.d(l,{atom:function(){return o},derive:function(){return A},modular:function(){return S},quickStart:function(){return a},reactive:function(){return x},signal:function(){return R},useAtom:function(){return N},useDerived:function(){return L},useReactive:function(){return U},useWatch:function(){return K},watch:function(){return y}});var d=`
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
`,p=`
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
`,m=`
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
`,r=`
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

render(<><h1 style={{color:'red'}}>dom\u7C92\u5EA6\u66F4\u65B0</h1><DataBindWidthNoHook/></>);
`,c=`
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
`,h=`
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

render(<><h1 style={{color:'red'}}>block\u7C92\u5EA6\u66F4\u65B0</h1><DictDataBindWidthNoHookUsingBlock/></>);
`,v=`
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
`,a={HelloHelux:d,HelloHeluxDict:p,DataBindWidthHook:m,DataBindWidthNoHook:r,DictDataBindWidthHook:c,DictDataBindWidthNoHookUsingBlock:h,ChangeStateWithActions:v},e=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`,t=`
const [dict, setDict] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDict(draft => {
    // draft was already unboxed from { val: T } to T
    draft.b.b1.b2 += 100;
  })
  console.log('dict.val.b.b1.b2 is ', dict.val.b.b1.b2);
};

render(<button onClick={ change } > change { $(dict.val.b.b1.b2)}</button>);
`,u=`
// stateRoot was still boxed,
// state was already unboxed from { val: T } to T
const { state, stateRoot, setDraft } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
  console.log('stateRoot.val.b.b1.b2 is ', stateRoot.val.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
`,s=`
// state === stateRoot when use sharex
const { state, stateRoot, setDraft } = sharex({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
  console.log('stateRoot.b.b1.b2 is ', stateRoot.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
`,o={primitive:e,dict:t,dict_atomx:u,dict_sharex:s},i=`
const [ num, setNum ] = atom(1);
const result = derive(()=> num.val + 1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
  console.log(\`result is \${result.val}\`);
};

render(<button onClick={change}>change {$(result.val)}</button>);
`,_=`
const [ num, setNum ] = atom(1);
// deriveDict has no boxed behavior
const result = deriveDict(()=> ({ plus1: num.val + 1, plus100: num.val + 100 }));

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
  console.log('result is', result);
};

render(<button onClick={change}>change {$(result.plus1)} {$(result.plus100)}</button>);
`,A={primitive:i,dict:_},C=`
const [num, setNum] = atom(1);
watch(
  // watch cb
  () => {
    console.log(\`change from \${getSnap(num).val} to \${num.val}\`);
  },
  // deps cb
  () => [num],
);

const change = () => {
  setNum(prev => prev + 1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`,W=`
const [dict, setDict] = atom({ a: 1, b: { b1: { b2: 1 } } });
watch(
  // watch cb
  () => {
    console.log(\`change from \${getSnap(dict).val.b.b1.b2} to \${dict.val.b.b1.b2}\`);
  },
  // deps cb
  () => [dict.val.b.b1.b2],
);

const change = () => {
  setDict(draft => {
    // draft was already unboxed from { val: T } to T
    draft.b.b1.b2 += 100;
  });
  console.log('dict.val.b.b1.b2 is ', dict.val.b.b1.b2);
};

render(<button onClick={change}>change {$(dict.val.b.b1.b2)}</button>);

`,y={primitive:C,dict:W},E=`
const [ num, , { reactiveRoot } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
  setTimeout(()=>{
    console.log(\`num is \${num.val}\`);
  },0);
};

render(<button onClick={change}>change {$(num)}</button>);
`,M=`
const [ num, , { reactiveRoot, flush: flushChanged } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
  flushChanged(); // commit changed data immediately
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`,O=`
// use unboxed reactive insteadof boxed reactiveRoot
const [dict, , { reactive }] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  reactive.b.b1.b2 += 100; // already unboxed
  setTimeout(()=>{
    console.log('reactive.b.b1.b2 is ', reactive.b.b1.b2);
  },0);
};

render(<button onClick={ change }> change { $(reactive.b.b1.b2)}</button>);
`,P=`
// state was already unboxed from { val: T } to T
const { reactive } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  reactive.b.b1.b2 += 100; // already unboxed
  setTimeout(()=>{
    console.log('reactive.b.b1.b2 is ', reactive.b.b1.b2);
  },0);
};

render(<button onClick={change}>change {$(reactive.b.b1.b2)}</button>);
`,x={primitive:E,primitive_flush:M,dict:O,dict_atomx:P},f=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {signal(num)}</button>);
`,g=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

// use $ instead of signal to wrap shared state primitive value
render(<button onClick={change}>change {$(num)}</button>);
`,D=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num, (val)=>\`this is num \${val}\`)}</button>);
`,b=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

const Num = block(()=>{
  const [ count, setCount ] = React.useState(0);

  return (
    <div>
      {/** pass shared state primite value without hook */}
      {num.val}
      <br />
      local count: {count}
      <button onClick={change}>change</button>
      <button onClick={()=>setCount(prev=>prev+1)}>change count</button>
    </div>
  );
});

render(<><Num /><Num /></>);
`,R={primitive:f,alias:g,format:D,block:b},B=`
const { defineActions, useState } = sharex({ a: 1, b: { b1: { b2: 1 } } });

const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));

const { actions, useLoading } = defineActions()({
  // sync action
  changeA({ draft }) {
    draft.a += 1;
  },
  // async action
  async changeB2Async({ draft }) {
    await delay();
    const { b1 } = draft.b;
    b1.b2 += 10;
    if (b1.b2 > 30 && b1.b2 < 50) {
      throw new Error('throw err to useLoading');
    }
  },
});

function Demo() {
  const [state] = useState();
  return (
    <div>
      <h1>state.a: {state.a} </h1>
      <button onClick={actions.changeA}>changeA</button>
    </div>
  );
}

function DemoWithLoading() {
  const [state] = useState();
  const { changeB2Async: { ok, loading, err } } = useLoading();
  return (
    <div>
      {ok && <h1>state.b.b1.b2: {state.b.b1.b2} </h1>}
      {loading && <h1>loading...</h1>}
      {err && <h1 style={{ color: 'red' }}> {err.message} </h1>}
      <button onClick={actions.changeB2Async}>changeB2Async</button>
      <h5>click 3 times will trigger error</h5>
    </div>
  );
}

render(<><Demo /><DemoWithLoading /></>);
`,S={defineActions:B},T=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev => prev + 1);
  console.log(\`num is \${num.val}\`);
};

function Demo() {
  const [ numVal ] = useAtom(num); // already unboxed
  return (
    <div>
      num: {numVal}
      <button onClick={change}>change</button>
    </div>
  );
};

render(<><Demo /><Demo /></>);
`,N={primitive:T},$=`
const [ num, setNum ] = atom(1);
const result = derive(()=> num.val + 100);

const change = ()=> {
  setNum(prev => prev + 1);
  console.log(\`num is \${num.val}\`);
};

function Demo() {
  const [ numVal ] = useDerived(result); // already unboxed
  return (
    <div>
      derived num: {numVal}
      <button onClick={change}>change</button>
    </div>
  );
};

render(<><h1>num: {$(num.val)}</h1><Demo /><Demo /></>);
`,L={primitive:$},I=`
const [ num, , { reactiveRoot, useReactive: useReactiveState } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
};

function Demo() {
  const [ numVal ] = useReactiveState(); // already unboxed
  return (
    <div>
      num: {numVal}
      <button onClick={change}>change</button>
    </div>
  );
};

render(<><Demo /><Demo /></>);
`,H=`
const ctx = atomx(1); // atomx return dict, atom return tuple
const { reactiveRoot } = ctx;

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
};

function Demo() {
  const [ numVal ] = ctx.useReactive(); // already unboxed
  return (
    <div>
      num: {numVal}
      <button onClick={change}>change</button>
    </div>
  );
};

render(<><Demo /><Demo /></>);
`,U={primitive:I,primitive_atomx:H},w=`
const { reactiveRoot, useState } = atomx(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
};

function Demo() {
  const [ numVal ] = useState(); // already unboxed
  const [ count, setCount ] = React.useState(0);

  helux.useWatch(()=>{
    console.log('found reactiveRoot changed');
    // no closure trap
    console.log('always print latest count ', count);
  }, ()=>[reactiveRoot]);

  return (
    <div>
      num: {numVal}
      <br />
      local count: {count}
      <button onClick={change}>change</button>
      <button onClick={()=>setCount(prev=>prev+1)}>change count</button>
    </div>
  );
};

render(<><Demo /><Demo /></>);
`,j=`
// use unboxed reactive instead of boxed reactiveRoot here
const { reactive, useState } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = ()=> {
  reactive.b.b1.b2++; // commit at next tick
};

function Demo() {
  const [ numVal ] = useState(); // already unboxed
  const [ count, setCount ] = React.useState(0);

  helux.useWatch(()=>{
    console.log('found reactive..b.b1.b2 changed');
    // no closure trap
    console.log('always print latest count ', count);
  }, ()=>[reactive.b.b1.b2]); // watch sub node

  return (
    <div>
      reactive.b.b1.b2: {reactive.b.b1.b2}
      <br />
      local count: {count}
      <button onClick={change}>change</button>
      <button onClick={()=>setCount(prev=>prev+1)}>change count</button>
    </div>
  );
};

render(<><Demo /><Demo /></>);
`,K={primitive:w,dict:j}},77786:function(){"use strict"},2903:function(){}}]);
