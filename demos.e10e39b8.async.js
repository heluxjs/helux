"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[2433,4610],{89869:function(R,h,a){a.r(h);var s=a(28633),y=a.n(s),g=a(73649),v=(0,g.share)({a:1}),b=y()(v,1),f=b[0],u=(0,g.atom)(3e3),x=y()(u,1),S=x[0];(0,g.watch)(function(){console.log("found price changed: [ priceState ]")},function(){return[f]}),(0,g.watch)(function(){console.log("found price or numAtom changed: ()=>[ priceState, numAtom ]")},function(){return[f,S]}),h.default=function(){return""}},63850:function(R,h,a){a.r(h);var s=a(28633),y=a.n(s),g=a(73649),v=(0,g.share)({a:1}),b=y()(v,1),f=b[0];(0,g.watch)(function(){console.log("found price.a changed: () => [priceState.a]")},function(){return[f.a]}),h.default=function(){return""}},27433:function(R,h,a){a.r(h),a.d(h,{default:function(){return D}});var s=a(28633),y=a.n(s),g=a(24610),v=a(73649);function b(){return{name:"dict",a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{list:[],mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var f=a(35250),u=(0,v.atom)(b),x=y()(u,1),S=x[0];function A(T){var E=(0,v.useAtom)(S,{pure:T.pure}),O=y()(E,3),j=O[0],M=O[2],N=j.extra,P=j.name,$=j.desc,w=N.list,I=N.mark;return(0,f.jsxs)(g.MarkUpdate,{info:M,children:[(0,f.jsx)("div",{children:P}),(0,f.jsx)("div",{children:$}),(0,f.jsx)("div",{children:w.length}),(0,f.jsx)("div",{children:I})]})}var D=function(){return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(A,{pure:!0}),(0,f.jsx)(A,{pure:!1})]})}},52740:function(R,h,a){a.r(h),a.d(h,{default:function(){return t}});var s={};a.r(s),a.d(s,{atom:function(){return E},derive:function(){return j},useAtom:function(){return w},useDerived:function(){return U},watch:function(){return P}});var y=a(28633),g=a.n(y),v=a(70079),b=a(18207),f=a(73649),u=a(35250),x="#e8ae56",S=v.memo(function(e){var r=e.onClick,o=e.name,i=function(c){return{color:o===c?x:""}};return(0,u.jsxs)("div",{style:{width:"120px"},onClick:function(c){var d=c.target.dataset.name;d&&(r==null||r(d))},children:[(0,u.jsx)("div",{className:"menuWrap","data-name":"atom",style:i("atom"),children:"atom"}),(0,u.jsx)("div",{className:"menuWrap","data-name":"derive",style:i("derive"),children:"derive"}),(0,u.jsx)("div",{className:"menuWrap","data-name":"watch",style:i("watch"),children:"watch"}),(0,u.jsx)("div",{className:"menuWrap","data-name":"useAtom",style:i("useAtom"),children:"useAtom"}),(0,u.jsx)("div",{className:"menuWrap","data-name":"useDerived",style:i("useDerived"),children:"useDerived"})]})}),A=`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
};

render(<button onClick={change}>change {$(num)}</button>);
`,D=`
const [dict, setDict] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDict(draft => {
    // draft was already unboxed from { val: T } to T
    draft.b.b1.b2 += 100;
  })
  console.log('dict.val.b.b1.b2 is ', dict.val.b.b1.b2);
};

render(<button onClick={ change } > change { $(dict.val.b.b1.b2)}</button>);
`,T=`
// state was already unboxed from { val: T } to T
const { state, setDraft } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
`,E={primitive:A,dict:D,dict_atomx:T},O=`
const [ num, setNum ] = atom(1);
const result = derive(()=> num.val + 1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\`num is \${num.val}\`);
  console.log(\`result is \${result.val}\`);
};

render(<button onClick={change}>change {$(result.val)}</button>);
`,j={primitive:O},M=`
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
`,N=`
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

`,P={primitive:M,dict:N},$=`
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
`,w={primitive:$},I=`
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
`,U={primitive:I},H={atom:{dict_atomx:"dict(atomx)"}};function W(e,r){var o;return((o=H[e])===null||o===void 0?void 0:o[r])||r}function F(e,r){var o=function(d){return r===d?{backgroundColor:"rgb(100, 90, 183)",color:"#fff"}:{backgroundColor:"",color:"rgb(100, 90, 183)"}},i=s,l=i[e]||{};return Object.keys(l).map(function(c){return(0,u.jsx)("div",{className:"topBarItem","data-name":c,style:o(c),children:W(e,c)},c)})}var z=v.memo(function(e){var r=e.onClick,o=e.name,i=e.subName,l=function(d){var m=d.target.dataset.name;m&&(r==null||r(m))};return(0,u.jsx)("div",{className:"topBar",onClick:l,children:F(o,i)})}),V=a(12027),G=a.n(V),J=a(93949),Q=a.n(J),X=a(6270),Y=a.n(X),Z=a(28810),_=a.n(Z),K=a(77701),B=a.n(K),q=a(28249),nn=a.n(q),en=a(29861),tn=a.n(en),C=a(71635),rn=function(e){B()(o,e);var r=nn()(o);function o(){var i;Q()(this,o);for(var l=arguments.length,c=new Array(l),d=0;d<l;d++)c[d]=arguments[d];return i=r.call.apply(r,[this].concat(c)),tn()(_()(i),"state",{logs:[]}),i}return Y()(o,[{key:"componentDidMount",value:function(){var l=this;(0,C.Hook)(window.console,function(c){l.setState(function(d){var m=d.logs;return{logs:[].concat(G()(m),[(0,C.Decode)(c)])}})}),console.log("welcome to helux playground ^_^")}},{key:"render",value:function(){var l=this,c=function(){return l.setState({logs:[]})};return(0,u.jsxs)("div",{className:"liveConsoleWrap",children:[(0,u.jsx)("button",{type:"button",style:{position:"absolute",right:"12px",top:"1px",zIndex:2e3},onClick:c,children:"clear"}),(0,u.jsx)("div",{className:"liveConsole",children:(0,u.jsx)(C.Console,{logs:this.state.logs,variant:"dark"})})]})}}]),o}(v.Component),an=v.memo(rn),L={atom:"primitive",derive:"primitive"},k={atom:L.atom,derive:L.derive};function n(e,r){var o,i=s;return((o=i[e])===null||o===void 0?void 0:o[r])||""}var t=function(){var e=v.useState({name:"atom",subName:"primitive",code:n("atom","primitive")}),r=g()(e,2),o=r[0],i=r[1],l=function(m){var p=k[m]||"primitive";i({name:m,subName:p,code:n(m,p)})},c=function(m){var p=o.name;k[p]=m,i({name:p,subName:m,code:n(p,m)})};return(0,u.jsx)(b.nu,{noInline:!0,code:o.code,scope:f,children:(0,u.jsx)("div",{className:"playground-wrap",children:(0,u.jsxs)("div",{style:{display:"flex",height:"100%",padding:"12px 100px"},children:[(0,u.jsx)(S,{onClick:l,name:o.name}),(0,u.jsxs)("div",{style:{flex:"1 1 0px",height:"100%"},children:[(0,u.jsx)(z,{onClick:c,name:o.name,subName:o.subName}),(0,u.jsx)(b.uz,{style:{height:"100%"}})]}),(0,u.jsxs)("div",{style:{flex:"1 1 0px",height:"calc(100vh - 138px)"},children:[(0,u.jsx)("div",{style:{width:"200%",height:"28px"}}),(0,u.jsxs)("div",{style:{height:"50%",padding:"12px",boxSizing:"border-box"},children:[(0,u.jsx)(b.IF,{className:"liveErr"}),(0,u.jsx)(b.i5,{})]}),(0,u.jsx)(an,{})]})]})})})}},24610:function(R,h,a){a.r(h),a.d(h,{Entry:function(){return X},MarkUpdate:function(){return rn},MarkUpdateH1:function(){return an},MarkUpdateH2:function(){return L},MarkUpdateH3:function(){return k},demoUtils:function(){return G}});var s=a(70079);function y(n,t){var e=n==null?null:typeof Symbol!="undefined"&&n[Symbol.iterator]||n["@@iterator"];if(e!=null){var r,o,i,l,c=[],d=!0,m=!1;try{if(i=(e=e.call(n)).next,t===0){if(Object(e)!==e)return;d=!1}else for(;!(d=(r=i.call(e)).done)&&(c.push(r.value),c.length!==t);d=!0);}catch(p){m=!0,o=p}finally{try{if(!d&&e.return!=null&&(l=e.return(),Object(l)!==l))return}finally{if(m)throw o}}return c}}function g(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(n,o).enumerable})),e.push.apply(e,r)}return e}function v(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?g(Object(e),!0).forEach(function(r){u(n,r,e[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):g(Object(e)).forEach(function(r){Object.defineProperty(n,r,Object.getOwnPropertyDescriptor(e,r))})}return n}function b(n,t){if(typeof n!="object"||!n)return n;var e=n[Symbol.toPrimitive];if(e!==void 0){var r=e.call(n,t||"default");if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(n)}function f(n){var t=b(n,"string");return typeof t=="symbol"?t:String(t)}function u(n,t,e){return t=f(t),t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function x(n,t){return S(n)||y(n,t)||A(n,t)||T()}function S(n){if(Array.isArray(n))return n}function A(n,t){if(n){if(typeof n=="string")return D(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);if(e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set")return Array.from(n);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return D(n,t)}}function D(n,t){(t==null||t>n.length)&&(t=n.length);for(var e=0,r=new Array(t);e<t;e++)r[e]=n[e];return r}function T(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var E=0;function O(){return E+=1,E}function j(n){var t=n||new Date,e=t.toLocaleString(),r="".concat(t.getTime()).substring(10);return"".concat(e," ").concat(r)}function M(n,t){var e=Object.keys(n).map(function(r){return n[r]});return e.concat(t||[])}function N(){}function P(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return Math.ceil(Math.random()*n)}function $(){for(var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:8,t="",e="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",r=0;r<n;r++)t+=e.charAt(Math.floor(Math.random()*e.length));return t}var w=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:2e3;return new Promise(function(e){return setTimeout(e,t)})};function I(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];U.apply(void 0,[n,"blue"].concat(e))}function U(n,t){for(var e,r=arguments.length,o=new Array(r>2?r-2:0),i=2;i<r;i++)o[i-2]=arguments[i];(e=console).log.apply(e,["%c ".concat(n),"color:".concat(t)].concat(o))}function H(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),r=1;r<t;r++)e[r-1]=arguments[r];U.apply(void 0,[n,"red"].concat(e))}function W(n,t){n.includes(t)||n.push(t)}function F(){var n=new Date,t=n.toLocaleString(),e=t.split(" "),r=x(e,2),o=r[1],i=n.getMilliseconds();return"".concat(o," ").concat(i)}function z(n){window.see||(window.see={}),Object.assign(window.see,n)}function V(){return{loading:!1,a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var G=Object.freeze({__proto__:null,getSeed:O,getLocaleTime:j,getAtionFns:M,noop:N,random:P,randomStr:$,delay:w,log:I,logColor:U,logRed:H,nodupPush:W,timemark:F,bindToWindow:z,dictFactory:V});function J(){var n=s.useState({}),t=x(n,2),e=t[1];return function(){return e({})}}function Q(n){var t=n.fns,e=t===void 0?[]:t,r=[];return Array.isArray(e)?r=e:Object.keys(e).forEach(function(o){var i=e[o];i.__fnName=o,r.push(i)}),r}function X(n){var t=n.buttonArea,e=t===void 0?"":t,r=n.children,o=s.useState(!0),i=x(o,2),l=i[0],c=i[1],d=J();return s.createElement("div",null,s.createElement("button",{onClick:function(){return c(!l)}},"switch show"),s.createElement("button",{onClick:d},"force update"),Q(n).map(function(m,p){return s.createElement("button",{key:p,onClick:m},m.__fnName||m.name)}),e,s.createElement("div",{className:"box"},l&&r))}var Y={border:"1px solid green",padding:"6px",margin:"6px"},Z={fontSize:"12px",color:"#fff",padding:"3px"},_={margin:"3px",backgroundColor:"#e0e0e0"},K=["#0944d0","#fc774b","#1da187","#fdc536","#1789f5"],B=0;function q(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,e=0;t?(e=B%K.length,B++):e=n%K.length;var r=K[e];return r}var nn={time:0,sn:0,insKey:0,getDeps:function(){return[]}};function en(n){var t=[];return Array.isArray(n)?t=n||[]:t=[n],t}function tn(n){var t=en(n),e=0,r="",o=t.map(function(c){return c.insKey}).join(","),i=[];t.forEach(function(c){e+=c.sn;var d=c.getDeps();d.forEach(function(m){return W(i,m)})}),r=i.join(" , ");var l=t.length>1?"(sn sum ".concat(e,")"):"(sn ".concat(e,")");return{sn:e,depStr:r,snStr:l,insKeyStr:o}}function C(n){var t=n.name,e=t===void 0?"MarkUpdate":t,r=n.info,o=r===void 0?nn:r,i=n.forceColor,l=tn(o),c=l.sn,d=l.insKeyStr,m=l.depStr,p=l.snStr;return s.createElement("div",{style:Y},n.children,s.createElement("div",{style:v(v({},Z),{},{backgroundColor:q(c,i)})},"[",e,"] update at ",j()," ",p," (insKey ",d,")"),m&&s.createElement("div",{style:{color:"green"}}," deps is [ ",m," ]"))}function rn(n){return s.createElement(C,v({},n),n.children)}function an(n){return s.createElement(C,v({},n),s.createElement("h1",null,n.children))}function L(n){return s.createElement(C,v({},n),s.createElement("h2",null,n.children))}function k(n){return s.createElement(C,v({},n),s.createElement("h3",{style:_},n.children))}}}]);
