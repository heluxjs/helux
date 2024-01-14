"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[2433,4610],{89869:function(J,x,r){r.r(x);var o=r(28633),j=r.n(o),y=r(73649),g=(0,y.share)({a:1}),$=j()(g,1),u=$[0],R=(0,y.atom)(3e3),E=j()(R,1),N=E[0];(0,y.watch)(function(){console.log("found price changed: [ priceState ]")},function(){return[u]}),(0,y.watch)(function(){console.log("found price or numAtom changed: ()=>[ priceState, numAtom ]")},function(){return[u,N]}),x.default=function(){return""}},63850:function(J,x,r){r.r(x);var o=r(28633),j=r.n(o),y=r(73649),g=(0,y.share)({a:1}),$=j()(g,1),u=$[0];(0,y.watch)(function(){console.log("found price.a changed: () => [priceState.a]")},function(){return[u.a]}),x.default=function(){return""}},27433:function(J,x,r){r.r(x),r.d(x,{default:function(){return w}});var o=r(28633),j=r.n(o),y=r(24610),g=r(73649);function $(){return{name:"dict",a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{list:[],mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var u=r(35250),R=(0,g.atom)($),E=j()(R,1),N=E[0];function k(B){var P=(0,g.useAtom)(N,{pure:B.pure}),M=j()(P,3),O=M[0],L=M[2],I=O.extra,K=O.name,H=O.desc,V=I.list,F=I.mark;return(0,u.jsxs)(y.MarkUpdate,{info:L,children:[(0,u.jsx)("div",{children:K}),(0,u.jsx)("div",{children:H}),(0,u.jsx)("div",{children:V.length}),(0,u.jsx)("div",{children:F})]})}var w=function(){return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(k,{pure:!0}),(0,u.jsx)(k,{pure:!1})]})}},52322:function(J,x,r){r.r(x),r.d(x,{default:function(){return kn}});var o={};r.r(o),r.d(o,{atom:function(){return M},derive:function(){return I},modular:function(){return rn},reactive:function(){return Z},signal:function(){return en},useAtom:function(){return cn},useDerived:function(){return X},useReactive:function(){return ln},useWatch:function(){return mn},watch:function(){return V}});var j=r(28633),y=r.n(j),g=r(24325),$=r.n(g),u=r(70079),R=r(18207),E=r(5027),N=r(73649),k=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`,w=`
const [dict, setDict] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDict(draft => {
    // draft was already unboxed from { val: T } to T
    draft.b.b1.b2 += 100;
  })
  console.log('dict.val.b.b1.b2 is ', dict.val.b.b1.b2);
};

render(<button onClick={ change } > change { $(dict.val.b.b1.b2)}</button>);
`,B=`
// stateRoot was still boxed,
// state was already unboxed from { val: T } to T
const { state, stateRoot, setDraft } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
  console.log('stateRoot.val.b.b1.b2 is ', stateRoot.val.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
`,P=`
// state === stateRoot when use sharex
const { state, stateRoot, setDraft } = sharex({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
  console.log('stateRoot.b.b1.b2 is ', stateRoot.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
`,M={primitive:k,dict:w,dict_atomx:B,dict_sharex:P},O=`
const [ num, setNum ] = atom(1);
const result = derive(()=> num.val + 1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
  console.log(\`result is \${result.val}\`);
};

render(<button onClick={change}>change {$(result.val)}</button>);
`,L=`
const [ num, setNum ] = atom(1);
// deriveDict has no boxed behavior
const result = deriveDict(()=> ({ plus1: num.val + 1, plus100: num.val + 100 }));

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
  console.log('result is', result);
};

render(<button onClick={change}>change {$(result.plus1)} {$(result.plus100)}</button>);
`,I={primitive:O,dict:L},K=`
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
`,H=`
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

`,V={primitive:K,dict:H},F=`
const [ num, , { reactiveRoot } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
  setTimeout(()=>{
    console.log(\`num is \${num.val}\`);
  },0);
};

render(<button onClick={change}>change {$(num)}</button>);
`,z=`
const [ num, , { reactiveRoot, flush: flushChanged } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
  flushChanged(); // commit changed data immediately
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`,Y=`
// use unboxed reactive insteadof boxed reactiveRoot
const [dict, , { reactive }] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  reactive.b.b1.b2 += 100; // already unboxed
  setTimeout(()=>{
    console.log('reactive.b.b1.b2 is ', reactive.b.b1.b2);
  },0);
};

render(<button onClick={ change } > change { $(reactive.b.b1.b2)}</button>);
`,Q=`
// state was already unboxed from { val: T } to T
const { reactive } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  reactive.b.b1.b2 += 100; // already unboxed
  setTimeout(()=>{
    console.log('reactive.b.b1.b2 is ', reactive.b.b1.b2);
  },0);
};

render(<button onClick={change}>change {$(reactive.b.b1.b2)}</button>);
`,Z={primitive:F,primitive_flush:z,dict:Y,dict_atomx:Q},_=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {signal(num)}</button>);
`,q=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

// use $ instead of signal to wrap shared state primitive value
render(<button onClick={change}>change {$(num)}</button>);
`,nn=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num, (val)=>\`this is num \${val}\`)}</button>);
`,tn=`
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
`,en={primitive:_,alias:q,format:nn,block:tn},an=`
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
`,rn={defineActions:an},on=`
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
`,cn={primitive:on},G=`
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
`,X={primitive:G},un=`
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
`,sn=`
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
`,ln={primitive:un,primitive_atomx:sn},dn=`
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
`,U=`
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
`,mn={primitive:dn,dict:U},s=r(35250),vn="#e8ae56",bn=["atom","derive","watch","reactive","signal","modular","useAtom","useDerived"];function n(d,i){d.includes(i)||d.push(i)}function t(d){var i=function(h){return{color:d===h?vn:""}},c=o,b=bn.slice();return Object.keys(c).forEach(function(m){return n(b,m)}),b.map(function(m){return(0,s.jsx)("div",{className:"menuWrap","data-name":m,style:i(m),children:m},m)})}var e=u.memo(function(d){var i=d.onClick,c=d.name,b=function(h){var f=h.target.dataset.name;f&&(i==null||i(f))};return(0,s.jsx)("div",{style:{width:"120px"},onClick:b,children:t(c)})}),a={atom:{dict_atomx:"dict(atomx)",dict_sharex:"dict(sharex)"},reactive:{dict_atomx:"dict(atomx)"},useReactive:{primitive_atomx:"primitive(atomx)"}};function v(d,i){var c;return((c=a[d])===null||c===void 0?void 0:c[i])||i}function l(d,i){var c=function(f){return i===f?{backgroundColor:"rgb(100, 90, 183)",color:"#fff"}:{backgroundColor:"",color:"rgb(100, 90, 183)"}},b=o,m=b[d]||{};return Object.keys(m).map(function(h){return(0,s.jsx)("div",{className:"topBarItem","data-name":h,style:c(h),children:v(d,h)},h)})}var p=u.memo(function(d){var i=d.onClick,c=d.name,b=d.subName,m=function(f){var S=f.target.dataset.name;S&&(i==null||i(S))};return(0,s.jsx)("div",{className:"topBar",onClick:m,children:l(c,b)})}),C=r(12027),A=r.n(C),D=r(93949),T=r.n(D),pn=r(6270),xn=r.n(pn),yn=r(28810),Cn=r.n(yn),Dn=r(77701),Sn=r.n(Dn),An=r(28249),jn=r.n(An),Rn=r(29861),$n=r.n(Rn),hn=r(71635),En=function(d){Sn()(c,d);var i=jn()(c);function c(){var b;T()(this,c);for(var m=arguments.length,h=new Array(m),f=0;f<m;f++)h[f]=arguments[f];return b=i.call.apply(i,[this].concat(h)),$n()(Cn()(b),"state",{logs:[]}),b}return xn()(c,[{key:"componentDidMount",value:function(){var m=this;(0,hn.Hook)(window.console,function(h){m.setState(function(f){var S=f.logs;return{logs:[].concat(A()(S),[(0,hn.Decode)(h)])}})}),console.log("Welcome to helux playground ^_^")}},{key:"render",value:function(){var m=this,h=function(){return m.setState({logs:[]})};return(0,s.jsxs)("div",{className:"liveConsoleWrap",children:[(0,s.jsx)("button",{type:"button",style:{position:"absolute",right:"12px",top:"1px",zIndex:2e3},onClick:h,children:"clear"}),(0,s.jsx)("div",{className:"liveConsole",children:(0,s.jsx)(hn.Console,{logs:this.state.logs,variant:"dark"})})]})}}]),c}(u.Component),Nn=u.memo(En),On=$()({helux:N,React:u},N),Tn={atom:"primitive",derive:"primitive",modular:"defineActions"},gn={};function fn(d,i){var c,b=o;return((c=b[d])===null||c===void 0?void 0:c[i])||""}var kn=function(){var d=u.useState({name:"atom",subName:"primitive",code:fn("atom","primitive")}),i=y()(d,2),c=i[0],b=i[1],m=function(S){var W=gn[S]||Tn[S]||"primitive";b({name:S,subName:W,code:fn(S,W)})},h=function(S){var W=c.name;gn[W]=S,b({name:W,subName:S,code:fn(W,S)})};return(0,s.jsx)(R.nu,{noInline:!0,code:c.code,scope:On,theme:E.np.vsDark,children:(0,s.jsx)("div",{className:"playground-wrap",children:(0,s.jsxs)("div",{style:{display:"flex",height:"100%",padding:"12px 100px"},children:[(0,s.jsx)(e,{onClick:m,name:c.name}),(0,s.jsxs)("div",{style:{flex:"1 1 0px",height:"100%"},children:[(0,s.jsx)(p,{onClick:h,name:c.name,subName:c.subName}),(0,s.jsx)(R.uz,{style:{height:"100%"}})]}),(0,s.jsxs)("div",{style:{flex:"1 1 0px",height:"calc(100vh - 138px)"},children:[(0,s.jsx)("div",{style:{width:"200%",height:"28px"}}),(0,s.jsxs)("div",{style:{height:"50%",padding:"12px",boxSizing:"border-box",border:"1px solid #e8ae56"},children:[(0,s.jsx)(R.IF,{className:"liveErr"}),(0,s.jsx)(R.i5,{})]}),(0,s.jsx)(Nn,{})]})]})})})}},24610:function(J,x,r){r.r(x),r.d(x,{Entry:function(){return an},MarkUpdate:function(){return mn},MarkUpdateH1:function(){return s},MarkUpdateH2:function(){return vn},MarkUpdateH3:function(){return bn},demoUtils:function(){return nn}});var o=r(70079);function j(n,t){var e=n==null?null:typeof Symbol!="undefined"&&n[Symbol.iterator]||n["@@iterator"];if(e!=null){var a,v,l,p,C=[],A=!0,D=!1;try{if(l=(e=e.call(n)).next,t===0){if(Object(e)!==e)return;A=!1}else for(;!(A=(a=l.call(e)).done)&&(C.push(a.value),C.length!==t);A=!0);}catch(T){D=!0,v=T}finally{try{if(!A&&e.return!=null&&(p=e.return(),Object(p)!==p))return}finally{if(D)throw v}}return C}}function y(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);t&&(a=a.filter(function(v){return Object.getOwnPropertyDescriptor(n,v).enumerable})),e.push.apply(e,a)}return e}function g(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?y(Object(e),!0).forEach(function(a){R(n,a,e[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):y(Object(e)).forEach(function(a){Object.defineProperty(n,a,Object.getOwnPropertyDescriptor(e,a))})}return n}function $(n,t){if(typeof n!="object"||!n)return n;var e=n[Symbol.toPrimitive];if(e!==void 0){var a=e.call(n,t||"default");if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(n)}function u(n){var t=$(n,"string");return typeof t=="symbol"?t:String(t)}function R(n,t,e){return t=u(t),t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function E(n,t){return N(n)||j(n,t)||k(n,t)||B()}function N(n){if(Array.isArray(n))return n}function k(n,t){if(n){if(typeof n=="string")return w(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);if(e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set")return Array.from(n);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return w(n,t)}}function w(n,t){(t==null||t>n.length)&&(t=n.length);for(var e=0,a=new Array(t);e<t;e++)a[e]=n[e];return a}function B(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var P=0;function M(){return P+=1,P}function O(n){var t=n||new Date,e=t.toLocaleString(),a="".concat(t.getTime()).substring(10);return"".concat(e," ").concat(a)}function L(n,t){var e=Object.keys(n).map(function(a){return n[a]});return e.concat(t||[])}function I(){}function K(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return Math.ceil(Math.random()*n)}function H(){for(var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:8,t="",e="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",a=0;a<n;a++)t+=e.charAt(Math.floor(Math.random()*e.length));return t}var V=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:2e3;return new Promise(function(e){return setTimeout(e,t)})};function F(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),a=1;a<t;a++)e[a-1]=arguments[a];z.apply(void 0,[n,"blue"].concat(e))}function z(n,t){for(var e,a=arguments.length,v=new Array(a>2?a-2:0),l=2;l<a;l++)v[l-2]=arguments[l];(e=console).log.apply(e,["%c ".concat(n),"color:".concat(t)].concat(v))}function Y(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),a=1;a<t;a++)e[a-1]=arguments[a];z.apply(void 0,[n,"red"].concat(e))}function Q(n,t){n.includes(t)||n.push(t)}function Z(){var n=new Date,t=n.toLocaleString(),e=t.split(" "),a=E(e,2),v=a[1],l=n.getMilliseconds();return"".concat(v," ").concat(l)}function _(n){window.see||(window.see={}),Object.assign(window.see,n)}function q(){return{loading:!1,a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var nn=Object.freeze({__proto__:null,getSeed:M,getLocaleTime:O,getAtionFns:L,noop:I,random:K,randomStr:H,delay:V,log:F,logColor:z,logRed:Y,nodupPush:Q,timemark:Z,bindToWindow:_,dictFactory:q});function tn(){var n=o.useState({}),t=E(n,2),e=t[1];return function(){return e({})}}function en(n){var t=n.fns,e=t===void 0?[]:t,a=[];return Array.isArray(e)?a=e:Object.keys(e).forEach(function(v){var l=e[v];l.__fnName=v,a.push(l)}),a}function an(n){var t=n.buttonArea,e=t===void 0?"":t,a=n.children,v=o.useState(!0),l=E(v,2),p=l[0],C=l[1],A=tn();return o.createElement("div",null,o.createElement("button",{onClick:function(){return C(!p)}},"switch show"),o.createElement("button",{onClick:A},"force update"),en(n).map(function(D,T){return o.createElement("button",{key:T,onClick:D},D.__fnName||D.name)}),e,o.createElement("div",{className:"box"},p&&a))}var rn={border:"1px solid green",padding:"6px",margin:"6px"},on={fontSize:"12px",color:"#fff",padding:"3px"},cn={margin:"3px",backgroundColor:"#e0e0e0"},G=["#0944d0","#fc774b","#1da187","#fdc536","#1789f5"],X=0;function un(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,e=0;t?(e=X%G.length,X++):e=n%G.length;var a=G[e];return a}var sn={time:0,sn:0,insKey:0,getDeps:function(){return[]}};function ln(n){var t=[];return Array.isArray(n)?t=n||[]:t=[n],t}function dn(n){var t=ln(n),e=0,a="",v=t.map(function(C){return C.insKey}).join(","),l=[];t.forEach(function(C){e+=C.sn;var A=C.getDeps();A.forEach(function(D){return Q(l,D)})}),a=l.join(" , ");var p=t.length>1?"(sn sum ".concat(e,")"):"(sn ".concat(e,")");return{sn:e,depStr:a,snStr:p,insKeyStr:v}}function U(n){var t=n.name,e=t===void 0?"MarkUpdate":t,a=n.info,v=a===void 0?sn:a,l=n.forceColor,p=dn(v),C=p.sn,A=p.insKeyStr,D=p.depStr,T=p.snStr;return o.createElement("div",{style:rn},n.children,o.createElement("div",{style:g(g({},on),{},{backgroundColor:un(C,l)})},"[",e,"] update at ",O()," ",T," (insKey ",A,")"),D&&o.createElement("div",{style:{color:"green"}}," deps is [ ",D," ]"))}function mn(n){return o.createElement(U,g({},n),n.children)}function s(n){return o.createElement(U,g({},n),o.createElement("h1",null,n.children))}function vn(n){return o.createElement(U,g({},n),o.createElement("h2",null,n.children))}function bn(n){return o.createElement(U,g({},n),o.createElement("h3",{style:cn},n.children))}}}]);
