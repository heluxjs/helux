(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[2433,4610],{89869:function(q,C,a){"use strict";a.r(C);var u=a(28633),k=a.n(u),b=a(73649),p=(0,b.share)({a:1}),x=k()(p,1),l=x[0],R=(0,b.atom)(3e3),$=k()(R,1),O=$[0];(0,b.watch)(function(){console.log("found price changed: [ priceState ]")},function(){return[l]}),(0,b.watch)(function(){console.log("found price or numAtom changed: ()=>[ priceState, numAtom ]")},function(){return[l,O]}),C.default=function(){return""}},63850:function(q,C,a){"use strict";a.r(C);var u=a(28633),k=a.n(u),b=a(73649),p=(0,b.share)({a:1}),x=k()(p,1),l=x[0];(0,b.watch)(function(){console.log("found price.a changed: () => [priceState.a]")},function(){return[l.a]}),C.default=function(){return""}},27433:function(q,C,a){"use strict";a.r(C),a.d(C,{default:function(){return w}});var u=a(28633),k=a.n(u),b=a(24610),p=a(73649);function x(){return{name:"dict",a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{list:[],mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var l=a(35250),R=(0,p.atom)(x),$=k()(R,1),O=$[0];function P(L){var I=(0,p.useAtom)(O,{pure:L.pure}),B=k()(I,3),T=B[0],K=B[2],W=T.extra,H=T.name,V=T.desc,z=W.list,F=W.mark;return(0,l.jsxs)(b.MarkUpdate,{info:K,children:[(0,l.jsx)("div",{children:H}),(0,l.jsx)("div",{children:V}),(0,l.jsx)("div",{children:z.length}),(0,l.jsx)("div",{children:F})]})}var w=function(){return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(P,{pure:!0}),(0,l.jsx)(P,{pure:!1})]})}},13446:function(q,C,a){"use strict";a.r(C),a.d(C,{default:function(){return _n}});var u={};a.r(u),a.d(u,{atom:function(){return K},derive:function(){return V},modular:function(){return hn},reactive:function(){return cn},signal:function(){return mn},useAtom:function(){return tn},useDerived:function(){return bn},useReactive:function(){return U},useWatch:function(){return Cn},watch:function(){return G}});var k=a(28633),b=a.n(k),p=a(24325),x=a.n(p),l=a(70079),R=a(18207),$=a(84083),O=a.n($),P=a(5027),w=a(73649),L=`
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
`,T=`
// state === stateRoot when use sharex
const { state, stateRoot, setDraft } = sharex({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
  console.log('stateRoot.b.b1.b2 is ', stateRoot.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
`,K={primitive:L,dict:I,dict_atomx:B,dict_sharex:T},W=`
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
`,V={primitive:W,dict:H},z=`
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
`,F=`
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

`,G={primitive:z,dict:F},on=`
const [ num, , { reactiveRoot } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
  setTimeout(()=>{
    console.log(\`num is \${num.val}\`);
  },0);
};

render(<button onClick={change}>change {$(num)}</button>);
`,nn=`
const [ num, , { reactiveRoot, flush: flushChanged } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
  flushChanged(); // commit changed data immediately
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`,an=`
// use unboxed reactive insteadof boxed reactiveRoot
const [dict, , { reactive }] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  reactive.b.b1.b2 += 100; // already unboxed
  setTimeout(()=>{
    console.log('reactive.b.b1.b2 is ', reactive.b.b1.b2);
  },0);
};

render(<button onClick={ change }> change { $(reactive.b.b1.b2)}</button>);
`,rn=`
// state was already unboxed from { val: T } to T
const { reactive } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  reactive.b.b1.b2 += 100; // already unboxed
  setTimeout(()=>{
    console.log('reactive.b.b1.b2 is ', reactive.b.b1.b2);
  },0);
};

render(<button onClick={change}>change {$(reactive.b.b1.b2)}</button>);
`,cn={primitive:on,primitive_flush:nn,dict:an,dict_atomx:rn},sn=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {signal(num)}</button>);
`,un=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

// use $ instead of signal to wrap shared state primitive value
render(<button onClick={change}>change {$(num)}</button>);
`,ln=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num, (val)=>\`this is num \${val}\`)}</button>);
`,dn=`
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
`,mn={primitive:sn,alias:un,format:ln,block:dn},vn=`
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
`,hn={defineActions:vn},Q=`
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
`,tn={primitive:Q},fn=`
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
`,bn={primitive:fn},gn=`
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
`,pn=`
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
`,U={primitive:gn,primitive_atomx:pn},xn=`
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
`,yn=`
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
`,Cn={primitive:xn,dict:yn},r=a(35250),n="#e8ae56",t=["atom","derive","watch","reactive","signal","modular","useAtom","useDerived"];function e(i,s){i.includes(s)||i.push(s)}function o(i){var s=function(f){return{color:i===f?n:""}},c=u,d=t.slice();return Object.keys(c).forEach(function(m){return e(d,m)}),d.map(function(m){return(0,r.jsx)("div",{className:"menuWrap","data-name":m,style:s(m),children:m},m)})}var h=l.memo(function(i){var s=i.onClick,c=i.name,d=function(f){var g=f.target.dataset.name;g&&(s==null||s(g))};return(0,r.jsx)("div",{style:{width:"120px"},onClick:d,children:o(c)})}),v={atom:{dict_atomx:"dict(atomx)",dict_sharex:"dict(sharex)"},reactive:{dict_atomx:"dict(atomx)"},useReactive:{primitive_atomx:"primitive(atomx)"}};function y(i,s){var c;return((c=v[i])===null||c===void 0?void 0:c[s])||s}function D(i,s){var c=function(g){return s===g?{backgroundColor:"rgb(100, 90, 183)",color:"#fff"}:{backgroundColor:"",color:"rgb(100, 90, 183)"}},d=u,m=d[i]||{};return Object.keys(m).map(function(f){return(0,r.jsx)("div",{className:"topBarItem","data-name":f,style:c(f),children:y(i,f)},f)})}var A=l.memo(function(i){var s=i.onClick,c=i.name,d=i.subName,m=function(g){var N=g.target.dataset.name;N&&(s==null||s(N))};return(0,r.jsx)("div",{className:"topBar",onClick:m,children:(0,r.jsx)("span",{className:"samples",children:D(c,d)})})}),S=a(12027),M=a.n(S),$n=a(93949),wn=a.n($n),Nn=a(6270),Tn=a.n(Nn),On=a(28810),Mn=a.n(On),Pn=a(77701),In=a.n(Pn),Bn=a(28249),Wn=a.n(Bn),Un=a(29861),Ln=a.n(Un),Dn=a(71635),Kn=function(i){In()(c,i);var s=Wn()(c);function c(){var d;wn()(this,c);for(var m=arguments.length,f=new Array(m),g=0;g<m;g++)f[g]=arguments[g];return d=s.call.apply(s,[this].concat(f)),Ln()(Mn()(d),"state",{logs:[]}),d}return Tn()(c,[{key:"componentDidMount",value:function(){var m=this;(0,Dn.Hook)(window.console,function(f){m.setState(function(g){var N=g.logs;return{logs:[].concat(M()(N),[(0,Dn.Decode)(f)])}})}),console.log("Welcome to helux playground ^_^")}},{key:"render",value:function(){var m=this,f=function(){return m.setState({logs:[]})};return(0,r.jsxs)("div",{className:"liveConsoleWrap",children:[(0,r.jsx)("button",{type:"button",style:{position:"absolute",right:"12px",top:"1px",zIndex:2e3},onClick:f,children:"clear"}),(0,r.jsx)("div",{className:"liveConsole",children:(0,r.jsx)(Dn.Console,{logs:this.state.logs,variant:"dark"})})]})}}]),c}(l.Component),Hn=l.memo(Kn),Vn=(0,w.share)({key:"",code:""}),Sn=b()(Vn,3),J=Sn[0],X=Sn[1],tt=Sn[2];function zn(i){return(0,r.jsx)("svg",x()(x()({xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",viewBox:"0 0 24 24"},i),{},{children:(0,r.jsx)("path",{fill:"none",stroke:"currentColor",strokeWidth:"2",d:"M20 8c-1.403-2.96-4.463-5-8-5a9 9 0 1 0 0 18a9 9 0 0 0 9-9m0-9v6h-6"})}))}function Fn(i){return(0,r.jsx)("svg",x()(x()({xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em",viewBox:"0 0 24 24"},i),{},{children:(0,r.jsx)("path",{fill:"currentColor",d:"M23.681 6.158L17.843.32a1.093 1.093 0 0 0-.771-.32H1.092C.489 0 .001.489.001 1.091v21.817c0 .603.489 1.091 1.091 1.091h21.817c.603 0 1.091-.489 1.091-1.091V6.928c0-.301-.122-.574-.32-.771zM6.549 2.182h6.546v5.819H6.546zm0 19.635v-5.818h10.905v5.818zm15.273 0h-2.185v-6.908c0-.603-.489-1.091-1.091-1.091H5.455c-.603 0-1.091.489-1.091 1.091v6.909H2.182V2.181h2.182V9.09c0 .603.489 1.091 1.091 1.091h8.728c.603 0 1.091-.489 1.091-1.091V2.181h1.344l5.199 5.199z"})}))}var Gn={save:(0,r.jsx)(Fn,{}),reset:(0,r.jsx)(zn,{})},An=function(s){return(0,r.jsx)("button",x()(x()({style:{margin:"4px",width:"32px",height:"32px",padding:"8px",cursor:"pointer",borderRadius:"24px"}},s),{},{type:"button",children:Gn[s.name]}))},Qn=a(75829),jn=a.n(Qn),Jn=function(){var s=(0,l.useCallback)(function(){jn().setItem("helux_code_".concat(J.key),J.code,function(d){d?console.error(d):console.info("code is saved")})},[]),c=(0,l.useCallback)(function(){jn().removeItem("helux_code_".concat(J.key),function(d){d||X(function(m){m.code=""})})},[]);return(0,r.jsxs)("div",{style:{position:"absolute",display:"flex",flexDirection:"column",padding:"8px",boxSizing:"border-box",backgroundColor:"transparent",left:"50%",top:"36px",width:"60px",right:"10px"},children:[(0,r.jsx)(An,{name:"save",title:"\u4FDD\u5B58\u4EE3\u7801",onClick:function(){return s()}}),(0,r.jsx)(An,{name:"reset",title:"\u6062\u590D\u4EE3\u7801",onClick:function(){return c()}})]})};function kn(i,s){var c,d=u;return((c=d[i])===null||c===void 0?void 0:c[s])||""}var Xn=x()({helux:w,React:l},w),Yn={atom:"primitive",derive:"primitive",modular:"defineActions"},Rn={},En=O().parse(window.location.search,{ignoreQueryPrefix:!0}),Y=En.n||"atom",Z=En.s||"primitive",Zn=kn(Y,Z);X(function(i){i.key="".concat(Y,"_").concat(Z)});function en(i,s,c){jn().getItem("helux_code_".concat(i,"_").concat(s),function(d,m){!d&&typeof m=="string"&&m.trim().length>0?c(m):c(kn(i,s))})}var _n=function(){var i=l.useState({name:Y,subName:Z}),s=b()(i,2),c=s[0],d=s[1],m=l.useState(Zn),f=b()(m,2),g=f[0],N=f[1];(0,l.useEffect)(function(){en(Y,Z,N)},[]),(0,w.useWatch)(function(){var j=J.code;j.trim().length===0&&en(Y,Z,N)},function(){return[J.code]});var qn=(0,l.useCallback)(function(j){var E=Rn[j]||Yn[j]||"primitive";X(function(_){_.key="".concat(j,"_").concat(E)}),d({name:j,subName:E}),en(j,E,N)},[c.name,c.subName]),nt=(0,l.useCallback)(function(j){var E=c.name;Rn[E]=j,X(function(_){_.key="".concat(E,"_").concat(j)}),d({name:E,subName:j}),en(E,j,N)},[c.name,c.subName]);return(0,r.jsx)(R.nu,{noInline:!0,code:g,scope:Xn,theme:P.np.vsDark,children:(0,r.jsx)("div",{className:"playground-wrap",children:(0,r.jsxs)("div",{style:{display:"flex",height:"100%",padding:"12px 100px"},children:[(0,r.jsx)(h,{onClick:qn,name:c.name}),(0,r.jsxs)("div",{style:{flex:"1 1 0px",height:"100%"},children:[(0,r.jsx)(A,{onClick:nt,name:c.name,subName:c.subName}),(0,r.jsx)(R.uz,{style:{flexGrow:1},onChange:function(E){X(function(_){_.code=E})}}),(0,r.jsx)(Jn,{})]}),(0,r.jsxs)("div",{style:{flex:"1 1 0px",height:"calc(100vh - 138px)"},children:[(0,r.jsx)("div",{style:{width:"200%",height:"28px"}}),(0,r.jsxs)("div",{style:{height:"50%",padding:"12px",boxSizing:"border-box",border:"1px solid #e8ae56"},children:[(0,r.jsx)(R.IF,{className:"liveErr"}),(0,r.jsx)(R.i5,{})]}),(0,r.jsx)(Hn,{})]})]})})})}},24610:function(q,C,a){"use strict";a.r(C),a.d(C,{Entry:function(){return dn},MarkUpdate:function(){return xn},MarkUpdateH1:function(){return yn},MarkUpdateH2:function(){return Cn},MarkUpdateH3:function(){return r},demoUtils:function(){return sn}});var u=a(70079);function k(n,t){var e=n==null?null:typeof Symbol!="undefined"&&n[Symbol.iterator]||n["@@iterator"];if(e!=null){var o,h,v,y,D=[],A=!0,S=!1;try{if(v=(e=e.call(n)).next,t===0){if(Object(e)!==e)return;A=!1}else for(;!(A=(o=v.call(e)).done)&&(D.push(o.value),D.length!==t);A=!0);}catch(M){S=!0,h=M}finally{try{if(!A&&e.return!=null&&(y=e.return(),Object(y)!==y))return}finally{if(S)throw h}}return D}}function b(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);t&&(o=o.filter(function(h){return Object.getOwnPropertyDescriptor(n,h).enumerable})),e.push.apply(e,o)}return e}function p(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?b(Object(e),!0).forEach(function(o){R(n,o,e[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):b(Object(e)).forEach(function(o){Object.defineProperty(n,o,Object.getOwnPropertyDescriptor(e,o))})}return n}function x(n,t){if(typeof n!="object"||!n)return n;var e=n[Symbol.toPrimitive];if(e!==void 0){var o=e.call(n,t||"default");if(typeof o!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(n)}function l(n){var t=x(n,"string");return typeof t=="symbol"?t:String(t)}function R(n,t,e){return t=l(t),t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function $(n,t){return O(n)||k(n,t)||P(n,t)||L()}function O(n){if(Array.isArray(n))return n}function P(n,t){if(n){if(typeof n=="string")return w(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);if(e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set")return Array.from(n);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return w(n,t)}}function w(n,t){(t==null||t>n.length)&&(t=n.length);for(var e=0,o=new Array(t);e<t;e++)o[e]=n[e];return o}function L(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var I=0;function B(){return I+=1,I}function T(n){var t=n||new Date,e=t.toLocaleString(),o="".concat(t.getTime()).substring(10);return"".concat(e," ").concat(o)}function K(n,t){var e=Object.keys(n).map(function(o){return n[o]});return e.concat(t||[])}function W(){}function H(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return Math.ceil(Math.random()*n)}function V(){for(var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:8,t="",e="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",o=0;o<n;o++)t+=e.charAt(Math.floor(Math.random()*e.length));return t}var z=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:2e3;return new Promise(function(e){return setTimeout(e,t)})};function F(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),o=1;o<t;o++)e[o-1]=arguments[o];G.apply(void 0,[n,"blue"].concat(e))}function G(n,t){for(var e,o=arguments.length,h=new Array(o>2?o-2:0),v=2;v<o;v++)h[v-2]=arguments[v];(e=console).log.apply(e,["%c ".concat(n),"color:".concat(t)].concat(h))}function on(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),o=1;o<t;o++)e[o-1]=arguments[o];G.apply(void 0,[n,"red"].concat(e))}function nn(n,t){n.includes(t)||n.push(t)}function an(){var n=new Date,t=n.toLocaleString(),e=t.split(" "),o=$(e,2),h=o[1],v=n.getMilliseconds();return"".concat(h," ").concat(v)}function rn(n){window.see||(window.see={}),Object.assign(window.see,n)}function cn(){return{loading:!1,a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var sn=Object.freeze({__proto__:null,getSeed:B,getLocaleTime:T,getAtionFns:K,noop:W,random:H,randomStr:V,delay:z,log:F,logColor:G,logRed:on,nodupPush:nn,timemark:an,bindToWindow:rn,dictFactory:cn});function un(){var n=u.useState({}),t=$(n,2),e=t[1];return function(){return e({})}}function ln(n){var t=n.fns,e=t===void 0?[]:t,o=[];return Array.isArray(e)?o=e:Object.keys(e).forEach(function(h){var v=e[h];v.__fnName=h,o.push(v)}),o}function dn(n){var t=n.buttonArea,e=t===void 0?"":t,o=n.children,h=u.useState(!0),v=$(h,2),y=v[0],D=v[1],A=un();return u.createElement("div",null,u.createElement("button",{onClick:function(){return D(!y)}},"switch show"),u.createElement("button",{onClick:A},"force update"),ln(n).map(function(S,M){return u.createElement("button",{key:M,onClick:S},S.__fnName||S.name)}),e,u.createElement("div",{className:"box"},y&&o))}var mn={border:"1px solid green",padding:"6px",margin:"6px"},vn={fontSize:"12px",color:"#fff",padding:"3px"},hn={margin:"3px",backgroundColor:"#e0e0e0"},Q=["#0944d0","#fc774b","#1da187","#fdc536","#1789f5"],tn=0;function fn(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,e=0;t?(e=tn%Q.length,tn++):e=n%Q.length;var o=Q[e];return o}var bn={time:0,sn:0,insKey:0,getDeps:function(){return[]}};function gn(n){var t=[];return Array.isArray(n)?t=n||[]:t=[n],t}function pn(n){var t=gn(n),e=0,o="",h=t.map(function(D){return D.insKey}).join(","),v=[];t.forEach(function(D){e+=D.sn;var A=D.getDeps();A.forEach(function(S){return nn(v,S)})}),o=v.join(" , ");var y=t.length>1?"(sn sum ".concat(e,")"):"(sn ".concat(e,")");return{sn:e,depStr:o,snStr:y,insKeyStr:h}}function U(n){var t=n.name,e=t===void 0?"MarkUpdate":t,o=n.info,h=o===void 0?bn:o,v=n.forceColor,y=pn(h),D=y.sn,A=y.insKeyStr,S=y.depStr,M=y.snStr;return u.createElement("div",{style:mn},n.children,u.createElement("div",{style:p(p({},vn),{},{backgroundColor:fn(D,v)})},"[",e,"] update at ",T()," ",M," (insKey ",A,")"),S&&u.createElement("div",{style:{color:"green"}}," deps is [ ",S," ]"))}function xn(n){return u.createElement(U,p({},n),n.children)}function yn(n){return u.createElement(U,p({},n),u.createElement("h1",null,n.children))}function Cn(n){return u.createElement(U,p({},n),u.createElement("h2",null,n.children))}function r(n){return u.createElement(U,p({},n),u.createElement("h3",{style:hn},n.children))}},2903:function(){}}]);
