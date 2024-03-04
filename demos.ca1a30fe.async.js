(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[2433,4610],{60049:function(Y,y,r){"use strict";r.r(y);var c=r(28633),j=r.n(c),f=r(73649),p=(0,f.share)({a:1}),$=j()(p,1),s=$[0],R=(0,f.atom)(3e3),E=j()(R,1),P=E[0];(0,f.watch)(function(){console.log("found price changed: [ priceState ]")},function(){return[s]}),(0,f.watch)(function(){console.log("found price or numAtom changed: ()=>[ priceState, numAtom ]")},function(){return[s,P]}),y.default=function(){return""}},34260:function(Y,y,r){"use strict";r.r(y);var c=r(28633),j=r.n(c),f=r(73649),p=(0,f.share)({a:1}),$=j()(p,1),s=$[0];(0,f.watch)(function(){console.log("found price.a changed: () => [priceState.a]")},function(){return[s.a]}),y.default=function(){return""}},21003:function(Y,y,r){"use strict";r.r(y),r.d(y,{default:function(){return N}});var c=r(28633),j=r.n(c),f=r(24610),p=r(73649);function $(){return{name:"dict",a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{list:[],mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var s=r(35250),R=(0,p.atom)($),E=j()(R,1),P=E[0];function M(L){var I=(0,p.useAtom)(P,{pure:L.pure}),U=j()(I,3),O=U[0],K=U[2],W=O.extra,H=O.name,V=O.desc,F=W.list,z=W.mark;return(0,s.jsxs)(f.MarkUpdate,{info:K,children:[(0,s.jsx)("div",{children:H}),(0,s.jsx)("div",{children:V}),(0,s.jsx)("div",{children:F.length}),(0,s.jsx)("div",{children:z})]})}var N=function(){return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(M,{pure:!0}),(0,s.jsx)(M,{pure:!1})]})}},69648:function(Y,y,r){"use strict";r.r(y),r.d(y,{default:function(){return Qn}});var c={};r.r(c),r.d(c,{atom:function(){return K},derive:function(){return V},modular:function(){return dn},reactive:function(){return an},signal:function(){return un},useAtom:function(){return _},useDerived:function(){return vn},useReactive:function(){return B},useWatch:function(){return pn},watch:function(){return G}});var j=r(28633),f=r.n(j),p=r(24325),$=r.n(p),s=r(70079),R=r(24817),E=r(84083),P=r.n(E),M=r(5027),N=r(73649),L=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`,I=`
const [dict, setDict] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDict(draft => {
    // draft was already unboxed from { val: T } to T
    draft.b.b1.b2 += 100;
  })
  console.log('dict.val.b.b1.b2 is ', dict.val.b.b1.b2);
};

render(<button onClick={ change } > change { $(dict.val.b.b1.b2)}</button>);
`,U=`
// stateRoot was still boxed,
// state was already unboxed from { val: T } to T
const { state, stateRoot, setDraft } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
  console.log('stateRoot.val.b.b1.b2 is ', stateRoot.val.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
`,O=`
// state === stateRoot when use sharex
const { state, stateRoot, setDraft } = sharex({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
  console.log('stateRoot.b.b1.b2 is ', stateRoot.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
`,K={primitive:L,dict:I,dict_atomx:U,dict_sharex:O},W=`
const [ num, setNum ] = atom(1);
const result = derive(()=> num.val + 1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
  console.log(\`result is \${result.val}\`);
};

render(<button onClick={change}>change {$(result.val)}</button>);
`,H=`
const [ num, setNum ] = atom(1);
// deriveDict has no boxed behavior
const result = deriveDict(()=> ({ plus1: num.val + 1, plus100: num.val + 100 }));

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
  console.log('result is', result);
};

render(<button onClick={change}>change {$(result.plus1)} {$(result.plus100)}</button>);
`,V={primitive:W,dict:H},F=`
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
`,z=`
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

`,G={primitive:F,dict:z},nn=`
const [ num, , { reactiveRoot } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
  setTimeout(()=>{
    console.log(\`num is \${num.val}\`);
  },0);
};

render(<button onClick={change}>change {$(num)}</button>);
`,Z=`
const [ num, , { reactiveRoot, flush: flushChanged } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
  flushChanged(); // commit changed data immediately
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`,tn=`
// use unboxed reactive insteadof boxed reactiveRoot
const [dict, , { reactive }] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  reactive.b.b1.b2 += 100; // already unboxed
  setTimeout(()=>{
    console.log('reactive.b.b1.b2 is ', reactive.b.b1.b2);
  },0);
};

render(<button onClick={ change }> change { $(reactive.b.b1.b2)}</button>);
`,en=`
// state was already unboxed from { val: T } to T
const { reactive } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  reactive.b.b1.b2 += 100; // already unboxed
  setTimeout(()=>{
    console.log('reactive.b.b1.b2 is ', reactive.b.b1.b2);
  },0);
};

render(<button onClick={change}>change {$(reactive.b.b1.b2)}</button>);
`,an={primitive:nn,primitive_flush:Z,dict:tn,dict_atomx:en},rn=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {signal(num)}</button>);
`,on=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

// use $ instead of signal to wrap shared state primitive value
render(<button onClick={change}>change {$(num)}</button>);
`,cn=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num, (val)=>\`this is num \${val}\`)}</button>);
`,sn=`
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
`,un={primitive:rn,alias:on,format:cn,block:sn},ln=`
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
`,dn={defineActions:ln},Q=`
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
`,_={primitive:Q},mn=`
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
`,vn={primitive:mn},hn=`
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
`,bn=`
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
`,B={primitive:hn,primitive_atomx:bn},fn=`
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
`,gn=`
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
`,pn={primitive:fn,dict:gn},d=r(35250),n="#e8ae56",t=["atom","derive","watch","reactive","signal","modular","useAtom","useDerived"];function e(u,i){u.includes(i)||u.push(i)}function a(u){var i=function(b){return{color:u===b?n:""}},o=c,v=t.slice();return Object.keys(o).forEach(function(l){return e(v,l)}),v.map(function(l){return(0,d.jsx)("div",{className:"menuWrap","data-name":l,style:i(l),children:l},l)})}var h=s.memo(function(u){var i=u.onClick,o=u.name,v=function(b){var g=b.target.dataset.name;g&&(i==null||i(g))};return(0,d.jsx)("div",{style:{width:"120px"},onClick:v,children:a(o)})}),m={atom:{dict_atomx:"dict(atomx)",dict_sharex:"dict(sharex)"},reactive:{dict_atomx:"dict(atomx)"},useReactive:{primitive_atomx:"primitive(atomx)"}};function x(u,i){var o;return((o=m[u])===null||o===void 0?void 0:o[i])||i}function C(u,i){var o=function(g){return i===g?{backgroundColor:"rgb(100, 90, 183)",color:"#fff"}:{backgroundColor:"",color:"rgb(100, 90, 183)"}},v=c,l=v[u]||{};return Object.keys(l).map(function(b){return(0,d.jsx)("div",{className:"topBarItem","data-name":b,style:o(b),children:x(u,b)},b)})}var S=s.memo(function(u){var i=u.onClick,o=u.name,v=u.subName,l=function(g){var k=g.target.dataset.name;k&&(i==null||i(k))};return(0,d.jsx)("div",{className:"topBar",onClick:l,children:(0,d.jsx)("span",{className:"samples",children:C(o,v)})})}),D=r(12027),w=r.n(D),$n=r(93949),En=r.n($n),Nn=r(6270),kn=r.n(Nn),On=r(28810),Tn=r.n(On),Pn=r(77701),wn=r.n(Pn),Mn=r(28249),In=r.n(Mn),Un=r(29861),Wn=r.n(Un),xn=r(71635),Bn=function(u){wn()(o,u);var i=In()(o);function o(){var v;En()(this,o);for(var l=arguments.length,b=new Array(l),g=0;g<l;g++)b[g]=arguments[g];return v=i.call.apply(i,[this].concat(b)),Wn()(Tn()(v),"state",{logs:[]}),v}return kn()(o,[{key:"componentDidMount",value:function(){var l=this;(0,xn.Hook)(window.console,function(b){l.setState(function(g){var k=g.logs;return{logs:[].concat(w()(k),[(0,xn.Decode)(b)])}})}),console.log("Welcome to helux playground ^_^")}},{key:"render",value:function(){var l=this,b=function(){return l.setState({logs:[]})};return(0,d.jsxs)("div",{className:"liveConsoleWrap",children:[(0,d.jsx)("button",{type:"button",style:{position:"absolute",right:"12px",top:"1px",zIndex:2e3},onClick:b,children:"clear"}),(0,d.jsx)("div",{className:"liveConsole",children:(0,d.jsx)(xn.Console,{logs:this.state.logs,variant:"dark"})})]})}}]),o}(s.Component),Ln=s.memo(Bn),Kn=(0,N.share)({key:"",code:""}),yn=f()(Kn,3),Sn=yn[0],Cn=yn[1],Yn=yn[2],Hn=r(75829),Vn=r.n(Hn);function An(u,i){var o,v=c;return((o=v[u])===null||o===void 0?void 0:o[i])||""}var Fn=$()({helux:N,React:s},N),zn={atom:"primitive",derive:"primitive",modular:"defineActions"},jn={},Rn=P().parse(window.location.search,{ignoreQueryPrefix:!0}),J=Rn.n||"atom",X=Rn.s||"primitive",Gn=An(J,X);Cn(function(u){u.key="".concat(J,"_").concat(X)});function q(u,i,o){Vn().getItem("helux_code_".concat(u,"_").concat(i),function(v,l){!v&&typeof l=="string"&&l.trim().length>0?o(l):o(An(u,i))})}var Qn=function(){var u=s.useState({name:J,subName:X}),i=f()(u,2),o=i[0],v=i[1],l=s.useState(Gn),b=f()(l,2),g=b[0],k=b[1];(0,s.useEffect)(function(){q(J,X,k)},[]),(0,N.useWatch)(function(){var A=Sn.code;A.trim().length===0&&q(J,X,k)},function(){return[Sn.code]});var Jn=(0,s.useCallback)(function(A){var T=jn[A]||zn[A]||"primitive";Cn(function(Dn){Dn.key="".concat(A,"_").concat(T)}),v({name:A,subName:T}),q(A,T,k)},[o.name,o.subName]),Xn=(0,s.useCallback)(function(A){var T=o.name;jn[T]=A,Cn(function(Dn){Dn.key="".concat(T,"_").concat(A)}),v({name:T,subName:A}),q(T,A,k)},[o.name,o.subName]);return(0,d.jsx)(R.nu,{noInline:!0,code:g,scope:Fn,theme:M.np.vsDark,children:(0,d.jsx)("div",{className:"playground-wrap",children:(0,d.jsxs)("div",{style:{display:"flex",height:"100%",padding:"12px 100px"},children:[(0,d.jsx)(h,{onClick:Jn,name:o.name}),(0,d.jsxs)("div",{style:{flex:"1 1 0px",height:"100%"},children:[(0,d.jsx)(S,{onClick:Xn,name:o.name,subName:o.subName}),(0,d.jsx)(R.uz,{style:{flexGrow:1}})]}),(0,d.jsxs)("div",{style:{flex:"1 1 0px",height:"calc(100vh - 138px)"},children:[(0,d.jsx)("div",{style:{width:"200%",height:"28px"}}),(0,d.jsxs)("div",{style:{height:"50%",padding:"12px",boxSizing:"border-box",border:"1px solid #e8ae56"},children:[(0,d.jsx)(R.IF,{className:"liveErr"}),(0,d.jsx)(R.i5,{})]}),(0,d.jsx)(Ln,{})]})]})})})}},24610:function(Y,y,r){"use strict";r.r(y),r.d(y,{Entry:function(){return sn},MarkUpdate:function(){return fn},MarkUpdateH1:function(){return gn},MarkUpdateH2:function(){return pn},MarkUpdateH3:function(){return d},demoUtils:function(){return rn}});var c=r(70079);function j(n,t){var e=n==null?null:typeof Symbol!="undefined"&&n[Symbol.iterator]||n["@@iterator"];if(e!=null){var a,h,m,x,C=[],S=!0,D=!1;try{if(m=(e=e.call(n)).next,t===0){if(Object(e)!==e)return;S=!1}else for(;!(S=(a=m.call(e)).done)&&(C.push(a.value),C.length!==t);S=!0);}catch(w){D=!0,h=w}finally{try{if(!S&&e.return!=null&&(x=e.return(),Object(x)!==x))return}finally{if(D)throw h}}return C}}function f(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);t&&(a=a.filter(function(h){return Object.getOwnPropertyDescriptor(n,h).enumerable})),e.push.apply(e,a)}return e}function p(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?f(Object(e),!0).forEach(function(a){R(n,a,e[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):f(Object(e)).forEach(function(a){Object.defineProperty(n,a,Object.getOwnPropertyDescriptor(e,a))})}return n}function $(n,t){if(typeof n!="object"||!n)return n;var e=n[Symbol.toPrimitive];if(e!==void 0){var a=e.call(n,t||"default");if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(n)}function s(n){var t=$(n,"string");return typeof t=="symbol"?t:String(t)}function R(n,t,e){return t=s(t),t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function E(n,t){return P(n)||j(n,t)||M(n,t)||L()}function P(n){if(Array.isArray(n))return n}function M(n,t){if(n){if(typeof n=="string")return N(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);if(e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set")return Array.from(n);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return N(n,t)}}function N(n,t){(t==null||t>n.length)&&(t=n.length);for(var e=0,a=new Array(t);e<t;e++)a[e]=n[e];return a}function L(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var I=0;function U(){return I+=1,I}function O(n){var t=n||new Date,e=t.toLocaleString(),a="".concat(t.getTime()).substring(10);return"".concat(e," ").concat(a)}function K(n,t){var e=Object.keys(n).map(function(a){return n[a]});return e.concat(t||[])}function W(){}function H(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return Math.ceil(Math.random()*n)}function V(){for(var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:8,t="",e="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",a=0;a<n;a++)t+=e.charAt(Math.floor(Math.random()*e.length));return t}var F=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:2e3;return new Promise(function(e){return setTimeout(e,t)})};function z(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),a=1;a<t;a++)e[a-1]=arguments[a];G.apply(void 0,[n,"blue"].concat(e))}function G(n,t){for(var e,a=arguments.length,h=new Array(a>2?a-2:0),m=2;m<a;m++)h[m-2]=arguments[m];(e=console).log.apply(e,["%c ".concat(n),"color:".concat(t)].concat(h))}function nn(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),a=1;a<t;a++)e[a-1]=arguments[a];G.apply(void 0,[n,"red"].concat(e))}function Z(n,t){n.includes(t)||n.push(t)}function tn(){var n=new Date,t=n.toLocaleString(),e=t.split(" "),a=E(e,2),h=a[1],m=n.getMilliseconds();return"".concat(h," ").concat(m)}function en(n){window.see||(window.see={}),Object.assign(window.see,n)}function an(){return{loading:!1,a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var rn=Object.freeze({__proto__:null,getSeed:U,getLocaleTime:O,getAtionFns:K,noop:W,random:H,randomStr:V,delay:F,log:z,logColor:G,logRed:nn,nodupPush:Z,timemark:tn,bindToWindow:en,dictFactory:an});function on(){var n=c.useState({}),t=E(n,2),e=t[1];return function(){return e({})}}function cn(n){var t=n.fns,e=t===void 0?[]:t,a=[];return Array.isArray(e)?a=e:Object.keys(e).forEach(function(h){var m=e[h];m.__fnName=h,a.push(m)}),a}function sn(n){var t=n.buttonArea,e=t===void 0?"":t,a=n.children,h=c.useState(!0),m=E(h,2),x=m[0],C=m[1],S=on();return c.createElement("div",null,c.createElement("button",{onClick:function(){return C(!x)}},"switch show"),c.createElement("button",{onClick:S},"force update"),cn(n).map(function(D,w){return c.createElement("button",{key:w,onClick:D},D.__fnName||D.name)}),e,c.createElement("div",{className:"box"},x&&a))}var un={border:"1px solid green",padding:"6px",margin:"6px"},ln={fontSize:"12px",color:"#fff",padding:"3px"},dn={margin:"3px",backgroundColor:"#e0e0e0"},Q=["#0944d0","#fc774b","#1da187","#fdc536","#1789f5"],_=0;function mn(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,e=0;t?(e=_%Q.length,_++):e=n%Q.length;var a=Q[e];return a}var vn={time:0,sn:0,insKey:0,getDeps:function(){return[]}};function hn(n){var t=[];return Array.isArray(n)?t=n||[]:t=[n],t}function bn(n){var t=hn(n),e=0,a="",h=t.map(function(C){return C.insKey}).join(","),m=[];t.forEach(function(C){e+=C.sn;var S=C.getDeps();S.forEach(function(D){return Z(m,D)})}),a=m.join(" , ");var x=t.length>1?"(sn sum ".concat(e,")"):"(sn ".concat(e,")");return{sn:e,depStr:a,snStr:x,insKeyStr:h}}function B(n){var t=n.name,e=t===void 0?"MarkUpdate":t,a=n.info,h=a===void 0?vn:a,m=n.forceColor,x=bn(h),C=x.sn,S=x.insKeyStr,D=x.depStr,w=x.snStr;return c.createElement("div",{style:un},n.children,c.createElement("div",{style:p(p({},ln),{},{backgroundColor:mn(C,m)})},"[",e,"] update at ",O()," ",w," (insKey ",S,")"),D&&c.createElement("div",{style:{color:"green"}}," deps is [ ",D," ]"))}function fn(n){return c.createElement(B,p({},n),n.children)}function gn(n){return c.createElement(B,p({},n),c.createElement("h1",null,n.children))}function pn(n){return c.createElement(B,p({},n),c.createElement("h2",null,n.children))}function d(n){return c.createElement(B,p({},n),c.createElement("h3",{style:dn},n.children))}},2903:function(){}}]);
