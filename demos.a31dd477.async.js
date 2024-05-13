(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[2433,4610],{61101:function(L,p,a){"use strict";a.r(p);var c=a(28633),S=a.n(c),g=a(73649),m=a(35250),R=(0,g.share)({a:1,c:0}),i=S()(R,2),j=i[0],O=i[1],T=(0,g.watch)(function(){console.log("found price changed: [ priceState ]")},function(){return[j]});T.unwatch();function P(){O(function(M){return void(M.a+=100)})}function $(){T.run()}p.default=function(){return(0,m.jsxs)("div",{children:[(0,m.jsx)("h1",{children:"after calling unwatch"}),(0,m.jsx)("button",{type:"button",onClick:P,children:"change state will not trigger watch"}),(0,m.jsx)("br",{}),(0,m.jsx)("br",{}),(0,m.jsx)("button",{type:"button",onClick:$,children:"run will still trigger watch"})]})}},89869:function(L,p,a){"use strict";a.r(p);var c=a(28633),S=a.n(c),g=a(73649),m=(0,g.share)({a:1}),R=S()(m,1),i=R[0],j=(0,g.atom)(3e3),O=S()(j,1),T=O[0];(0,g.watch)(function(){console.log("found price changed: [ priceState ]")},function(){return[i]}),(0,g.watch)(function(){console.log("found price or numAtom changed: ()=>[ priceState, numAtom ]")},function(){return[i,T]}),p.default=function(){return""}},63850:function(L,p,a){"use strict";a.r(p);var c=a(28633),S=a.n(c),g=a(73649),m=(0,g.share)({a:1}),R=S()(m,1),i=R[0];(0,g.watch)(function(){console.log("found price.a changed: () => [priceState.a]")},function(){return[i.a]}),p.default=function(){return""}},27433:function(L,p,a){"use strict";a.r(p),a.d(p,{default:function(){return $}});var c=a(28633),S=a.n(c),g=a(24610),m=a(73649);function R(){return{name:"dict",a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{list:[],mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var i=a(35250),j=(0,m.atom)(R),O=S()(j,1),T=O[0];function P(M){var I=(0,m.useAtom)(T,{pure:M.pure}),U=S()(I,3),_=U[0],K=U[2],W=_.extra,H=_.name,V=_.desc,F=W.list,z=W.mark;return(0,i.jsxs)(g.MarkUpdate,{info:K,children:[(0,i.jsx)("div",{children:H}),(0,i.jsx)("div",{children:V}),(0,i.jsx)("div",{children:F.length}),(0,i.jsx)("div",{children:z})]})}var $=function(){return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(P,{pure:!0}),(0,i.jsx)(P,{pure:!1})]})}},75551:function(L,p,a){"use strict";a.r(p),a.d(p,{default:function(){return Gn}});var c={};a.r(c),a.d(c,{atom:function(){return K},derive:function(){return V},modular:function(){return dn},reactive:function(){return an},signal:function(){return sn},useAtom:function(){return Z},useDerived:function(){return vn},useReactive:function(){return B},useWatch:function(){return pn},watch:function(){return G}});var S=a(28633),g=a.n(S),m=a(24325),R=a.n(m),i=a(70079),j=a(18207),O=a(84083),T=a.n(O),P=a(5027),$=a(73649),M=`
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
`,_=`
// state === stateRoot when use sharex
const { state, stateRoot, setDraft } = sharex({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
  console.log('stateRoot.b.b1.b2 is ', stateRoot.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
`,K={primitive:M,dict:I,dict_atomx:U,dict_sharex:_},W=`
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
`,Y=`
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
`,an={primitive:nn,primitive_flush:Y,dict:tn,dict_atomx:en},rn=`
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
`,un=`
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
`,sn={primitive:rn,alias:on,format:cn,block:un},ln=`
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
`,Z={primitive:Q},mn=`
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
`,fn=`
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
`,B={primitive:hn,primitive_atomx:fn},bn=`
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
`,pn={primitive:bn,dict:gn},d=a(35250),n="#e8ae56",t=["atom","derive","watch","reactive","signal","modular","useAtom","useDerived"];function e(s,u){s.includes(u)||s.push(u)}function r(s){var u=function(b){return{color:s===b?n:""}},o=c,h=t.slice();return Object.keys(o).forEach(function(l){return e(h,l)}),h.map(function(l){return(0,d.jsx)("div",{className:"menuWrap","data-name":l,style:u(l),children:l},l)})}var f=i.memo(function(s){var u=s.onClick,o=s.name,h=function(b){var x=b.target.dataset.name;x&&(u==null||u(x))};return(0,d.jsx)("div",{style:{width:"120px"},onClick:h,children:r(o)})}),v={atom:{dict_atomx:"dict(atomx)",dict_sharex:"dict(sharex)"},reactive:{dict_atomx:"dict(atomx)"},useReactive:{primitive_atomx:"primitive(atomx)"}};function y(s,u){var o;return((o=v[s])===null||o===void 0?void 0:o[u])||u}function C(s,u){var o=function(x){return u===x?{backgroundColor:"rgb(100, 90, 183)",color:"#fff"}:{backgroundColor:"",color:"rgb(100, 90, 183)"}},h=c,l=h[s]||{};return Object.keys(l).map(function(b){return(0,d.jsx)("div",{className:"topBarItem","data-name":b,style:o(b),children:y(s,b)},b)})}var A=i.memo(function(s){var u=s.onClick,o=s.name,h=s.subName,l=function(x){var N=x.target.dataset.name;N&&(u==null||u(N))};return(0,d.jsx)("div",{className:"topBar",onClick:l,children:(0,d.jsx)("span",{className:"samples",children:C(o,h)})})}),D=a(12027),w=a.n(D),Rn=a(93949),On=a.n(Rn),$n=a(6270),Tn=a.n($n),Nn=a(28810),Pn=a.n(Nn),_n=a(77701),kn=a.n(_n),Mn=a(28249),wn=a.n(Mn),In=a(29861),Un=a.n(In),xn=a(71635),Wn=function(s){kn()(o,s);var u=wn()(o);function o(){var h;On()(this,o);for(var l=arguments.length,b=new Array(l),x=0;x<l;x++)b[x]=arguments[x];return h=u.call.apply(u,[this].concat(b)),Un()(Pn()(h),"state",{logs:[]}),h}return Tn()(o,[{key:"componentDidMount",value:function(){var l=this;(0,xn.Hook)(window.console,function(b){l.setState(function(x){var N=x.logs;return{logs:[].concat(w()(N),[(0,xn.Decode)(b)])}})}),console.log("Welcome to helux playground ^_^")}},{key:"render",value:function(){var l=this,b=function(){return l.setState({logs:[]})};return(0,d.jsxs)("div",{className:"liveConsoleWrap",children:[(0,d.jsx)("button",{type:"button",style:{position:"absolute",right:"12px",top:"1px",zIndex:2e3},onClick:b,children:"clear"}),(0,d.jsx)("div",{className:"liveConsole",children:(0,d.jsx)(xn.Console,{logs:this.state.logs,variant:"dark"})})]})}}]),o}(i.Component),Bn=i.memo(Wn),Ln=(0,$.share)({key:"",code:""}),yn=g()(Ln,3),Sn=yn[0],Cn=yn[1],Xn=yn[2],Kn=a(75829),Hn=a.n(Kn);function jn(s,u){var o,h=c;return((o=h[s])===null||o===void 0?void 0:o[u])||""}var Vn=R()({helux:$,React:i},$),Fn={atom:"primitive",derive:"primitive",modular:"defineActions"},An={},En=T().parse(window.location.search,{ignoreQueryPrefix:!0}),J=En.n||"atom",X=En.s||"primitive",zn=jn(J,X);Cn(function(s){s.key="".concat(J,"_").concat(X)});function q(s,u,o){Hn().getItem("helux_code_".concat(s,"_").concat(u),function(h,l){!h&&typeof l=="string"&&l.trim().length>0?o(l):o(jn(s,u))})}var Gn=function(){var s=i.useState({name:J,subName:X}),u=g()(s,2),o=u[0],h=u[1],l=i.useState(zn),b=g()(l,2),x=b[0],N=b[1];(0,i.useEffect)(function(){q(J,X,N)},[]),(0,$.useWatch)(function(){var E=Sn.code;E.trim().length===0&&q(J,X,N)},function(){return[Sn.code]});var Qn=(0,i.useCallback)(function(E){var k=An[E]||Fn[E]||"primitive";Cn(function(Dn){Dn.key="".concat(E,"_").concat(k)}),h({name:E,subName:k}),q(E,k,N)},[o.name,o.subName]),Jn=(0,i.useCallback)(function(E){var k=o.name;An[k]=E,Cn(function(Dn){Dn.key="".concat(k,"_").concat(E)}),h({name:k,subName:E}),q(k,E,N)},[o.name,o.subName]);return(0,d.jsx)(j.nu,{noInline:!0,code:x,scope:Vn,theme:P.np.vsDark,children:(0,d.jsx)("div",{className:"playground-wrap",children:(0,d.jsxs)("div",{style:{display:"flex",height:"100%",padding:"12px 100px"},children:[(0,d.jsx)(f,{onClick:Qn,name:o.name}),(0,d.jsxs)("div",{style:{flex:"1 1 0px",height:"100%"},children:[(0,d.jsx)(A,{onClick:Jn,name:o.name,subName:o.subName}),(0,d.jsx)(j.uz,{style:{flexGrow:1}})]}),(0,d.jsxs)("div",{style:{flex:"1 1 0px",height:"calc(100vh - 138px)"},children:[(0,d.jsx)("div",{style:{width:"200%",height:"28px"}}),(0,d.jsxs)("div",{style:{height:"50%",padding:"12px",boxSizing:"border-box",border:"1px solid #e8ae56"},children:[(0,d.jsx)(j.IF,{className:"liveErr"}),(0,d.jsx)(j.i5,{})]}),(0,d.jsx)(Bn,{})]})]})})})}},24610:function(L,p,a){"use strict";a.r(p),a.d(p,{Entry:function(){return un},MarkUpdate:function(){return bn},MarkUpdateH1:function(){return gn},MarkUpdateH2:function(){return pn},MarkUpdateH3:function(){return d},demoUtils:function(){return rn}});var c=a(70079);function S(n,t){var e=n==null?null:typeof Symbol!="undefined"&&n[Symbol.iterator]||n["@@iterator"];if(e!=null){var r,f,v,y,C=[],A=!0,D=!1;try{if(v=(e=e.call(n)).next,t===0){if(Object(e)!==e)return;A=!1}else for(;!(A=(r=v.call(e)).done)&&(C.push(r.value),C.length!==t);A=!0);}catch(w){D=!0,f=w}finally{try{if(!A&&e.return!=null&&(y=e.return(),Object(y)!==y))return}finally{if(D)throw f}}return C}}function g(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);t&&(r=r.filter(function(f){return Object.getOwnPropertyDescriptor(n,f).enumerable})),e.push.apply(e,r)}return e}function m(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?g(Object(e),!0).forEach(function(r){j(n,r,e[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):g(Object(e)).forEach(function(r){Object.defineProperty(n,r,Object.getOwnPropertyDescriptor(e,r))})}return n}function R(n,t){if(typeof n!="object"||!n)return n;var e=n[Symbol.toPrimitive];if(e!==void 0){var r=e.call(n,t||"default");if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(n)}function i(n){var t=R(n,"string");return typeof t=="symbol"?t:String(t)}function j(n,t,e){return t=i(t),t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function O(n,t){return T(n)||S(n,t)||P(n,t)||M()}function T(n){if(Array.isArray(n))return n}function P(n,t){if(n){if(typeof n=="string")return $(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);if(e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set")return Array.from(n);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return $(n,t)}}function $(n,t){(t==null||t>n.length)&&(t=n.length);for(var e=0,r=new Array(t);e<t;e++)r[e]=n[e];return r}function M(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var I=0;function U(){return I+=1,I}function _(n){var t=n||new Date,e=t.toLocaleString(),r="".concat(t.getTime()).substring(10);return"".concat(e," ").concat(r)}function K(n,t){var e=Object.keys(n).map(function(r){return n[r]});return e.concat(t||[])}function W(){}function H(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return Math.ceil(Math.random()*n)}function V(){for(var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:8,t="",e="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",r=0;r<n;r++)t+=e.charAt(Math.floor(Math.random()*e.length));return t}var F=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:2e3;return new Promise(function(e){return setTimeout(e,t)})};function z(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];G.apply(void 0,[n,"blue"].concat(e))}function G(n,t){for(var e,r=arguments.length,f=new Array(r>2?r-2:0),v=2;v<r;v++)f[v-2]=arguments[v];(e=console).log.apply(e,["%c ".concat(n),"color:".concat(t)].concat(f))}function nn(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];G.apply(void 0,[n,"red"].concat(e))}function Y(n,t){n.includes(t)||n.push(t)}function tn(){var n=new Date,t=n.toLocaleString(),e=t.split(" "),r=O(e,2),f=r[1],v=n.getMilliseconds();return"".concat(f," ").concat(v)}function en(n){window.see||(window.see={}),Object.assign(window.see,n)}function an(){return{loading:!1,a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var rn=Object.freeze({__proto__:null,getSeed:U,getLocaleTime:_,getAtionFns:K,noop:W,random:H,randomStr:V,delay:F,log:z,logColor:G,logRed:nn,nodupPush:Y,timemark:tn,bindToWindow:en,dictFactory:an});function on(){var n=c.useState({}),t=O(n,2),e=t[1];return function(){return e({})}}function cn(n){var t=n.fns,e=t===void 0?[]:t,r=[];return Array.isArray(e)?r=e:Object.keys(e).forEach(function(f){var v=e[f];v.__fnName=f,r.push(v)}),r}function un(n){var t=n.buttonArea,e=t===void 0?"":t,r=n.children,f=c.useState(!0),v=O(f,2),y=v[0],C=v[1],A=on();return c.createElement("div",null,c.createElement("button",{onClick:function(){return C(!y)}},"switch show"),c.createElement("button",{onClick:A},"force update"),cn(n).map(function(D,w){return c.createElement("button",{key:w,onClick:D},D.__fnName||D.name)}),e,c.createElement("div",{className:"box"},y&&r))}var sn={border:"1px solid green",padding:"6px",margin:"6px"},ln={fontSize:"12px",color:"#fff",padding:"3px"},dn={margin:"3px",backgroundColor:"#e0e0e0"},Q=["#0944d0","#fc774b","#1da187","#fdc536","#1789f5"],Z=0;function mn(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,e=0;t?(e=Z%Q.length,Z++):e=n%Q.length;var r=Q[e];return r}var vn={time:0,sn:0,insKey:0,getDeps:function(){return[]}};function hn(n){var t=[];return Array.isArray(n)?t=n||[]:t=[n],t}function fn(n){var t=hn(n),e=0,r="",f=t.map(function(C){return C.insKey}).join(","),v=[];t.forEach(function(C){e+=C.sn;var A=C.getDeps();A.forEach(function(D){return Y(v,D)})}),r=v.join(" , ");var y=t.length>1?"(sn sum ".concat(e,")"):"(sn ".concat(e,")");return{sn:e,depStr:r,snStr:y,insKeyStr:f}}function B(n){var t=n.name,e=t===void 0?"MarkUpdate":t,r=n.info,f=r===void 0?vn:r,v=n.forceColor,y=fn(f),C=y.sn,A=y.insKeyStr,D=y.depStr,w=y.snStr;return c.createElement("div",{style:sn},n.children,c.createElement("div",{style:m(m({},ln),{},{backgroundColor:mn(C,v)})},"[",e,"] update at ",_()," ",w," (insKey ",A,")"),D&&c.createElement("div",{style:{color:"green"}}," deps is [ ",D," ]"))}function bn(n){return c.createElement(B,m({},n),n.children)}function gn(n){return c.createElement(B,m({},n),c.createElement("h1",null,n.children))}function pn(n){return c.createElement(B,m({},n),c.createElement("h2",null,n.children))}function d(n){return c.createElement(B,m({},n),c.createElement("h3",{style:dn},n.children))}},2903:function(){}}]);
