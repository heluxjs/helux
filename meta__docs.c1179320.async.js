"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[1904],{13517:function(f,n,e){e.r(n),e.d(n,{Entry:function(){return L},MarkUpdate:function(){return te},MarkUpdateH1:function(){return ae},MarkUpdateH2:function(){return ee},MarkUpdateH3:function(){return re},demoUtils:function(){return M}});var p=e(94159);function a(S,W){var K=S==null?null:typeof Symbol!="undefined"&&S[Symbol.iterator]||S["@@iterator"];if(K!=null){var w,G,k,z,V=[],J=!0,Z=!1;try{if(k=(K=K.call(S)).next,W===0){if(Object(K)!==K)return;J=!1}else for(;!(J=(w=k.call(K)).done)&&(V.push(w.value),V.length!==W);J=!0);}catch(Y){Z=!0,G=Y}finally{try{if(!J&&K.return!=null&&(z=K.return(),Object(z)!==z))return}finally{if(Z)throw G}}return V}}function I(S,W){var K=Object.keys(S);if(Object.getOwnPropertySymbols){var w=Object.getOwnPropertySymbols(S);W&&(w=w.filter(function(G){return Object.getOwnPropertyDescriptor(S,G).enumerable})),K.push.apply(K,w)}return K}function b(S){for(var W=1;W<arguments.length;W++){var K=arguments[W]!=null?arguments[W]:{};W%2?I(Object(K),!0).forEach(function(w){T(S,w,K[w])}):Object.getOwnPropertyDescriptors?Object.defineProperties(S,Object.getOwnPropertyDescriptors(K)):I(Object(K)).forEach(function(w){Object.defineProperty(S,w,Object.getOwnPropertyDescriptor(K,w))})}return S}function T(S,W,K){return W=c(W),W in S?Object.defineProperty(S,W,{value:K,enumerable:!0,configurable:!0,writable:!0}):S[W]=K,S}function A(S,W){return o(S)||a(S,W)||C(S,W)||B()}function o(S){if(Array.isArray(S))return S}function C(S,W){if(S){if(typeof S=="string")return O(S,W);var K=Object.prototype.toString.call(S).slice(8,-1);if(K==="Object"&&S.constructor&&(K=S.constructor.name),K==="Map"||K==="Set")return Array.from(S);if(K==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(K))return O(S,W)}}function O(S,W){(W==null||W>S.length)&&(W=S.length);for(var K=0,w=new Array(W);K<W;K++)w[K]=S[K];return w}function B(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function g(S,W){if(typeof S!="object"||S===null)return S;var K=S[Symbol.toPrimitive];if(K!==void 0){var w=K.call(S,W||"default");if(typeof w!="object")return w;throw new TypeError("@@toPrimitive must return a primitive value.")}return(W==="string"?String:Number)(S)}function c(S){var W=g(S,"string");return typeof W=="symbol"?W:String(W)}var l=0;function d(){return l+=1,l}function r(S){var W=S||new Date,K=W.toLocaleString(),w="".concat(W.getTime()).substring(10);return"".concat(K," ").concat(w)}function s(S,W){var K=Object.keys(S).map(function(w){return S[w]});return K.concat(W||[])}function t(){}function u(){var S=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return Math.ceil(Math.random()*S)}function m(){for(var S=arguments.length>0&&arguments[0]!==void 0?arguments[0]:8,W="",K="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",w=0;w<S;w++)W+=K.charAt(Math.floor(Math.random()*K.length));return W}var i=function(){var W=arguments.length>0&&arguments[0]!==void 0?arguments[0]:2e3;return new Promise(function(K){return setTimeout(K,W)})};function _(S){for(var W=arguments.length,K=new Array(W>1?W-1:0),w=1;w<W;w++)K[w-1]=arguments[w];h.apply(void 0,[S,"blue"].concat(K))}function h(S,W){for(var K,w=arguments.length,G=new Array(w>2?w-2:0),k=2;k<w;k++)G[k-2]=arguments[k];(K=console).log.apply(K,["%c ".concat(S),"color:".concat(W)].concat(G))}function v(S){for(var W=arguments.length,K=new Array(W>1?W-1:0),w=1;w<W;w++)K[w-1]=arguments[w];h.apply(void 0,[S,"red"].concat(K))}function x(S,W){S.includes(W)||S.push(W)}function E(){var S=new Date,W=S.toLocaleString(),K=W.split(" "),w=A(K,2),G=w[1],k=S.getMilliseconds();return"".concat(G," ").concat(k)}function D(S){window.see||(window.see={}),Object.assign(window.see,S)}function y(){return{loading:!1,a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}var M=Object.freeze({__proto__:null,getSeed:d,getLocaleTime:r,getAtionFns:s,noop:t,random:u,randomStr:m,delay:i,log:_,logColor:h,logRed:v,nodupPush:x,timemark:E,bindToWindow:D,dictFactory:y});function P(){var S=p.useState({}),W=A(S,2),K=W[1];return function(){return K({})}}function R(S){var W=S.fns,K=W===void 0?[]:W,w=[];return Array.isArray(K)?w=K:Object.keys(K).forEach(function(G){var k=K[G];k.__fnName=G,w.push(k)}),w}function L(S){var W=S.buttonArea,K=W===void 0?"":W,w=S.children,G=p.useState(!0),k=A(G,2),z=k[0],V=k[1],J=P();return p.createElement("div",null,p.createElement("button",{onClick:function(){return V(!z)}},"switch show"),p.createElement("button",{onClick:J},"force update"),R(S).map(function(Z,Y){return p.createElement("button",{key:Y,onClick:Z},Z.__fnName||Z.name)}),K,p.createElement("div",{className:"box"},z&&w))}var U={border:"1px solid green",padding:"6px",margin:"6px"},$={fontSize:"12px",color:"#fff",padding:"3px"},j={margin:"3px",backgroundColor:"#e0e0e0"},N=["#0944d0","#fc774b","#1da187","#fdc536","#1789f5"],F=0;function X(S){var W=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,K=0;W?(K=F%N.length,F++):K=S%N.length;var w=N[K];return w}var H={time:0,sn:0,insKey:0,getDeps:function(){return[]}};function q(S){var W=[];return Array.isArray(S)?W=S||[]:W=[S],W}function ne(S){var W=q(S),K=0,w="",G=W.map(function(V){return V.insKey}).join(","),k=[];W.forEach(function(V){K+=V.sn;var J=V.getDeps();J.forEach(function(Z){return x(k,Z)})}),w=k.join(" , ");var z=W.length>1?"(sn sum ".concat(K,")"):"(sn ".concat(K,")");return{sn:K,depStr:w,snStr:z,insKeyStr:G}}function Q(S){var W=S.name,K=W===void 0?"MarkUpdate":W,w=S.info,G=w===void 0?H:w,k=S.forceColor,z=ne(G),V=z.sn,J=z.insKeyStr,Z=z.depStr,Y=z.snStr;return p.createElement("div",{style:U},S.children,p.createElement("div",{style:b(b({},$),{},{backgroundColor:X(V,k)})},"[",K,"] update at ",r()," ",Y," (insKey ",J,")"),Z&&p.createElement("div",{style:{color:"green"}}," deps is [ ",Z," ]"))}function te(S){return p.createElement(Q,b({},S),S.children)}function ae(S){return p.createElement(Q,b({},S),p.createElement("h1",null,S.children))}function ee(S){return p.createElement(Q,b({},S),p.createElement("h2",null,S.children))}function re(S){return p.createElement(Q,b({},S),p.createElement("h3",{style:j},S.children))}},9311:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(14873),I={}},20377:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(36261),I={}},95589:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(49081),I={}},53913:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(98190),I={}},39427:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(99963),I={}},85736:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(27308),I={}},57901:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(75786),I={}},11818:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(64106),I={}},12217:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(82809),I={}},84507:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(60799),I={}},86838:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(11164),I={}},1014:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(98299),I={}},94094:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(75252),I={}},94522:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(1390),I={}},14693:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(19565),I={}},15399:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(96878),I={}},52252:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(74780),I={}},93571:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(43559),I={}},21725:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(88583),I={}},38090:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(44388),I={}},99886:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(23740),I={}},73049:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(69723),I={}},79525:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(27811),I={}},80557:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(99647),I={}},14706:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(32088),I={}},87600:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(23619),I={}},22182:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(98304),I={}},20795:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(42379),I={}},85566:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(83206),I={}},26482:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(3018),I={}},66488:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(49183),I={}},49689:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(15339),I={}},6061:function(f,n,e){var p;e.r(n),e.d(n,{demos:function(){return g}});var a=e(29008),I=e.n(a),b=e(28633),T=e.n(b),A=e(70958),o=e.n(A),C=e(94159),O=e(18093),B=e(95152),g={"docs-api-base-block-demo-0":{component:C.memo(C.lazy(o()(I()().mark(function c(){var l,d,r,s,t,u,m,i,_;return I()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return v.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return l=v.sent,d=l.block,r=l.share,s=r({a:{a1:1},b:1}),t=T()(s,2),u=t[0],m=t[1],i=function(){return m(function(E){return void(E.a.a1+=100)})},_=d(function(x){return C.createElement("div",{style:{border:"1px solid green",padding:"6px",margin:"6px"}},C.createElement("div",null,"props.mark: ",x.mark||"no mark"),C.createElement("div",null,"obj.a.a1 ",u.a.a1),C.createElement("div",null,"obj.b ",u.b))}),v.abrupt("return",{default:function(){return C.createElement("div",null,C.createElement("h3",null,"updated at ",new Date().toLocaleString()),C.createElement(_,null),C.createElement(_,{mark:"second user"}),C.createElement("button",{onClick:i},"changeA1"))}});case 9:case"end":return v.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-base-block-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { block, share } from 'helux';

const [obj, setObj] = share({ a: { a1: 1 }, b: 1 });
const changeA1 = () => setObj((draft) => void (draft.a.a1 += 100));

const User = block((props) => (
  <div style={{ border: '1px solid green', padding: '6px', margin: '6px' }}>
    <div>props.mark: {props.mark || 'no mark'}</div>
    <div>obj.a.a1 {obj.a.a1}</div>
    <div>obj.b {obj.b}</div>
  </div>
));

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User />
      <User mark="second user" />
      <button onClick={changeA1}>changeA1</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:B},renderOpts:{compile:function(){var c=o()(I()().mark(function d(){var r,s=arguments;return I()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-api-base-block-demo-1":{component:C.memo(C.lazy(o()(I()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v;return I()().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:return E.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return l=E.sent,d=l.block,r=l.share,E.next=7,Promise.resolve().then(e.t.bind(e,94159,19));case 7:return s=E.sent,t=s.useState,u=r({a:{a1:1},b:1}),m=T()(u,2),i=m[0],_=m[1],h=function(){return _(function(y){return void(y.a.a1+=100)})},v=d(function(){var D=t(""),y=T()(D,2),M=y[0],P=y[1],R=function(){return P("".concat(Date.now()))};return C.createElement("div",{style:{border:"1px solid green",padding:"6px",margin:"6px"}},C.createElement("div",null,"tip: ",M),C.createElement("div",null,"obj.a.a1 ",i.a.a1),C.createElement("div",null,"obj.b ",i.b),C.createElement("button",{onClick:R},"changeTip"))}),E.abrupt("return",{default:function(){return C.createElement("div",null,C.createElement("h3",null,"updated at ",new Date().toLocaleString()),C.createElement(v,null),C.createElement("button",{onClick:h},"changeA1"))}});case 13:case"end":return E.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-base-block-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { block, share } from 'helux';
import { useState } from 'react';

const [obj, setObj] = share({ a: { a1: 1 }, b: 1 });
const changeA1 = () => setObj((draft) => void (draft.a.a1 += 100));

const User = block(() => {
  const [tip, setTip] = useState('');
  const changeTip = () => setTip(\`\${Date.now()}\`);
  return (
    <div style={{ border: '1px solid green', padding: '6px', margin: '6px' }}>
      <div>tip: {tip}</div>
      <div>obj.a.a1 {obj.a.a1}</div>
      <div>obj.b {obj.b}</div>
      <button onClick={changeTip}>changeTip</button>
    </div>
  );
});

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User />
      <button onClick={changeA1}>changeA1</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"},react:{type:"NPM",value:"18.0.0"}},entry:"index.tsx"},context:{helux:B,react:p||(p=e.t(C,2))},renderOpts:{compile:function(){var c=o()(I()().mark(function d(){var r,s=arguments;return I()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-api-base-block-demo-2":{component:C.memo(C.lazy(o()(I()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x,E;return I()().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:return y.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return l=y.sent,d=l.block,r=l.share,y.next=7,Promise.resolve().then(e.t.bind(e,94159,19));case 7:return s=y.sent,t=s.useImperativeHandle,u=s.useRef,m=s.useState,i=r({a:{a1:1},b:1}),_=T()(i,2),h=_[0],v=_[1],x=function(){return v(function(P){return void(P.a.a1+=100)})},E=d(function(M,P){var R=m(""),L=T()(R,2),U=L[0],$=L[1],j=function(){return $("".concat(Date.now()))};return t(P.ref,function(){return{changeTip:j}}),C.createElement("div",{style:{border:"1px solid green",padding:"6px",margin:"6px"}},C.createElement("div",null,"tip: ",U),C.createElement("div",null,"obj.a.a1 ",h.a.a1),C.createElement("div",null,"obj.b ",h.b),C.createElement("button",{onClick:j},"changeTip"))}),y.abrupt("return",{default:function(){var P=u(),R=function(){var U;return(U=P.current)===null||U===void 0?void 0:U.changeTip()};return C.createElement("div",null,C.createElement("h3",null,"updated at ",new Date().toLocaleString()),C.createElement(E,{ref:P}),C.createElement("button",{onClick:x},"changeA1"),C.createElement("button",{onClick:R},"callChildFn"))}});case 15:case"end":return y.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-base-block-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { block, share } from 'helux';
import { useImperativeHandle, useRef, useState } from 'react';

const [obj, setObj] = share({ a: { a1: 1 }, b: 1 });
const changeA1 = () => setObj((draft) => void (draft.a.a1 += 100));

const User = block((props, params) => {
  const [tip, setTip] = useState('');
  const changeTip = () => setTip(\`\${Date.now()}\`);
  useImperativeHandle(params.ref, () => ({
    changeTip,
  }));

  return (
    <div style={{ border: '1px solid green', padding: '6px', margin: '6px' }}>
      <div>tip: {tip}</div>
      <div>obj.a.a1 {obj.a.a1}</div>
      <div>obj.b {obj.b}</div>
      <button onClick={changeTip}>changeTip</button>
    </div>
  );
});

export default function Demo() {
  const ref = useRef();
  const callChildFn = () => ref.current?.changeTip();

  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User ref={ref} />
      <button onClick={changeA1}>changeA1</button>
      <button onClick={callChildFn}>callChildFn</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"},react:{type:"NPM",value:"18.0.0"}},entry:"index.tsx"},context:{helux:B,react:p||(p=e.t(C,2))},renderOpts:{compile:function(){var c=o()(I()().mark(function d(){var r,s=arguments;return I()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-api-base-block-demo-3":{component:C.memo(C.lazy(o()(I()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x,E,D,y;return I()().wrap(function(P){for(;;)switch(P.prev=P.next){case 0:return P.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return l=P.sent,d=l.block,r=l.derive,s=l.share,t=function(){var L=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1e3;return new Promise(function(U){return setTimeout(U,L)})},u=s({a:{a1:1},b:1}),m=T()(u,3),i=m[0],_=m[1],h=m[2],v=r({fn:function(){return i.a.a1+1},task:function(){var R=o()(I()().mark(function U(){return I()().wrap(function(j){for(;;)switch(j.prev=j.next){case 0:return j.next=2,t();case 2:return j.abrupt("return",i.a.a1+100);case 3:case"end":return j.stop()}},U)}));function L(){return R.apply(this,arguments)}return L}()}),x=h.defineActions()({changeA:function(L){var U=L.draft;U.a.a1+=100}}),E=x.actions,D=x.useLoading,y=d(function(R,L){var U=L.status;console.log(U);var $=L.read(v.val),j=T()($,1),N=j[0];return C.createElement("div",{style:{border:"1px solid green",padding:"6px",margin:"6px"}},U.ok&&C.createElement("div",null,"b ",N),U.loading&&C.createElement("div",null,"loading..."),U.err&&C.createElement("div",null,U.err.message))},!0),P.abrupt("return",{default:function(){return C.createElement("div",null,C.createElement("h3",null,"updated at ",new Date().toLocaleString()),C.createElement(y,null),C.createElement("button",{onClick:E.changeA},"changeA"))}});case 12:case"end":return P.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-base-block-demo-3",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { block, derive, share } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [obj, setObj, ctx] = share({ a: { a1: 1 }, b: 1 });
const result = derive({
  fn: () => obj.a.a1 + 1,
  task: async () => {
    await delay();
    return obj.a.a1 + 100;
  },
});

const { actions, useLoading } = ctx.defineActions()({
  changeA({ draft }) {
    draft.a.a1 += 100;
  },
});

const User = block((props, params) => {
  const { status } = params; // \u8BFB\u53D6\u6D3E\u751F\u7ED3\u679C\u53D8\u5316\u72B6\u6001
  console.log(status);
  const [b] = params.read(result.val); // \u901A\u8FC7 read \u9501\u5B9A\u4F9D\u8D56
  return (
    <div style={{ border: '1px solid green', padding: '6px', margin: '6px' }}>
      {status.ok && <div>b {b}</div>}
      {status.loading && <div>loading...</div>}
      {status.err && <div>{status.err.message}</div>}
    </div>
  );
}, true);

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User />
      <button onClick={actions.changeA}>changeA</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:B},renderOpts:{compile:function(){var c=o()(I()().mark(function d(){var r,s=arguments;return I()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-api-base-block-demo-4":{component:C.memo(C.lazy(o()(I()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x,E;return I()().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:return y.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return l=y.sent,d=l.block,r=l.share,s=function(){var P=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1e3;return new Promise(function(R){return setTimeout(R,P)})},t=r({a:{a1:1},b:1}),u=T()(t,3),m=u[0],i=u[1],_=u[2],h=_.defineActions()({changeA:function(P){return o()(I()().mark(function R(){var L;return I()().wrap(function($){for(;;)switch($.prev=$.next){case 0:return L=P.draft,$.next=3,s();case 3:L.a.a1+=100;case 4:case"end":return $.stop()}},R)}))()}}),v=h.actions,x=h.useLoading,E=d(function(M,P){var R=x(),L=R.changeA;return C.createElement("div",{style:{border:"1px solid green",padding:"6px",margin:"6px"}},L.ok&&C.createElement("div",null,"obj.a.a1 ",m.a.a1),L.loading&&C.createElement("div",null,"loading..."),L.err&&C.createElement("div",null,L.err.message))}),y.abrupt("return",{default:function(){return C.createElement("div",null,C.createElement("h3",null,"updated at ",new Date().toLocaleString()),C.createElement(E,null),C.createElement("button",{onClick:v.changeA},"changeA"))}});case 10:case"end":return y.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-base-block-demo-4",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { block, share } from 'helux';
const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [obj, setObj, ctx] = share({ a: { a1: 1 }, b: 1 });
const { actions, useLoading } = ctx.defineActions()({
  async changeA({ draft }) {
    await delay();
    draft.a.a1 += 100;
  },
});

const User = block((props, params) => {
  const { changeA: status } = useLoading();
  return (
    <div style={{ border: '1px solid green', padding: '6px', margin: '6px' }}>
      {status.ok && <div>obj.a.a1 {obj.a.a1}</div>}
      {status.loading && <div>loading...</div>}
      {status.err && <div>{status.err.message}</div>}
    </div>
  );
});

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User />
      <button onClick={actions.changeA}>changeA</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:B},renderOpts:{compile:function(){var c=o()(I()().mark(function d(){var r,s=arguments;return I()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},76763:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(41992),I={}},8347:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(88500),I={}},38840:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(60689),I={}},3278:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(82695),O=e(95152),B={"docs-api-base-derive-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_,h;return a()().wrap(function(x){for(;;)switch(x.prev=x.next){case 0:return x.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=x.sent,l=c.atom,d=c.derive,r=c.useDerived,s=function(){var D=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1e3;return new Promise(function(y){return setTimeout(y,D)})},t=l(1),u=b()(t,2),m=u[0],i=u[1],_=function(){return i(function(D){return D+1})},h=d({fn:function(){return 0},deps:function(){return[m.val]},task:function(){var E=A()(a()().mark(function y(M){var P;return a()().wrap(function(L){for(;;)switch(L.prev=L.next){case 0:return P=M.input,L.next=3,s();case 3:return L.abrupt("return",P[0]+100);case 4:case"end":return L.stop()}},y)}));function D(y){return E.apply(this,arguments)}return D}()}),x.abrupt("return",{default:function(){var D=r(h),y=b()(D,2),M=y[0],P=y[1];return o.createElement("div",null,P.ok&&o.createElement("h1",null,M),P.loading&&o.createElement("h1",null,"loading..."),P.err&&o.createElement("h1",null,P.err.message),o.createElement("button",{onClick:_},"change"))}});case 11:case"end":return x.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-derive-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, derive, useDerived } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom, setAtom] = atom(1);
const change = () => setAtom((prev) => prev + 1);
const plus100Result = derive({
  fn: () => 0,
  deps: () => [numAtom.val],
  task: async ({ input }) => {
    await delay();
    return input[0] + 100;
  },
});

export default function Demo() {
  const [result, status] = useDerived(plus100Result);
  return (
    <div>
      {status.ok && <h1>{result}</h1>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1>{status.err.message}</h1>}
      <button onClick={change}>change</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},72236:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(50834),O=e(95152),B={"docs-api-base-dynamic-block-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m;return a()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=_.sent,l=c.dynamicBlock,d=c.share,r=d({a:{a1:1},b:1}),s=b()(r,2),t=s[0],u=s[1],m=function(){return u(function(v){return void(v.a.a1+=100)})},_.abrupt("return",{default:function(){var v=l(function(x){return o.createElement("div",{style:{border:"1px solid green",padding:"6px",margin:"6px"}},o.createElement("div",null,"props.mark: ",x.mark||"no mark"),o.createElement("div",null,"obj.a.a1 ",t.a.a1),o.createElement("div",null,"obj.b ",t.b))});return o.createElement("div",null,o.createElement("h3",null,"updated at ",new Date().toLocaleString()),o.createElement(v,null),o.createElement(v,{mark:"second user"}),o.createElement("button",{onClick:m},"changeA1"))}});case 8:case"end":return _.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-dynamic-block-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { dynamicBlock, share } from 'helux';

const [obj, setObj] = share({ a: { a1: 1 }, b: 1 });
const changeA1 = () => setObj((draft) => void (draft.a.a1 += 100));

export default function Demo() {
  const User = dynamicBlock((props) => (
    <div style={{ border: '1px solid green', padding: '6px', margin: '6px' }}>
      <div>props.mark: {props.mark || 'no mark'}</div>
      <div>obj.a.a1 {obj.a.a1}</div>
      <div>obj.b {obj.b}</div>
    </div>
  ));

  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <User />
      <User mark="second user" />
      <button onClick={changeA1}>changeA1</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},94785:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(62189),I={}},21877:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(96177),I={}},30338:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(51390),O=e(95152),B={"docs-api-base-mutate-dict-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_,h,v,x;return a()().wrap(function(D){for(;;)switch(D.prev=D.next){case 0:return D.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=D.sent,l=c.mutateDict,d=c.share,r=d({name:"helux",age:1},{moduleName:"M1"}),s=b()(r,3),t=s[0],u=s[2],m=d({a:1,b:{b1:{b2:200}},c:2,d:4,e:""},{moduleName:"M2"}),i=b()(m,3),_=i[0],h=i[2],v=u.defineActions()({changeName:function(M){var P=M.draft;P.name="".concat(P.name,"s")},changeAge:function(M){var P=M.draft;P.age+=1}}),x=l(_)({changeA:function(M){return M.a=t.age+10},changeD:{deps:function(){return[_.a,t.age]},fn:function(M,P){var R=b()(P.input,2),L=R[0],U=R[1];M.d=L+U}},changeE:{deps:function(){return[t.name]},task:function(){var y=A()(a()().mark(function P(R){var L,U,$;return a()().wrap(function(N){for(;;)switch(N.prev=N.next){case 0:L=R.draft,U=b()(R.input,1),$=U[0],L.e=$+Date.now();case 2:case"end":return N.stop()}},P)}));function M(P){return y.apply(this,arguments)}return M}()}}),D.abrupt("return",{default:function(){var M=h.useState(),P=b()(M,1),R=P[0];return o.createElement("div",null,o.createElement("h3",null,"foo.a ",R.a),o.createElement("h3",null,"foo.d ",R.d),o.createElement("h3",null,"foo.e ",R.e),o.createElement("button",{onClick:v.actions.changeName},"changeName"),o.createElement("button",{onClick:v.actions.changeAge},"changeAge"))}});case 10:case"end":return D.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-mutate-dict-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { mutateDict, share } from 'helux';

const [info, , infoCtx] = share(
  { name: 'helux', age: 1 },
  { moduleName: 'M1' },
);
const [foo, , fooCtx] = share(
  { a: 1, b: { b1: { b2: 200 } }, c: 2, d: 4, e: '' },
  { moduleName: 'M2' },
);

const infoAc = infoCtx.defineActions()({
  changeName({ draft }) {
    draft.name = \`\${draft.name}s\`;
  },
  changeAge({ draft }) {
    draft.age += 1;
  },
});

const witnessDict = mutateDict(foo)({
  changeA: (draft) => (draft.a = info.age + 10),
  changeD: {
    deps: () => [foo.a, info.age],
    fn: (draft, { input: [a, age] }) => {
      draft.d = a + age;
    },
  },
  changeE: {
    deps: () => [info.name],
    task: async ({ draft, input: [name] }) => {
      draft.e = name + Date.now();
    },
  },
});

export default function () {
  const [foo] = fooCtx.useState();
  return (
    <div>
      <h3>foo.a {foo.a}</h3>
      <h3>foo.d {foo.d}</h3>
      <h3>foo.e {foo.e}</h3>
      <button onClick={infoAc.actions.changeName}>changeName</button>
      <button onClick={infoAc.actions.changeAge}>changeAge</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},25602:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(71834),I={}},65738:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(76357),I={}},68388:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(38225),O=e(95152),B={"docs-api-base-run-derive-task-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_,h,v;return a()().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:return E.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=E.sent,l=c.atom,d=c.derive,r=c.runDeriveTask,s=c.useDerived,t=function(){var y=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1e3;return new Promise(function(M){return setTimeout(M,y)})},u=l(1),m=b()(u,2),i=m[0],_=m[1],h=d({fn:function(){return 0},deps:function(){return[i.val]},task:function(){var D=A()(a()().mark(function M(P){var R;return a()().wrap(function(U){for(;;)switch(U.prev=U.next){case 0:return R=P.input,U.next=3,t();case 3:return U.abrupt("return",R[0]+Date.now());case 4:case"end":return U.stop()}},M)}));function y(M){return D.apply(this,arguments)}return y}()}),v=function(){return r(h)},E.abrupt("return",{default:function(){var y=s(h),M=b()(y,2),P=M[0],R=M[1];return o.createElement("div",null,R.ok&&o.createElement("h1",null,P),R.loading&&o.createElement("h1",null,"loading..."),R.err&&o.createElement("h1",null,R.err.message),o.createElement("button",{onClick:v},"rerunTask"))}});case 12:case"end":return E.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-run-derive-task-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, derive, runDeriveTask, useDerived } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom, setAtom] = atom(1);
const plus100Result = derive({
  fn: () => 0,
  deps: () => [numAtom.val],
  task: async ({ input }) => {
    await delay();
    return input[0] + Date.now();
  },
});
const rerunTask = () => runDeriveTask(plus100Result);

export default function Demo() {
  const [result, status] = useDerived(plus100Result);
  return (
    <div>
      {status.ok && <h1>{result}</h1>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1>{status.err.message}</h1>}
      <button onClick={rerunTask}>rerunTask</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},28858:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(61882),I={}},14533:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(89335),O=e(95152),B={"docs-api-base-run-mutate-task-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_,h,v;return a()().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:return E.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=E.sent,l=c.atom,d=c.derive,r=c.runMutateTask,s=c.useDerived,t=function(){var y=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1e3;return new Promise(function(M){return setTimeout(M,y)})},u=l(1),m=b()(u,2),i=m[0],_=m[1],h=d({fn:function(){return 0},deps:function(){return[i.val]},task:function(){var D=A()(a()().mark(function M(P){var R;return a()().wrap(function(U){for(;;)switch(U.prev=U.next){case 0:return R=P.input,U.next=3,t();case 3:return U.abrupt("return",R[0]+100);case 4:case"end":return U.stop()}},M)}));function y(M){return D.apply(this,arguments)}return y}()}),v=function(){return r(h)},E.abrupt("return",{default:function(){var y=s(h),M=b()(y,2),P=M[0],R=M[1];return o.createElement("div",null,R.ok&&o.createElement("h1",null,P),R.loading&&o.createElement("h1",null,"loading..."),R.err&&o.createElement("h1",null,R.err.message),o.createElement("button",{onClick:v},"rerunTask"))}});case 12:case"end":return E.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-run-mutate-task-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, derive, runMutateTask, useDerived } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom, setAtom] = atom(1);
const plus100Result = derive({
  fn: () => 0,
  deps: () => [numAtom.val],
  task: async ({ input }) => {
    await delay();
    return input[0] + 100;
  },
});
const rerunTask = () => runMutateTask(plus100Result);

export default function Demo() {
  const [result, status] = useDerived(plus100Result);
  return (
    <div>
      {status.ok && <h1>{result}</h1>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1>{status.err.message}</h1>}
      <button onClick={rerunTask}>rerunTask</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},83567:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(8846),O=e(95152),B={"docs-api-base-run-mutate-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_,h;return a()().wrap(function(x){for(;;)switch(x.prev=x.next){case 0:return x.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=x.sent,l=c.mutateDict,d=c.runMutate,r=c.share,s=r({name:"helux",age:1,a:0}),t=b()(s,3),u=t[0],m=t[2],i=l(u)({changeA:function(D){return D.a=D.age+Math.random()}}),_=function(){return d(u,"changeA")},h=function(){return i.changeA.run()},x.abrupt("return",{default:function(){var D=m.useState(),y=b()(D,1),M=y[0];return o.createElement("div",null,o.createElement("h3",null,"info.a ",M.a),o.createElement("button",{onClick:_},"rerun"),o.createElement("button",{onClick:h},"rerun2"))}});case 11:case"end":return x.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-run-mutate-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { mutateDict, runMutate, share } from 'helux';

const [info, , infoCtx] = share({ name: 'helux', age: 1, a: 0 });

const witnessDict = mutateDict(info)({
  changeA: (draft) => (draft.a = draft.age + Math.random()),
});

const rerun = () => runMutate(info, 'changeA');
// \u548C\u4E0B\u9762\u5199\u6CD5\u7B49\u6548
const rerun2 = () => witnessDict.changeA.run();

export default function () {
  const [info] = infoCtx.useState();
  return (
    <div>
      <h3>info.a {info.a}</h3>
      <button onClick={rerun}>rerun</button>
      <button onClick={rerun2}>rerun2</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},14840:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(68257),I={}},51518:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(22378),I={}},87170:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(97930),O=e(95152),B={"docs-api-base-signal-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m;return a()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=_.sent,l=c.atom,d=c.signal,r=l(1),s=b()(r,2),t=s[0],u=s[1],m=function(){return u(function(v){return v+1})},_.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement("h3",null,"updated at ",new Date().toLocaleString()),o.createElement("div",null,"primitive atom: ",d(t)),o.createElement("button",{onClick:m},"changeNum"))}});case 8:case"end":return _.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-signal-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, signal } from 'helux';

const [numAtom, setAtom] = atom(1);
const changeNum = () => setAtom((prev) => prev + 1);

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <div>primitive atom: {signal(numAtom)}</div>
      <button onClick={changeNum}>changeNum</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-base-signal-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m;return a()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=_.sent,l=c.$,d=c.atom,r=d(1),s=b()(r,2),t=s[0],u=s[1],m=function(){return u(function(v){return v+1})},_.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement("h3",null,"updated at ",new Date().toLocaleString()),o.createElement("div",null,"primitive atom: ",l(t)),o.createElement("button",{onClick:m},"changeNum"))}});case 8:case"end":return _.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-signal-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, atom } from 'helux';

const [numAtom, setAtom] = atom(1);
const changeNum = () => setAtom((prev) => prev + 1);

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <div>primitive atom: {$(numAtom)}</div>
      <button onClick={changeNum}>changeNum</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-base-signal-demo-2":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m;return a()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=_.sent,l=c.$,d=c.atom,r=d(1),s=b()(r,2),t=s[0],u=s[1],m=function(){return u(function(v){return v+1})},_.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement("h3",null,"updated at ",new Date().toLocaleString()),o.createElement("div",null,l(t)),o.createElement("div",null,l(t,function(v){return"hello signal: ".concat(v)})),o.createElement("button",{onClick:m},"changeNum"))}});case 8:case"end":return _.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-signal-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, atom } from 'helux';

const [numAtom, setAtom] = atom(1);
const changeNum = () => setAtom((prev) => prev + 1);

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <div>{$(numAtom)}</div>
      <div>{$(numAtom, (val) => \`hello signal: \${val}\`)}</div>
      <button onClick={changeNum}>changeNum</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-base-signal-demo-3":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_,h,v,x,E;return a()().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:return y.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=y.sent,l=c.$,d=c.atom,r=c.share,s=d({a:{a1:1},b:1}),t=b()(s,2),u=t[0],m=t[1],i=r({a:{a1:1},b:1}),_=b()(i,2),h=_[0],v=_[1],x=function(){return m(function(P){return void(P.a.a1+=100)})},E=function(){return v(function(P){return void(P.a.a1+=100)})},y.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement("h3",null,"updated at ",new Date().toLocaleString()),o.createElement("div",null,l(function(){return o.createElement("div",null,o.createElement("div",null,"obj1.a.a1 ",u.val.a.a1),o.createElement("div",null,"obj1.b ",u.val.b),o.createElement("div",null,"obj2.a.a1 ",h.a.a1))})),o.createElement("button",{onClick:x},"changeAtomA1"),o.createElement("button",{onClick:E},"changeShareA1"))}});case 11:case"end":return y.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-signal-demo-3",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, atom, share } from 'helux';

const [obj1, setObj1] = atom({ a: { a1: 1 }, b: 1 });
const [obj2, setObj2] = share({ a: { a1: 1 }, b: 1 });

const changeAtomA1 = () => setObj1((draft) => void (draft.a.a1 += 100));
const changeShareA1 = () => setObj2((draft) => void (draft.a.a1 += 100));

export default function Demo() {
  return (
    <div>
      <h3>updated at {new Date().toLocaleString()}</h3>
      <div>
        {$(() => (
          <div>
            {/* \u6CE8\u610F\u6B64\u6B21 atom \u5BF9\u8C61\u9700\u8981\u81EA\u5DF1 .val \u62C6\u7BB1 */}
            <div>obj1.a.a1 {obj1.val.a.a1}</div>
            <div>obj1.b {obj1.val.b}</div>
            <div>obj2.a.a1 {obj2.a.a1}</div>
          </div>
        ))}
      </div>
      <button onClick={changeAtomA1}>changeAtomA1</button>
      <button onClick={changeShareA1}>changeShareA1</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},49862:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(87268),O=e(95152),B={"docs-api-base-sync-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u;return a()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=i.sent,l=c.atom,d=c.sync,r=l({a:"1",b:{b1:{b2:"1"}}}),s=b()(r,3),t=s[0],u=s[2],i.abrupt("return",{default:function(){var h=u.useState(),v=b()(h,1),x=v[0];return o.createElement("div",null,o.createElement("input",{value:x.a,onChange:d(t)(function(E){return E.a})}),o.createElement("input",{value:x.b.b1.b2,onChange:d(t)(function(E){return E.b.b1.b2})}))}});case 7:case"end":return i.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-sync-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, sync } from 'helux';

const [objAtom, , ctx] = atom({ a: '1', b: { b1: { b2: '1' } } });

export default () => {
  const [obj] = ctx.useState();
  return (
    <div>
      <input value={obj.a} onChange={sync(objAtom)((to) => to.a)} />
      <input value={obj.b.b1.b2} onChange={sync(objAtom)((to) => to.b.b1.b2)} />
    </div>
  );
};`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-base-sync-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=m.sent,l=c.atom,d=l({a:"1",b:{b1:{b2:"1"}}}),r=b()(d,3),s=r[0],t=r[2],m.abrupt("return",{default:function(){var _=t.useState(),h=b()(_,1),v=h[0];return o.createElement("div",null,o.createElement("input",{value:v.a,onChange:t.sync(function(x){return x.a})}),o.createElement("input",{value:v.b.b1.b2,onChange:t.sync(function(x){return x.b.b1.b2})}))}});case 6:case"end":return m.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-sync-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom } from 'helux';

const [objAtom, , ctx] = atom({ a: '1', b: { b1: { b2: '1' } } });

export default () => {
  const [obj] = ctx.useState();
  return (
    <div>
      <input value={obj.a} onChange={ctx.sync((to) => to.a)} />
      <input value={obj.b.b1.b2} onChange={ctx.sync((to) => to.b.b1.b2)} />
    </div>
  );
};`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},40155:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(86296),O=e(95152),B={"docs-api-base-syncer-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u;return a()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=i.sent,l=c.atom,d=c.syncer,r=l(1),s=b()(r,3),t=s[0],u=s[2],i.abrupt("return",{default:function(){var h=u.useState(),v=b()(h,1),x=v[0];return o.createElement("input",{value:x,onChange:d(t)})}});case 7:case"end":return i.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-syncer-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, syncer } from 'helux';

const [numAtom, , ctx] = atom(1);

export default () => {
  const [num] = ctx.useState();
  return <input value={num} onChange={syncer(numAtom)} />;
};`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-base-syncer-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=m.sent,l=c.atom,d=l(1),r=b()(d,3),s=r[0],t=r[2],m.abrupt("return",{default:function(){var _=t.useState(),h=b()(_,1),v=h[0];return o.createElement("input",{value:v,onChange:t.syncer})}});case 6:case"end":return m.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-syncer-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom } from 'helux';

const [numAtom, , ctx] = atom(1);

export default () => {
  const [num] = ctx.useState();
  return <input value={num} onChange={ctx.syncer} />;
};`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-base-syncer-demo-2":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u;return a()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=i.sent,l=c.atom,d=c.syncer,r=l({a:"1",b:"2"}),s=b()(r,3),t=s[0],u=s[2],i.abrupt("return",{default:function(){var h=u.useState(),v=b()(h,1),x=v[0];return o.createElement("div",null,o.createElement("input",{value:x.a,onChange:d(t).a}),o.createElement("input",{value:x.b,onChange:d(t).b}))}});case 7:case"end":return i.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-syncer-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, syncer } from 'helux';

const [objAtom, , ctx] = atom({ a: '1', b: '2' });

export default () => {
  const [obj] = ctx.useState();
  return (
    <div>
      <input value={obj.a} onChange={syncer(objAtom).a} />
      <input value={obj.b} onChange={syncer(objAtom).b} />
    </div>
  );
};`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-base-syncer-demo-3":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=m.sent,l=c.atom,d=l({a:"1",b:"2"}),r=b()(d,3),s=r[0],t=r[2],m.abrupt("return",{default:function(){var _=t.useState(),h=b()(_,1),v=h[0];return o.createElement("div",null,o.createElement("input",{value:v.a,onChange:t.syncer.a}),o.createElement("input",{value:v.b,onChange:t.syncer.b}))}});case 6:case"end":return m.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-syncer-demo-3",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom } from 'helux';

const [objAtom, , ctx] = atom({ a: '1', b: '2' });

export default () => {
  const [obj] = ctx.useState();
  return (
    <div>
      <input value={obj.a} onChange={ctx.syncer.a} />
      <input value={obj.b} onChange={ctx.syncer.b} />
    </div>
  );
};`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-base-syncer-demo-4":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u;return a()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=i.sent,l=c.atom,d=c.syncer,r=l({a:"1",b:"2"}),s=b()(r,3),t=s[0],u=s[2],i.abrupt("return",{default:function(){var h=u.useState(),v=b()(h,1),x=v[0],E=d(t).a,D=d(t).a;return o.createElement("div",null,o.createElement("h1",null,"s1 === s2 ","".concat(E===D)))}});case 7:case"end":return i.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-base-syncer-demo-4",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, syncer } from 'helux';

const [objAtom, , ctx] = atom({ a: '1', b: '2' });

export default () => {
  const [obj] = ctx.useState();
  const s1 = syncer(objAtom).a;
  const s2 = syncer(objAtom).a;
  return (
    <div>
      <h1>s1 === s2 {\`\${s1 === s2}\`}</h1>
    </div>
  );
};`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},98309:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(68285),I={}},587:function(f,n,e){e.r(n),e.d(n,{demos:function(){return C}});var p=e(29008),a=e.n(p),I=e(70958),b=e.n(I),T=e(94159),A=e(53722),o=e(95152),C={"docs-api-base-watch-demo-watch-root-node":{component:T.memo(T.lazy(function(){return e.e(2433).then(e.bind(e,28145))})),asset:{type:"BLOCK",id:"docs-api-base-watch-demo-watch-root-node",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:e(83227).Z},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:o},renderOpts:{compile:function(){var O=b()(a()().mark(function g(){var c,l=arguments;return a()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,e.e(2357).then(e.bind(e,82357));case 2:return r.abrupt("return",(c=r.sent).default.apply(c,l));case 3:case"end":return r.stop()}},g)}));function B(){return O.apply(this,arguments)}return B}()}},"docs-api-base-watch-demo-watch-sub-node":{component:T.memo(T.lazy(function(){return e.e(2433).then(e.bind(e,17471))})),asset:{type:"BLOCK",id:"docs-api-base-watch-demo-watch-sub-node",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:e(41185).Z},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:o},renderOpts:{compile:function(){var O=b()(a()().mark(function g(){var c,l=arguments;return a()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,e.e(2357).then(e.bind(e,82357));case 2:return r.abrupt("return",(c=r.sent).default.apply(c,l));case 3:case"end":return r.stop()}},g)}));function B(){return O.apply(this,arguments)}return B}()}},"docs-api-base-watch-demo-run-watch":{component:T.memo(T.lazy(function(){return e.e(2433).then(e.bind(e,85583))})),asset:{type:"BLOCK",id:"docs-api-base-watch-demo-run-watch",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:e(4991).Z},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:o},renderOpts:{compile:function(){var O=b()(a()().mark(function g(){var c,l=arguments;return a()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,e.e(2357).then(e.bind(e,82357));case 2:return r.abrupt("return",(c=r.sent).default.apply(c,l));case 3:case"end":return r.stop()}},g)}));function B(){return O.apply(this,arguments)}return B}()}}}},79457:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(63277),I={}},94985:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(25793),I={}},77318:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(78457),O=e(95152),B={"docs-api-hooks-use-action-loading-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_;return a()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return v.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=v.sent,l=c.share,d=c.useActionLoading,r=c.useAtom,s=l({a:1,b:{b1:1}}),t=b()(s,3),u=t[0],m=t[2],i=function(){var E=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1e3;return new Promise(function(D){return setTimeout(D,E)})},_=m.action()(function(){var x=A()(a()().mark(function E(D){var y;return a()().wrap(function(P){for(;;)switch(P.prev=P.next){case 0:return y=D.draft,P.next=3,i(1e3);case 3:y.a+=1;case 4:case"end":return P.stop()}},E)}));return function(E){return x.apply(this,arguments)}}(),"changeA"),v.abrupt("return",{default:function(){var E=r(u),D=b()(E,2),y=D[0],M=D[1],P=d(u),R=b()(P,1),L=R[0];return o.createElement("div",null,L.changeA.ok&&o.createElement("h1",null,y.a),L.changeA.loading&&o.createElement("h1",null,"loading..."),L.changeA.err&&o.createElement("h1",null,L.changeA.err.message),o.createElement("button",{onClick:_},"changeA"))}});case 10:case"end":return v.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-action-loading-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { share, useActionLoading, useAtom } from 'helux';

const [dictAtom, , ctx] = share({ a: 1, b: { b1: 1 } });
const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const changeA = ctx.action()(async ({ draft }) => {
  await delay(1000);
  draft.a += 1;
}, 'changeA'); // \u5B9A\u597D action \u63CF\u8FF0\u4E3A changeA

export default function () {
  // \u6216\u5199\u4E3A
  // const [ dict, setDict ] = ctx.useState();
  const [dict, setDict] = useAtom(dictAtom);

  // or: ctx.useActionLoading();
  const [ld] = useActionLoading(dictAtom);
  return (
    <div>
      {ld.changeA.ok && <h1>{dict.a}</h1>}
      {ld.changeA.loading && <h1>loading...</h1>}
      {ld.changeA.err && <h1>{ld.changeA.err.message}</h1>}
      <button onClick={changeA}>changeA</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},28020:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(56950),O=e(95152),B={"docs-api-hooks-use-atom-x-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i;return a()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return i=function(){var x=u.useStateX(),E=x.state;return o.createElement("h1",null,E)},m=function(){var x=d(t),E=x.state;return o.createElement("h1",null,E)},h.next=4,Promise.resolve().then(e.bind(e,95152));case 4:return c=h.sent,l=c.atom,d=c.useAtomX,r=l(1),s=b()(r,3),t=s[0],u=s[2],h.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(m,null),o.createElement(i,null),o.createElement("button",{onClick:function(){return u.setState(function(E){return E+1})}},"change"))}});case 9:case"end":return h.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-atom-x-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useAtomX } from 'helux';

const [numAtom, , ctx] = atom(1);

function Demo() {
  const { state: num } = useAtomX(numAtom);
  return <h1>{num}</h1>;
}

function Demo2() {
  const { state: num } = ctx.useStateX();
  return <h1>{num}</h1>;
}

export default () => (
  <>
    <Demo />
    <Demo2 />
    <button onClick={() => ctx.setState((prev) => prev + 1)}>change</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},19302:function(f,n,e){e.r(n),e.d(n,{demos:function(){return c}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(57202),O=e(95152),B=e(13517),g=e(48259),c={"docs-api-hooks-use-atom-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function l(){var d,r,s,t,u,m;return a()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return d=_.sent,r=d.atom,s=d.useAtom,t=r(1),u=b()(t,1),m=u[0],_.abrupt("return",{default:function(){var v=s(m),x=b()(v,2),E=x[0],D=x[1];return o.createElement("h1",{onClick:function(){return D(E+1)}},"useAtom: ",E)}});case 7:case"end":return _.stop()}},l)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-atom-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useAtom } from 'helux';
const [numAtom] = atom(1);

export default function () {
  const [num, setNum] = useAtom(numAtom);
  return <h1 onClick={() => setNum(num + 1)}>useAtom: {num}</h1>;
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var l=A()(a()().mark(function r(){var s,t=arguments;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,e.e(2357).then(e.bind(e,82357));case 2:return m.abrupt("return",(s=m.sent).default.apply(s,t));case 3:case"end":return m.stop()}},r)}));function d(){return l.apply(this,arguments)}return d}()}},"docs-api-hooks-use-atom-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function l(){var d,r,s,t,u,m;return a()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return d=_.sent,r=d.atom,s=r(1),t=b()(s,3),u=t[0],m=t[2],_.abrupt("return",{default:function(){var v=m.useState(),x=b()(v,2),E=x[0],D=x[1];return o.createElement("h1",{onClick:function(){return D(E+1)}},"ctx.useState: ",E)}});case 6:case"end":return _.stop()}},l)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-atom-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom } from 'helux';
const [numAtom, , ctx] = atom(1);

export default function () {
  const [num, setNum] = ctx.useState();
  return <h1 onClick={() => setNum(num + 1)}>ctx.useState: {num}</h1>;
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var l=A()(a()().mark(function r(){var s,t=arguments;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,e.e(2357).then(e.bind(e,82357));case 2:return m.abrupt("return",(s=m.sent).default.apply(s,t));case 3:case"end":return m.stop()}},r)}));function d(){return l.apply(this,arguments)}return d}()}},"docs-api-hooks-use-atom-demo-2":{component:o.memo(o.lazy(A()(a()().mark(function l(){var d,r,s,t,u,m,i;return a()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return h.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return d=h.sent,r=d.atom,s=d.useAtom,t=r({a:1,b:{b1:1}}),u=b()(t,3),m=u[0],i=u[2],h.abrupt("return",{default:function(){var x=s(m),E=b()(x,2),D=E[0],y=E[1],M=function(){y(function(R){R.a+=1,R.b.b1+=10})};return o.createElement("div",null,o.createElement("h1",null,D.a),o.createElement("h1",null,D.b.b1),o.createElement("button",{onClick:M},"change"))}});case 7:case"end":return h.stop()}},l)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-atom-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useAtom } from 'helux';
const [dictAtom, , ctx] = atom({ a: 1, b: { b1: 1 } });

export default function () {
  // \u6216\u5199\u4E3A
  // const [ dict, setDict ] = ctx.useState();
  const [dict, setDict] = useAtom(dictAtom);
  const change = () => {
    setDict((draft) => {
      draft.a += 1;
      draft.b.b1 += 10;
    });
  };
  return (
    <div>
      <h1>{dict.a}</h1>
      <h1>{dict.b.b1}</h1>
      <button onClick={change}>change</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var l=A()(a()().mark(function r(){var s,t=arguments;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,e.e(2357).then(e.bind(e,82357));case 2:return m.abrupt("return",(s=m.sent).default.apply(s,t));case 3:case"end":return m.stop()}},r)}));function d(){return l.apply(this,arguments)}return d}()}},"docs-api-hooks-use-atom-demo-3":{component:o.memo(o.lazy(A()(a()().mark(function l(){var d,r,s,t,u,m,i;return a()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return h.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return d=h.sent,r=d.share,s=d.useAtom,t=r({a:1,b:{b1:1}}),u=b()(t,3),m=u[0],i=u[2],h.abrupt("return",{default:function(){var x=s(m),E=b()(x,2),D=E[0],y=E[1],M=function(){y(function(R){R.a+=1,R.b.b1+=10})};return o.createElement("div",null,o.createElement("h1",null,D.a),o.createElement("h1",null,D.b.b1),o.createElement("button",{onClick:M},"change"))}});case 7:case"end":return h.stop()}},l)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-atom-demo-3",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { share, useAtom } from 'helux';
const [dictAtom, , ctx] = share({ a: 1, b: { b1: 1 } });

export default function () {
  // \u6216\u5199\u4E3A
  // const [ dict, setDict ] = ctx.useState();
  const [dict, setDict] = useAtom(dictAtom);
  const change = () => {
    setDict((draft) => {
      draft.a += 1;
      draft.b.b1 += 10;
    });
  };
  return (
    <div>
      <h1>{dict.a}</h1>
      <h1>{dict.b.b1}</h1>
      <button onClick={change}>change</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var l=A()(a()().mark(function r(){var s,t=arguments;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,e.e(2357).then(e.bind(e,82357));case 2:return m.abrupt("return",(s=m.sent).default.apply(s,t));case 3:case"end":return m.stop()}},r)}));function d(){return l.apply(this,arguments)}return d}()}},"docs-api-hooks-use-atom-demo-4":{component:o.memo(o.lazy(A()(a()().mark(function l(){var d,r,s,t,u,m,i;return a()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return h.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return d=h.sent,r=d.atom,s=d.useAtom,t=r({a:1,b:{b1:1}}),u=b()(t,3),m=u[0],i=u[2],h.abrupt("return",{default:function(){var x=s(m,{collectType:"no"}),E=b()(x,2),D=E[0],y=E[1],M=function(){y(function(R){R.a+=1,R.b.b1+=10})};return o.createElement("div",null,o.createElement("h1",null,D.a),o.createElement("h1",null,D.b.b1),o.createElement("h3",{style:{color:"red"}},"\u4E0D\u6536\u96C6\u4F9D\u8D56\uFF0C\u70B9\u51FBchange\u65E0\u53CD\u5E94"),o.createElement("button",{onClick:M},"change"))}});case 7:case"end":return h.stop()}},l)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-atom-demo-4",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useAtom } from 'helux';
const [dictAtom, , ctx] = atom({ a: 1, b: { b1: 1 } });

export default function () {
  // or ctx.useState({ collectType: 'no' });
  const [dict, setDict] = useAtom(dictAtom, { collectType: 'no' });
  const change = () => {
    setDict((draft) => {
      draft.a += 1;
      draft.b.b1 += 10;
    });
  };
  return (
    <div>
      <h1>{dict.a}</h1>
      <h1>{dict.b.b1}</h1>
      <h3 style={{ color: 'red' }}>\u4E0D\u6536\u96C6\u4F9D\u8D56\uFF0C\u70B9\u51FBchange\u65E0\u53CD\u5E94</h3>
      <button onClick={change}>change</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var l=A()(a()().mark(function r(){var s,t=arguments;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,e.e(2357).then(e.bind(e,82357));case 2:return m.abrupt("return",(s=m.sent).default.apply(s,t));case 3:case"end":return m.stop()}},r)}));function d(){return l.apply(this,arguments)}return d}()}},"docs-api-hooks-use-atom-demo-5":{component:o.memo(o.lazy(A()(a()().mark(function l(){var d,r,s,t,u,m,i,_;return a()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return v.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return d=v.sent,r=d.atom,s=d.useAtom,t=r({a:1,b:{b1:1}},{rules:[{when:function(E){return E.b.b1},ids:["up1"]}]}),u=b()(t,3),m=u[0],i=u[2],_=function(){i.setState(function(E){E.b.b1+=10})},v.abrupt("return",{default:function(){return s(m,{id:"up1"}),o.createElement("div",null,o.createElement("h1",null,"update at ",Date.now()),o.createElement("h3",null,"\u56E0\u914D\u7F6E\u7684id\u6EE1\u8DB3\u4E86rules\u914D\u7F6E\u7684\u53D8\u66F4\u89C4\u5219\uFF0C\u5F53\u524D\u7EC4\u4EF6\u5BF9\u6570\u636E\u65E0\u4F9D\u8D56\u4E5F\u5C06\u88AB\u6E32\u67D3"),o.createElement("button",{onClick:_},"change"))}});case 8:case"end":return v.stop()}},l)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-atom-demo-5",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useAtom } from 'helux';
const [dictAtom, , ctx] = atom(
  { a: 1, b: { b1: 1 } },
  {
    rules: [
      // state.b.b1 \u53D8\u5316\u65F6\uFF0C\u89E6\u53D1\u8FD9\u4E9B ids \u89C6\u56FE\u66F4\u65B0
      { when: (state) => state.b.b1, ids: ['up1'] },
    ],
  },
);
const change = () => {
  ctx.setState((draft) => {
    draft.b.b1 += 10;
  });
};

export default function () {
  // or ctx.useState({ id: 'up1' });
  useAtom(dictAtom, { id: 'up1' });
  return (
    <div>
      <h1>update at {Date.now()}</h1>
      <h3>
        \u56E0\u914D\u7F6E\u7684id\u6EE1\u8DB3\u4E86rules\u914D\u7F6E\u7684\u53D8\u66F4\u89C4\u5219\uFF0C\u5F53\u524D\u7EC4\u4EF6\u5BF9\u6570\u636E\u65E0\u4F9D\u8D56\u4E5F\u5C06\u88AB\u6E32\u67D3
      </h3>
      <button onClick={change}>change</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var l=A()(a()().mark(function r(){var s,t=arguments;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,e.e(2357).then(e.bind(e,82357));case 2:return m.abrupt("return",(s=m.sent).default.apply(s,t));case 3:case"end":return m.stop()}},r)}));function d(){return l.apply(this,arguments)}return d}()}},"docs-api-hooks-use-atom-demo-6":{component:o.memo(o.lazy(A()(a()().mark(function l(){var d,r,s,t,u,m,i,_;return a()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return v.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return d=v.sent,r=d.atom,s=d.useAtom,t=r({a:1,b:{b1:1}}),u=b()(t,3),m=u[0],i=u[2],_=function(){i.setState(function(E){E.b.b1+=10})},v.abrupt("return",{default:function(){return s(m,{deps:function(D){return[D.b.b1]}}),o.createElement("div",null,o.createElement("h1",null,"update at ",Date.now()),o.createElement("button",{onClick:_},"change"))}});case 8:case"end":return v.stop()}},l)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-atom-demo-6",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useAtom } from 'helux';
const [dictAtom, , ctx] = atom({ a: 1, b: { b1: 1 } });
const change = () => {
  ctx.setState((draft) => {
    draft.b.b1 += 10;
  });
};

export default function () {
  // or ctx.useState({ id: 'up1' });
  useAtom(dictAtom, { deps: (state) => [state.b.b1] });
  return (
    <div>
      <h1>update at {Date.now()}</h1>
      <button onClick={change}>change</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var l=A()(a()().mark(function r(){var s,t=arguments;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,e.e(2357).then(e.bind(e,82357));case 2:return m.abrupt("return",(s=m.sent).default.apply(s,t));case 3:case"end":return m.stop()}},r)}));function d(){return l.apply(this,arguments)}return d}()}},"docs-api-hooks-use-atom-demo-setting-pure":{component:o.memo(o.lazy(function(){return e.e(2433).then(e.bind(e,11188))})),asset:{type:"BLOCK",id:"docs-api-hooks-use-atom-demo-setting-pure",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:e(24596).Z},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"},"./data.ts":{type:"FILE",value:e(4197).Z}},entry:"index.tsx"},context:{"./data.ts":g,"@helux/demo-utils":B,helux:O,"/home/runner/work/helux/helux/docs/docs/api/hooks/demos/data.ts":g},renderOpts:{compile:function(){var l=A()(a()().mark(function r(){var s,t=arguments;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,e.e(2357).then(e.bind(e,82357));case 2:return m.abrupt("return",(s=m.sent).default.apply(s,t));case 3:case"end":return m.stop()}},r)}));function d(){return l.apply(this,arguments)}return d}()}}}},68908:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(27156),O=e(95152),B={"docs-api-hooks-use-derived-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_;return a()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return _=function(){var E=r(m),D=b()(E,1),y=D[0];return o.createElement("h1",null,y)},v.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=v.sent,l=c.atomx,d=c.derive,r=c.useDerived,s=l(1),t=s.stateRoot,u=s.reactiveRoot,m=d(function(){return t.val+100}),i=function(){u.val+=1},v.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(_,null),o.createElement(_,null),o.createElement("button",{onClick:i},"change"))}});case 11:case"end":return v.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-derived-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atomx, derive, useDerived } from 'helux';

const { stateRoot, reactiveRoot } = atomx(1);
const result = derive(() => stateRoot.val + 100);

const change = () => {
  reactiveRoot.val += 1;
};

function Demo() {
  const [plus100] = useDerived(result);
  return <h1>{plus100}</h1>;
}

export default () => (
  <>
    <Demo />
    <Demo />
    <button onClick={change}>change</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-hooks-use-derived-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_,h;return a()().wrap(function(x){for(;;)switch(x.prev=x.next){case 0:return h=function(){var D=r(i),y=b()(D,2),M=y[0],P=y[1];return console.log(M,P),o.createElement(o.Fragment,null,P.ok&&o.createElement("h1",null,M),P.loading&&o.createElement("h1",null,"loading..."),P.err&&o.createElement("h1",{style:{color:"red"}},P.err.message))},x.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=x.sent,l=c.atomx,d=c.derive,r=c.useDerived,s=function(){var D=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1e3;return new Promise(function(y){return setTimeout(y,D)})},t=l(1),u=t.stateRoot,m=t.reactiveRoot,i=d({deps:function(){return[u.val]},fn:function(){return 0},task:function(){var E=A()(a()().mark(function y(M){var P;return a()().wrap(function(L){for(;;)switch(L.prev=L.next){case 0:return P=M.input,L.next=3,s(100);case 3:if(P[0]!==3){L.next=5;break}throw new Error("meet 3");case 5:return L.abrupt("return",P[0]+100);case 6:case"end":return L.stop()}},y)}));function D(y){return E.apply(this,arguments)}return D}()}),_=function(){m.val+=1},x.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(h,null),o.createElement(h,null),o.createElement("button",{onClick:_},"change"))}});case 12:case"end":return x.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-derived-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atomx, derive, useDerived } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const { stateRoot, reactiveRoot } = atomx(1);
const result = derive({
  deps: () => [stateRoot.val],
  fn: () => 0,
  task: async ({ input }) => {
    await delay(100);
    if (input[0] === 3) {
      throw new Error('meet 3');
    }
    return input[0] + 100;
  },
});

const change = () => {
  reactiveRoot.val += 1;
};

function Demo() {
  const [plus100, status] = useDerived(result);
  console.log(plus100, status);
  return (
    <>
      {status.ok && <h1>{plus100}</h1>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
    </>
  );
}

export default () => (
  <>
    <Demo />
    <Demo />
    <button onClick={change}>change</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},71308:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(71667),O=e(95152),B={"docs-api-hooks-use-global-force-update-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i;return a()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return i=function(){var x=r(u),E=d(u),D=b()(E,1),y=D[0];return o.createElement("div",null,o.createElement("h1",null,y.a),o.createElement("h3",null,"update at ",Date.now()),o.createElement("button",{onClick:x},"updateAllAtomIns"))},h.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=h.sent,l=c.share,d=c.useAtom,r=c.useGlobalForceUpdate,s=l({a:1,b:{b1:1}}),t=b()(s,3),u=t[0],m=t[2],h.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(i,null),o.createElement(i,null))}});case 9:case"end":return h.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-global-force-update-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { share, useAtom, useGlobalForceUpdate } from 'helux';
const [dictAtom, , ctx] = share({ a: 1, b: { b1: 1 } });

function Demo() {
  // \u6216\u5199\u4E3A
  // or const updateAllAtomIns = ctx.useForceUpdate();
  const updateAllAtomIns = useGlobalForceUpdate(dictAtom);
  const [dict] = useAtom(dictAtom);
  return (
    <div>
      <h1>{dict.a}</h1>
      <h3>update at {Date.now()}</h3>
      <button onClick={updateAllAtomIns}>updateAllAtomIns</button>
    </div>
  );
}

export default () => (
  <>
    <Demo />
    <Demo />
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-hooks-use-global-force-update-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_;return a()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return _=function(){var E=r(u,function(P){return[P.a]}),D=d(u),y=b()(D,1),M=y[0];return o.createElement("div",null,o.createElement("h1",null,"dict.b.b1: ",M.b.b1),o.createElement("h3",null,"update at ",Date.now()),o.createElement("button",{onClick:E},"updateSomeIns"))},i=function(){var E=r(u,function(P){return[P.a]}),D=d(u),y=b()(D,1),M=y[0];return o.createElement("div",null,o.createElement("h1",null,"dict.a: ",M.a),o.createElement("h3",null,"update at ",Date.now()),o.createElement("button",{onClick:E},"updateSomeIns"))},v.next=4,Promise.resolve().then(e.bind(e,95152));case 4:return c=v.sent,l=c.share,d=c.useAtom,r=c.useGlobalForceUpdate,s=l({a:1,b:{b1:2}}),t=b()(s,3),u=t[0],m=t[2],v.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(i,null),o.createElement(_,null))}});case 10:case"end":return v.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-global-force-update-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { share, useAtom, useGlobalForceUpdate } from 'helux';
const [dictAtom, , ctx] = share({ a: 1, b: { b1: 2 } });

function Demo1() {
  // \u6216\u5199\u4E3A
  // or const updateSomeIns = ctx.useForceUpdate(state=>[state.a]);
  const updateSomeIns = useGlobalForceUpdate(dictAtom, (state) => [state.a]);
  const [dict] = useAtom(dictAtom);
  return (
    <div>
      <h1>dict.a: {dict.a}</h1>
      <h3>update at {Date.now()}</h3>
      <button onClick={updateSomeIns}>updateSomeIns</button>
    </div>
  );
}

function Demo2() {
  const updateSomeIns = useGlobalForceUpdate(dictAtom, (state) => [state.a]);
  const [dict] = useAtom(dictAtom);
  return (
    <div>
      <h1>dict.b.b1: {dict.b.b1}</h1>
      <h3>update at {Date.now()}</h3>
      <button onClick={updateSomeIns}>updateSomeIns</button>
    </div>
  );
}

export default () => (
  <>
    <Demo1 />
    <Demo2 />
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},41773:function(f,n,e){e.r(n),e.d(n,{demos:function(){return C}});var p=e(29008),a=e.n(p),I=e(70958),b=e.n(I),T=e(94159),A=e(76197),o=e(95152),C={"docs-api-hooks-use-global-id-demo-0":{component:T.memo(T.lazy(b()(a()().mark(function O(){var B,g,c,l,d,r,s,t,u;return a()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return u=function(){return c("up1"),T.createElement("h1",null,"found a changed! update at: ",Date.now())},i.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return B=i.sent,g=B.atomx,c=B.useGlobalId,l=g({a:1,b:1},{rules:[{when:function(h){return h.a},globalIds:["up1"]}]}),d=l.state,r=l.reactive,s=l.getSnap,t=function(){r.a+=1},i.abrupt("return",{default:function(){return T.createElement(T.Fragment,null,T.createElement(u,null),T.createElement("button",{onClick:t},"change"))}});case 9:case"end":return i.stop()}},O)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-global-id-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atomx, useGlobalId } from 'helux';

const { state, reactive, getSnap } = atomx(
  { a: 1, b: 1 },
  {
    rules: [
      {
        when: (state) => state.a,
        globalIds: ['up1'],
      },
    ],
  },
);
const change = () => {
  reactive.a += 1;
};

function Demo() {
  useGlobalId('up1');
  return <h1>found a changed! update at: {Date.now()}</h1>;
}

export default () => (
  <>
    <Demo />
    <button onClick={change}>change</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:o},renderOpts:{compile:function(){var O=b()(a()().mark(function g(){var c,l=arguments;return a()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,e.e(2357).then(e.bind(e,82357));case 2:return r.abrupt("return",(c=r.sent).default.apply(c,l));case 3:case"end":return r.stop()}},g)}));function B(){return O.apply(this,arguments)}return B}()}}}},58667:function(f,n,e){e.r(n),e.d(n,{demos:function(){return C}});var p=e(29008),a=e.n(p),I=e(70958),b=e.n(I),T=e(94159),A=e(43162),o=e(95152),C={"docs-api-hooks-use-local-force-update-demo-0":{component:T.memo(T.lazy(b()(a()().mark(function O(){var B,g;return a()().wrap(function(l){for(;;)switch(l.prev=l.next){case 0:return l.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return B=l.sent,g=B.useLocalForceUpdate,l.abrupt("return",{default:function(){var r=g();return T.createElement("div",null,T.createElement("h3",null,"update at ",Date.now()),T.createElement("button",{onClick:r},"click"))}});case 5:case"end":return l.stop()}},O)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-local-force-update-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { useLocalForceUpdate } from 'helux';

export default function () {
  const forceUpdate = useLocalForceUpdate();

  return (
    <div>
      <h3>update at {Date.now()}</h3>
      <button onClick={forceUpdate}>click</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:o},renderOpts:{compile:function(){var O=b()(a()().mark(function g(){var c,l=arguments;return a()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,e.e(2357).then(e.bind(e,82357));case 2:return r.abrupt("return",(c=r.sent).default.apply(c,l));case 3:case"end":return r.stop()}},g)}));function B(){return O.apply(this,arguments)}return B}()}}}},19019:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(59237),O=e(95152),B={"docs-api-hooks-use-mutable-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l;return a()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=r.sent,l=c.useMutable,r.abrupt("return",{default:function(){var t=l({a:1,b:{b1:1}}),u=b()(t,2),m=u[0],i=u[1],_=function(){i(function(v){v.b.b1+=100})};return o.createElement("h1",null,o.createElement("button",{onClick:_},"obj.b.b1 ",m.b.b1))}});case 5:case"end":return r.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-mutable-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { useMutable } from 'helux';

export default function Demo() {
  const [obj, setObj] = useMutable({ a: 1, b: { b1: 1 } });
  const change = () => {
    setObj((draft) => {
      draft.b.b1 += 100;
    });
  };

  return (
    <h1>
      <button onClick={change}>obj.b.b1 {obj.b.b1}</button>
    </h1>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},70428:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(6801),O=e(95152),B={"docs-api-hooks-use-mutate-loading-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_,h;return a()().wrap(function(x){for(;;)switch(x.prev=x.next){case 0:return x.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=x.sent,l=c.share,d=c.useAtom,r=c.useMutateLoading,s=l({a:1,b:{b1:1}},{moduleName:"uml"}),t=b()(s,3),u=t[0],m=t[2],i=function(){var D=arguments.length>0&&arguments[0]!==void 0?arguments[0]:1e3;return new Promise(function(y){return setTimeout(y,D)})},_=m.mutate({deps:function(){return[u.b.b1]},task:function(){var E=A()(a()().mark(function y(M){var P,R;return a()().wrap(function(U){for(;;)switch(U.prev=U.next){case 0:return P=M.draft,R=M.input,U.next=3,i(1e3);case 3:P.a+=R[0];case 4:case"end":return U.stop()}},y)}));function D(y){return E.apply(this,arguments)}return D}(),immediate:!0,desc:"changeA"}),h=function(){m.setDraft(function(D){return D.b.b1+=1})},x.abrupt("return",{default:function(){var D=d(u),y=b()(D,2),M=y[0],P=y[1],R=r(u),L=b()(R,1),U=L[0];return o.createElement("div",null,U.changeA.ok&&o.createElement("h1",null,M.a),U.changeA.loading&&o.createElement("h1",null,"loading..."),U.changeA.err&&o.createElement("h1",null,U.changeA.err.message),o.createElement("button",{onClick:h},"changeB1"))}});case 11:case"end":return x.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-mutate-loading-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { share, useAtom, useMutateLoading } from 'helux';

const [dictAtom, , ctx] = share({ a: 1, b: { b1: 1 } }, { moduleName: 'uml' });
const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const witness = ctx.mutate({
  deps: () => [dictAtom.b.b1],
  task: async ({ draft, input }) => {
    await delay(1000);
    draft.a += input[0];
  },
  immediate: true,
  desc: 'changeA',
});
const changeB1 = () => {
  ctx.setDraft((draft) => (draft.b.b1 += 1));
};

export default function () {
  // \u6216\u5199\u4E3A
  // const [ dict, setDict ] = ctx.useState();
  const [dict, setDict] = useAtom(dictAtom);

  // or: ctx.useMutateLoading();
  const [ld] = useMutateLoading(dictAtom);

  return (
    <div>
      {ld.changeA.ok && <h1>{dict.a}</h1>}
      {ld.changeA.loading && <h1>loading...</h1>}
      {ld.changeA.err && <h1>{ld.changeA.err.message}</h1>}
      <button onClick={changeB1}>changeB1</button>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},21049:function(f,n,e){var p;e.r(n),e.d(n,{demos:function(){return g}});var a=e(28633),I=e.n(a),b=e(29008),T=e.n(b),A=e(70958),o=e.n(A),C=e(94159),O=e(76989),B=e(95152),g={"docs-api-hooks-use-on-event-demo-0":{component:C.memo(C.lazy(o()(T()().mark(function c(){var l,d,r,s,t;return T()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return t=function(){return r("someEv",function(){for(var _=arguments.length,h=new Array(_),v=0;v<_;v++)h[v]=arguments[v];alert("receive ".concat(h.join(",")))}),C.createElement("h1",null,"useOnEvent")},m.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return l=m.sent,d=l.emit,r=l.useOnEvent,s=function(){return d("someEv",1,2)},m.abrupt("return",{default:function(){return C.createElement(C.Fragment,null,C.createElement(t,null),C.createElement("button",{onClick:s},"emitEvent"))}});case 8:case"end":return m.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-on-event-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { emit, useOnEvent } from 'helux';

const emitEvent = () => emit('someEv', 1, 2);

function Demo() {
  useOnEvent('someEv', (...args) => {
    alert(\`receive \${args.join(',')}\`);
  });
  return <h1>useOnEvent</h1>;
}

export default () => (
  <>
    <Demo />
    <button onClick={emitEvent}>emitEvent</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:B},renderOpts:{compile:function(){var c=o()(T()().mark(function d(){var r,s=arguments;return T()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-api-hooks-use-on-event-demo-1":{component:C.memo(C.lazy(o()(T()().mark(function c(){var l,d,r,s,t,u,m;return T()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return m=function(){var v=t.useState(1),x=I()(v,2),E=x[0],D=x[1],y=function(){return D(function(P){return P+1})};return r("someEv2",function(){for(var M=arguments.length,P=new Array(M),R=0;R<M;R++)P[R]=arguments[R];alert("receive ".concat(P.join(","),", num is ").concat(E))}),t.createElement("h1",null,t.createElement("button",{onClick:y},"change ",E))},_.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return l=_.sent,d=l.emit,r=l.useOnEvent,_.next=8,Promise.resolve().then(e.t.bind(e,94159,19));case 8:return s=_.sent,t=s.default,u=function(){return d("someEv2",1,2)},_.abrupt("return",{default:function(){return t.createElement(t.Fragment,null,t.createElement(m,null),t.createElement("button",{onClick:u},"emitEvent"))}});case 12:case"end":return _.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-on-event-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { emit, useOnEvent } from 'helux';
import React from 'react';

const emitEvent = () => emit('someEv2', 1, 2);

function Demo() {
  const [num, setNum] = React.useState(1);
  const change = () => setNum((prev) => prev + 1);
  useOnEvent('someEv2', (...args) => {
    alert(\`receive \${args.join(',')}, num is \${num}\`);
  });
  return (
    <h1>
      <button onClick={change}>change {num}</button>
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <button onClick={emitEvent}>emitEvent</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"},react:{type:"NPM",value:"18.0.0"}},entry:"index.tsx"},context:{helux:B,react:p||(p=e.t(C,2))},renderOpts:{compile:function(){var c=o()(T()().mark(function d(){var r,s=arguments;return T()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},92554:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(23630),I={}},84538:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(42060),O=e(95152),B={"docs-api-hooks-use-reactive-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i;return a()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return i=function(){var x=u.useReactive(),E=b()(x,2),D=E[0],y=E[1],M=function(){y.val+=1};return o.createElement("h1",{onClick:M},D)},m=function(){var x=d(t),E=b()(x,2),D=E[0],y=E[1],M=function(){y.val+=1};return o.createElement("h1",{onClick:M},D)},h.next=4,Promise.resolve().then(e.bind(e,95152));case 4:return c=h.sent,l=c.atom,d=c.useReactive,r=l(1),s=b()(r,3),t=s[0],u=s[2],h.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(m,null),o.createElement(i,null),o.createElement("button",{onClick:function(){return u.setState(function(E){return E+1})}},"change"))}});case 9:case"end":return h.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-reactive-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useReactive } from 'helux';

const [numAtom, , ctx] = atom(1);

function Demo() {
  const [state, stateRoot] = useReactive(numAtom);
  const change = () => {
    stateRoot.val += 1;
  };
  return <h1 onClick={change}>{state}</h1>;
}

function Demo2() {
  const [state, stateRoot] = ctx.useReactive();
  const change = () => {
    stateRoot.val += 1;
  };
  return <h1 onClick={change}>{state}</h1>;
}

export default () => (
  <>
    <Demo />
    <Demo2 />
    <button onClick={() => ctx.setState((prev) => prev + 1)}>change</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-hooks-use-reactive-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u;return a()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return u=function(){var h=r.useReactive(),v=b()(h,1),x=v[0];return o.createElement("h1",{onClick:s},x)},t=function(){var h=d(r.reactiveRoot),v=b()(h,1),x=v[0];return o.createElement("h1",{onClick:s},x)},i.next=4,Promise.resolve().then(e.bind(e,95152));case 4:return c=i.sent,l=c.atomx,d=c.useReactive,r=l(1),s=function(){r.reactiveRoot.val+=1},i.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(t,null),o.createElement(u,null),o.createElement("button",{onClick:s},"change"))}});case 10:case"end":return i.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-reactive-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atomx, useReactive } from 'helux';

const ctx = atomx(1);
const change = () => {
  ctx.reactiveRoot.val += 1;
};

function Demo() {
  const [state] = useReactive(ctx.reactiveRoot);
  return <h1 onClick={change}>{state}</h1>;
}

function Demo2() {
  const [state] = ctx.useReactive();
  return <h1 onClick={change}>{state}</h1>;
}

export default () => (
  <>
    <Demo />
    <Demo2 />
    <button onClick={change}>change</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-api-hooks-use-reactive-demo-2":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u;return a()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return u=function(){return o.createElement("h1",{onClick:t},l(s))},i.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=i.sent,l=c.$,d=c.atomx,r=d(1),s=r.reactiveRoot,t=function(){s.val+=1},i.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(u,null),o.createElement(u,null),o.createElement("button",{onClick:t},"change"))}});case 9:case"end":return i.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-reactive-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, atomx } from 'helux';

const { reactiveRoot } = atomx(1);
const change = () => {
  reactiveRoot.val += 1;
};

function Demo() {
  // \u6B64\u5904 signal \u4F1A\u81EA\u52A8\u62C6\u7BB1 atom
  return <h1 onClick={change}>{$(reactiveRoot)}</h1>;
}

export default () => (
  <>
    <Demo />
    <Demo />
    <button onClick={change}>change</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},17454:function(f,n,e){var p;e.r(n),e.d(n,{demos:function(){return g}});var a=e(29008),I=e.n(a),b=e(28633),T=e.n(b),A=e(70958),o=e.n(A),C=e(94159),O=e(1906),B=e(95152),g={"docs-api-hooks-use-service-demo-0":{component:C.memo(C.lazy(o()(I()().mark(function c(){var l,d,r,s,t;return I()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return l=m.sent,d=l.useService,m.next=6,Promise.resolve().then(e.t.bind(e,94159,19));case 6:return r=m.sent,s=r.default,t=s.memo(function(i){return s.createElement("h3",null,s.createElement("span",null,"update at ",Date.now()),s.createElement("button",{onClick:i.change},"call change"))}),m.abrupt("return",{default:function(){var _=s.useState(1),h=T()(_,2),v=h[0],x=h[1],E=d({change:function(){return x(function(y){return y+1})},seeNum:function(){return alert(v)}});return s.createElement("h1",null,s.createElement("span",null,"num ",v),s.createElement("button",{onClick:E.seeNum},"seeNum"),s.createElement(t,{change:E.change}))}});case 10:case"end":return m.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-service-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { useService } from 'helux';
import React from 'react';

const Child = React.memo((props) => {
  return (
    <h3>
      <span>update at {Date.now()}</span>
      <button onClick={props.change}>call change</button>
    </h3>
  );
});

export default function Father() {
  const [num, setNum] = React.useState(1);
  const srv = useService({
    change: () => setNum((prev) => prev + 1),
    seeNum: () => alert(num),
  });
  return (
    <h1>
      <span>num {num}</span>
      <button onClick={srv.seeNum}>seeNum</button>
      <Child change={srv.change} />
    </h1>
  );
}`},helux:{type:"NPM",value:"5.5.0"},react:{type:"NPM",value:"18.0.0"}},entry:"index.tsx"},context:{helux:B,react:p||(p=e.t(C,2))},renderOpts:{compile:function(){var c=o()(I()().mark(function d(){var r,s=arguments;return I()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-api-hooks-use-service-demo-1":{component:C.memo(C.lazy(o()(I()().mark(function c(){var l,d,r,s,t;return I()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return l=m.sent,d=l.useService,m.next=6,Promise.resolve().then(e.t.bind(e,94159,19));case 6:return r=m.sent,s=r.default,t=s.memo(function(i){return s.createElement("h3",null,s.createElement("span",null,"update at ",Date.now()),s.createElement("button",{onClick:i.change},"call change"))}),m.abrupt("return",{default:function(){var _=s.useState(1),h=T()(_,2),v=h[0],x=h[1],E=d(function(){return x(function(D){return D+1})});return s.createElement("h1",null,s.createElement("span",null,"num ",v),s.createElement(t,{change:E}))}});case 10:case"end":return m.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-service-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { useService } from 'helux';
import React from 'react';

const Child = React.memo((props) => {
  return (
    <h3>
      <span>update at {Date.now()}</span>
      <button onClick={props.change}>call change</button>
    </h3>
  );
});

export default function Father() {
  const [num, setNum] = React.useState(1);
  const change = useService(() => setNum((prev) => prev + 1));
  return (
    <h1>
      <span>num {num}</span>
      <Child change={change} />
    </h1>
  );
}`},helux:{type:"NPM",value:"5.5.0"},react:{type:"NPM",value:"18.0.0"}},entry:"index.tsx"},context:{helux:B,react:p||(p=e.t(C,2))},renderOpts:{compile:function(){var c=o()(I()().mark(function d(){var r,s=arguments;return I()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-api-hooks-use-service-demo-2":{component:C.memo(C.lazy(o()(I()().mark(function c(){var l,d,r,s,t,u,m,i,_;return I()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return i=function(E){var D=t.useState(1),y=T()(D,2),M=y[0],P=y[1],R=r({change:function(){return P(function(U){return U+1})},seeNum:function(){return alert(M)}},E);return t.createElement("div",{style:{border:"1px solid purple",padding:"12px"}},"num ",M)},m=function(E){return t.createElement("div",{style:{border:"1px solid red",padding:"12px"}},"Father comp:",t.createElement(i,{a:1,srvRef:E.srvRef}))},u=function(E){var D=t.useRef(null);return t.createElement("div",{style:{border:"1px solid blue",padding:"12px"}},t.createElement("h3",null,"GrandFather"),t.createElement("button",{onClick:function(){var M;(M=D.current)===null||M===void 0||M.change()}},"call child change"),t.createElement(m,{a:1,srvRef:d(D)}))},v.next=5,Promise.resolve().then(e.bind(e,95152));case 5:return l=v.sent,d=l.storeSrv,r=l.useService,v.next=10,Promise.resolve().then(e.t.bind(e,94159,19));case 10:return s=v.sent,t=s.default,_=function(){return t.createElement(u,null)},v.abrupt("return",{default:_});case 14:case"end":return v.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-service-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { storeSrv, useService } from 'helux';
import React from 'react';

function GrandFather(props: any) {
  const srvRef = React.useRef<any>(null);

  return (
    <div style={{ border: '1px solid blue', padding: '12px' }}>
      <h3>GrandFather</h3>
      <button
        onClick={() => {
          srvRef.current?.change();
        }}
      >
        call child change
      </button>
      <Father a={1} srvRef={storeSrv(srvRef)} />
    </div>
  );
}

function Father(props: any) {
  return (
    <div style={{ border: '1px solid red', padding: '12px' }}>
      Father comp:
      <Comp a={1} srvRef={props.srvRef} />
    </div>
  );
}

function Comp(props) {
  const [num, setNum] = React.useState(1);
  const srv = useService(
    {
      change: () => setNum((prev) => prev + 1),
      seeNum: () => alert(num),
    },
    props,
  );
  return (
    <div style={{ border: '1px solid purple', padding: '12px' }}>num {num}</div>
  );
}

const Demo = () => <GrandFather />;

export default Demo;`},helux:{type:"NPM",value:"5.5.0"},react:{type:"NPM",value:"18.0.0"}},entry:"index.tsx"},context:{helux:B,react:p||(p=e.t(C,2))},renderOpts:{compile:function(){var c=o()(I()().mark(function d(){var r,s=arguments;return I()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},43903:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(50522),O=e(95152),B={"docs-api-hooks-use-watch-effect-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m,i,_,h;return a()().wrap(function(x){for(;;)switch(x.prev=x.next){case 0:return h=function(){i(function(D){D.a+=1})},x.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=x.sent,l=c.share,d=c.useMutable,r=c.useWatchEffect,s=c.getSnap,t=l({a:1,b:{b1:{b2:200}}}),u=b()(t,3),m=u[0],i=u[1],_=u[2],x.abrupt("return",{default:function(D){var y=d({tip:"1"}),M=b()(y,2),P=M[0],R=M[1];return r(function(){R(function(L){L.tip="priceState.a changed from ".concat(s(m).a," to ").concat(m.a)})}),o.createElement("div",null,o.createElement("button",{onClick:h},"changeA"),o.createElement("h1",null,"tip: ",P.tip))}});case 10:case"end":return x.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-watch-effect-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { share, useMutable, useWatchEffect, getSnap } from 'helux';

const [priceState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 } } });

function changeA() {
  setState((draft) => {
    draft.a += 1;
  });
}

export default function Comp(props: any) {
  const [ state, setState] = useMutable({tip:'1'})
  useWatchEffect(() => {
    setState(draft=>{
      draft.tip = \`priceState.a changed from \${getSnap(priceState).a} to \${priceState.a}\`;
    });
  });

  return (
    <div>
      <button onClick={changeA}>changeA</button>
      <h1>tip: {state.tip}</h1>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},96624:function(f,n,e){var p;e.r(n),e.d(n,{demos:function(){return g}});var a=e(28633),I=e.n(a),b=e(29008),T=e.n(b),A=e(70958),o=e.n(A),C=e(94159),O=e(69387),B=e(95152),g={"docs-api-hooks-use-watch-demo-0":{component:C.memo(C.lazy(o()(T()().mark(function c(){var l,d,r,s,t,u,m,i,_;return T()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return _=function(){return r(function(){alert("change from ".concat(m().val," to ").concat(t.val))},function(){return[t]}),C.createElement("h1",null,C.createElement("pre",null,"watch state"))},v.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return l=v.sent,d=l.atomx,r=l.useWatch,s=d(1),t=s.state,u=s.reactiveRoot,m=s.getSnap,i=function(){u.val+=1},v.abrupt("return",{default:function(){return C.createElement(C.Fragment,null,C.createElement(_,null),C.createElement("button",{onClick:i},"change"))}});case 9:case"end":return v.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-watch-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atomx, useWatch } from 'helux';

const { state, reactiveRoot, getSnap } = atomx(1);
const change = () => {
  reactiveRoot.val += 1;
};

function Demo() {
  useWatch(
    () => {
      alert(\`change from \${getSnap().val} to \${state.val}\`);
    },
    () => [state],
  );
  return (
    <h1>
      <pre>watch state</pre>
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <button onClick={change}>change</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:B},renderOpts:{compile:function(){var c=o()(T()().mark(function d(){var r,s=arguments;return T()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-api-hooks-use-watch-demo-1":{component:C.memo(C.lazy(o()(T()().mark(function c(){var l,d,r,s,t,u,m,i;return T()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return i=function(){return r(function(){alert("change from ".concat(JSON.stringify(u().val)," to ").concat(JSON.stringify(t)))},function(){return[t]}),C.createElement("h1",null,C.createElement("pre",null,"watch reactive"))},h.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return l=h.sent,d=l.atomx,r=l.useWatch,s=d({a:1,b:2}),t=s.reactive,u=s.getSnap,m=function(){t.a+=10},h.abrupt("return",{default:function(){return C.createElement(C.Fragment,null,C.createElement(i,null),C.createElement("button",{onClick:m},"change"))}});case 9:case"end":return h.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-watch-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atomx, useWatch } from 'helux';

const { reactive, getSnap } = atomx({ a: 1, b: 2 });
const change = () => {
  reactive.a += 10;
};

function Demo() {
  useWatch(
    () => {
      alert(
        \`change from \${JSON.stringify(getSnap().val)} to \${JSON.stringify(
          reactive,
        )}\`,
      );
    },
    () => [reactive],
  );
  return (
    <h1>
      <pre>watch reactive</pre>
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <button onClick={change}>change</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:B},renderOpts:{compile:function(){var c=o()(T()().mark(function d(){var r,s=arguments;return T()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-api-hooks-use-watch-demo-2":{component:C.memo(C.lazy(o()(T()().mark(function c(){var l,d,r,s,t,u,m,i,_;return T()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return _=function(){return r(function(){alert("change from ".concat(JSON.stringify(u().val)," to ").concat(JSON.stringify(t)))},function(){return[t.a]}),C.createElement("h1",null,C.createElement("pre",null,"watch reactive.a"))},v.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return l=v.sent,d=l.atomx,r=l.useWatch,s=d({a:1,b:2}),t=s.reactive,u=s.getSnap,m=function(){t.a+=10},i=function(){t.b+=10},v.abrupt("return",{default:function(){return C.createElement(C.Fragment,null,C.createElement(_,null),C.createElement("button",{onClick:m},"changeA"),C.createElement("button",{onClick:i},"changeB"))}});case 10:case"end":return v.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-watch-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atomx, useWatch } from 'helux';

const { reactive, getSnap } = atomx({ a: 1, b: 2 });
const changeA = () => {
  reactive.a += 10;
};
const changeB = () => {
  reactive.b += 10;
};

function Demo() {
  useWatch(
    () => {
      alert(
        \`change from \${JSON.stringify(getSnap().val)} to \${JSON.stringify(
          reactive,
        )}\`,
      );
    },
    () => [reactive.a],
  );
  return (
    <h1>
      <pre>watch reactive.a</pre>
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <button onClick={changeA}>changeA</button>
    <button onClick={changeB}>changeB</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:B},renderOpts:{compile:function(){var c=o()(T()().mark(function d(){var r,s=arguments;return T()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-api-hooks-use-watch-demo-3":{component:C.memo(C.lazy(o()(T()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v;return T()().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:return v=function(){var y=t.useState(1),M=I()(y,2),P=M[0],R=M[1],L=function(){return R(function($){return $+1})};return r(function(){alert("change from ".concat(_().val," to ").concat(m.val,", num is ").concat(P))},function(){return[m]}),t.createElement("h1",null,t.createElement("button",{onClick:L},"changeNum ",P))},E.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return l=E.sent,d=l.atomx,r=l.useWatch,E.next=8,Promise.resolve().then(e.t.bind(e,94159,19));case 8:return s=E.sent,t=s.default,u=d(1),m=u.state,i=u.reactiveRoot,_=u.getSnap,h=function(){i.val+=1},E.abrupt("return",{default:function(){return t.createElement(t.Fragment,null,t.createElement(v,null),t.createElement("button",{onClick:h},"change"))}});case 13:case"end":return E.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-hooks-use-watch-demo-3",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atomx, useWatch } from 'helux';
import React from 'react';

const { state, reactiveRoot, getSnap } = atomx(1);
const change = () => {
  reactiveRoot.val += 1;
};

function Demo() {
  const [num, setNum] = React.useState(1);
  const changeNum = () => setNum((prev) => prev + 1);
  useWatch(
    () => {
      alert(\`change from \${getSnap().val} to \${state.val}, num is \${num}\`);
    },
    () => [state],
  );
  return (
    <h1>
      <button onClick={changeNum}>changeNum {num}</button>
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <button onClick={change}>change</button>
  </>
);`},helux:{type:"NPM",value:"5.5.0"},react:{type:"NPM",value:"18.0.0"}},entry:"index.tsx"},context:{helux:B,react:p||(p=e.t(C,2))},renderOpts:{compile:function(){var c=o()(T()().mark(function d(){var r,s=arguments;return T()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},20145:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(5059),I={}},64312:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(11196),I={}},76066:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(13458),I={}},78261:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(16989),I={}},3174:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(11179),I={}},57782:function(f,n,e){e.r(n),e.d(n,{demos:function(){return C}});var p=e(29008),a=e.n(p),I=e(70958),b=e.n(I),T=e(94159),A=e(46392),o=e(95152),C={"docs-api-utils-flush-demo-0":{component:T.memo(T.lazy(b()(a()().mark(function O(){var B,g,c,l,d,r,s,t;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return t=function(){return t=b()(a()().mark(function _(){return a()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:r.a+=100,l(r,"changeA"),r.a+=100,l(r,"changeA");case 4:case"end":return v.stop()}},_)})),t.apply(this,arguments)},s=function(){return t.apply(this,arguments)},m.next=4,Promise.resolve().then(e.bind(e,95152));case 4:return B=m.sent,g=B.$,c=B.atomx,l=B.flush,d=c({a:1,b:2}),r=d.reactive,m.abrupt("return",{default:function(){return T.createElement("div",null,T.createElement("h3",null,"update at ",Date.now()),g(r.a),T.createElement("div",null,T.createElement("button",{onClick:s},"changeA")))}});case 11:case"end":return m.stop()}},O)})))),asset:{type:"BLOCK",id:"docs-api-utils-flush-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, atomx, flush } from 'helux';

const ctx = atomx({ a: 1, b: 2 });
const { reactive } = ctx;

async function changeA() {
  reactive.a += 100;
  // or ctx.flush('changeA');
  flush(reactive, 'changeA');
  reactive.a += 100;
  flush(reactive, 'changeA');
}

export default function Demo() {
  return (
    <div>
      <h3>update at {Date.now()}</h3>
      {$(reactive.a)}
      <div>
        <button onClick={changeA}>changeA</button>
      </div>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:o},renderOpts:{compile:function(){var O=b()(a()().mark(function g(){var c,l=arguments;return a()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,e.e(2357).then(e.bind(e,82357));case 2:return r.abrupt("return",(c=r.sent).default.apply(c,l));case 3:case"end":return r.stop()}},g)}));function B(){return O.apply(this,arguments)}return B}()}},"docs-api-utils-flush-demo-1":{component:T.memo(T.lazy(b()(a()().mark(function O(){var B,g,c,l,d,r,s;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return B=u.sent,g=B.$,c=B.atomx,l=B.flush,d=c({a:1,b:2}),r=d.reactive,s=d.defineActions()({changeA:function(){var m=b()(a()().mark(function _(h){var v;return a()().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:v=h.draft,v.a+=100,l(v,"changeA"),v.a+=100,l(v,"changeA");case 5:case"end":return E.stop()}},_)}));function i(_){return m.apply(this,arguments)}return i}()}),u.abrupt("return",{default:function(){return T.createElement("div",null,T.createElement("h3",null,"update at ",Date.now()),g(r.a),T.createElement("div",null,T.createElement("button",{onClick:s.actions.changeA},"changeA")))}});case 10:case"end":return u.stop()}},O)})))),asset:{type:"BLOCK",id:"docs-api-utils-flush-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, atomx, flush } from 'helux';

const ctx = atomx({ a: 1, b: 2 });
const { reactive } = ctx;

const ac = ctx.defineActions()({
  changeA: async function ({ draft }) {
    draft.a += 100;
    // or ctx.flush('changeA');
    flush(draft, 'changeA');
    draft.a += 100;
    flush(draft, 'changeA');
  },
});

export default function Demo() {
  return (
    <div>
      <h3>update at {Date.now()}</h3>
      {$(reactive.a)}
      <div>
        <button onClick={ac.actions.changeA}>changeA</button>
      </div>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:o},renderOpts:{compile:function(){var O=b()(a()().mark(function g(){var c,l=arguments;return a()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,e.e(2357).then(e.bind(e,82357));case 2:return r.abrupt("return",(c=r.sent).default.apply(c,l));case 3:case"end":return r.stop()}},g)}));function B(){return O.apply(this,arguments)}return B}()}}}},43248:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(66647),I={}},94708:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(39540),I={}},28676:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(30293),I={}},57040:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(33849),I={}},25729:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(39518),I={}},90311:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(79515),I={}},75763:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(3823),I={}},70120:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(7036),I={}},4983:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(52921),I={}},89706:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(80892),I={}},58770:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(56007),I={}},32010:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(71044),I={}},52288:function(f,n,e){e.r(n),e.d(n,{demos:function(){return g}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(14632),O=e(13517),B=e(95152),g={"docs-api-utils-shallow-compare-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x;return a()().wrap(function(D){for(;;)switch(D.prev=D.next){case 0:return v=function(M){h(function(P){P[M].name=Date.now()})},D.next=3,Promise.resolve().then(e.bind(e,13517));case 3:return l=D.sent,d=l.MarkUpdate,D.next=7,Promise.resolve().then(e.bind(e,95152));case 7:return r=D.sent,s=r.atom,t=r.shallowCompare,u=r.useAtom,m=s([{id:1,name:11},{id:2,name:22}]),i=b()(m,2),_=i[0],h=i[1],x=o.memo(function(y){var M=y.item;return o.createElement(d,null,"id: ",M.id," name: ",M.name)},t),D.abrupt("return",{default:function(){var M=u(_),P=b()(M,1),R=P[0];return o.createElement("div",null,o.createElement("button",{onClick:function(){return v(1)}},"change idx 1"),o.createElement("div",null,R.map(function(L){return o.createElement(x,{key:L.id,item:L})})))}});case 14:case"end":return D.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-api-utils-shallow-compare-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { MarkUpdate } from '@helux/demo-utils';
import { atom, shallowCompare, useAtom } from 'helux';

const [listAtom, setAtom] = atom([
  { id: 1, name: 11 },
  { id: 2, name: 22 },
]);

function change(idx: number) {
  // \u5F53\u524D\u4FEE\u6539\u4EC5\u4F1A\u5F15\u8D77 List \u548C Item1 \u91CD\u6E32\u67D3
  setAtom((draft) => {
    draft[idx].name = Date.now();
  });
}

const Item = React.memo((props) => {
  const { item } = props;
  return (
    <MarkUpdate>
      id: {item.id} name: {item.name}
    </MarkUpdate>
  );
  // \u900F\u4F20 shallowCompare \u51FD\u6570\uFF0C\u7528\u4E8E\u6BD4\u8F83item\u4EE3\u7406\u5BF9\u8C61\u524D\u540E\u662F\u5426\u4E00\u81F4\uFF0C\u5185\u90E8\u4F1A\u6BD4\u8F83\u6570\u636E\u7248\u672C\u53F7
}, shallowCompare);

export default function List() {
  const [list] = useAtom(listAtom);
  return (
    <div>
      <button onClick={() => change(1)}>change idx 1</button>
      <div>
        {list.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":O,helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},10689:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(26335),I={}},41257:function(f,n,e){e.r(n),e.d(n,{demos:function(){return g}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(10721),O=e(13517),B=e(95152),g={"docs-guide-action-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_;return a()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return _=function(){var E=u(),D=b()(E,1),y=D[0];return o.createElement("h1",null,y.a)},v.next=3,Promise.resolve().then(e.bind(e,13517));case 3:return l=v.sent,d=l.Entry,v.next=7,Promise.resolve().then(e.bind(e,95152));case 7:return r=v.sent,s=r.sharex,t=s({a:1,b:{b1:1},c:!0,desc:""}),u=t.useState,m=t.action,i=m()(function(x){var E=x.draft,D=x.payload;E.a+=100},"hiAction"),v.abrupt("return",{default:function(){return o.createElement(d,{fns:{hiAction:i}},o.createElement(_,null),o.createElement(_,null))}});case 12:case"end":return v.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-action-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry } from '@helux/demo-utils';
import { sharex } from 'helux';

const { useState, action } = sharex({ a: 1, b: { b1: 1 }, c: true, desc: '' });

const hiAction = action<[number, string]>()(({ draft, payload }) => {
  draft.a += 100;
}, 'hiAction');

function Demo1() {
  const [state] = useState();
  return <h1>{state.a}</h1>;
}

export default () => (
  <Entry fns={{ hiAction }}>
    <Demo1 />
    <Demo1 />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":O,helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-action-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v;return a()().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:return v=function(){var y=m(),M=b()(y,1),P=M[0],R=_(),L=b()(R,1),U=L[0].hiAsyncAction;return U.loading?o.createElement("h1",null,"loading..."):U.ok?o.createElement("h1",null,P.a):o.createElement("h1",{style:{color:"red"}},U.err.message)},E.next=3,Promise.resolve().then(e.bind(e,13517));case 3:return l=E.sent,d=l.Entry,r=l.demoUtils,E.next=8,Promise.resolve().then(e.bind(e,95152));case 8:return s=E.sent,t=s.sharex,u=t({a:1,b:{b1:1},c:!0,desc:""}),m=u.useState,i=u.action,_=u.useActionLoading,h=i()(function(){var D=A()(a()().mark(function y(M){var P,R;return a()().wrap(function(U){for(;;)switch(U.prev=U.next){case 0:return P=M.draft,R=M.payload,P.a+=100,U.next=4,r.delay();case 4:if(P.a+=100,!(P.a>300)){U.next=7;break}throw new Error("300!");case 7:return U.abrupt("return",!0);case 8:case"end":return U.stop()}},y)}));return function(y){return D.apply(this,arguments)}}(),"hiAsyncAction"),E.abrupt("return",{default:function(){return o.createElement(d,{fns:{hiAsyncAction:h}},o.createElement(v,null),o.createElement(v,null))}});case 13:case"end":return E.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-action-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry, demoUtils } from '@helux/demo-utils';
import { sharex } from 'helux';

const { useState, action, useActionLoading } = sharex({
  a: 1,
  b: { b1: 1 },
  c: true,
  desc: '',
});

const hiAsyncAction = action<[number, string]>()(async ({ draft, payload }) => {
  draft.a += 100;
  await demoUtils.delay(); // \u8FDB\u5165\u4E0B\u4E00\u6B21\u4E8B\u4EF6\u5FAA\u73AF\u5FAE\u4EFB\u52A1\u6267\u884C\u524D\uFF0C\u89E6\u53D1\u63D0\u4EA4 draft \u53D8\u66F4\u6570\u636E
  draft.a += 100;

  if (draft.a > 300) {
    // \u629B\u51FA\u9519\u8BEF\u8BA9 useActionLoading \u5904\u7406
    throw new Error('300!');
  }
  return true;
}, 'hiAsyncAction');

function Demo1() {
  const [state] = useState();
  const [{ hiAsyncAction: ld }] = useActionLoading(); // \u83B7\u5F97 hiAsyncAction \u7684\u6267\u884C\u72B6\u6001

  if (ld.loading) {
    return <h1>loading...</h1>;
  }

  if (!ld.ok) {
    return <h1 style={{ color: 'red' }}>{ld.err.message}</h1>;
  }

  return <h1>{state.a}</h1>;
}

export default () => (
  <Entry fns={{ hiAsyncAction }}>
    <Demo1 />
    <Demo1 />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":O,helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},94014:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(55289),I={}},69948:function(f,n,e){e.r(n),e.d(n,{demos:function(){return g}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(78373),O=e(95152),B=e(13517),g={"docs-guide-atom-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u;return a()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return l=i.sent,d=l.atom,r=l.useAtom,s=d(1),t=b()(s,1),u=t[0],i.abrupt("return",{default:function(){var h=r(u),v=b()(h,2),x=v[0],E=v[1];return o.createElement("h1",{onClick:function(){return E(Math.random())}},x)}});case 7:case"end":return i.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-atom-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useAtom } from 'helux';
const [numAtom] = atom(1);

export default function Demo() {
  const [num, setAtom] = useAtom(numAtom); // \u8FD4\u56DE\u7ED3\u679C\u81EA\u52A8\u62C6\u7BB1
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx",title:"\u70B9\u51FB\u6570\u5B57\u89E6\u53D1\u4FEE\u6539"},context:{helux:O},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-atom-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m;return a()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return l=_.sent,d=l.atom,r=l.useAtom,s=d(1),t=b()(s,2),u=t[0],m=t[1],_.abrupt("return",{default:function(){var v=r(u),x=b()(v,1),E=x[0];return o.createElement("h1",{onClick:function(){return m(Math.random())}},E)}});case 7:case"end":return _.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-atom-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useAtom } from 'helux';
const [numAtom, setAtom] = atom(1);

export default function Demo() {
  const [num] = useAtom(numAtom);
  // \u8C03\u7528\u5916\u90E8\u7684 set \u53E5\u67C4
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx",title:"\u70B9\u51FB\u6570\u5B57\u89E6\u53D1\u4FEE\u6539"},context:{helux:O},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-atom-demo-2":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return s=function(){var i=r.useState(),_=b()(i,1),h=_[0],v=function(){return r.setState(Math.random())};return o.createElement("h1",null,o.createElement("button",{onClick:v},"click me"),h)},u.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return l=u.sent,d=l.atomx,r=d(1),u.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(s,null),o.createElement(s,null))}});case 7:case"end":return u.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-atom-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atomx } from 'helux';
const ctx = atomx(1);

function Demo() {
  const [num] = ctx.useState();
  const change = () => ctx.setState(Math.random());
  return (
    <h1>
      <button onClick={change}>click me</button>
      {num}
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <Demo />
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx",title:"\u70B9\u51FBclick me \u6309\u94AE\u89E6\u53D1\u4FEE\u6539"},context:{helux:O},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-atom-demo-3":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x,E;return a()().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:return E=function(){var P=u(_),R=b()(P,3),L=R[0],U=R[1],$=R[2],j=function(){return U(function(F){return void(F.info.born="".concat(Date.now()))})};return o.createElement(r,{info:$},o.createElement("h1",null,"hello helux age ",L.info.age),o.createElement("button",{onClick:j},"changeBornInner"))},x=function(){var P=u(_),R=b()(P,3),L=R[0],U=R[1],$=R[2],j=function(){return U(function(F){return void(F.info.born="".concat(Date.now()))})};return o.createElement(r,{info:$},o.createElement("h1",null,"hello helux ",L.info.born),o.createElement("button",{onClick:j},"changeBornInner"))},v=function(){h(function(P){return void(P.info.born="".concat(Date.now()))})},y.next=5,Promise.resolve().then(e.bind(e,13517));case 5:return l=y.sent,d=l.Entry,r=l.MarkUpdate,y.next=10,Promise.resolve().then(e.bind(e,95152));case 10:return s=y.sent,t=s.share,u=s.useAtom,m=t({a:1,b:2,info:{born:"2023-12-31",age:2}}),i=b()(m,2),_=i[0],h=i[1],y.abrupt("return",{default:function(){return o.createElement(d,{fns:{changeBornOut:v}},o.createElement(x,null),o.createElement(E,null))}});case 15:case"end":return y.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-atom-demo-3",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry, MarkUpdate } from '@helux/demo-utils';
import { share, useAtom } from 'helux';

const [sharedState, setState] = share({
  a: 1,
  b: 2,
  info: { born: '2023-12-31', age: 2 },
});

function changeBornOut() {
  setState((draft) => void (draft.info.born = \`\${Date.now()}\`));
}

function HelloBorn() {
  const [state, setState, info] = useAtom(sharedState);
  const change = () =>
    setState((draft) => void (draft.info.born = \`\${Date.now()}\`));
  return (
    <MarkUpdate info={info}>
      <h1>hello helux {state.info.born}</h1>
      <button onClick={change}>changeBornInner</button>
    </MarkUpdate>
  );
}

function HelloAge() {
  const [state, setState, info] = useAtom(sharedState);
  const change = () =>
    setState((draft) => void (draft.info.born = \`\${Date.now()}\`));
  return (
    <MarkUpdate info={info}>
      <h1>hello helux age {state.info.age}</h1>
      <button onClick={change}>changeBornInner</button>
    </MarkUpdate>
  );
}

export default function Demo() {
  return (
    <Entry fns={{ changeBornOut }}>
      <HelloBorn />
      <HelloAge />
    </Entry>
  );
}`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx",title:"\u57FA\u4E8Edraft\u4FEE\u6539"},context:{"@helux/demo-utils":B,helux:O},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},30414:function(f,n,e){e.r(n),e.d(n,{demos:function(){return l}});var p=e(24325),a=e.n(p),I=e(29008),b=e.n(I),T=e(28633),A=e.n(T),o=e(70958),C=e.n(o),O=e(94159),B=e(86204),g=e(13517),c=e(95152),l={"docs-guide-dep-tracking-demo-0":{component:O.memo(O.lazy(C()(b()().mark(function d(){var r,s,t,u,m,i,_,h,v,x,E,D;return b()().wrap(function(M){for(;;)switch(M.prev=M.next){case 0:return D=function(){var R=v(),L=A()(R,3),U=L[0],$=L[2];return O.createElement(t,{info:$},U.b.b1)},E=function(){var R=v(),L=A()(R,3),U=L[0],$=L[2];return O.createElement(t,{info:$},U.a)},M.next=4,Promise.resolve().then(e.bind(e,13517));case 4:return r=M.sent,s=r.Entry,t=r.MarkUpdate,M.next=9,Promise.resolve().then(e.bind(e,95152));case 9:return u=M.sent,m=u.atomx,i=m({a:1,b:{b1:1}}),_=i.state,h=i.setDraft,v=i.useState,x=function(){return h(function(R){return R.a=Math.random()})},M.abrupt("return",{default:function(){return O.createElement(s,{fns:{changeObj:x}},O.createElement(E,null),O.createElement(E,null),O.createElement(D,null),O.createElement(D,null))}});case 14:case"end":return M.stop()}},d)})))),asset:{type:"BLOCK",id:"docs-guide-dep-tracking-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry, MarkUpdate } from '@helux/demo-utils';
import { atomx } from 'helux';

const { state, setDraft, useState } = atomx({ a: 1, b: { b1: 1 } });
const changeObj = () => setDraft((draft) => (draft.a = Math.random()));

function Demo1() {
  const [obj, , info] = useState();
  return <MarkUpdate info={info}>{obj.a}</MarkUpdate>;
}

function Demo2() {
  const [obj, , info] = useState();
  return <MarkUpdate info={info}>{obj.b.b1}</MarkUpdate>;
}

export default () => (
  <Entry fns={{ changeObj }}>
    <Demo1 />
    <Demo1 />
    <Demo2 />
    <Demo2 />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":g,helux:c},renderOpts:{compile:function(){var d=C()(b()().mark(function s(){var t,u=arguments;return b()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,e.e(2357).then(e.bind(e,82357));case 2:return i.abrupt("return",(t=i.sent).default.apply(t,u));case 3:case"end":return i.stop()}},s)}));function r(){return d.apply(this,arguments)}return r}()}},"docs-guide-dep-tracking-demo-1":{component:O.memo(O.lazy(C()(b()().mark(function d(){var r,s,t,u,m,i,_,h,v,x,E,D,y;return b()().wrap(function(P){for(;;)switch(P.prev=P.next){case 0:return y=function(){var L=v(),U=A()(L,3),$=U[0],j=U[2];return $.a>3?O.createElement(t,{info:j},$.a," - ",$.b.b1):O.createElement(t,{info:j},$.a)},P.next=3,Promise.resolve().then(e.bind(e,13517));case 3:return r=P.sent,s=r.Entry,t=r.MarkUpdate,P.next=8,Promise.resolve().then(e.bind(e,95152));case 8:return u=P.sent,m=u.atomx,i=m({a:1,b:{b1:1}}),_=i.state,h=i.setDraft,v=i.useState,x=function(){return h(function(L){return L.a+=1})},E=function(){return h(function(L){return L.a-=1})},D=function(){return h(function(L){return L.b.b1=Date.now()})},P.abrupt("return",{default:function(){return O.createElement(s,{fns:{plusA:x,minusA:E,changeB1:D}},O.createElement(y,null),O.createElement(y,null))}});case 15:case"end":return P.stop()}},d)})))),asset:{type:"BLOCK",id:"docs-guide-dep-tracking-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry, MarkUpdate } from '@helux/demo-utils';
import { atomx } from 'helux';

const { state, setDraft, useState } = atomx({ a: 1, b: { b1: 1 } });
const plusA = () => setDraft((draft) => (draft.a += 1));
const minusA = () => setDraft((draft) => (draft.a -= 1));
const changeB1 = () => setDraft((draft) => (draft.b.b1 = Date.now()));

function Demo1() {
  const [obj, , info] = useState();
  if (obj.a > 3) {
    return (
      <MarkUpdate info={info}>
        {obj.a} - {obj.b.b1}
      </MarkUpdate>
    );
  }

  return <MarkUpdate info={info}>{obj.a}</MarkUpdate>;
}

export default () => (
  <Entry fns={{ plusA, minusA, changeB1 }}>
    <Demo1 />
    <Demo1 />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":g,helux:c},renderOpts:{compile:function(){var d=C()(b()().mark(function s(){var t,u=arguments;return b()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,e.e(2357).then(e.bind(e,82357));case 2:return i.abrupt("return",(t=i.sent).default.apply(t,u));case 3:case"end":return i.stop()}},s)}));function r(){return d.apply(this,arguments)}return r}()}},"docs-guide-dep-tracking-demo-2":{component:O.memo(O.lazy(C()(b()().mark(function d(){var r,s,t,u,m,i,_,h,v,x,E,D,y;return b()().wrap(function(P){for(;;)switch(P.prev=P.next){case 0:return y=function(){var L=v(),U=A()(L,3),$=U[0],j=U[2];return O.createElement(t,{info:j},"obj.b.b1.ok ","".concat($.b.b1.ok))},P.next=3,Promise.resolve().then(e.bind(e,13517));case 3:return r=P.sent,s=r.Entry,t=r.MarkUpdate,P.next=8,Promise.resolve().then(e.bind(e,95152));case 8:return u=P.sent,m=u.atomx,i=m({a:1,b:{b1:{b2:1,ok:!0}}}),_=i.state,h=i.setDraft,v=i.useState,x=function(){return h(function(L){return L.b.b1=a()({},L.b.b1)})},E=function(){return h(function(L){return L.b.b1.ok=L.b.b1.ok})},D=function(){return h(function(L){return L.b.b1.ok=!L.b.b1.ok})},P.abrupt("return",{default:function(){return O.createElement(s,{fns:{changeB1:x,changeB1_Ok_oldValue:E,changeB1_Ok_newValue:D}},O.createElement(y,null),O.createElement(y,null))}});case 15:case"end":return P.stop()}},d)})))),asset:{type:"BLOCK",id:"docs-guide-dep-tracking-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry, MarkUpdate } from '@helux/demo-utils';
import { atomx } from 'helux';

const { state, setDraft, useState } = atomx({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});
const changeB1 = () => setDraft((draft) => (draft.b.b1 = { ...draft.b.b1 }));
const changeB1_Ok_oldValue = () =>
  setDraft((draft) => (draft.b.b1.ok = draft.b.b1.ok));
const changeB1_Ok_newValue = () =>
  setDraft((draft) => (draft.b.b1.ok = !draft.b.b1.ok));

function Demo1() {
  const [obj, , info] = useState();
  return <MarkUpdate info={info}>obj.b.b1.ok {\`\${obj.b.b1.ok}\`}</MarkUpdate>;
}

export default () => (
  <Entry fns={{ changeB1, changeB1_Ok_oldValue, changeB1_Ok_newValue }}>
    <Demo1 />
    <Demo1 />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":g,helux:c},renderOpts:{compile:function(){var d=C()(b()().mark(function s(){var t,u=arguments;return b()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,e.e(2357).then(e.bind(e,82357));case 2:return i.abrupt("return",(t=i.sent).default.apply(t,u));case 3:case"end":return i.stop()}},s)}));function r(){return d.apply(this,arguments)}return r}()}},"docs-guide-dep-tracking-demo-3":{component:O.memo(O.lazy(C()(b()().mark(function d(){var r,s,t,u,m,i,_,h,v,x;return b()().wrap(function(D){for(;;)switch(D.prev=D.next){case 0:return x=function(M){var P=O.useState(""),R=A()(P,2),L=R[0],U=R[1],$=function(){var N=v(),F=N.ret1,X=N.ret2;U("isDiff(b, newB)===".concat(F,", isDiff(c, newC)===").concat(X))};return O.createElement("div",null,O.createElement("h1",null,"compare tip: ",L),O.createElement("button",{onClick:$},"triggerCompre"))},v=function(){var M=_.b,P=_.c;h(function(j){return void(j.b.b1+=100)});var R=_.b,L=_.c,U=t(M,R),$=t(P,L);return{ret1:U,ret2:$}},D.next=4,Promise.resolve().then(e.bind(e,95152));case 4:return r=D.sent,s=r.$,t=r.isDiff,u=r.share,m=u({b:{b1:1},c:{c1:1}}),i=A()(m,2),_=i[0],h=i[1],D.abrupt("return",{default:function(){return O.createElement(O.Fragment,null,O.createElement(x,null),s(_.b.b1))}});case 10:case"end":return D.stop()}},d)})))),asset:{type:"BLOCK",id:"docs-guide-dep-tracking-demo-3",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, isDiff, share } from 'helux';

const [state, setState] = share({ b: { b1: 1 }, c: { c1: 1 } });

function testIsDiff() {
  const { b, c } = state;
  setState((draft) => void (draft.b.b1 += 100));
  const { b: newB, c: newC } = state;

  // \u{1F449} \u6B64\u65F6 b\uFF0Cc \u8282\u70B9\u662F\u4EE3\u7406\u5BF9\u8C61\uFF0C\u76F4\u63A5\u6BD4\u8F83\u7684\u8BDD\uFF0C\u5B83\u4EEC\u59CB\u7EC8\u662F\u4E0D\u76F8\u7B49\u7684\uFF0C
  // \u800C isDiff \u51FD\u6570\u5185\u90E8\u4F1A\u6BD4\u8F83\u6570\u636E\u7248\u672C\u53F7\u5E76\u7ED9\u51FA\u6B63\u786E\u7684\u7ED3\u679C
  const ret1 = isDiff(b, newB); // true
  const ret2 = isDiff(c, newC); // false\uFF0Cc \u8282\u70B9\u672A\u53D1\u751F\u8FC7\u53D8\u5316
  return { ret1, ret2 };
}

function Comp(props: any) {
  const [tip, setTip] = React.useState('');
  const triggerCompre = () => {
    const { ret1, ret2 } = testIsDiff();
    setTip(\`isDiff(b, newB)===\${ret1}, isDiff(c, newC)===\${ret2}\`);
  };

  return (
    <div>
      <h1>compare tip: {tip}</h1>
      <button onClick={triggerCompre}>triggerCompre</button>
    </div>
  );
}

export default () => (
  <>
    <Comp />
    {$(state.b.b1)}
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:c},renderOpts:{compile:function(){var d=C()(b()().mark(function s(){var t,u=arguments;return b()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,e.e(2357).then(e.bind(e,82357));case 2:return i.abrupt("return",(t=i.sent).default.apply(t,u));case 3:case"end":return i.stop()}},s)}));function r(){return d.apply(this,arguments)}return r}()}}}},67446:function(f,n,e){e.r(n),e.d(n,{demos:function(){return g}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(248),O=e(13517),B=e(95152),g={"docs-guide-derive-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x,E,D,y,M,P,R,L;return a()().wrap(function($){for(;;)switch($.prev=$.next){case 0:return L=function(){var N=m(M),F=b()(N,1),X=F[0];return o.createElement("h1",null,X)},$.next=3,Promise.resolve().then(e.bind(e,13517));case 3:return l=$.sent,d=l.Entry,$.next=7,Promise.resolve().then(e.bind(e,95152));case 7:return r=$.sent,s=r.atom,t=r.derive,u=r.share,m=r.useDerived,i=s(5),_=b()(i,2),h=_[0],v=_[1],x=u({a:50,c:{c1:100,c2:1e3},list:[{name:"one",age:1}]}),E=b()(x,2),D=E[0],y=E[1],M=t(function(){return h.val+D.c.c1}),P=function(){return v(function(N){return N+10})},R=function(){return y(function(N){return void(N.c.c1+=20)})},$.abrupt("return",{default:function(){return o.createElement(d,{fns:{changeNum:P,changeC1:R}},o.createElement(L,null))}});case 18:case"end":return $.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-derive-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry } from '@helux/demo-utils';
import { atom, derive, share, useDerived } from 'helux';

const [numAtom, setAtom] = atom(5);
const [info, setInfo] = share({
  a: 50,
  c: { c1: 100, c2: 1000 },
  list: [{ name: 'one', age: 1 }],
});

const result = derive(() => {
  return numAtom.val + info.c.c1;
});

const changeNum = () => setAtom((prev) => prev + 10);
const changeC1 = () => setInfo((draft) => void (draft.c.c1 += 20));

function Demo() {
  const [num] = useDerived(result); // \u81EA\u52A8\u62C6\u7BB1
  return <h1>{num}</h1>;
}

export default () => (
  <Entry fns={{ changeNum, changeC1 }}>
    <Demo />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":O,helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-derive-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x,E,D;return a()().wrap(function(M){for(;;)switch(M.prev=M.next){case 0:return D=function(){var R=m(E),L=b()(R,2),U=L[0],$=L[1];return $.loading?o.createElement("h1",null,"loading..."):$.ok?o.createElement("h1",null,U):o.createElement("h1",{style:{color:"red"}},$.err.message)},M.next=3,Promise.resolve().then(e.bind(e,13517));case 3:return l=M.sent,d=l.Entry,r=l.demoUtils,M.next=8,Promise.resolve().then(e.bind(e,95152));case 8:return s=M.sent,t=s.derive,u=s.share,m=s.useDerived,i=u({a:1,b:{b1:{b2:200}}}),_=b()(i,2),h=_[0],v=_[1],x=function(){return v(function(R){return void(R.a+=100)})},E=t({deps:function(){return[h.a,h.b.b1.b2]},fn:function(R){var L=b()(R.input,2),U=L[0],$=L[1];return U+$},task:function(){var P=A()(a()().mark(function L(U){var $,j,N,F;return a()().wrap(function(H){for(;;)switch(H.prev=H.next){case 0:return $=b()(U.input,2),j=$[0],N=$[1],H.next=3,r.delay(1e3);case 3:if(F=j+N+1,!(F>500)){H.next=6;break}throw new Error(">500");case 6:return H.abrupt("return",F);case 7:case"end":return H.stop()}},L)}));function R(L){return P.apply(this,arguments)}return R}()}),M.abrupt("return",{default:function(){return o.createElement(d,{fns:{changeA:x}},o.createElement(D,null))}});case 16:case"end":return M.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-derive-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry, demoUtils } from '@helux/demo-utils';
import { derive, share, useDerived } from 'helux';

const [sharedState, setState] = share({ a: 1, b: { b1: { b2: 200 } } });
const changeA = () => setState((draft) => void (draft.a += 100));

const result = derive({
  deps: () => [sharedState.a, sharedState.b.b1.b2] as const,
  fn: ({ input: [a, b2] }) => a + b2,
  task: async ({ input: [a, b2] }) => {
    await demoUtils.delay(1000);
    const ret = a + b2 + 1;
    if (ret > 500) throw new Error('>500');
    return ret;
  },
});

function Demo() {
  const [num, status] = useDerived(result);
  if (status.loading) return <h1>loading...</h1>;
  if (!status.ok) return <h1 style={{ color: 'red' }}>{status.err.message}</h1>;
  return <h1>{num}</h1>;
}

export default () => (
  <Entry fns={{ changeA }}>
    <Demo />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":O,helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-derive-demo-2":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x,E,D,y;return a()().wrap(function(P){for(;;)switch(P.prev=P.next){case 0:return y=function(){var L=i(E),U=b()(L,2),$=U[0],j=U[1];return o.createElement("h1",null,$)},D=function(){u(E)},P.next=4,Promise.resolve().then(e.bind(e,13517));case 4:return l=P.sent,d=l.Entry,r=l.demoUtils,P.next=9,Promise.resolve().then(e.bind(e,95152));case 9:return s=P.sent,t=s.derive,u=s.runDerive,m=s.share,i=s.useDerived,_=m({a:1}),h=b()(_,2),v=h[0],x=h[1],E=t(function(){return v.a+r.random()}),P.abrupt("return",{default:function(){return o.createElement(d,{fns:{rerun:D}},o.createElement(y,null))}});case 17:case"end":return P.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-derive-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry, demoUtils } from '@helux/demo-utils';
import { derive, runDerive, share, useDerived } from 'helux';

const [sharedState, setState] = share({ a: 1 });
const result = derive(() => {
  return sharedState.a + demoUtils.random();
});
function rerun() {
  runDerive(result);
}

function Demo() {
  const [num, status] = useDerived(result);
  return <h1>{num}</h1>;
}

export default () => (
  <Entry fns={{ rerun }}>
    <Demo />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":O,helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},52568:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(56067),I={}},85123:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(20062),I={}},3656:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(28712),I={}},42092:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(68083),I={}},86309:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(92632),I={}},77166:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(28633),a=e.n(p),I=e(29008),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(94030),O=e(95152),B={"docs-guide-modular-demo-0":{component:o.memo(o.lazy(A()(b()().mark(function g(){var c,l,d,r,s,t,u;return b()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return u=function(){var h=d.useState(),v=a()(h,1),x=v[0],E=t.useLoading(),D=E.changeC1;return o.createElement("div",null,D.ok&&o.createElement("h3",null,"a.b1.c1: ",x.a.b1.c1),D.loading&&o.createElement("h1",null,"loading..."),D.err&&o.createElement("h1",{style:{color:"red"}},D.err.message))},i.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=i.sent,l=c.sharex,d=l({a:{b:{c:1},b1:{c1:1}},info:{name:"helux"}},{moduleName:"dfDemo"}),r=d.state,s=function(h){return new Promise(function(v){return setTimeout(v,h)})},t=d.defineActions()({changeC:function(h){var v=h.draft;return v.a.b.c+=1e3},changeC1:function(){var _=A()(b()().mark(function v(x){var E,D;return b()().wrap(function(M){for(;;)switch(M.prev=M.next){case 0:if(E=x.draft,D=E.a.b1.c1+100,!(D>300)){M.next=4;break}throw new Error(">300");case 4:E.a.b1.c1=D;case 5:case"end":return M.stop()}},v)}));function h(v){return _.apply(this,arguments)}return h}()}),i.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement("button",{onClick:t.actions.changeC1},"changeC1"),o.createElement(u,null))}});case 10:case"end":return i.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-modular-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { sharex } from 'helux';
const ctx = sharex(
  { a: { b: { c: 1 }, b1: { c1: 1 } }, info: { name: 'helux' } },
  { moduleName: 'dfDemo' },
);
const { state } = ctx;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const ac = ctx.defineActions()({
  changeC: ({ draft }) => (draft.a.b.c += 1000),
  changeC1: async ({ draft }) => {
    const ret = draft.a.b1.c1 + 100;
    if (ret > 300) {
      throw new Error('>300');
    }
    draft.a.b1.c1 = ret;
  },
});

function Price() {
  const [state] = ctx.useState();
  const { changeC1: status } = ac.useLoading();

  return (
    <div>
      {status.ok && <h3>a.b1.c1: {state.a.b1.c1}</h3>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
    </div>
  );
}

export default () => (
  <>
    <button onClick={ac.actions.changeC1}>changeC1</button>
    <Price />
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(b()().mark(function l(){var d,r=arguments;return b()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-guide-modular-demo-1":{component:o.memo(o.lazy(A()(b()().mark(function g(){var c,l,d,r,s,t,u,m,i;return b()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return i=function(){var x=m.helper.a.useDerived(),E=m.helper.c.useDerivedInfo(),D=a()(E,2),y=D[0],M=D[1];return o.createElement("div",null,o.createElement("h3",null,"derived a: ",x),M.ok&&o.createElement("h1",null,"derived c: ",y," "),M.loading&&o.createElement("h1",null,"loading..."),M.err&&o.createElement("h1",{style:{color:"red"}},M.err.message))},h.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=h.sent,l=c.$,d=c.sharex,r=d({a:{b:{c:1},b1:{c1:1}},info:{name:"helux"}},{moduleName:"dfDemo"}),s=r.state,t=function(x){return new Promise(function(E){return setTimeout(E,x)})},u=r.defineActions()({changeC:function(x){var E=x.draft;return E.a.b.c+=1e3},changeC1:function(x){var E=x.draft;return E.a.b1.c1+=100}}),m=r.defineFullDerive()({a:function(){return s.a.b.c+1e4},b:function(){return s.a.b.c+2e4},c:{deps:function(){return[s.a.b1.c1,s.info.name]},fn:function(){return 1},task:function(x){return A()(b()().mark(function E(){var D,y,M,P;return b()().wrap(function(L){for(;;)switch(L.prev=L.next){case 0:return D=a()(x.input,2),y=D[0],M=D[1],L.next=3,t(2e3);case 3:if(P=1+y,!(P>300)){L.next=6;break}throw new Error(">300");case 6:return L.abrupt("return",P);case 7:case"end":return L.stop()}},E)}))()}}}),h.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement("h3",null,"state.a.b.c: ",l(s.a.b.c)),o.createElement("h3",null,"state.a.b1.c1: ",l(s.a.b1.c1)),o.createElement("button",{onClick:u.actions.changeC},"changeC"),o.createElement("button",{onClick:u.actions.changeC1},"changeC1"),o.createElement(i,null))}});case 12:case"end":return h.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-modular-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, sharex } from 'helux';
const ctx = sharex(
  { a: { b: { c: 1 }, b1: { c1: 1 } }, info: { name: 'helux' } },
  { moduleName: 'dfDemo' },
);
const { state } = ctx;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const ac = ctx.defineActions()({
  changeC: ({ draft }) => (draft.a.b.c += 1000),
  changeC1: ({ draft }) => (draft.a.b1.c1 += 100),
});

const df = ctx.defineFullDerive()({
  a: () => state.a.b.c + 10000,
  b: () => state.a.b.c + 20000,
  c: {
    // DR['c']['result'] \u5C06\u7EA6\u675F\u6B64\u5904\u7684 deps \u8FD4\u56DE\u7C7B\u578B
    deps: () => [state.a.b1.c1, state.info.name],
    fn: () => 1,
    async task(params) {
      const [c1, name] = params.input; // \u83B7\u5F97\u7C7B\u578B\u63D0\u793A
      await delay(2000);
      const ret = 1 + c1;
      if (ret > 300) {
        throw new Error('>300');
      }
      return ret;
    },
  },
});

function Price() {
  const a = df.helper.a.useDerived();
  const [c, status] = df.helper.c.useDerivedInfo();

  return (
    <div>
      <h3>derived a: {a}</h3>
      {status.ok && <h1>derived c: {c} </h1>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
    </div>
  );
}

export default () => (
  <>
    <h3>state.a.b.c: {$(state.a.b.c)}</h3>
    <h3>state.a.b1.c1: {$(state.a.b1.c1)}</h3>
    <button onClick={ac.actions.changeC}>changeC</button>
    <button onClick={ac.actions.changeC1}>changeC1</button>
    <Price />
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(b()().mark(function l(){var d,r=arguments;return b()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-guide-modular-demo-2":{component:o.memo(o.lazy(A()(b()().mark(function g(){var c,l,d,r,s,t,u,m,i;return b()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return i=function(){var x=r.useState(),E=a()(x,1),D=E[0],y=m.useLoading(),M=y.changeB;return o.createElement("div",null,M.ok&&o.createElement("h3",null,"info.extraName: ",D.info.extraName),M.loading&&o.createElement("h1",null,"loading..."),M.err&&o.createElement("h1",{style:{color:"red"}},M.err.message))},h.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=h.sent,l=c.$,d=c.sharex,r=d({a:{b:{c:1},b1:{c1:1}},info:{name:"helux",extraName:"helux cool"}},{moduleName:"deriveM"}),s=r.state,t=function(x){return new Promise(function(E){return setTimeout(E,x)})},u=r.defineActions()({changeC:function(x){var E=x.draft;return E.a.b.c+=1e3}}),m=r.defineMutateSelf()({toBeDrive:function(x,E){var D=E.state;x.a.b1.c1=D.a.b.c+1e3},changeB:{deps:function(){return[s.a.b.c]},task:function(x){return A()(b()().mark(function E(){var D,y;return b()().wrap(function(P){for(;;)switch(P.prev=P.next){case 0:return D=x.draft,y=x.input,P.next=3,t(1e3);case 3:D.info.extraName="".concat(y[0],"_").concat(Date.now());case 4:case"end":return P.stop()}},E)}))()},immediate:!1}}),h.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement("h3",null,"state.a.b.c: ",l(s.a.b.c)),o.createElement("button",{onClick:u.actions.changeC},"changeC"),o.createElement(i,null))}});case 12:case"end":return h.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-modular-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, sharex } from 'helux';
const ctx = sharex(
  {
    a: { b: { c: 1 }, b1: { c1: 1 } },
    info: { name: 'helux', extraName: 'helux cool' },
  },
  { moduleName: 'deriveM' },
);
const { state } = ctx;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const ac = ctx.defineActions()({
  changeC: ({ draft }) => (draft.a.b.c += 1000),
});

const ds = ctx.defineMutateSelf()({
  // a.b.c \u53D8\u5316\u540E\uFF0C\u4FEE\u6539 a.b1.c1
  toBeDrive: (draft, { state }) => {
    draft.a.b1.c1 = state.a.b.c + 1000;
  },
  changeB: {
    // \u901A\u8FC7 deps \u663E\u793A\u5B9A\u4E49\u4F9D\u8D56\u4E3A a.b.c
    deps: () => [state.a.b.c],
    async task({ draft, input }) {
      await delay(1000);
      // a.b.c \u53D8\u5316\u540E\uFF0C\u4FEE\u6539 info.extraName
      draft.info.extraName = \`\${input[0]}_\${Date.now()}\`;
    },
    // \u672A\u5B9A\u4E49 fn \u65F6\uFF0Cimmediate \u9ED8\u8BA4\u4E3A true\uFF0C\u4F1A\u7ACB\u5373\u53EA\u9700 task
    immediate: false,
  },
});

function Price() {
  const [state] = ctx.useState();
  const { changeB: status } = ds.useLoading();

  return (
    <div>
      {status.ok && <h3>info.extraName: {state.info.extraName}</h3>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
    </div>
  );
}

export default () => (
  <>
    <h3>state.a.b.c: {$(state.a.b.c)}</h3>
    <button onClick={ac.actions.changeC}>changeC</button>
    <Price />
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(b()().mark(function l(){var d,r=arguments;return b()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-guide-modular-demo-3":{component:o.memo(o.lazy(A()(b()().mark(function g(){var c,l,d,r,s,t,u,m,i;return b()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return i=function(){var x=m.useDerivedState(),E=a()(x,1),D=E[0],y=m.useLoading(),M=y.changeB;return o.createElement("div",null,o.createElement("h3",null,"a: ",D.a),M.ok&&o.createElement("h3",null,"b: ",D.b),M.loading&&o.createElement("h1",null,"loading..."),M.err&&o.createElement("h1",{style:{color:"red"}},M.err.message))},h.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=h.sent,l=c.$,d=c.sharex,r=d({a:{b:{c:1},b1:{c1:1}},info:{name:"helux",extraName:"helux cool"}},{moduleName:"deriveM"}),s=r.state,t=function(x){return new Promise(function(E){return setTimeout(E,x)})},u=r.defineActions()({changeC:function(x){var E=x.draft;return E.a.b.c+=1e3},changeName:function(x){var E=x.draft;return E.info.name="".concat(Date.now())}}),m=r.defineMutateDerive({a:1,b:"2",c:3})({changeA:function(x){return x.a=s.a.b.c+100},changeB:{deps:function(){return[s.info.name]},task:function(x){return A()(b()().mark(function E(){return b()().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:return y.next=2,t(1e3);case 2:x.draft.b=s.info.name+"ccc";case 3:case"end":return y.stop()}},E)}))()}}}),h.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement("h3",null,"derivedState.b: ",l(m.derivedState.b)),o.createElement("button",{onClick:u.actions.changeC},"changeC"),o.createElement("button",{onClick:u.actions.changeName},"changeName"),o.createElement(i,null))}});case 12:case"end":return h.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-modular-demo-3",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, sharex } from 'helux';
const ctx = sharex(
  {
    a: { b: { c: 1 }, b1: { c1: 1 } },
    info: { name: 'helux', extraName: 'helux cool' },
  },
  { moduleName: 'deriveM' },
);
const { state } = ctx;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const ac = ctx.defineActions()({
  changeC: ({ draft }) => (draft.a.b.c += 1000),
  changeName: ({ draft }) => (draft.info.name = \`\${Date.now()}\`),
});

const dm = ctx.defineMutateDerive({
  a: 1,
  b: '2',
  c: 3,
})({
  changeA: (draft) => (draft.a = state.a.b.c + 100),
  changeB: {
    deps: () => [state.info.name],
    async task(params) {
      await delay(1000);
      params.draft.b = state.info.name + 'ccc';
    },
  },
});

function Price() {
  const [state] = dm.useDerivedState();
  const { changeB: status } = dm.useLoading();

  return (
    <div>
      <h3>a: {state.a}</h3>
      {status.ok && <h3>b: {state.b}</h3>}
      {status.loading && <h1>loading...</h1>}
      {status.err && <h1 style={{ color: 'red' }}>{status.err.message}</h1>}
    </div>
  );
}

export default () => (
  <>
    <h3>derivedState.b: {$(dm.derivedState.b)}</h3>
    <button onClick={ac.actions.changeC}>changeC</button>
    <button onClick={ac.actions.changeName}>changeName</button>
    <Price />
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(b()().mark(function l(){var d,r=arguments;return b()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},4097:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(19562),I={}},96784:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(45914),O=e(95152),B={"docs-guide-quick-start-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return m.next=2,Promise.resolve().then(e.bind(e,95152));case 2:return c=m.sent,l=c.atom,d=c.useAtom,r=l(1),s=b()(r,1),t=s[0],m.abrupt("return",{default:function(){var _=d(t),h=b()(_,2),v=h[0],x=h[1];return o.createElement("h1",{onClick:function(){return x(Math.random())}},v)}});case 7:case"end":return m.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-quick-start-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useAtom } from 'helux';
const [numAtom] = atom(1);

export default function Demo() {
  // \u8FD4\u56DE\u7ED3\u679C\u81EA\u52A8\u62C6\u7BB1
  const [num, setAtom] = useAtom(numAtom);
  return <h1 onClick={() => setAtom(Math.random())}>{num}</h1>;
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx",title:"\u70B9\u51FB\u6570\u5B57\u89E6\u53D1\u4FEE\u6539"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-guide-quick-start-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m;return a()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return m=function(){var v=d(t),x=b()(v,2),E=x[0],D=x[1],y=function(){return D(function(P){P.info.age+=1})};return o.createElement("h1",{onClick:function(){return D(Math.random())}},E.name," ",E.info.age,o.createElement("button",{onClick:y},"changeName"))},_.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=_.sent,l=c.atom,d=c.useAtom,r=l({name:"hello helux",info:{age:1}}),s=b()(r,2),t=s[0],u=s[1],_.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(m,null),o.createElement(m,null))}});case 8:case"end":return _.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-quick-start-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atom, useAtom } from 'helux';
const [objAtom, setAtom] = atom({ name: 'hello helux', info: { age: 1 } });

function Demo() {
  const [obj, setAtom] = useAtom(objAtom);
  const changeName = () =>
    setAtom((draft) => {
      draft.info.age += 1;
    });

  return (
    <h1 onClick={() => setAtom(Math.random())}>
      {obj.name} {obj.info.age}
      <button onClick={changeName}>changeName</button>
    </h1>
  );
}

export default () => (
  <>
    <Demo />
    <Demo />
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx",title:"\u591A\u5B9E\u4F8B\u5171\u4EABatom"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},24732:function(f,n,e){e.r(n),e.d(n,{demos:function(){return g}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(52995),O=e(13517),B=e(95152),g={"docs-guide-reactive-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x;return a()().wrap(function(D){for(;;)switch(D.prev=D.next){case 0:return x=function(){var M=i(),P=b()(M,3),R=P[0],L=P[2],U=function(){return R.b.b1.ok=!R.b.b1.ok};return o.createElement(r,{info:L},o.createElement("div",{onClick:U},"b.b1.ok: ","".concat(R.b.b1.ok)))},v=function(){var M=i(),P=b()(M,3),R=P[0],L=P[2];return o.createElement(r,{info:L},"b.b1.b2: ",R.b.b1.b2)},h=function(){var M=i(),P=b()(M,3),R=P[0],L=P[2];return o.createElement(r,{info:L},"a: ",R.a)},_=function(){m.b.b1.ok=!m.b.b1.ok},D.next=6,Promise.resolve().then(e.bind(e,13517));case 6:return l=D.sent,d=l.Entry,r=l.MarkUpdate,D.next=11,Promise.resolve().then(e.bind(e,95152));case 11:return s=D.sent,t=s.sharex,u=t({a:1,b:{b1:{b2:1,ok:!0}}}),m=u.reactive,i=u.useReactive,setInterval(function(){m.a+=1,m.b.b1.b2+=5},2e3),D.abrupt("return",{default:function(){return o.createElement(d,{fns:{toogleOkOut:_}},o.createElement(h,null),o.createElement(h,null),o.createElement(v,null),o.createElement(v,null),o.createElement(x,null))}});case 16:case"end":return D.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-reactive-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry, MarkUpdate } from '@helux/demo-utils';
import { sharex } from 'helux';

const { reactive, useReactive } = sharex({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});

setInterval(() => {
  reactive.a += 1;
  reactive.b.b1.b2 += 5;
}, 2000);

function toogleOkOut() {
  reactive.b.b1.ok = !reactive.b.b1.ok;
}

function Demo() {
  const [reactive, , info] = useReactive();
  return <MarkUpdate info={info}>a: {reactive.a}</MarkUpdate>;
}
function Demo2() {
  const [reactive, , info] = useReactive();
  return <MarkUpdate info={info}>b.b1.b2: {reactive.b.b1.b2}</MarkUpdate>;
}
function Demo3() {
  const [reactive, , info] = useReactive();
  const toogle = () => (reactive.b.b1.ok = !reactive.b.b1.ok);
  return (
    <MarkUpdate info={info}>
      <div onClick={toogle}>b.b1.ok: {\`\${reactive.b.b1.ok}\`}</div>
    </MarkUpdate>
  );
}

export default () => (
  <Entry fns={{ toogleOkOut }}>
    <Demo />
    <Demo />
    <Demo2 />
    <Demo2 />
    <Demo3 />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":O,helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-reactive-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x;return a()().wrap(function(D){for(;;)switch(D.prev=D.next){case 0:return v=function(){return o.createElement(r,null,t(_.a))},h=function(){_.a+=1,_.b.b1.b2+=5},D.next=4,Promise.resolve().then(e.bind(e,13517));case 4:return l=D.sent,d=l.Entry,r=l.MarkUpdate,D.next=9,Promise.resolve().then(e.bind(e,95152));case 9:return s=D.sent,t=s.$,u=s.block,m=s.sharex,i=m({a:1,b:{b1:{b2:1,ok:!0}}}),_=i.reactive,x=u(function(){return o.createElement(r,null,o.createElement("h3",null,_.a),o.createElement("h3",null,_.b.b1.b2))}),D.abrupt("return",{default:function(){return o.createElement(d,{fns:{change:h}},o.createElement(v,null),o.createElement(x,null))}});case 16:case"end":return D.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-reactive-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry, MarkUpdate } from '@helux/demo-utils';
import { $, block, sharex } from 'helux';

const { reactive } = sharex({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});
function change() {
  reactive.a += 1;
  reactive.b.b1.b2 += 5;
}

function InSignalZone() {
  return <MarkUpdate>{$(reactive.a)}</MarkUpdate>;
}

const InBlockZone = block(() => {
  return (
    <MarkUpdate>
      <h3>{reactive.a}</h3>
      <h3>{reactive.b.b1.b2}</h3>
    </MarkUpdate>
  );
});

export default () => (
  <Entry fns={{ change }}>
    <InSignalZone />
    <InBlockZone />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":O,helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-reactive-demo-2":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i;return a()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return i=function(){var x=t(),E=b()(x,1),D=E[0];return o.createElement("input",{value:D.str,onChange:m})},m=function(x){s.str=x.target.value,u()},h.next=4,Promise.resolve().then(e.bind(e,95152));case 4:return l=h.sent,d=l.sharex,r=d({str:""}),s=r.reactive,t=r.useState,u=r.flush,h.abrupt("return",{default:function(){return o.createElement(o.Fragment,null,o.createElement(i,null),o.createElement(i,null))}});case 8:case"end":return h.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-reactive-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { sharex } from 'helux';
const { reactive, useState, flush } = sharex({ str: '' });
function change(e) {
  reactive.str = e.target.value;
  // \u53BB\u6389 flush \u8C03\u7528\uFF0C\u4E2D\u6587\u8F93\u5165\u6CD5\u65E0\u6CD5\u5F55\u5165\u6C49\u5B57
  flush();
}

function Demo(){
  const [ state ] = useState();
  return <input value={state.str} onChange={change} />;
}

export default () => (
  <>
    <Demo />
    <Demo />
  </>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},47020:function(f,n,e){e.r(n),e.d(n,{demos:function(){return g}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(88785),O=e(13517),B=e(95152),g={"docs-guide-signal-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h;return a()().wrap(function(x){for(;;)switch(x.prev=x.next){case 0:return x.next=2,Promise.resolve().then(e.bind(e,13517));case 2:return l=x.sent,d=l.MarkUpdate,x.next=6,Promise.resolve().then(e.bind(e,95152));case 6:return r=x.sent,s=r.$,t=r.share,u=t({a:1,b:2,info:{born:"2023-12-31",age:2}}),m=b()(u,2),i=m[0],_=m[1],h=function(){return _(function(D){return void(D.info.born="".concat(Date.now()))})},x.abrupt("return",{default:function(){return o.createElement(d,null,o.createElement("h2",null,"update at ",Date.now()),o.createElement("h2",null,"a very very long static content..."),o.createElement("button",{onClick:h},"click me"),o.createElement("h1",null,"state.info.born: ",s(i.info.born)))}});case 12:case"end":return x.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-signal-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { MarkUpdate } from '@helux/demo-utils';
import { $, share } from 'helux';
const [state, setState] = share({
  a: 1,
  b: 2,
  info: { born: '2023-12-31', age: 2 },
});
const change = () =>
  setState((draft) => void (draft.info.born = \`\${Date.now()}\`));
// or \u7BAD\u5934\u51FD\u6570\u5305 {}\uFF0C\u6D88\u9664\u9690\u5F0F\u8FD4\u56DE\u503C
// change = ()=> setState((draft) => { draft.info.born = \`\${Date.now()}\` });

export default function Demo() {
  return (
    <MarkUpdate>
      <h2>update at {Date.now()}</h2>
      <h2>a very very long static content...</h2>
      <button onClick={change}>click me</button>
      <h1>state.info.born: {$(state.info.born)}</h1>
    </MarkUpdate>
  );
}`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":O,helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-signal-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x,E;return a()().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:return v=function(){h(function(P){P.name="helux_".concat(Date.now()),P.detail.desc="desc_".concat(Date.now())})},y.next=3,Promise.resolve().then(e.bind(e,13517));case 3:return l=y.sent,d=l.Entry,r=l.MarkUpdate,y.next=8,Promise.resolve().then(e.bind(e,95152));case 8:return s=y.sent,t=s.block,u=s.share,m=u({name:"helux",age:1,detail:{desc:"a powerful state engine"}}),i=b()(m,2),_=i[0],h=i[1],x=t(function(){return o.createElement(r,null,o.createElement("h3",null,"name: ",_.name),o.createElement("h3",null,"desc: ",_.detail.desc))}),E=t(function(){return o.createElement(r,null,o.createElement("h3",null,"age: ",_.age)," ")}),y.abrupt("return",{default:function(){return o.createElement(d,{fns:{changeName:v}},o.createElement(x,null),o.createElement(E,null))}});case 15:case"end":return y.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-signal-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { Entry, MarkUpdate } from '@helux/demo-utils';
import { block, share } from 'helux';
const [state, setState] = share({
  name: 'helux',
  age: 1,
  detail: { desc: 'a powerful state engine' },
});
function changeName() {
  setState((draft) => {
    draft.name = \`helux_\${Date.now()}\`;
    draft.detail.desc = \`desc_\${Date.now()}\`;
  });
}

const Block1 = block(() => {
  return (
    <MarkUpdate>
      <h3>name: {state.name}</h3>
      <h3>desc: {state.detail.desc}</h3>
    </MarkUpdate>
  );
});
const Block2 = block(() => {
  return (
    <MarkUpdate>
      <h3>age: {state.age}</h3>{' '}
    </MarkUpdate>
  );
});

export default () => (
  <Entry fns={{ changeName }}>
    <Block1 />
    <Block2 />
  </Entry>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{"@helux/demo-utils":O,helux:B},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},97449:function(f,n,e){e.r(n),e.d(n,{demos:function(){return B}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(48207),O=e(95152),B={"docs-guide-sync-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return t=function(){var _=s(),h=b()(_,1),v=h[0];return o.createElement("div",null,o.createElement("input",{value:v.desc,onChange:r.desc}),o.createElement("input",{type:"checkbox",checked:v.c,onChange:r.c}))},m.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=m.sent,l=c.sharex,d=l({a:1,b:{b1:1},c:!0,desc:""}),r=d.syncer,s=d.useState,m.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement(t,null),o.createElement(t,null))}});case 7:case"end":return m.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-sync-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { sharex } from 'helux';

const { syncer, useState } = sharex({ a: 1, b: { b1: 1 }, c: true, desc: '' });

function Demo1() {
  const [state] = useState();
  return (
    <div>
      <input value={state.desc} onChange={syncer.desc} />
      <input type="checkbox" checked={state.c} onChange={syncer.c} />
    </div>
  );
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
  </div>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-guide-sync-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return t=function(){var _=s(),h=b()(_,1),v=h[0];return o.createElement("input",{value:v,onChange:r})},m.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=m.sent,l=c.atomx,d=l(""),r=d.syncer,s=d.useState,m.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement(t,null),o.createElement(t,null))}});case 7:case"end":return m.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-sync-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { atomx } from 'helux';

const { syncer, useState } = atomx('');

function Demo1() {
  const [state] = useState();
  return <input value={state} onChange={syncer} />;
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
  </div>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-guide-sync-demo-2":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return t=function(){var _=s(),h=b()(_,1),v=h[0];return o.createElement("input",{value:v.b.b1,onChange:r(function(x){return x.b.b1})})},m.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=m.sent,l=c.sharex,d=l({b:{b1:"1"}}),r=d.sync,s=d.useState,m.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement(t,null),o.createElement(t,null))}});case 7:case"end":return m.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-sync-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { sharex } from 'helux';

const { sync, useState } = sharex({ b: { b1: '1' } });

function Demo1() {
  const [state] = useState();
  return <input value={state.b.b1} onChange={sync((to) => to.b.b1)} />;
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
  </div>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-guide-sync-demo-3":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return t=function(){var _=s(),h=b()(_,1),v=h[0];return o.createElement("input",{value:v.b.b1,onChange:r(["b","b1"])})},m.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=m.sent,l=c.sharex,d=l({b:{b1:"1"}}),r=d.sync,s=d.useState,m.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement(t,null),o.createElement(t,null))}});case 7:case"end":return m.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-sync-demo-3",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { sharex } from 'helux';

const { sync, useState } = sharex({ b: { b1: '1' } });

function Demo1() {
  const [state] = useState();
  return <input value={state.b.b1} onChange={sync(['b', 'b1'])} />;
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
  </div>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-guide-sync-demo-4":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t;return a()().wrap(function(m){for(;;)switch(m.prev=m.next){case 0:return t=function(){var _=s(),h=b()(_,1),v=h[0];return o.createElement("input",{value:v.b.b1,onChange:r(function(x){return x.b.b1},function(x){return x==="888"?"boom":x})})},m.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=m.sent,l=c.sharex,d=l({b:{b1:"1"}}),r=d.sync,s=d.useState,m.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement(t,null),o.createElement(t,null))}});case 7:case"end":return m.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-sync-demo-4",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { sharex } from 'helux';

const { sync, useState } = sharex({ b: { b1: '1' } });

function Demo1() {
  const [state] = useState();
  return (
    <input
      value={state.b.b1}
      onChange={sync(
        (to) => to.b.b1,
        (val) => {
          return val === '888' ? 'boom' : val;
        },
      )}
    />
  );
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
  </div>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}},"docs-guide-sync-demo-5":{component:o.memo(o.lazy(A()(a()().mark(function g(){var c,l,d,r,s,t,u,m;return a()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return m=function(){var v=t(),x=b()(v,1),E=x[0];return o.createElement("input",{value:E.b.b1,onChange:s(function(D){return D.b.b1},function(D,y){if(D==="888")return y.draft.b.b2="b2 changed at ".concat(Date.now()),"boom"})})},_.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return c=_.sent,l=c.$,d=c.sharex,r=d({b:{b1:"",b2:""}}),s=r.sync,t=r.useState,u=r.state,_.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement(m,null),o.createElement(m,null),o.createElement("h2",null,"state.b.b2: ",l(u.b.b2)))}});case 8:case"end":return _.stop()}},g)})))),asset:{type:"BLOCK",id:"docs-guide-sync-demo-5",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { $, sharex } from 'helux';

const { sync, useState, state } = sharex({ b: { b1: '', b2: '' } });

function Demo1() {
  const [state] = useState();
  return (
    <input
      value={state.b.b1}
      onChange={sync(
        (to) => to.b.b1,
        (val, params) => {
          if (val === '888') {
            params.draft.b.b2 = \`b2 changed at \${Date.now()}\`;
            return 'boom';
          }
        },
      )}
    />
  );
}

export default () => (
  <div>
    <Demo1 />
    <Demo1 />
    <h2>state.b.b2: {$(state.b.b2)}</h2>
  </div>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var g=A()(a()().mark(function l(){var d,r=arguments;return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.e(2357).then(e.bind(e,82357));case 2:return t.abrupt("return",(d=t.sent).default.apply(d,r));case 3:case"end":return t.stop()}},l)}));function c(){return g.apply(this,arguments)}return c}()}}}},13755:function(f,n,e){e.r(n),e.d(n,{demos:function(){return g}});var p=e(29008),a=e.n(p),I=e(28633),b=e.n(I),T=e(70958),A=e.n(T),o=e(94159),C=e(85639),O=e(95152),B=e(13517),g={"docs-guide-watch-demo-0":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h;return a()().wrap(function(x){for(;;)switch(x.prev=x.next){case 0:return h=function(D){var y=o.useState(""),M=b()(y,2),P=M[0],R=M[1];return s(function(){R("priceState.a changed from ".concat(d(m).a," to ").concat(m.a))},function(){return[m.a]}),o.createElement("h1",null,"watch tip: ",P)},_=function(){i(function(D){return void(D.a+=1)})},x.next=4,Promise.resolve().then(e.bind(e,95152));case 4:return l=x.sent,d=l.getSnap,r=l.share,s=l.useWatch,t=r({a:1}),u=b()(t,2),m=u[0],i=u[1],x.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement(h,null),o.createElement("button",{onClick:_},"changeA"))}});case 10:case"end":return x.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-watch-demo-0",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { getSnap, share, useWatch } from 'helux';
const [priceState, setPrice] = share({ a: 1 });

function changeA() {
  setPrice((draft) => void (draft.a += 1));
}

function Comp(props: any) {
  const [tip, setTip] = React.useState('');
  // watch \u56DE\u8C03\u968F\u7EC4\u4EF6\u9500\u6BC1\u4F1A\u81EA\u52A8\u53D6\u6D88\u76D1\u542C
  useWatch(
    () => {
      setTip(
        \`priceState.a changed from \${getSnap(priceState).a} to \${priceState.a}\`,
      );
    },
    () => [priceState.a],
  );

  return <h1>watch tip: {tip}</h1>;
}

export default () => (
  <div>
    <Comp />
    <button onClick={changeA}>changeA</button>
  </div>
);`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx",title:"\u70B9\u51FB changeA \u6309\u94AE\uFF0C\u89C2\u5BDF tip \u53D8\u5316"},context:{helux:O},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-watch-demo-1":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v,x,E;return a()().wrap(function(y){for(;;)switch(y.prev=y.next){case 0:return E=function(P){var R=u({num:1}),L=b()(R,2),U=L[0],$=L[1],j=o.useState(""),N=b()(j,2),F=N[0],X=N[1];return m(function(){X("num in watch cb is ".concat(U.num))},function(){return[h.a]}),o.createElement("div",null,o.createElement("button",{onClick:function(){return $({num:d.random()})}},"changeLocal"),o.createElement("div",null," num: ",U.num),o.createElement("div",null," watch tip: ",F))},x=function(){v(function(P){return void(P.a+=1)})},y.next=4,Promise.resolve().then(e.bind(e,13517));case 4:return l=y.sent,d=l.demoUtils,y.next=8,Promise.resolve().then(e.bind(e,95152));case 8:return r=y.sent,s=r.$,t=r.share,u=r.useObject,m=r.useWatch,i=t({a:1}),_=b()(i,2),h=_[0],v=_[1],y.abrupt("return",{default:function(){return o.createElement("div",null,o.createElement(E,null),o.createElement("button",{onClick:x},"changeA"),o.createElement("h3",null,"shared.a ",s(h.a)))}});case 15:case"end":return y.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-watch-demo-1",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { demoUtils } from '@helux/demo-utils';
import { $, share, useObject, useWatch } from 'helux';
const [priceState, setPrice] = share({ a: 1 });
function changeA() {
  setPrice((draft) => void (draft.a += 1));
}

function Comp(props: any) {
  const [obj, setObj] = useObject({ num: 1 });
  const [tip, setTip] = React.useState('');

  useWatch(
    () => {
      // priceState.a changed, here can read the latest num
      setTip(\`num in watch cb is \${obj.num}\`);
    },
    () => [priceState.a],
  );

  return (
    <div>
      <button onClick={() => setObj({ num: demoUtils.random() })}>
        changeLocal
      </button>
      <div> num: {obj.num}</div>
      <div> watch tip: {tip}</div>
    </div>
  );
}

export default () => (
  <div>
    <Comp />
    <button onClick={changeA}>changeA</button>
    <h3>shared.a {$(priceState.a)}</h3>
  </div>
);`},"@helux/demo-utils":{type:"NPM",value:"0.0.3"},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx",title:"\u5148\u70B9changeLocal\u518D\u70B9changeA"},context:{"@helux/demo-utils":B,helux:O},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}},"docs-guide-watch-demo-2":{component:o.memo(o.lazy(A()(a()().mark(function c(){var l,d,r,s,t,u,m,i,_,h,v;return a()().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:return v=function(){_(function(y){y.a+=1})},E.next=3,Promise.resolve().then(e.bind(e,95152));case 3:return l=E.sent,d=l.share,r=l.useMutable,s=l.useWatchEffect,t=l.getSnap,u=d({a:1,b:{b1:{b2:200}}}),m=b()(u,3),i=m[0],_=m[1],h=m[2],E.abrupt("return",{default:function(y){var M=r({tip:"1"}),P=b()(M,2),R=P[0],L=P[1];return s(function(){L(function(U){U.tip="priceState.a changed from ".concat(t(i).a," to ").concat(i.a)})}),o.createElement("div",null,o.createElement("button",{onClick:v},"changeA"),o.createElement("h1",null,"tip: ",R.tip))}});case 10:case"end":return E.stop()}},c)})))),asset:{type:"BLOCK",id:"docs-guide-watch-demo-2",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:`import { share, useMutable, useWatchEffect, getSnap } from 'helux';

const [priceState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 } } });

function changeA() {
  setState((draft) => {
    draft.a += 1;
  });
}

export default function Comp(props: any) {
  const [ state, setState] = useMutable({tip:'1'})
  useWatchEffect(() => {
    setState(draft=>{
      draft.tip = \`priceState.a changed from \${getSnap(priceState).a} to \${priceState.a}\`;
    });
  });

  return (
    <div>
      <button onClick={changeA}>changeA</button>
      <h1>tip: {state.tip}</h1>
    </div>
  );
}`},helux:{type:"NPM",value:"5.5.0"}},entry:"index.tsx"},context:{helux:O},renderOpts:{compile:function(){var c=A()(a()().mark(function d(){var r,s=arguments;return a()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.next=2,e.e(2357).then(e.bind(e,82357));case 2:return u.abrupt("return",(r=u.sent).default.apply(r,s));case 3:case"end":return u.stop()}},d)}));function l(){return c.apply(this,arguments)}return l}()}}}},62169:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(5426),I={}},19480:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(25286),I={}},70198:function(f,n,e){var p;e.r(n),e.d(n,{demos:function(){return ne}});var a=e(29008),I=e.n(a),b=e(70958),T=e.n(b),A=e(94159),o=e(96924),C=e(758),O=e(47831),B=e.n(O),g=e(99901),c=e.n(g),l=e(86939),d=e(95152),r=e(75829),s=e.n(r),t=e(11616),u=e(55287),m=e(72471),i=e(59201),_=e(20826),h=e(60606),v=e(79725),x=e(68229),E=e.n(x),D=e(66010),y=e(35038),M=e(351),P=e(36340),R=e(59373),L=e(46301),U=e(61881),$=e(17575),j=e(95299),N=e(16222),F=e(57317),X=e(60352),H=e(94330),q=e(21718),ne={"docs-playground-demo-playground":{component:A.memo(A.lazy(function(){return e.e(2433).then(e.bind(e,12754))})),asset:{type:"BLOCK",id:"docs-playground-demo-playground",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:e(9258).Z},react:{type:"NPM",value:"18.0.0"},"react-live":{type:"NPM",value:"4.1.8"},"copy-to-clipboard":{type:"NPM",value:"3.3.3"},qs:{type:"NPM",value:"6.14.0"},"prism-react-renderer":{type:"NPM",value:"2.4.1"},helux:{type:"NPM",value:"5.5.0"},localforage:{type:"NPM",value:"1.10.0"},"./TopBar.tsx":{type:"FILE",value:e(14759).Z},"./codeContext.ts":{type:"FILE",value:e(90123).Z},"./Console.tsx":{type:"FILE",value:e(65333).Z},"./ApiMenus.tsx":{type:"FILE",value:e(66956).Z},"./codes.ts":{type:"FILE",value:e(1160).Z},"./index.less":{type:"FILE",value:e(70232).Z},"./Tools.tsx":{type:"FILE",value:e(38016).Z},"console-feed":{type:"NPM",value:"3.8.0"},"./icons/IconButton.tsx":{type:"FILE",value:e(54066).Z},"./Save.tsx":{type:"FILE",value:e(28687).Z},"./Reset.tsx":{type:"FILE",value:e(4390).Z},"./reactive.ts":{type:"FILE",value:e(90610).Z},"./derive.ts":{type:"FILE",value:e(95863).Z},"./watch.ts":{type:"FILE",value:e(30129).Z},"./useAtom.ts":{type:"FILE",value:e(69912).Z},"./useDerived.ts":{type:"FILE",value:e(6896).Z},"./useWatch.ts":{type:"FILE",value:e(99661).Z},"./signal.ts":{type:"FILE",value:e(72936).Z},"./useReactive.ts":{type:"FILE",value:e(36935).Z},"./quickStart.ts":{type:"FILE",value:e(40029).Z},"./modular.ts":{type:"FILE",value:e(8657).Z},"./atom.ts":{type:"FILE",value:e(91069).Z}},entry:"index.tsx"},context:{"./TopBar.tsx":t,"./codeContext.ts":u,"./Console.tsx":m,"./ApiMenus.tsx":i,"./codes.ts":_,"./index.less":h,"./Tools.tsx":v,"./icons/IconButton.tsx":D,"./Save.tsx":y,"./Reset.tsx":M,"./reactive.ts":P,"./derive.ts":R,"./watch.ts":L,"./useAtom.ts":U,"./useDerived.ts":$,"./useWatch.ts":j,"./signal.ts":N,"./useReactive.ts":F,"./quickStart.ts":X,"./modular.ts":H,"./atom.ts":q,react:p||(p=e.t(A,2)),"react-live":C,"copy-to-clipboard":O,qs:g,"prism-react-renderer":l,helux:d,localforage:r,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/TopBar.tsx":t,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codeContext.ts":u,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/Console.tsx":m,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/ApiMenus.tsx":i,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/index.ts":_,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/index.less":h,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/Tools.tsx":v,"console-feed":x,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/icons/IconButton.tsx":D,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/icons/Save.tsx":y,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/icons/Reset.tsx":M,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/reactive.ts":P,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/derive.ts":R,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/watch.ts":L,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/useAtom.ts":U,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/useDerived.ts":$,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/useWatch.ts":j,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/signal.ts":N,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/useReactive.ts":F,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/quickStart.ts":X,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/modular.ts":H,"/home/runner/work/helux/helux/docs/docs/playground/demos/Playground/codes/atom.ts":q},renderOpts:{compile:function(){var Q=T()(I()().mark(function ae(){var ee,re=arguments;return I()().wrap(function(W){for(;;)switch(W.prev=W.next){case 0:return W.next=2,e.e(2357).then(e.bind(e,82357));case 2:return W.abrupt("return",(ee=W.sent).default.apply(ee,re));case 3:case"end":return W.stop()}},ae)}));function te(){return Q.apply(this,arguments)}return te}()}}}},76432:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(95394),I={}},29241:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(79618),I={}},13334:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(74355),I={}},56806:function(f,n,e){e.r(n),e.d(n,{demos:function(){return I}});var p=e(94159),a=e(62252),I={}},48259:function(f,n,e){e.r(n),e.d(n,{dictFactory:function(){return p}});function p(){return{name:"dict",a:{b:{c:1},b1:{c1:1}},info:{name:"helux",age:1},desc:"awesome lib",extra:{list:[],mark:"extra",toBeDrive:0,prefixedMark:"",newName:""},f:1,g:1}}},48662:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(14873);const a=[]},25648:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(36261);const a=[{value:"\u901A\u8FC7 ",paraId:0,tocIndex:0},{value:"action",paraId:0,tocIndex:0},{value:" \u5DE5\u5382\u51FD\u6570\u521B\u5EFA\u4E13\u7528\u4E8E\u4FEE\u6539\u72B6\u6001\u7684 ",paraId:0,tocIndex:0},{value:"action",paraId:0,tocIndex:0},{value:" \u540C\u6B65\u6216\u5F02\u6B65\u51FD\u6570",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"\u6307\u5357/Action",paraId:2}]},6851:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(49081);const a=[{value:"\u5171\u4EAB\u72B6\u6001\u6839\u503C\uFF0C\u5BF9\u4E8E",paraId:0,tocIndex:1},{value:"atom",paraId:0,tocIndex:1},{value:"\u8FD4\u56DE\u7ED3\u679C\uFF0C\u4F1A\u88C5\u7BB1\u4E3A ",paraId:0,tocIndex:1},{value:"{val:T}",paraId:0,tocIndex:1},{value:"\u7ED3\u6784\uFF0C\u5BF9\u4E8E",paraId:0,tocIndex:1},{value:"share",paraId:0,tocIndex:1},{value:"\u8FD4\u56DE\u7ED3\u679C\uFF0C\u65E0\u88C5\u7BB1\u884C\u4E3A\uFF0C\u8BE5\u503C\u65F6\u4E00\u4E2A\u53EA\u53EF\u8BFB\u7684\u7A33\u5B9A\u5F15\u7528\uFF0C\u603B\u662F\u53EF\u4EE5\u8BFB\u53D6\u6700\u65B0\u503C\uFF0C\u4EFB\u4F55\u4FEE\u6539\u90FD\u5C06\u65E0\u6548\u3002",paraId:0,tocIndex:1},{value:`// \u5143\u7EC4\u7B2C\u4E00\u4F4D\u83B7\u5F97
const [state] = atom(1);
const [state] = share({ a: 1 });

// \u5143\u7EC4\u7B2C3\u4F4D\u83B7\u5F97
const [, , { state }] = atom(1);
const [, , { state }] = share({ a: 1 });

// atomx\u3001sharex \u8FD4\u56DE\u7ED3\u679C\u89E3\u6784\u83B7\u5F97
const { state } = atomx(1);
const { state } = sharex({ a: 1 });
`,paraId:1,tocIndex:1},{value:"\u5171\u4EAB\u72B6\u6001\u771F\u5B9E\u503C\u5F15\u7528\uFF0C\u5BF9\u4E8E\u975E\u539F\u59CB\u503C",paraId:2,tocIndex:2},{value:"atom",paraId:2,tocIndex:2},{value:"\u8FD4\u56DE\u7ED3\u679C\uFF0CstateVal \u4E3A\u62C6\u7BB1\u540E\u7684\u4EE3\u7406\u5BF9\u8C61\uFF0C\u5BF9\u4E8E\u539F\u59CB\u503C",paraId:2,tocIndex:2},{value:"atom",paraId:2,tocIndex:2},{value:"\u8FD4\u56DE\u7ED3\u679C\uFF0CstateVal \u4E3A\u62C6\u7BB1\u540E\u7684\u539F\u59CB\u503C\u3002",paraId:2,tocIndex:2},{value:"\u5BF9\u4E8E",paraId:3,tocIndex:2},{value:"share",paraId:3,tocIndex:2},{value:"\u8FD4\u56DE\u7ED3\u679C\uFF0C",paraId:3,tocIndex:2},{value:"stateVal",paraId:3,tocIndex:2},{value:"\u548C",paraId:3,tocIndex:2},{value:"state",paraId:3,tocIndex:2},{value:"\u76F8\u7B49\uFF0C\u6307\u5411\u540C\u4E00\u4E2A\u5F15\u7528\u3002",paraId:3,tocIndex:2},{value:"reactive",paraId:4,tocIndex:3},{value:"\u662F\u5168\u5C40\u53EF\u7528\u7684\u54CD\u5E94\u5F0F\u5BF9\u8C61\u771F\u5B9E\u503C\u5F15\u7528\uFF0C\u5BF9\u4E8E\u975E\u539F\u59CB\u503C",paraId:4,tocIndex:3},{value:"atom",paraId:4,tocIndex:3},{value:"\u8FD4\u56DE\u7ED3\u679C\uFF0C",paraId:4,tocIndex:3},{value:"reactive",paraId:4,tocIndex:3},{value:"\u662F\u62C6\u7BB1\u540E\u7684\u4EE3\u7406\u5BF9\u8C61\uFF0C\u53EF\u76F4\u63A5\u5BF9",paraId:4,tocIndex:3},{value:"reactive",paraId:4,tocIndex:3},{value:"\u4FEE\u6539\uFF0C\u9ED8\u8BA4\u6570\u636E\u53D8\u66F4\u5728\u4E0B\u4E00\u6B21\u4E8B\u4EF6\u5FAA\u73AF\u5FAE\u4EFB\u52A1\u5F00\u59CB\u6267\u884C\u524D\u63D0\u4EA4",paraId:4,tocIndex:3},{value:`const { reactive } = sharex({ a: 1 });
setTimeout(() => {
  reactive.a += 1;
}, 1000);
`,paraId:5,tocIndex:3},{value:"reactiveRoot",paraId:6,tocIndex:4},{value:"\u662F\u5168\u5C40\u53EF\u7528\u7684\u54CD\u5E94\u5F0F\u5BF9\u8C61\u6839\u503C\u5F15\u7528\uFF0C\u5BF9\u4E8E\u975E\u539F\u59CB\u503C",paraId:6,tocIndex:4},{value:"atom",paraId:6,tocIndex:4},{value:"\u8FD4\u56DE\u7ED3\u679C\uFF0C",paraId:6,tocIndex:4},{value:"reactiveRoot",paraId:6,tocIndex:4},{value:"\u662F\u62C6\u7BB1\u524D\u7684\u4EE3\u7406\u5BF9\u8C61\u3002",paraId:6,tocIndex:4},{value:"\u5BF9\u4E8E",paraId:7,tocIndex:4},{value:"share",paraId:7,tocIndex:4},{value:"\u8FD4\u56DE\u7ED3\u679C\uFF0C",paraId:7,tocIndex:4},{value:"reactiveRoot",paraId:7,tocIndex:4},{value:"\u548C",paraId:7,tocIndex:4},{value:"reactive",paraId:7,tocIndex:4},{value:"\u76F8\u7B49\uFF0C\u6307\u5411\u540C\u4E00\u4E2A\u5F15\u7528\u3002",paraId:7,tocIndex:4},{value:"\u5171\u4EAB\u5BF9\u8C61\u7684\u552F\u4E00 key \u6570\u5B57\uFF0C\u7531\u5185\u90E8\u751F\u6210",paraId:8,tocIndex:5},{value:"\u5171\u4EAB\u5BF9\u8C61\u7684\u552F\u4E00 key \u5B57\u7B26\u4E32",paraId:9,tocIndex:6},{value:"\u5171\u4EAB\u5BF9\u8C61\u7684\u771F\u5B9E\u503C key",paraId:10,tocIndex:7},{value:"\u5171\u4EAB\u5BF9\u8C61\u662F\u5426\u6709 ",paraId:11,tocIndex:8},{value:"atom",paraId:11,tocIndex:8},{value:" \u63A5\u53E3\u521B\u5EFA",paraId:11,tocIndex:8}]},72222:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(98190);const a=[{value:"\u6279\u91CF\u5B9A\u4E49\u72B6\u6001\u5BF9\u5E94\u7684\u4FEE\u6539\u51FD\u6570\uFF0C\u8FD4\u56DE ",paraId:0,tocIndex:0},{value:"{ actions, eActions, getLoading, useLoading, useLoadingInfo }",paraId:0,tocIndex:0},{value:"\uFF0C \u7EC4\u4EF6\u4E2D\u53EF\u901A\u8FC7 useLoading \u8BFB\u53D6\u5F02\u6B65\u51FD\u6570\u7684\u6267\u884C\u4E2D\u72B6\u6001 loading\u3001\u662F\u5426\u6B63\u5E38\u6267\u884C\u7ED3\u675F ok\u3001\u4EE5\u53CA\u6267\u884C\u51FA\u73B0\u7684\u9519\u8BEF err\uFF0C \u7EC4\u4EF6\u5916\u53EF\u901A\u8FC7 ",paraId:0,tocIndex:0},{value:"getLoading",paraId:0,tocIndex:0},{value:" \u83B7\u53D6",paraId:0,tocIndex:0},{value:"\u672C\u7AE0\u8282\u5C55\u793A\u57FA\u7840\u7528\u6CD5\uFF0C\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"\u6A21\u5757\u5316/defineActions",paraId:2},{value:`// \u3010\u53EF\u9009\u3011\u7EA6\u675F\u5404\u4E2A\u51FD\u6570\u5165\u53C2 payload \u7C7B\u578B
type Payloads = {
  changeA1: number;
  foo: boolean | undefined;
  // \u4E0D\u5F3A\u5236\u8981\u6C42\u4E3A\u6BCF\u4E00\u4E2Aaction key \u90FD\u5B9A\u4E49 payload \u7C7B\u578B\u7EA6\u675F\uFF0C\u4F46\u4E3A\u4E86\u53EF\u7EF4\u62A4\u6027\u5EFA\u8BAE\u90FD\u8865\u4E0A
};

// \u4E0D\u7EA6\u675F payloads \u7C7B\u578B\u65F6\u5199\u4E3A ctx.defineActions()({ ... });
const { actions, eActions, useLoading, getLoading } =
  ctx.defineActions<Payloads>()({
    // \u540C\u6B65 action\uFF0C\u76F4\u63A5\u4FEE\u6539\u8349\u7A3F
    changeA1({ draft, payload }) {
      draft.a.b.c += payload;
    },
    // \u540C\u6B65 action\uFF0C\u8FD4\u56DE\u7ED3\u679C
    changeA2({ draft, payload }) {
      draft.a.b.c += payload;
      return true;
    },
    // \u540C\u6B65 action\uFF0C\u76F4\u63A5\u4FEE\u6539\u8349\u7A3F\u6DF1\u8282\u70B9\u6570\u636E\uFF0C\u4F7F\u7528 merge \u4FEE\u6539\u6D45\u8282\u70B9\u6570\u636E
    changeA3({ draft, payload, merge }) {
      draft.a.b.c += payload;
      merge({ c: 'new desc' }); // \u7B49\u6548\u4E8E draft.c = 'new desc';
      return true;
    },
    // \u5F02\u6B65 action\uFF0C\u76F4\u63A5\u4FEE\u6539\u8349\u7A3F
    async foo1({ draft, payload }) {
      await delay(3000);
      draft.a.b.c += 1000;
    },
    // \u5F02\u6B65 action\uFF0C\u591A\u6B21\u76F4\u63A5\u4FEE\u6539\u8349\u7A3F\uFF0C\u5408\u5E76\u4FEE\u6539\u591A\u4E2A\u72B6\u6001\uFF0C\u540C\u65F6\u8FD4\u56DE\u4E00\u4E2A\u7ED3\u679C
    async foo2({ draft, payload, merge }) {
      draft.a.b.c += 1000;
      await delay(3000); // \u8FDB\u5165\u4E0B\u4E00\u6B21\u4E8B\u4EF6\u5FAA\u73AF\u89E6\u53D1\u8349\u7A3F\u63D0\u4EA4
      draft.a.b.c += 1000;
      await delay(3000); // \u518D\u6B21\u8FDB\u5165\u4E0B\u4E00\u6B21\u4E8B\u4EF6\u5FAA\u73AF\u89E6\u53D1\u8349\u7A3F\u63D0\u4EA4
      const { list, total } = await fetchList();
      merge({ list, total }); // \u7B49\u4EF7\u4E8E draft.list = list, draft.tatal = total
      return true;
    },
  });
`,paraId:3}]},89980:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(99963);const a=[{value:"\u6279\u91CF\u5B9A\u4E49\u72B6\u6001\u5BF9\u5E94\u7684\u5168\u91CF\u6D3E\u751F\u51FD\u6570\uFF0C\u8FD4\u56DE\u7ED3\u679C\u5F62\u5982",paraId:0,tocIndex:0},{value:"{ result, helper: { [key]: runDeriveFn, runDeriveTask, useDerived, useDerivedInfo } }",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"\u6A21\u5757\u5316/defineFullDerive",paraId:2}]},1677:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(27308);const a=[{value:"\u5168\u65B0\u5B9A\u4E49\u4E00\u4E2A\u72B6\u6001\u5BF9\u8C61\u5E76\u5BF9\u5176\u6279\u91CF\u5B9A\u4E49\u6D3E\u751F\u51FD\u6570\uFF0C\u8FD9\u4E9B\u51FD\u6570\u7684\u8BA1\u7B97\u4F9D\u8D56\u6E90\u53EF\u4EE5\u662F\u5F53\u524D",paraId:0,tocIndex:0},{value:"ctx.state",paraId:0,tocIndex:0},{value:"\u4E5F\u53EF\u4EE5\u662F\u5176\u4ED6\u72B6\u6001\uFF0C\u8FD4\u56DE\u7ED3\u679C\u5F62\u5982",paraId:0,tocIndex:0},{value:"{ derivedState, useDerivedState, witnessDict, getLoading, useLoading, useLoadingInfo }",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"\u6A21\u5757\u5316/defineFullDerive",paraId:2}]},64786:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(75786);const a=[{value:"\u6279\u91CF\u5B9A\u4E49\u72B6\u6001\u5BF9\u5E94\u7684\u81EA\u6211\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\uFF0C\u8FD4\u56DE\u7ED3\u679C\u5F62\u5982",paraId:0,tocIndex:0},{value:"{ witnessDict, getLoading, useLoading, useLoadingInfo }",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"\u6A21\u5757\u5316/defineMutateSelf",paraId:2}]},18058:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(64106);const a=[]},82558:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(82809);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api ",paraId:0,tocIndex:0},{value:"flush",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"API/\u5DE5\u5177/flush",paraId:2}]},79012:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(60799);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api ",paraId:0,tocIndex:0},{value:"getActionLoading",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"API/\u5DE5\u5177/getActionLoading",paraId:2}]},91655:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(11164);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api ",paraId:0,tocIndex:0},{value:"getMutateLoading",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"API/\u5DE5\u5177/getMutateLoading",paraId:2}]},686:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(98299);const a=[{value:"\u5171\u4EAB\u4E0A\u4E0B\u6587\u5BF9\u8C61\u6307\u7684\u662F ",paraId:0,tocIndex:0},{value:"atom",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"share",paraId:0,tocIndex:0},{value:" \u8FD4\u56DE\u5143\u7EC4\u91CC\u7684\u7B2C\u4E09\u4F4D\u503C\uFF0C\u4E0A\u4E0B\u6587\u5BF9\u8C61\u672C\u8EAB\u4E5F\u5305\u542B\u4E86\u5143\u7EC4\u524D\u4E24\u4F4D\u53C2\u6570",paraId:0,tocIndex:0},{value:"state",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"setState",paraId:0,tocIndex:0},{value:`const [numAtom, setAtom, atomCtx] = atom(1);
// atomCtx.state === numAtom , atomCtx.setState === setAtom

const [shared, setShared, sharedCtx] = share({ name: 'helux' });
// sharedCtx.state === shared , atomCtx.setState === setShared
`,paraId:1,tocIndex:0},{value:"\u4E5F\u6307",paraId:2,tocIndex:0},{value:"atomx",paraId:2,tocIndex:0},{value:"\u3001",paraId:2,tocIndex:0},{value:"sharex",paraId:2,tocIndex:0},{value:" \u8FD4\u56DE\u7684\u5BF9\u8C61\uFF0C",paraId:2,tocIndex:0},{value:"atomx",paraId:2,tocIndex:0},{value:" \u662F ",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:" \u53D8\u79CD\u8868\u8FBE\u5F62\u5F0F\uFF0C",paraId:2,tocIndex:0},{value:"sharex",paraId:2,tocIndex:0},{value:" \u662F ",paraId:2,tocIndex:0},{value:"share",paraId:2,tocIndex:0},{value:` \u53D8\u79CD\u8868\u8FBE\u5F62\u5F0F\uFF0C
\u5B83\u4EEC\u4E0D\u518D\u8FD4\u56DE\u5143\u7EC4\uFF0C\u800C\u662F\u76F4\u63A5\u8FD4\u56DE\u5171\u4EAB\u4E0A\u4E0B\u6587`,paraId:2,tocIndex:0},{value:`const atomCtx = atomx(1);
const sharedCtx = sharex({ name: 'helux' });
`,paraId:3,tocIndex:0},{value:"\u5171\u4EAB\u4E0A\u4E0B\u6587\u5BF9\u8C61\u4E3B\u8981\u5305\u542B\u4EE5\u4E0B\u5C5E\u6027\u3001\u65B9\u6CD5",paraId:4,tocIndex:0},{value:`// \u8FD9\u4E9B\u51FD\u6570\u5728\u9876\u5C42 api \u5747\u6709\u5B9E\u73B0\uFF0C\u7528\u6CD5\u4E5F\u548C\u9876\u5C42 api \u4E00\u6837\uFF0C\u53EA\u662F\u5C11\u53BB\u4E86\u7ED1\u5B9A\u76EE\u6807\u5171\u4EAB\u72B6\u6001\u7684\u8FC7\u7A0B\uFF08\u5185\u90E8\u5B8C\u6210\u4E86\u7ED1\u5B9A\uFF09
mutate              <-- \u521B\u5EFA\u53EF\u53D8\u6D3E\u751F\u51FD\u6570
runMutate           <-- \u8FD0\u884C\u6307\u5B9A\u7684\u53EF\u53D8\u6D3E\u751F\u51FD\u6570
runMutateTask       <-- \u8FD0\u884C\u6307\u5B9A\u7684\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1
action              <-- \u521B\u5EFA\u4FEE\u6539\u72B6\u6001\u7684\u52A8\u4F5C\u51FD\u6570
call                <-- \u5B9A\u4E49\u4FEE\u6539\u72B6\u6001\u7684\u52A8\u4F5C\u51FD\u6570\u5E76\u7ACB\u5373\u8C03\u7528
useState            <-- \u662F\u7528\u5F53\u524D\u72B6\u6001\u7684\u94A9\u5B50\u51FD\u6570\uFF0C\u4F9Breact\u7EC4\u4EF6\u8C03\u7528
getMutateLoading    <-- \u7EC4\u4EF6\u5916\u83B7\u53D6 mutate \u53EF\u53D8\u6D3E\u751F\u51FD\u6570\u7684\u8FD0\u884C\u72B6\u6001
useMutateLoading    <-- \u7EC4\u4EF6\u5185\u4F7F\u7528 mutate \u53EF\u53D8\u6D3E\u751F\u51FD\u6570\u8FD0\u884C\u72B6\u6001\u7684\u94A9\u5B50
getActionLoading    <-- \u7EC4\u4EF6\u5916\u83B7\u53D6 action \u52A8\u4F5C\u51FD\u6570\u7684\u8FD0\u884C\u72B6\u6001
useActionLoading    <-- \u7EC4\u4EF6\u5185\u4F7F\u7528 action \u52A8\u4F5C\u51FD\u6570\u8FD0\u884C\u72B6\u6001\u7684\u94A9\u5B50
sync                <-- \u5F53\u524D\u72B6\u6001\u7684\u591A\u5C42\u7EA7\u8DEF\u5F84\u503C\u7684\u81EA\u52A8\u540C\u6B65\u51FD\u6570\uFF0C\u901A\u5E38\u7528\u4E8E\u8868\u5355\u53CC\u5411\u7ED1\u5B9A
syncer              <-- \u5F53\u524D\u72B6\u6001\u7684\u5355\u5C42\u7EA7\u8DEF\u5F84\u503C\u7684\u81EA\u52A8\u540C\u6B65\u51FD\u6570\uFF0C\u901A\u5E38\u7528\u4E8E\u8868\u5355\u53CC\u5411\u7ED1\u5B9A

// \u57FA\u4E8E action derive mutate \u8FDB\u4E00\u6B65\u5C01\u88C5\u7684\u5DE5\u5177\u51FD\u6570\uFF0C\u7528\u4E8E\u8F85\u52A9\u5C06\u72B6\u6001\u62C6\u5206\u4E3A\u591A\u6587\u4EF6\u7BA1\u7406\u8D77\u6765\uFF0C\u505A\u66F4\u597D\u7684\u6A21\u5757\u5316\u62BD\u8C61
defineActions       <-- \u521B\u5EFA\u591A\u4E2A\u52A8\u4F5C\u51FD\u6570
defineFullDerive    <-- \u521B\u5EFA\u591A\u4E2A\u5168\u91CF\u6D3E\u751F\u51FD\u6570
defineMutateSelf    <-- \u521B\u5EFA\u591A\u4E2A\u76D1\u542C\u81EA\u5DF1\u53D8\u5316\uFF0C\u4FEE\u6539\u81EA\u5DF1\u5176\u4ED6\u6570\u636E\u8282\u70B9\u7684\u53EF\u53D8\u6D3E\u751F\u51FD\u6570
defineMutateDerive  <-- \u521B\u5EFA\u591A\u4E2A\u76D1\u542C\u81EA\u5DF1\u53D8\u5316\uFF0C\u4FEE\u6539\u65B0\u72B6\u6001\u5176\u4ED6\u6570\u636E\u8282\u70B9\u7684\u53EF\u53D8\u6D3E\u751F\u51FD\u6570
`,paraId:5,tocIndex:0}]},48601:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(75252);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api",paraId:0,tocIndex:0},{value:"mutate",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"API/\u57FA\u7840/mutate",paraId:2}]},81531:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(1390);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api ",paraId:0,tocIndex:0},{value:"reactiveDesc",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"API/\u5DE5\u5177/reactiveDesc",paraId:2}]},63854:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(19565);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api",paraId:0,tocIndex:0},{value:"runMutateTask",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"API/\u57FA\u7840/runMutateTask",paraId:2}]},68986:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(96878);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api",paraId:0,tocIndex:0},{value:"runMutate",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"API/\u57FA\u7840/runMutate",paraId:2}]},16889:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(74780);const a=[{value:"\u9664\u4E86\u5FFD\u7565\u56DE\u8C03\u8FD4\u56DE\u503C\u4EE5\u5916\uFF0C\u5176\u5B83\u4F7F\u7528\u65B9\u5F0F\u548C",paraId:0,tocIndex:0},{value:"setState",paraId:0,tocIndex:0},{value:"\u5747\u4E00\u6837",paraId:0,tocIndex:0}]},85757:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(43559);const a=[{value:"atom",paraId:0,tocIndex:0},{value:"\uFF0C",paraId:0,tocIndex:0},{value:"share",paraId:0,tocIndex:0},{value:"\u63A5\u53E3\u8FD4\u56DE\u7684\u5143\u7EC4\u7B2C\u4E8C\u4F4D\u662F\u4FEE\u6539\u72B6\u6001\u7684\u53E5\u67C4\uFF0C\u652F\u6301\u76F4\u63A5\u4FEE\u6539\u8349\u7A3F\uFF0C\u540C\u65F6\u4E5F\u4F1A\u5904\u7406\u56DE\u8C03\u8FD4\u56DE\u503C",paraId:0,tocIndex:0},{value:`//                \u{1F447} \u4FEE\u6539\u72B6\u6001\u53E5\u67C4
const [state1, setAtom] = atom({ a: 1, b: { b1: 1, b2: 2 } });
//                \u{1F447} \u4FEE\u6539\u72B6\u6001\u53E5\u67C4
const [state1, setState] = share({ a: 1, b: { b1: 1, b2: 2 } });
`,paraId:1,tocIndex:0},{value:"\u4E5F\u53EF\u4EE5\u901A\u8FC7 ctx \u5BF9\u8C61\u83B7\u5F97",paraId:2,tocIndex:0},{value:"setState",paraId:2,tocIndex:0},{value:"\u53E5\u67C4",paraId:2,tocIndex:0},{value:`const [, , ctx] = atom({ a: 1, b: { b1: 1, b2: 2 } });
const [, , ctx] = share({ a: 1, b: { b1: 1, b2: 2 } });
ctx.setState; // \u{1F448} \u4FEE\u6539\u72B6\u6001\u53E5\u67C4

// \u6216\u8005
const ctx = atomx({ a: 1, b: { b1: 1, b2: 2 } });
const ctx = sharex({ a: 1, b: { b1: 1, b2: 2 } });
ctx.setState; // \u{1F448} \u4FEE\u6539\u72B6\u6001\u53E5\u67C4
`,paraId:3,tocIndex:0},{value:"\u539F\u59CB\u503C\u4FEE\u6539",paraId:4,tocIndex:2},{value:`const [state1, setAtom] = atom(1);

console.log(state1.val); // 1
setAtom(100);
console.log(state1.val); // 100
`,paraId:5,tocIndex:2},{value:"\u5BF9\u8C61\u4FEE\u6539",paraId:6,tocIndex:2},{value:`const [state1, setAtom] = atom({ a: 1, b: { b1: 1, b2: 2 } });
const [state2, setShared] = share({ a: 1, b: { b1: 1, b2: 2 } });

// \u6CE8\uFF1A\u6B64\u5904 state1 \u9700\u6765\u81EA atom \u521B\u5EFA\uFF0C\u9700 .val \u53D6\u503C
console.log(state1.val.a); // 1
console.log(state2.a); // 1

// set \u53E5\u67C4\u5185\u90E8\u4F1A\u81EA\u52A8\u88C5\u7BB1\uFF0C\u6545 setAtom\u3001setShared \u8C03\u7528\u65B9\u5F0F\u4E00\u6837
setAtom({ a: 100, b: { b1: 1, b2: 2 } });
setShared({ a: 100, b: { b1: 1, b2: 2 } });

console.log(state1.val.a); // 100
console.log(state2.a); // 100
`,paraId:7,tocIndex:2},{value:"\u539F\u59CB\u503C\u4FEE\u6539\uFF0C\u8FD4\u56DE\u65B0\u503C",paraId:8,tocIndex:3},{value:`const [state1, setAtom] = atom(1);

// \u8FD4\u56DE\u65B0\u503C
setAtom(() => 100);
// \u8FD4\u56DE\u65B0\u503C\uFF08\u57FA\u4E8E\u4E0A\u4E00\u523B\u7684\u503C\uFF09
setAtom((prev) => prev + 100);
`,paraId:9,tocIndex:3},{value:"\u5BF9\u8C61\u503C\u4FEE\u6539\uFF0C\u8FD4\u56DE\u90E8\u5206\u503C\uFF0C\u5185\u90E8\u4F1A\u505A\u6D45\u5408\u5E76\u64CD\u4F5C",paraId:10,tocIndex:3},{value:`const [state1, setAtom] = atom({
  a: 100,
  b: { b1: 1, b2: 2 },
  c: { c1: 1, c2: 2 },
});

// \u5185\u90E8\u4F1A\u5B8C\u6210 newState = { ...prevState, b: { b1: 100, b2: 200 } } \u64CD\u4F5C
setAtom(() => ({ b: { b1: 100, b2: 200 } }));
`,paraId:11,tocIndex:3},{value:"\u5BF9\u8C61\u503C\u4FEE\u6539\uFF0C\u8FD4\u56DE\u65B0\u503C\uFF0C\u66FF\u6362\u6574\u4E2A\u72B6\u6001\uFF08\u76F8\u5F53\u4E8E\u5185\u90E8\u7684\u6D45\u5408\u5E76\u628A\u6574\u4E2A\u72B6\u6001\u4E4B\u524D\u7684\u503C\u90FD\u8986\u76D6\u4E86\uFF09",paraId:12,tocIndex:3},{value:`const [state1, setAtom] = atom({
  a: 100,
  b: { b1: 1, b2: 2 },
  c: { c1: 1, c2: 2 },
});

// \u5185\u90E8\u4F1A\u5B8C\u6210 newState = { ...prevState, ...newPartial } \u64CD\u4F5C
setAtom(() => ({ a: 1, b: { b1: 100, b2: 200 }, c: { c1: 100, c2: 200 } }));
`,paraId:13,tocIndex:3},{value:"\u9488\u5BF9\u5BF9\u8C61\u503C\u4FEE\u6539\u90E8\u5206\u6570\u636E\u7684\u573A\u666F\uFF0C\u56DE\u8C03\u53C2\u6570\u5217\u8868\u540C\u4E8B\u63D0\u4F9B\u4E86\u4E00\u4E2A\u53EF\u76F4\u63A5\u4FEE\u6539\u7684\u8349\u7A3F\u4EE3\u7406\u5BF9\u8C61\uFF0C\u53EF\u57FA\u4E8E\u8BE5\u8349\u7A3F\u5BF9\u8C61\u4FEE\u6539\u4EFB\u610F\u8282\u70B9\u6570\u636E\uFF0C\u751F\u6210\u7684\u65B0\u72B6\u6001\u548C\u65E7\u72B6\u6001\u662F\u7ED3\u6784\u5171\u4EAB\u7684\u6570\u636E\uFF0C\u53EF\u9605\u8BFB",paraId:14,tocIndex:4},{value:"\u6BD4\u8F83\u5BF9\u8C61",paraId:15,tocIndex:4},{value:"\u4E86\u89E3\u66F4\u591A\u3002",paraId:14,tocIndex:4},{value:`const [state1, setAtom] = atom({
  a: 100,
  b: { b1: 1, b2: 2 },
  c: { c1: 1, c2: 2 },
});

// \u4EC5\u4FEE\u6539 b.b1 \u7684\u503C\uFF0C\uFF08\u6CE8\u6B64\u5904\u7684 draft \u5DF2\u81EA\u52A8\u62C6\u7BB1\uFF09
setAtom((draft) => {
  draft.b.b1 = 100;
});
`,paraId:16,tocIndex:4},{value:":::caution \u7BAD\u5934\u51FD\u6570\u9690\u5F0F\u8FD4\u56DE\u503C",paraId:17,tocIndex:4},{value:"\u8FD9\u6837\u7684\u5199\u6CD5",paraId:18,tocIndex:4},{value:"setAtom((draft)=>draft.b.b1 = 100)",paraId:18,tocIndex:4},{value:" ts \u662F\u7F16\u8BD1\u4E0D\u901A\u8FC7\u7684\uFF0C\u56E0\u4E3A\u7BAD\u5934\u51FD\u6570\u9690\u542B\u8FD4\u56DE\u4E86",paraId:18,tocIndex:4},{value:"100",paraId:18,tocIndex:4},{value:"\uFF0C\u8FD9\u4E2A\u503C\u65F6\u4E0D\u80FD\u4E0D\u4F5C\u4E3A\u90E8\u5206\u72B6\u6001\u5408\u5E76\u5230\u5B57\u5178\u91CC\u7684\uFF0C\u6545\u6B64\u5904\u4F7F\u7528\u4E86``setAtom((draft)=>{draft.b.b1 = 100})` \u5E26\u82B1\u62EC\u53F7\u7684\u7BAD\u5934\u51FD\u6570\u5199\u6CD5\u6765\u6D88\u9664\u8FD9\u4E2A\u9690\u5F0F\u8FD4\u56DE\u503C",paraId:18,tocIndex:4},{value:":::",paraId:19,tocIndex:4},{value:"\u9664\u4E86\u5E26\u82B1\u62EC\u53F7\u7684\u7BAD\u5934\u51FD\u6570\u5199\u6CD5\uFF0C\u8FD8\u53EF\u4EE5\u4F7F\u7528",paraId:20,tocIndex:4},{value:"setDraft",paraId:20,tocIndex:4},{value:"\u63A5\u53E3\u6765\u6D88\u9664\u8FD9\u4E2A\u7F16\u8BD1\u9519\u8BEF\uFF0C",paraId:20,tocIndex:4},{value:"setDraft",paraId:20,tocIndex:4},{value:"\u5185\u90E8\u5FFD\u7565\u51FD\u6570\u4EFB\u610F\u8FD4\u56DE\u503C",paraId:20,tocIndex:4},{value:`const [state1, setAtom, ctx] = atom({
  a: 100,
  b: { b1: 1, b2: 2 },
  c: { c1: 1, c2: 2 },
});
// ctx.setDraft((draft) => draft.b.b1 = 100); // \u{1F448} \u6B64\u5904\u7BAD\u5934\u51FD\u6570\u4F53\u65E0\u82B1\u62EC\u53F7\u5305\u88F9\u4E5F\u80FD\u6B63\u5E38\u7F16\u8BD1\u901A\u8FC7

// \u4E5F\u53EF\u4F7F\u7528 atomx \u83B7\u5F97 ctx\uFF0C\u6B64\u65F6\u53EF\u5199\u4E3A const ctx = atomx(...); ctx.setDraft(...)
`,paraId:21,tocIndex:4},{value:"Map \u5BF9\u8C61\u503C\u4FEE\u6539",paraId:22,tocIndex:4},{value:`const [state1, setAtom] = atom(
  new Map([
    [1, { id: 1, name: '1' }],
    [2, { id: 2, name: '2' }],
  ]),
);

// \u4EC5\u4FEE\u6539 key \u4E3A 1 \u5BF9\u5E94\u7684\u503C\uFF0C\uFF08\u6CE8\u6B64\u5904\u7684 draft \u5DF2\u81EA\u52A8\u62C6\u7BB1\uFF09
setAtom((draft) => (draft.get(1).name = 'new'));
`,paraId:23,tocIndex:4},{value:"List \u5BF9\u8C61\u503C\u4FEE\u6539",paraId:24,tocIndex:4},{value:`const [state1, setAtom] = atom([
  { id: 1, name: '2' },
  { id: 1, name: '2' },
]);
setAtom((draft) => (draft[0].name = 'new'));
`,paraId:25,tocIndex:4},{value:"setState",paraId:26,tocIndex:5},{value:"\u63A5\u53E3\u652F\u6301\u56DE\u8C03\u91CC\u4FEE\u6539\u65E2\u4FEE\u6539\u90E8\u5206\u72B6\u6001\uFF0C\u540C\u65F6\u4E5F\u8FD4\u56DE\u90E8\u5206\u72B6\u6001",paraId:26,tocIndex:5},{value:`const [state1, setAtom] = atom({
  a: 100,
  b: { b1: 1, b2: 2 },
  c: { c1: 1, c2: 2 },
});

setAtom((draft) => {
  draft.b.b1 = 100;
  return { a: 1 }; // \u{1F448} \u7B49\u6548\u4E8E\u5199\u4E3A\uFF1Adraft.a = 1
});
`,paraId:27,tocIndex:5}]},763:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(88583);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api",paraId:0,tocIndex:0},{value:"sync",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"API/\u57FA\u7840/sync",paraId:2}]},21417:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(44388);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api",paraId:0,tocIndex:0},{value:"syncer",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"API/\u57FA\u7840/syncer",paraId:2}]},32740:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(23740);const a=[{value:"\u7EC4\u4EF6\u4E2D\u4F7F\u7528",paraId:0,tocIndex:0},{value:"action",paraId:0,tocIndex:0},{value:"\u51FD\u6570\u7684\u6267\u884C\u72B6\u6001",paraId:0,tocIndex:0},{value:"\u548C\u9876\u5C42 api",paraId:1},{value:"Hooks/useActionLoading",paraId:2},{value:" \u4F7F\u7528\u65B9\u5F0F\u4FDD\u6301\u4E00\u81F4\uFF0C\u533A\u522B\u662F\u5185\u90E8\u81EA\u52A8\u7ED1\u5B9A\u4E86\u5F53\u524D\u5171\u4EAB\u72B6\u6001",paraId:1}]},98885:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(69723);const a=[{value:"\u5F3A\u5236\u66F4\u65B0\u8BA2\u9605\u4E86\u67D0\u4E2A\u8282\u70B9\u53D8\u5316\u7684\u6240\u6709\u7EC4\u4EF6\u5B9E\u4F8B",paraId:0,tocIndex:0},{value:"\u548C\u9876\u5C42 api",paraId:1},{value:"Hooks/useGlobalForceUpdate",paraId:2},{value:" \u4F7F\u7528\u65B9\u5F0F\u4FDD\u6301\u4E00\u81F4\uFF0C\u533A\u522B\u662F\u5185\u90E8\u81EA\u52A8\u7ED1\u5B9A\u4E86\u5F53\u524D\u5171\u4EAB\u72B6\u6001",paraId:1}]},41522:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(27811);const a=[{value:"\u5F3A\u5236\u66F4\u65B0\u5F53\u524D\u7EC4\u4EF6\u5B9E\u4F8B",paraId:0,tocIndex:0},{value:"\u548C\u9876\u5C42 api",paraId:1},{value:"Hooks/useLocalForceUpdate",paraId:2},{value:" \u4FDD\u6301\u4E00\u81F4",paraId:1}]},89870:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(99647);const a=[{value:"\u4F7F\u7528\u672C\u5730\u72B6\u6001",paraId:0,tocIndex:0},{value:"\u548C\u9876\u5C42 api",paraId:1},{value:"Hooks/useMutable",paraId:2},{value:" \u4FDD\u6301\u4E00\u81F4",paraId:1}]},5094:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(32088);const a=[{value:"\u7EC4\u4EF6\u4E2D\u4F7F\u7528",paraId:0,tocIndex:0},{value:"mutate",paraId:0,tocIndex:0},{value:"\u51FD\u6570\u7684\u6267\u884C\u72B6\u6001",paraId:0,tocIndex:0},{value:"\u548C\u9876\u5C42 api",paraId:1},{value:"Hooks/useMutateLoading",paraId:2},{value:" \u4F7F\u7528\u65B9\u5F0F\u4FDD\u6301\u4E00\u81F4\uFF0C\u533A\u522B\u662F\u5185\u90E8\u81EA\u52A8\u7ED1\u5B9A\u4E86\u5F53\u524D\u5171\u4EAB\u72B6\u6001",paraId:1}]},2684:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(23619);const a=[{value:"\u7EC4\u4EF6\u4E2D\u4F7F\u7528",paraId:0,tocIndex:0},{value:"reactive",paraId:0,tocIndex:0},{value:"\u54CD\u5E94\u5F0F\u72B6\u6001",paraId:0,tocIndex:0},{value:"\u548C\u9876\u5C42 api",paraId:1},{value:"Hooks/useReactive",paraId:2},{value:" \u4F7F\u7528\u65B9\u5F0F\u4FDD\u6301\u4E00\u81F4\uFF0C\u533A\u522B\u662F\u5185\u90E8\u81EA\u52A8\u7ED1\u5B9A\u4E86\u5F53\u524D\u5171\u4EAB\u72B6\u6001",paraId:1}]},7168:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(98304);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api",paraId:0,tocIndex:0},{value:"useAtomX",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"Hooks/useAtomX",paraId:2}]},27025:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(42379);const a=[{value:"\u529F\u80FD\u540C\u9876\u5C42 api",paraId:0,tocIndex:0},{value:"useAtom",paraId:0,tocIndex:0},{value:"\uFF0C\u81EA\u52A8\u7ED1\u5B9A\u4E86\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u8C03\u7528\u65F6\u65E0\u9700\u518D\u7ED1\u5B9A\u3002",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"Hooks/useAtom",paraId:2}]},59821:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(83206);const a=[]},88002:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(3018);const a=[{value:"\u901A\u8FC7 ",paraId:0,tocIndex:0},{value:"action",paraId:0,tocIndex:0},{value:" \u5DE5\u5382\u51FD\u6570\u521B\u5EFA\u4E13\u7528\u4E8E\u4FEE\u6539\u72B6\u6001\u7684 ",paraId:0,tocIndex:0},{value:"action",paraId:0,tocIndex:0},{value:" \u540C\u6B65\u6216\u5F02\u6B65\u51FD\u6570",paraId:0,tocIndex:0},{value:"\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"\u6307\u5357/Action",paraId:2},{value:`import { share, action } from 'helux';

const { state } = sharex({ a: 1, b: 2 });

const hiAction = action(state)()(({ draft, payload }) => {
  draft.a += 100;
}, 'hiAction');
`,paraId:3,tocIndex:2},{value:"\u7EA6\u675F",paraId:4,tocIndex:2},{value:"payload",paraId:4,tocIndex:2},{value:"\u7C7B\u578B",paraId:4,tocIndex:2},{value:`const hiAction = action(state)<[number, string]>()(({ draft, payload }) => {
  draft.a += 100;
}, 'hiAction');
`,paraId:5,tocIndex:2},{value:"\u548C\u521B\u5EFA\u540C\u6B65 action \u65B9\u5F0F\u4E00\u6837\uFF0C\u53EA\u9700\u5C06\u51FD\u6570\u58F0\u660E\u4E3A\u5F02\u6B65\u51FD\u6570\u5373\u53EF\uFF0C\u8349\u7A3F\u53D8\u66F4\u540E\uFF0C\u4F1A\u5728\u4E0B\u4E00\u6B21\u4E8B\u4EF6\u5FAA\u73AF\u7684\u5FAE\u4EFB\u52A1\u5F00\u59CB\u524D\u63D0\u4EA4\u53D8\u66F4\u6570\u636E",paraId:6,tocIndex:3},{value:`const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const hiAsyncAction = action(state)()(async ({ draft, payload }) => {
  draft.a += 100;
  await delay(); // \u89E6\u53D1 drart \u63D0\u4EA4
  draft.a += 100;
}, 'hiAsyncAction');
`,paraId:7,tocIndex:3}]},42755:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(49183);const a=[{value:"atom",paraId:0,tocIndex:0},{value:"\u652F\u6301\u5305\u62EC\u539F\u59CB\u7C7B\u578B\u5728\u5185\u7684\u6240\u6709\u7C7B\u578B\uFF0C\u4F46\u4F1A\u88AB\u88C5\u7BB1\u4E3A",paraId:0,tocIndex:0},{value:"{ val: any }",paraId:0,tocIndex:0},{value:" \u7ED3\u6784\uFF0C\u76F4\u63A5\u8BFB\u53D6\u65F6\u9700\u8981\u53D6",paraId:0,tocIndex:0},{value:".val",paraId:0,tocIndex:0},{value:"\u505A\u62C6\u7BB1\u64CD\u4F5C",paraId:0,tocIndex:0},{value:`import { atom } from 'helux';

const [numAtom] = atom(1); // { val: 1 }
const [boolAtom] = atom(true); // { val: true }
const [listAtom] = atom([1, 2, 3]); // { val: [1,2,3] }
const [dictAtom] = atom({ desc: 'helux atom' }); // { val: { desc: 'helux atom'} }

// \u4E5F\u652F\u6301 Map Set \u7ED3\u6784\uFF0C\u4F46\u4E0D\u5EFA\u8BAE\u4F7F\u7528\uFF0C\u4E0D\u5229\u4E8E\u540E\u671F\u505A\u6570\u636E\u6301\u4E45\u5316
const [numAtom] = atom(
  new Map([
    [1, 1],
    [2, 2],
  ]),
);
`,paraId:1,tocIndex:1},{value:"\u652F\u6301\u4F20\u5165\u521D\u59CB\u503C\u5DE5\u5382\u51FD\u6570\uFF0C\u63A8\u8350\u4F7F\u7528\u6B64\u65B9\u5F0F",paraId:2,tocIndex:1},{value:`const [numAtom] = atom(() => 66); // numAtom: { val: 66 }
const [numAtom] = atom(() => [1, 2, 3]); // numAtom: { val: [1,2,3] }
`,paraId:3,tocIndex:1},{value:"\u7EC4\u4EF6\u5916\u53D6\u503C\u6216\u4FEE\u6539\u503C\u9700\u505A\u4E00\u6B21",paraId:4,tocIndex:1},{value:".val",paraId:4,tocIndex:1},{value:"\u64CD\u4F5C",paraId:4,tocIndex:1},{value:`const [numAtom, setAtom] = atom(1);
const [dictAtom, setDict] = atom({ desc: 'helux atom', info: { born: 2023 } });

// \u539F\u59CB\u503C\u8BFB\u53D6
console.log(numAtom.val);
// \u5BF9\u8C61\u503C\u8BFB\u53D6
console.log(dictAtom.val.info.born);
`,paraId:5,tocIndex:1},{value:"atom",paraId:6,tocIndex:1},{value:" \u8FD4\u56DE\u5143\u7EC4\u5B8C\u6574\u7ED3\u6784\u4E3A",paraId:6,tocIndex:1},{value:"[ state, setter, ctx ]",paraId:6,tocIndex:1},{value:"\uFF0C\u5206\u522B\u662F\u72B6\u6001\uFF0C\u4FEE\u6539\u53E5\u67C4\uFF0C\u548C\u5305\u542B\u4E86\u5176\u4ED6\u529F\u80FD\u7684",paraId:6,tocIndex:1},{value:"\u5171\u4EAB\u4E0A\u4E0B\u6587",paraId:7,tocIndex:1},{value:`import { atom } from 'helux';

// \u8FD4\u56DE\u5143\u7EC4 [ state, setter, ctx ]
const [numAtom, setAtom, atomCtx] = atom(1);
`,paraId:8,tocIndex:1},{value:"\u4F7F\u7528\u5143\u7EC4\u7B2C\u4E8C\u4F4D\u53C2\u6570",paraId:9,tocIndex:3},{value:"setter",paraId:9,tocIndex:3},{value:"\u4FEE\u6539\u539F\u59CB\u503C\u6570\u636E\u7C7B\u578B\u72B6\u6001",paraId:9,tocIndex:3},{value:`const [numAtom, setAtom] = atom(1);

setAtom(() => Math.random()); // \u56DE\u8C03\u8FD4\u56DE\u6700\u65B0\u503C
setAtom((draft) => draft + Math.random()); // \u590D\u7528\u56DE\u8C03\u8349\u7A3F\u8FD4\u56DE\u6700\u65B0\u503C
setAtom(Math.random()); // \u76F4\u63A5\u4F20\u5165\u6700\u65B0\u503C
`,paraId:10,tocIndex:3},{value:"\u4F7F\u7528\u5143\u7EC4\u7B2C\u4E8C\u4F4D\u53C2\u6570",paraId:11,tocIndex:4},{value:"setter",paraId:11,tocIndex:4},{value:"\u4FEE\u6539\u975E\u539F\u59CB\u503C\u6570\u636E\u7C7B\u578B\u72B6\u6001",paraId:11,tocIndex:4},{value:"\u56DE\u8C03\u91CC draft \u5DF2\u81EA\u52A8\u62C6\u7BB1\uFF0C\u65E0\u9700",paraId:12},{value:".val",paraId:12},{value:"\u53D6\u503C",paraId:12},{value:`const [dictAtom, setDict] = atom({
  desc: 'helux atom',
  info: { born: 2023 },
  extra: { author: 'fantasticsoul' },
});

// \u5BF9\u8C61\u503C\u4FEE\u6539\uFF0C\u4FEE\u6539\u7ED3\u675F\u540E\uFF0C\u4F1A\u751F\u6210\u4E00\u4EFD\u5177\u6709\u7ED3\u6784\u5171\u4EAB\u7279\u6027\u7684\u65B0\u72B6\u6001
setDict((draft) => {
  draft.info.born = 2022;
  draft.desc = 'hello helux';
});
`,paraId:13},{value:"\u6CE8\u610F\u7BAD\u5934\u51FD\u6570\u91CC\u4E00\u884C\u4EE3\u7801\u7ED9 draft \u8D4B\u503C\u65F6\uFF0C\u7BAD\u5934\u51FD\u6570\u5B58\u5728\u9690\u542B\u8FD4\u56DE\u503C\u5BFC\u81F4 ts \u7F16\u8BD1\u4E0D\u901A\u8FC7\u7684\u95EE\u9898",paraId:14},{value:"\u5143\u7EC4\u7B2C\u4E8C\u4F4D setter \u662F\u4F1A\u5904\u7406\u8FD4\u56DE\u503C\u7684\uFF0C\u7BAD\u5934\u51FD\u6570\u7684\u9690\u542B\u8FD4\u56DE\u503C\u7C7B\u578B\u548C atom \u5BF9\u8C61\u7C7B\u578B\u4E0D\u5339\u914D\uFF0C\u6B64\u65F6\u5BFC\u81F4\u7F16\u8BD1\u62A5\u9519",paraId:15},{value:`const [, setState, ctx] = atom({ a: 1, b: 2 });
// \u274C ts \u6821\u9A8C\u5931\u8D25\uFF0C\u8FD9\u91CC\u8FD4\u56DE\u4E86 1\uFF0C\u548C atom \u7C7B\u578B Partial<T> \u4E0D\u5339\u914D
setState((draft) => (draft.a = 1));

// \u2705 \u4EE5\u4E0B3\u79CD\u65B9\u5F0F ts \u6821\u9A8C\u901A\u8FC7
// 1 \u4F7F\u7528void\u5305\u88F9\uFF0C\u6D88\u9664\u9690\u5F0F\u8FD4\u56DE\u503C
setState((draft) => void (draft.a = 1));
// 2 \u4F7F\u7528 {} \u5305\u88F9\u7BAD\u5934\u51FD\u6570\u4F53
setState((draft) => {
  draft.a = 1;
});
// \u6216\u4F7F\u7528\u5171\u4EAB\u4E0A\u4E0B\u6587\u7684 setDraft \u63A5\u53E3
ctx.setDraft((draft) => (draft.a = 1));
`,paraId:16},{value:"\u521B\u5EFA",paraId:17,tocIndex:5},{value:"atom",paraId:17,tocIndex:5},{value:"\u5BF9\u8C61\u652F\u6301\u4F20\u5165",paraId:17,tocIndex:5},{value:"ICreateOptions",paraId:17,tocIndex:5},{value:"\u53EF\u9009\u53C2\u6570\uFF0C\u5305\u542B\u4EE5\u4E0B\u5C5E\u6027\u53EF\u4EE5\u8BBE\u7F6E",paraId:17,tocIndex:5},{value:"\u6A21\u5757\u540D\u79F0",paraId:18,tocIndex:6},{value:"\uFF0C\u65B9\u4FBF\u7528\u6237\u53EF\u4EE5\u67E5\u770B\u5230\u8BED\u4E49\u5316\u7684\u72B6\u6001\u6811\uFF0C",paraId:18,tocIndex:6},{value:"@helux/dev-tool",paraId:18,tocIndex:6},{value:"\u63D2\u4EF6\u4E5F\u4EC5\u63A5\u53D7\u8BBE\u7F6E\u4E86\u6A21\u5757\u540D\u7684\u72B6\u6001\u6765\u505A\u53EF\u89C6\u5316\u5448\u73B0\uFF0C\u63A8\u8350\u6309\u4E1A\u52A1\u540D\u8BBE\u7F6E\u3002",paraId:18,tocIndex:6},{value:`:::success{title=\u8BBE\u7F6E\u4EE5\u5426\u4E0D\u5F71\u54CD helux \u8FD0\u884C}
\u4E0D\u8BBE\u7F6E\u7684\u8BDD\u5185\u90E8\u4F1A\u4EE5\u751F\u6210\u7684\u81EA\u589E\u5E8F\u53F7\u4F5C\u4E3A key\uFF0C\u5982\u679C\u8BBE\u7F6E\u91CD\u590D\u4E86\uFF0C\u76EE\u524D\u4EC5\u63A7\u5236\u53F0\u505A\u4E2A\u8B66\u544A\uFF0Chelux \u5185\u90E8\u59CB\u7EC8\u4EE5\u751F\u6210\u7684\u81EA\u589E\u5E8F\u53F7\u4F5C\u4E3A\u6A21\u5757\u547D\u540D\u7A7A\u95F4\u63A7\u5236\u5176\u4ED6\u903B\u8F91
:::`,paraId:19,tocIndex:6},{value:`atom({ a: 1, b: 2 }, { moduleName: 'user' });
`,paraId:20,tocIndex:6},{value:"\u9ED8\u8BA4\u503C ",paraId:21,tocIndex:7},{value:"private",paraId:21,tocIndex:7},{value:" \uFF0C\u8868\u793A loading \u5BF9\u8C61\u8BB0\u5F55\u7684\u4F4D\u7F6E",paraId:21,tocIndex:7},{value:"\u4E0D\u8BB0\u5F55",paraId:22,tocIndex:7},{value:"loading",paraId:22,tocIndex:7},{value:"\u72B6\u6001",paraId:22,tocIndex:7},{value:`import { cst } from 'helux';
atom({ a: 1, b: 2 }, { recordLoading: cst.RECORD_LOADING.NO });
`,paraId:23,tocIndex:7},{value:"\u8BB0\u5F55",paraId:24,tocIndex:7},{value:"loading",paraId:24,tocIndex:7},{value:"\u72B6\u6001\u5230\u5171\u4EAB\u72B6\u6001\u5BF9\u5E94\u7684\u4F34\u751F loading \u72B6\u6001\u4E0A",paraId:24,tocIndex:7},{value:`import { cst } from 'helux';
atom({ a: 1, b: 2 }, { recordLoading: cst.RECORD_LOADING.PRIVATE });
`,paraId:25,tocIndex:7},{value:"\u8BB0\u5F55",paraId:26,tocIndex:7},{value:"loading",paraId:26,tocIndex:7},{value:"\u72B6\u6001\u5230\u5171\u4EAB\u72B6\u6001\u5BF9\u5E94\u7684\u5168\u5C40 loading \u72B6\u6001\u4E0A",paraId:26,tocIndex:7},{value:"\u6B64\u6A21\u5F0F\u9700\u8981\u5C0F\u5FC3\u89C4\u5212",paraId:27},{value:"action",paraId:27},{value:"\u3001",paraId:27},{value:"mutate",paraId:27},{value:"\u5404\u4E2A\u51FD\u6570\u7684\u540D\u79F0\uFF0C\u591A\u4E2A\u72B6\u6001\u5BF9\u5E94",paraId:27},{value:"action",paraId:27},{value:"\u3001",paraId:27},{value:"mutate",paraId:27},{value:"\u5404\u4E2A\u51FD\u6570\u540D\u79F0\u91CD\u590D\u65F6\uFF0C\u4F1A\u76F8\u4E92\u8986\u76D6\u5404\u81EA\u7684 loading \u72B6\u6001",paraId:27},{value:`import { cst } from 'helux';
atom({ a: 1, b: 2 }, { recordLoading: cst.RECORD_LOADING.GLOBAL });
`,paraId:28},{value:"\u63A7\u5236\u5B57\u5178\u5BF9\u8C61\u7684\u4F9D\u8D56\u6536\u96C6\u6DF1\u5EA6\uFF0C\u9ED8\u8BA4",paraId:29,tocIndex:8},{value:"6",paraId:29,tocIndex:8},{value:`const [state, setState, ctx] = share(
  {
    a: {
      b: {
        list: [
          { name: 1, age: 2, info: { street: 'u_road' } },
          { name: 2, age: 22, info: { street: 'u_road_2' } },
        ],
      },
    },
    a1: { a2: { a3: { a4: { a5: { a6: { a7: { a8: 1 } } } } } } },
  },
  {
    stopDepth: 12, // \u6539\u4E3A 12
  },
);
`,paraId:30,tocIndex:8},{value:"\u63A7\u5236\u6570\u7EC4\u662F\u5426\u53EA\u6536\u96C6\u5230\u4E0B\u6807\u4F4D\u7F6E\uFF0C\u9ED8\u8BA4 ",paraId:31,tocIndex:9},{value:"true",paraId:31,tocIndex:9},{value:"\uFF0C\u8868\u793A\u9488\u5BF9\u6570\u7EC4\u53EA\u6536\u96C6\u5230\u4E0B\u6807\u4F4D\u7F6E",paraId:31,tocIndex:9},{value:`const [state, setState, ctx] = share(
  {
    /** ... */
  },
  {
    stopArrDep: false, // \u5BF9\u8C61\u91CC\u7684\u6240\u6709\u6570\u7EC4\u90FD\u7EE7\u7EED\u5411\u4E0B\u6536\u96C6\uFF08\u5373\u5173\u95ED\u53EA\u6536\u96C6\u5230\u4E0B\u6807\u4F4D\u7F6E\u89C4\u5219\uFF09
  },
);
`,paraId:32,tocIndex:9},{value:"\u7531\u4E8E\u6570\u7EC4\u65F6\u52A8\u6001\u53D8\u5316\u7684\u7ED3\u6784\uFF0C\u5F00\u542F\u540E\u5982\u9047\u5230\u957F\u5EA6\u5F88\u5927\u7684\u6570\u7EC4\uFF0C\u4F1A\u6536\u96C6\u5230\u5927\u91CF\u4F9D\u8D56\uFF0C\u7528\u6237\u9700\u81EA\u5DF1\u8BC4\u4F30\u989D\u5916\u7684\u6027\u80FD\u635F\u8017\u9020\u6210\u7684\u5F71\u54CD\u662F\u5426\u4E3B\u5E94\u7528",paraId:33},{value:"stopDep",paraId:34,tocIndex:10},{value:"\uFF1A\u9488\u5BF9\u72B6\u6001\u67D0\u4E9B\u8282\u70B9\u8BBE\u7F6E\u6536\u96C6\u89C4\u5219\uFF0C\u503C\u4E3A",paraId:34,tocIndex:10},{value:"true",paraId:34,tocIndex:10},{value:"\u4F9D\u8D56\u6536\u96C6\u5230\u8FD9\u4E00\u5C42\u540E\u5C31\u505C\u6B62\uFF0C\u53EF\u5E72\u9884",paraId:34,tocIndex:10},{value:"stopDepth",paraId:34,tocIndex:10},{value:"\u7684\u7ED3\u679C\uFF0C\u4F8B\u5982\u5171\u4EAB\u72B6\u6001\u7684",paraId:34,tocIndex:10},{value:"stopDepth",paraId:34,tocIndex:10},{value:"\u662F",paraId:34,tocIndex:10},{value:"6",paraId:34,tocIndex:10},{value:"\uFF0C\u4F46\u67D0\u4E2A\u6DF1\u5EA6\u4E3A",paraId:34,tocIndex:10},{value:"4",paraId:34,tocIndex:10},{value:"\u7684\u8282\u70B9\u8BBE\u7F6E",paraId:34,tocIndex:10},{value:"stopDep",paraId:34,tocIndex:10},{value:"\u4E3A",paraId:34,tocIndex:10},{value:"true",paraId:34,tocIndex:10},{value:"\uFF0C\u5C31\u8FBE\u6210\u4E86\u9488\u5BF9\u8FD9\u4E2A\u6570\u636E\u8282\u70B9\u72EC\u7ACB\u5E72\u9884\u7684\u6548\u679C\u3002",paraId:34,tocIndex:10},{value:`const [state, setState, ctx] = atom(
  {
    /** ... */
  },
  {
    rules: [
      // \u5F53\u8BFB\u53D6\u6216\u5199\u5165 a.b.list \u6570\u636E\u65F6\uFF0C\u505C\u6B62\u4F9D\u8D56\u6536\u96C6\uFF0C\u5373\u4F9D\u8D56\u53EA\u8BB0\u5F55\u5230\u4E0B\u6807\uFF0C\u6B64\u8BBE\u5B9A\u4F18\u5148\u7EA7\u9AD8\u4E8E\u9876\u5C42\u7684 stopArrDep
      { when: (state) => state.a.b.list, stopDep: true },
    ],
    stopArrDep: false, // \u8FD9\u4E2A\u914D\u7F6E\u9488\u5BF9 state.a.b.list \u5C06\u65E0\u6548
  },
);
`,paraId:35,tocIndex:10},{value:"ids",paraId:36,tocIndex:10},{value:"\uFF1A\u5F53 a.b.list \u53D8\u5316\u65F6\uFF0C\u901A\u77E5\u8BBE\u5B9A\u4E86 id \u4E3A ",paraId:36,tocIndex:10},{value:"up1",paraId:36,tocIndex:10},{value:"\uFF0C",paraId:36,tocIndex:10},{value:"up2",paraId:36,tocIndex:10},{value:" \u7684\u7EC4\u4EF6\u91CD\u6E32\u67D3\uFF0C\u5C3D\u7BA1",paraId:36,tocIndex:10},{value:"up1",paraId:36,tocIndex:10},{value:"\uFF0C",paraId:36,tocIndex:10},{value:"up2",paraId:36,tocIndex:10},{value:"\u5BF9\u5E94\u7EC4\u4EF6\u53EF\u80FD\u5BF9 state.a.b.list \u65E0\u4F9D\u8D56\uFF0C\u4E5F\u4F1A\u88AB\u91CD\u6E32\u67D3\u3002",paraId:36,tocIndex:10},{value:`const [state, setState, ctx] = share({ ... }, {
  rules: [
    { when: state => state.a.b.list, ids: ['up1', 'up2']},
  ],
});

// \u4F7F\u7528\u4E86 id \u7684\u7EC4\u4EF6
function Demo(){
  useAtom(someAtom, { id: 'up1' });
}
`,paraId:37,tocIndex:10},{value:"\u9ED8\u8BA4 ",paraId:38,tocIndex:11},{value:"true",paraId:38,tocIndex:11},{value:"\uFF0C\u662F\u5426\u6765\u81EA",paraId:38,tocIndex:11},{value:"mutate",paraId:38,tocIndex:11},{value:"\u6216",paraId:38,tocIndex:11},{value:"watch",paraId:38,tocIndex:11},{value:"\u7684\u6B7B\u5FAA\u73AF\uFF0C\u8BBE\u7F6E\u4E3A ",paraId:38,tocIndex:11},{value:"false",paraId:38,tocIndex:11},{value:" \u8868\u793A\u4E0D\u68C0\u67E5",paraId:38,tocIndex:11},{value:"helux",paraId:39},{value:"\u4F1A\u5728\u8FD0\u884C\u65F6\u63A2\u6D4B\u51FA\u6B7B\u5FAA\u73AF\u5B58\u5728\u7684\u60C5\u51B5\uFF0C\u5E76\u63D0\u524D\u963B\u65AD\u65E0\u9650\u8C03\u7528\u4EA7\u751F\uFF0C\u540C\u65F6\u7ED9\u5F39\u7A97\u8B66\u544A\u548C\u63A7\u5236\u53F0\u8B66\u544A\uFF0C\u9632\u6B62\u5E94\u7528\u5D29\u6E83\uFF0C\u63A7\u5236\u53F0\u4F1A\u8F93\u51FA\u5F15\u8D77\u6B7B\u5FAA\u73AF\u7684\u8D77\u6E90\u51FD\u6570\uFF0C\u65B9\u4FBF\u7528\u6237\u5B9A\u4F4D\u95EE\u9898",paraId:39},{value:`const [state, setState, ctx] = atom(
  {
    /** ... */
  },
  {
    checkDeadCycle: false, // \u4E0D\u68C0\u67E5\u6B7B\u5FAA\u73AF
  },
);
`,paraId:40},{value:"\u662F\u5426\u8C03\u7528",paraId:41,tocIndex:12},{value:"window.alert",paraId:41,tocIndex:12},{value:"\u5F3A\u5F39\u6765\u81EA",paraId:41,tocIndex:12},{value:"mutate",paraId:41,tocIndex:12},{value:"\u6216",paraId:41,tocIndex:12},{value:"watch",paraId:41,tocIndex:12},{value:"\u7684\u6B7B\u5FAA\u73AF\u63D0\u793A\uFF0C\u9ED8\u8BA4",paraId:41,tocIndex:12},{value:"undefined",paraId:41,tocIndex:12},{value:"\uFF0C\u4E0D\u914D\u7F6E\u6B64\u9879\u65F6\uFF0C\u5F00\u53D1\u73AF\u5883\u5F39\u6B7B\u5FAA\u73AF\u63D0\u793A\uFF0C\u751F\u4EA7\u73AF\u5883\u4E0D\u5F39",paraId:41,tocIndex:12},{value:`const [state, setState, ctx] = atom(
  {
    /** ... */
  },
  {
    alertDeadCycleErr: false, // \u4E0D\u5F39\u6B7B\u5FAA\u73AF\u63D0\u793A\uFF0C\u53EA\u901A\u8FC7\u63A7\u5236\u53F0\u6253\u5370
  },
);
`,paraId:42,tocIndex:12},{value:"default: ",paraId:43,tocIndex:13},{value:"true",paraId:43,tocIndex:13},{value:"\uFF0C\u662F\u5426\u5141\u8BB8 ",paraId:43,tocIndex:13},{value:"mutate",paraId:43,tocIndex:13},{value:" \u6267\u884C\uFF0C\u53EF\u4EE5\u521B\u5EFA atom \u65F6\u8BBE\u7F6E\uFF0C\u4E5F\u53EF\u4EE5\u4E2D\u9014\u901A\u8FC7 ",paraId:43,tocIndex:13},{value:"setEnableMutate",paraId:43,tocIndex:13},{value:" \u53CD\u590D\u8BBE\u7F6E",paraId:43,tocIndex:13},{value:"\u6B64\u53C2\u6570\u504F\u5411\u4E8E\u63D0\u4F9B\u7ED9\u5F00\u53D1\u8005\u4F7F\u7528\uFF0C\u4E1A\u52A1\u5C42\u9762\u5927\u591A\u6570\u7528\u4E0D\u5230\u6B64\u7279\u6027",paraId:44},{value:"\u5B9A\u4E49\u5F53\u524D\u72B6\u6001\u7684",paraId:45,tocIndex:14},{value:"\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:46,tocIndex:14},{value:"\uFF0C\u63A8\u8350\u901A\u8FC7 [defineMutateSelf]\u3001[mutate]\u3001[mutateDict] \u5728\u5916\u90E8\u5B9A\u4E49 mutate \u51FD\u6570\uFF0C\u4EE5\u4FBF\u83B7\u5F97\u66F4\u597D\u7684\u7C7B\u578B\u63A8\u5BFC",paraId:45,tocIndex:14},{value:"\u5B9A\u4E49\u4E00\u4E2A\u540C\u6B65\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:47,tocIndex:14},{value:`const [state, setState, ctx] = atom({ a: 1, b: 0 }, {
  // a \u53D8\u5316\u65F6\u8BA1\u7B97 b
  mutate: draft => draft.b = draft.a + 1;
});
`,paraId:48,tocIndex:14},{value:"\u6570\u7EC4\u65B9\u5F0F\u5B9A\u4E49\u591A\u4E2A\u540C\u6B65\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:49,tocIndex:14},{value:`const [state, setState, ctx] = atom({ a: 1, b: 0, c: 0 }, {
  mutate: [
     draft => draft.b = draft.a + 1,
     draft => draft.c = draft.a + 10,
  ];
});
`,paraId:50,tocIndex:14},{value:"\u6570\u7EC4\u65B9\u5F0F\u5B9A\u4E49\u591A\u4E2A\u5E26\u63CF\u8FF0\u7684\u540C\u6B65\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:51,tocIndex:14},{value:`const [state, setState, ctx] = atom({ a: 1, b: 0, c: 0 }, {
  mutate: [
     {
       fn: draft => draft.b = draft.a + 1,
       desc: 'changeB',
     },
     {
       fn: draft => draft.c = draft.a + 10,
       desc: 'changeC',
     },
  ];
});
`,paraId:52,tocIndex:14},{value:"\u5B57\u5178\u65B9\u5F0F\u5B9A\u4E49\u591A\u4E2A\u5E26\u63CF\u8FF0\u7684\u540C\u6B65\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:53,tocIndex:14},{value:`const [state, setState, ctx] = atom({ a: 1, b: 0, c: 0 }, {
  mutate: {
    changeB: draft => draft.b = draft.a + 1,
    changeC: draft => draft.c = draft.a + 10,
  };
});
`,paraId:54,tocIndex:14},{value:"\u5B9A\u4E49\u4E00\u4E2A\u5F02\u6B65\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\uFF0C\u901A\u8FC7",paraId:55,tocIndex:14},{value:"fn",paraId:55,tocIndex:14},{value:"\u6536\u96C6\u5230\u4F9D\u8D56\uFF0C\u9996\u6B21\u8FD0\u884C\u4E0D\u89E6\u53D1\u5F02\u6B65\u4EFB\u52A1\u6267\u884C",paraId:55,tocIndex:14},{value:`const [state, setState, ctx] = atom({ a: 1, b: 0 }, {
  mutate: {
    fn: draft => draft.b = draft.a + 1,
    task: async({ draft })=>{
      await delay(1000);
      draft.b = draft.a + 1000,
    },
  }
});
`,paraId:56,tocIndex:14},{value:"\u5B9A\u4E49\u4E00\u4E2A\u5F02\u6B65\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\uFF0C\u901A\u8FC7",paraId:57,tocIndex:14},{value:"deps",paraId:57,tocIndex:14},{value:"\u786E\u5B9A\u4F9D\u8D56\uFF0C\u9996\u6B21\u8FD0\u884C\u4E0D\u89E6\u53D1\u5F02\u6B65\u4EFB\u52A1\u6267\u884C",paraId:57,tocIndex:14},{value:`const [state, setState, ctx] = atom({ a: 1, b: 0 }, {
  mutate: {
    deps: ()=>[state.a],
    task: async({ draft, input })=>{
      await delay(1000);
      // \u7B49\u6548\u4E8E draft.b = state.a + 1000,
      draft.b = input[0] + 1000,
    },
  }
});
`,paraId:58,tocIndex:14},{value:"\u5B9A\u4E49\u4E00\u4E2A\u5F02\u6B65\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\uFF0C\u8BBE\u7F6E",paraId:59,tocIndex:14},{value:"immediate",paraId:59,tocIndex:14},{value:"\u4E3A true\uFF0C\u9996\u6B21\u8FD0\u884C\u89E6\u53D1\u5F02\u6B65\u4EFB\u52A1\u6267\u884C",paraId:59,tocIndex:14},{value:`const [state, setState, ctx] = atom(
  { a: 1, b: 0 },
  {
    mutate: {
      fn: (draft) => (draft.b = draft.a + 1),
      task: async () => {
        /** */
      },
      immediate: true,
    },
  },
);

const [state, setState, ctx] = atom(
  { a: 1, b: 0 },
  {
    mutate: {
      deps: () => [state.a],
      task: async () => {
        /** */
      },
      immediate: true,
    },
  },
);
`,paraId:60,tocIndex:14},{value:"action",paraId:61,tocIndex:15},{value:"\u3001",paraId:61,tocIndex:15},{value:"mutate",paraId:61,tocIndex:15},{value:"\u3001",paraId:61,tocIndex:15},{value:"setState",paraId:61,tocIndex:15},{value:"\u3001",paraId:61,tocIndex:15},{value:"sync",paraId:61,tocIndex:15},{value:" \u63D0\u4EA4\u72B6\u6001\u4E4B\u524D\u4F1A\u89E6\u53D1\u6267\u884C\u7684\u51FD\u6570\uFF0C\u53EF\u5728\u6B64\u51FD\u6570\u91CC\u518D\u6B21\u4FEE\u6539 draft\uFF0C\u8BE5\u51FD\u6570\u6267\u884C\u65F6\u673A\u662F\u5728\u4E2D\u95F4\u4EF6\u4E4B\u524D",paraId:61,tocIndex:15},{value:`const [state, setState, ctx] = atom(
  { a: 1, b: 0, time: 0 },
  {
    before({ draft }) {
      draft.time = Date.now();
    },
  },
);
`,paraId:62,tocIndex:15}]},73347:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(15339);const a=[{value:"atomx",paraId:0,tocIndex:0},{value:" \u8FD4\u56DE\u5171\u4EAB\u4E0A\u4E0B\u6587 ",paraId:0,tocIndex:0},{value:"ctx",paraId:0,tocIndex:0},{value:"\uFF0C",paraId:0,tocIndex:0},{value:"atom",paraId:0,tocIndex:0},{value:" \u8FD4\u56DE\u5143\u7EC4\u7ED3\u6784 ",paraId:0,tocIndex:0},{value:"[ state, setState, ctx ]",paraId:0,tocIndex:0},{value:"\uFF0C \u5C06 ",paraId:0,tocIndex:0},{value:"ctx.state",paraId:0,tocIndex:0},{value:" \u548C ",paraId:0,tocIndex:0},{value:"ctx.setState",paraId:0,tocIndex:0},{value:" \u653E\u7F6E\u5230\u5143\u7EC4\u7684\u7B2C\u4E00\u4F4D\u548C\u7B2C\u4E8C\u6B21\u53C2\u6570\u5904\u3002",paraId:0,tocIndex:0},{value:`import { atom, atomx } from 'helux';

// \u8FD4\u56DE\u5143\u7EC4\uFF0C\u5143\u7EC4\u7684\u7B2C\u4E00\u4F4D\u548C\u7B2C\u4E8C\u6B21\u53C2\u6570\u5373\u662F state setState
const [numAtom, setAtom, atomCtx] = atom(1);

// \u8FD4\u56DE\u5B57\u5178\u5BF9\u8C61\uFF0C\u5BF9\u8C61\u91CC\u53EF\u89E3\u6784\u51FA state setState
const atomCtx = atomx(1);
const { state: numAtom, setState: setAtom } = atomCtx;
`,paraId:1,tocIndex:0},{value:"\u5176\u4ED6\u4F7F\u7528\u65B9\u5F0F\u5747\u548C",paraId:2,tocIndex:0},{value:"atom",paraId:3,tocIndex:0},{value:"\u4FDD\u6301\u4E00\u81F4\u3002",paraId:2,tocIndex:0}]},47215:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(18093);const a=[{value:"block",paraId:0,tocIndex:0},{value:"\u5141\u8BB8\u7528\u6237\u5C06\u7ED1\u5B9A\u4E86\u5171\u4EAB\u72B6\u6001\u7684 jsx \u7247\u6BB5\u62BD\u8C61\u4E3A\u7EC4\u4EF6\uFF0C\u65B9\u4FBF\u5176\u5B83\u5730\u65B9\u590D\u7528\u3002",paraId:0,tocIndex:0},{value:"block \u7EC4\u4EF6\u548C\u666E\u901A react \u7EC4\u4EF6\u4E00\u6837\uFF0C\u652F\u6301\u900F\u4F20",paraId:1,tocIndex:1},{value:"props",paraId:1,tocIndex:1},{value:"block",paraId:2,tocIndex:2},{value:"\u7EC4\u4EF6\u5185\u90E8\u652F\u6301\u4F7F\u7528\u5176\u4ED6\u94A9\u5B50\u51FD\u6570",paraId:2,tocIndex:2},{value:"block \u7EC4\u4EF6\u56DE\u8C03\u7684\u7B2C\u4E8C\u4F4D BlockParams \u53C2\u6570\u683C\u5F0F\u4E3A",paraId:3,tocIndex:3},{value:"{ props; status; read; ref?}",paraId:3,tocIndex:3},{value:"\uFF0C\u7528\u6237\u5B9A\u4E49\u7684 ref \u53EF\u4ECE\u7B2C\u4E8C\u4F4D\u53C2\u6570\u83B7\u53D6\u5230",paraId:3,tocIndex:3},{value:"\u5982\u5B58\u5728\u5F02\u6B65\u4FEE\u6539\u7684\u6D3E\u751F\u503C\uFF0C\u8BBE\u7F6E",paraId:4,tocIndex:4},{value:"block",paraId:4,tocIndex:4},{value:"\u8C03\u7528\u7684\u7B2C\u4E8C\u4F4D\u53C2\u6570\u4E3A true \u5F00\u542F\u611F\u77E5\u6D3E\u751F\u7ED3\u679C\u72B6\u6001\u53D8\u5316\u529F\u80FD\u540E\uFF0C\u53EF\u76F4\u63A5\u8BFB\u53D6",paraId:4,tocIndex:4},{value:"params.status",paraId:4,tocIndex:4},{value:"\u83B7\u5F97\u6D3E\u751F\u7ED3\u679C\u53D8\u5316\u72B6\u6001\u6765\u6E32\u67D3\u7EC4\u4EF6",paraId:4,tocIndex:4},{value:"\u5982\u5B58\u5728\u5F02\u6B65\u4FEE\u6539\u7684\u72B6\u6001\u503C\uFF0C\u53EF\u8C03\u7528",paraId:5,tocIndex:5},{value:"useLoading",paraId:5,tocIndex:5},{value:"\u8BFB\u53D6",paraId:5,tocIndex:5},{value:"status",paraId:5,tocIndex:5},{value:"\u83B7\u5F97\u53D8\u5316\u72B6\u6001\u6765\u6E32\u67D3\u7EC4\u4EF6",paraId:5,tocIndex:5}]},38040:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(41992);const a=[{value:"defineDeriveTask",paraId:0,tocIndex:0},{value:"\u7528\u4E8E\u5B9A\u4E49\u5F02\u6B65\u6D3E\u751F\u4EFB\u52A1\uFF0C\u662F\u4E00\u4E2A\u914D\u5408\u5171\u4EAB\u4E0A\u4E0B\u6587",paraId:0,tocIndex:0},{value:"defineFullDerive",paraId:0,tocIndex:0},{value:"\u63A5\u53E3\u5728\u72EC\u7ACB\u6587\u4EF6\u91CC\u5B9A\u4E49\u5F02\u6B65\u6D3E\u751F\u4EFB\u52A1\u65F6\uFF0C\u5E2E\u52A9\u63D0\u5347\u7C7B\u578B\u63A8\u5BFC\u4F53\u9A8C\u7684\u51FD\u6570\u3002",paraId:0,tocIndex:0},{value:"\u5728",paraId:1,tocIndex:1},{value:"\u6A21\u5757\u5316/\u591A\u6587\u4EF6\u4EE3\u7801\u7EC4\u7EC7\u65B9\u5F0F",paraId:2,tocIndex:1},{value:"\u7684",paraId:1,tocIndex:1},{value:"deriveFull",paraId:1,tocIndex:1},{value:"\u6587\u4EF6\u91CC\uFF0C\u5B9A\u4E49\u5F02\u6B65\u5168\u91CF\u6D3E\u751F\u51FD\u6570",paraId:1,tocIndex:1},{value:`import { defineDeriveTask } from 'helux';

/**
 * \u901A\u8FC7 defineDeriveTask \u7EA6\u675F\u7ED3\u679C\u8FD4\u56DE\u7C7B\u578B\uFF0C\u81EA\u52A8\u5C06 deps \u8FD4\u56DE\u7C7B\u578B\u5E76\u900F\u4F20\u7ED9 params.input
 */
export const f2 = defineDeriveTask(() => [state.f] as const)<number>({
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000);
    return params.prevResult + 100;
  },
});
`,paraId:3,tocIndex:1}]},47915:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(88500);const a=[{value:"defineDeriveFnItem",paraId:0,tocIndex:0},{value:"\u7528\u4E8E\u5B9A\u4E49\u5F02\u6B65\u6D3E\u751F\u4EFB\u52A1\uFF0C\u662F\u4E00\u4E2A\u914D\u5408\u5171\u4EAB\u4E0A\u4E0B\u6587",paraId:0,tocIndex:0},{value:"defineFullDerive",paraId:0,tocIndex:0},{value:"\u63A5\u53E3\u5728\u72EC\u7ACB\u6587\u4EF6\u91CC\u5B9A\u4E49\u5F02\u6B65\u6D3E\u751F\u4EFB\u52A1\u65F6\uFF0C\u5E2E\u52A9\u63D0\u5347\u7C7B\u578B\u63A8\u5BFC\u4F53\u9A8C\u7684\u51FD\u6570\u3002",paraId:0,tocIndex:0},{value:"\u5728",paraId:1,tocIndex:1},{value:"\u6A21\u5757\u5316/\u591A\u6587\u4EF6\u4EE3\u7801\u7EC4\u7EC7\u65B9\u5F0F",paraId:2,tocIndex:1},{value:"\u7684",paraId:1,tocIndex:1},{value:"deriveFull",paraId:1,tocIndex:1},{value:"\u6587\u4EF6\u91CC\uFF0C\u5B9A\u4E49\u5F02\u6B65\u5168\u91CF\u6D3E\u751F\u51FD\u6570",paraId:1,tocIndex:1},{value:`import { defineDeriveFnItem, IDeriveFnItem } from 'helux';

/**
 * \u901A\u8FC7 IDeriveFnItem \u4E3B\u52A8\u7EA6\u675F\u7ED3\u679C\u8FD4\u56DE\u7C7B\u578B\u548C deps \u8FD4\u56DE\u7C7B\u578B\uFF0C\u540C\u65F6 deps \u8FD4\u56DE\u7C7B\u578B\u81EA\u52A8\u900F\u4F20\u7ED9 params.input
 */
export const fTask2 = defineDeriveFnItem<IDeriveFnItem<number, [number]>>({
  deps: () => [state.f],
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000);
    return params.prevResult + 100;
  },
});
`,paraId:3,tocIndex:1}]},49677:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(60689);const a=[{value:"\u4F7F\u7528",paraId:0,tocIndex:0},{value:"deriveDict",paraId:0,tocIndex:0},{value:"\u5B9A\u4E49",paraId:0,tocIndex:0},{value:"\u5168\u91CF\u6D3E\u751F",paraId:1,tocIndex:0},{value:"\u51FD\u6570\uFF0C\u4EC5\u5F53\u51FD\u6570\u5185\u7684\u4F9D\u8D56\u53D1\u751F\u53D8\u5316\u65F6\u624D\u4F1A\u89E6\u53D1\u91CD\u8BA1\u7B97\uFF0C\u4F7F\u7528\u65B9\u5F0F\u548C",paraId:0,tocIndex:0},{value:"derive",paraId:2,tocIndex:0},{value:"\u5B8C\u5168\u4E00\u6837\uFF0C\u533A\u522B\u4EC5\u5728\u4E8E",paraId:0,tocIndex:0},{value:"deriveDict",paraId:0,tocIndex:0},{value:"\u751F\u6210\u7684\u7ED3\u679C\u5F3A\u5236\u8981\u6C42\u8FD4\u56DE\u7ED3\u679C\u4E3A\u5B57\u5178\u5BF9\u8C61\u7ED3\u6784\uFF0C\u751F\u6210\u7684\u6D3E\u751F\u7ED3\u679C\u65E0",paraId:0,tocIndex:0},{value:"{val:T}",paraId:0,tocIndex:0},{value:"\u88C5\u7BB1\u884C\u4E3A\uFF0C\u6545\u4F7F\u7528\u7ED3\u679C\u65F6\u65E0\u9700\u62C6\u7BB1\u3002",paraId:0,tocIndex:0},{value:"\u4E3A",paraId:3,tocIndex:1},{value:"atom",paraId:3,tocIndex:1},{value:"\u8FD4\u56DE\u7ED3\u679C\u5B9A\u4E49\u6D3E\u751F\u51FD\u6570",paraId:3,tocIndex:1},{value:`import { deriveDict, atom } from 'helux';

const [numAtom] = atom(1);
// { result: 101 }
const plus100Result = deriveDict(() => ({ result: numAtom.val + 100 }));
`,paraId:4,tocIndex:1},{value:"\u4E3A",paraId:5,tocIndex:1},{value:"share",paraId:5,tocIndex:1},{value:"\u8FD4\u56DE\u7ED3\u679C\u5B9A\u4E49\u6D3E\u751F\u51FD\u6570",paraId:5,tocIndex:1},{value:`import { deriveDict, share } from 'helux';

const [state] = share({ name: 'helux', author: 'fantasticsoul' });
// { fullName: ' hellow helux', fullAuthor: 'hello fantasticsoul' }
const plus100Result = deriveDict(() => ({
  fullName: \`hello \${state.name}\`,
  fullAuthor: \`hello \${state.author}\`,
}));
`,paraId:6,tocIndex:1}]},82114:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(82695);const a=[{value:"\u4F7F\u7528",paraId:0,tocIndex:0},{value:"derive",paraId:0,tocIndex:0},{value:"\u5B9A\u4E49",paraId:0,tocIndex:0},{value:"\u5168\u91CF\u6D3E\u751F",paraId:1,tocIndex:0},{value:"\u51FD\u6570\uFF0C\u4EC5\u5F53\u51FD\u6570\u5185\u7684\u4F9D\u8D56\u53D1\u751F\u53D8\u5316\u65F6\u624D\u4F1A\u89E6\u53D1\u91CD\u8BA1\u7B97\u3002",paraId:0,tocIndex:0},{value:"\u6D3E\u751F\u751F\u6210\u539F\u59CB\u503C",paraId:2,tocIndex:2},{value:`import { derive, atom } from 'helux';

const [numAtom] = atom(1); // { val: 1 }
const plus100Result = derive(() => numAtom.val + 100); // { val: 101 }
`,paraId:3,tocIndex:2},{value:"\u6D3E\u751F\u751F\u6210\u5B57\u5178\u5BF9\u8C61",paraId:4,tocIndex:2},{value:"\u56E0",paraId:5},{value:"derive",paraId:5},{value:"\u59CB\u7EC8\u4F1A\u88C5\u7BB1\u7ED3\u679C\u4E3A",paraId:5},{value:"{val: T}",paraId:5},{value:" \u7ED3\u6784\uFF0C\u5982\u751F\u6210\u5B57\u5178\u5BF9\u8C61\u7ED3\u679C\u63A8\u8350\u4F7F\u7528",paraId:5},{value:"deriveDict",paraId:6},{value:"\u63A5\u53E3\uFF0C\u514D\u53BB\u76F4\u63A5\u4F7F\u7528\u7ED3\u679C\u65F6\u9700\u8981\u62C6\u7BB1\u7684\u8FC7\u7A0B",paraId:5},{value:`import { derive, atom } from 'helux';

// { val: 1 }
const [numAtom] = atom(1);
// { val: { plus100: 201, plus200: 201 } }
const plusResult = derive(() => ({
  plus100: numAtom.val + 100,
  plus200: numAtom.val + 200,
}));
`,paraId:7},{value:"\u57FA\u4E8E\u6D3E\u751F\u7ED3\u679C\u751F\u6210\u65B0\u7684\u6D3E\u751F\u7ED3\u679C\uFF0C\u5F62\u6210\u6D3E\u751F\u94FE",paraId:8},{value:`import { derive, atom } from 'helux';

const [numAtom] = atom(1); // { val: 1 }
const plus100Result = derive(() => numAtom.val + 100); // { val: 101 }
const plus200Result = derive(() => plus100Result.val + 100); // { val: 201 }
`,paraId:9},{value:"\u6D3E\u751F\u751F\u6210\u539F\u59CB\u503C",paraId:10,tocIndex:3},{value:`import { derive, atom } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom] = atom(1);
const plus100Result = derive({
  fn: () => 0,
  // \u5728 deps \u8FD4\u56DE\u7ED3\u679C\u91CC\u9501\u5B9A\u4F9D\u8D56
  deps: () => [numAtom.val],
  // input \u6570\u7EC4\u5373 deps \u51FD\u6570\u8FD4\u56DE\u7ED3\u679C
  task: async ({ input }) => {
    await delay();
    return input[0] + 100;
  },
});
`,paraId:11,tocIndex:3},{value:"\u5F02\u6B65\u6D3E\u751F\u9ED8\u8BA4\u9996\u6B21\u53EA\u6267\u884C\u540C\u6B65\u51FD\u6570",paraId:12},{value:"fn",paraId:12},{value:"\uFF0C\u540E\u7EED\u76D1\u542C\u5230\u53D8\u5316\u4E0D\u518D\u6267\u884C",paraId:12},{value:"fn",paraId:12},{value:"\u4EC5\u6267\u884C",paraId:12},{value:"task",paraId:12},{value:"\uFF0C\u5982\u9700\u9996\u6B21\u6267\u884C\u4E5F\u9700\u8981\u6267\u884C",paraId:12},{value:"task",paraId:12},{value:"\uFF0C\u914D\u7F6E",paraId:12},{value:"immediate",paraId:12},{value:"\u4E3A",paraId:12},{value:"true",paraId:12},{value:"\u5373\u53EF",paraId:12},{value:`const plus100Result = derive({
  fn: () => 0,
  deps: () => [numAtom.val],
  task: async ({ input }) => {
    /** \u4EE3\u7801\u7565 */ return 1;
  },
  immediate: true,
});
`,paraId:13}]},22314:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(50834);const a=[{value:"dynamicBlock",paraId:0,tocIndex:0},{value:"\u548C",paraId:0,tocIndex:0},{value:"block",paraId:0,tocIndex:0},{value:"\u529F\u80FD\u5B8C\u5168\u76F8\u540C\uFF0C\u5141\u8BB8\u7528\u6237\u5728\u7EC4\u4EF6\u6E32\u67D3\u8FC7\u7A0B\u4E2D\u5B9A\u4E49 block \u7EC4\u4EF6",paraId:0,tocIndex:0}]},47636:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(62189);const a=[{value:"\u53D1\u5C04\u4E8B\u4EF6",paraId:0,tocIndex:0},{value:"\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"\u6307\u5357/\u4E8B\u4EF6",paraId:2}]},589:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(96177);const a=[{value:"\u5305\u542B\u4EE5\u4E0B\u57FA\u7840\u51FD\u6570",paraId:0,tocIndex:0},{value:"atom",paraId:1,tocIndex:0},{value:" \u521B\u5EFA",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5143\u7EC4",paraId:2,tocIndex:0},{value:"atomx",paraId:3,tocIndex:0},{value:" \u521B\u5EFA",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5B57\u5178",paraId:2,tocIndex:0},{value:"share",paraId:4,tocIndex:0},{value:" \u521B\u5EFA\u5B57\u5178\u578B",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5143\u7EC4",paraId:2,tocIndex:0},{value:"sharex",paraId:5,tocIndex:0},{value:" \u521B\u5EFA\u5B57\u5178\u578B",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5B57\u5178",paraId:2,tocIndex:0},{value:"signal",paraId:6,tocIndex:0},{value:" \u521B\u5EFA",paraId:2,tocIndex:0},{value:"signal",paraId:2,tocIndex:0},{value:"\u54CD\u5E94\u533A\u57DF\uFF0C\u5B9E\u73B0dom\u7C92\u5EA6\u66F4\u65B0",paraId:2,tocIndex:0},{value:"block",paraId:7,tocIndex:0},{value:" \u521B\u5EFA",paraId:2,tocIndex:0},{value:"block",paraId:2,tocIndex:0},{value:"\u5757\u54CD\u5E94\u533A\u57DF\uFF0C\u5B9E\u73B0\u5757\u7C92\u5EA6\u66F4\u65B0",paraId:2,tocIndex:0},{value:"dynamicBlock",paraId:8,tocIndex:0},{value:" \u7EC4\u4EF6\u6E32\u67D3\u8FC7\u7A0B\u4E2D\u521B\u5EFA\u52A8\u6001",paraId:2,tocIndex:0},{value:"block",paraId:2,tocIndex:0},{value:"\u5757\u54CD\u5E94\u533A\u57DF\uFF0C\u5B9E\u73B0\u5757\u7C92\u5EA6\u66F4\u65B0",paraId:2,tocIndex:0},{value:"derive",paraId:9,tocIndex:0},{value:" \u5B9A\u4E49\u5355\u4E2A\u5168\u91CF\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"deriveDict",paraId:10,tocIndex:0},{value:" \u6279\u91CF\u5B9A\u4E49\u5168\u91CF\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"defineDeriveTask",paraId:11,tocIndex:0},{value:" \u7C7B\u578B\u8F85\u52A9\u51FD\u6570\uFF0C\u5B9A\u4E49\u5168\u91CF\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1\uFF0C\u81EA\u52A8\u63A8\u5BFC deps \u8FD4\u56DE\u7C7B\u578B",paraId:2,tocIndex:0},{value:"defineDeriveFnItem",paraId:12,tocIndex:0},{value:" \u7C7B\u578B\u8F85\u52A9\u51FD\u6570\uFF0C\u5B9A\u4E49\u5168\u91CF\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1",paraId:2,tocIndex:0},{value:"runDerive",paraId:13,tocIndex:0},{value:" \u4EBA\u5DE5\u89E6\u53D1\u5168\u91CF\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"runDeriveTask",paraId:14,tocIndex:0},{value:" \u4EBA\u5DE5\u89E6\u53D1\u5168\u91CF\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1",paraId:2,tocIndex:0},{value:"mutate",paraId:15,tocIndex:0},{value:" \u5B9A\u4E49\u5355\u4E2A\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"mutateDict",paraId:16,tocIndex:0},{value:" \u6279\u91CF\u5B9A\u4E49\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"runMutate",paraId:17,tocIndex:0},{value:" \u4EBA\u5DE5\u89E6\u53D1\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"runMutateTask",paraId:18,tocIndex:0},{value:" \u4EBA\u5DE5\u89E6\u53D1\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1",paraId:2,tocIndex:0},{value:"action",paraId:19,tocIndex:0},{value:" \u521B\u5EFA\u4FEE\u6539\u72B6\u6001\u7684 action \u540C\u6B65\u6216\u5F02\u6B65\u51FD\u6570",paraId:2,tocIndex:0},{value:"watch",paraId:20,tocIndex:0},{value:" \u521B\u5EFA\u89C2\u5BDF\u6570\u636E\u53D8\u5316\u7684\u76D1\u542C\u51FD\u6570",paraId:2,tocIndex:0},{value:"watchEffect",paraId:21,tocIndex:0},{value:" \u521B\u5EFA\u89C2\u5BDF\u6570\u636E\u53D8\u5316\u7684\u76D1\u542C\u51FD\u6570\uFF0C\u7ACB\u5373\u8FD0\u884C\u5E76\u5728\u9996\u6B21\u8FD0\u884C\u65F6\u6536\u96C6\u5230\u4F9D\u8D56",paraId:2,tocIndex:0},{value:"syncer",paraId:22,tocIndex:0},{value:" \u6D45\u5C42\u6B21\u5BF9\u8C61\u7684\u540C\u6B65\u51FD\u6570\u751F\u6210\u5668\uFF0C\u8F85\u52A9\u53CC\u5411\u7ED1\u5B9A",paraId:2,tocIndex:0},{value:"sync",paraId:23,tocIndex:0},{value:" \u6DF1\u5C42\u6B21\u5BF9\u8C61\u7684\u540C\u6B65\u51FD\u6570\u751F\u6210\u5668\uFF0C\u8F85\u52A9\u53CC\u5411\u7ED1\u5B9A",paraId:2,tocIndex:0},{value:"emit",paraId:24,tocIndex:0},{value:" \u53D1\u5C04\u4E8B\u4EF6",paraId:2,tocIndex:0},{value:"on",paraId:25,tocIndex:0},{value:" \u76D1\u542C\u4E8B\u4EF6",paraId:2,tocIndex:0}]},1701:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(51390);const a=[{value:"\u4F7F\u7528",paraId:0,tocIndex:0},{value:"mutateDict",paraId:0,tocIndex:0},{value:"\u6279\u91CF\u5B9A\u4E49",paraId:0,tocIndex:0},{value:"\u53EF\u53D8\u6D3E\u751F",paraId:1,tocIndex:0},{value:"\u51FD\u6570\uFF0C\u4EC5\u5F53\u51FD\u6570\u5185\u7684\u4F9D\u8D56\u53D1\u751F\u53D8\u5316\u65F6\u624D\u4F1A\u89E6\u53D1\u91CD\u8BA1\u7B97\u3002",paraId:0,tocIndex:0},{value:"\u4E3A\u4E86\u66F4\u597D\u7684\u7C7B\u578B\u63A8\u5BFC\uFF0C\u63A5\u53E3\u8C03\u7528\u91C7\u7528\u4E86\u67EF\u91CC\u5316\u98CE\u683C\uFF0C\u5B9A\u4E49\u53EF\u53D8\u6D3E\u751F\u7684\u4F7F\u7528\u65B9\u5F0F\u548C",paraId:2,tocIndex:1},{value:"mutate",paraId:3,tocIndex:1},{value:"\u4E00\u6837\uFF0C\u533A\u522B\u662F",paraId:2,tocIndex:1},{value:"mutateDict",paraId:2,tocIndex:1},{value:"\u4EC5\u652F\u6301\u4F20\u5165\u5B57\u5178\u6765\u914D\u7F6E\u591A\u4E2A\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\u3002",paraId:2,tocIndex:1},{value:`// \u89E6\u53D1 changeA \u7684 mutate fn \u51FD\u6570\u6267\u884C
witnessDict.changeA.run();

// \u89E6\u53D1 changeE \u7684 mutate task \u51FD\u6570\u6267\u884C
witnessDict.changeE.runTask();
`,paraId:4,tocIndex:2}]},86428:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(71834);const a=[{value:"\u4F7F\u7528",paraId:0,tocIndex:0},{value:"mutate",paraId:0,tocIndex:0},{value:"\u5B9A\u4E49",paraId:0,tocIndex:0},{value:"\u53EF\u53D8\u6D3E\u751F",paraId:1,tocIndex:0},{value:"\u51FD\u6570\uFF0C\u4EC5\u5F53\u51FD\u6570\u5185\u7684\u4F9D\u8D56\u53D1\u751F\u53D8\u5316\u65F6\u624D\u4F1A\u89E6\u53D1\u91CD\u8BA1\u7B97\u3002",paraId:0,tocIndex:0},{value:"mutate",paraId:2},{value:"\u4E00\u6B21\u53EA\u80FD\u5B9A\u4E49\u4E00\u4E2A\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\uFF0C\u4E00\u6B21\u5B9A\u4E49\u591A\u4E2A\u53EF\u4F7F\u7528",paraId:2},{value:"mutateDict",paraId:3},{value:"\u3002",paraId:2},{value:"\u4E3A\u4E86\u66F4\u597D\u7684\u7C7B\u578B\u63A8\u5BFC\uFF0C\u63A5\u53E3\u8C03\u7528\u91C7\u7528\u4E86\u67EF\u91CC\u5316\u98CE\u683C",paraId:4,tocIndex:1},{value:`import { atom, mutate } from 'helux';

const [state, setState, ctx] = atom({ a: 1, b: 0 });

//                      \u{1F447}\u{1F3FB} \u6307\u5B9A\u5171\u4EAB\u72B6\u6001
const witness = mutate(state)((draft) => (draft.b = draft.a + 1));
//                              \u{1F446}\u{1F3FB} \u4E3A\u5176\u5B9A\u4E49mutate\u51FD\u6570
`,paraId:5,tocIndex:2},{value:"wintess",paraId:6,tocIndex:2},{value:" \u7C7B\u578B\u63CF\u8FF0\u4E3A",paraId:6,tocIndex:2},{value:`interface IMutateWitness<T = any> {
  /** \u4EBA\u5DE5\u8C03\u7528 mutate \u914D\u7F6E\u91CC\u7684\u540C\u6B65\u51FD\u6570 */
  run: MutateCall<T>;
  /** \u4EBA\u5DE5\u8C03\u7528 mutate \u914D\u7F6E\u91CC\u7684\u5F02\u6B65\u51FD\u6570 */
  runTask: MutateTaskCall<T>;
  /** \u7528\u6237\u900F\u4F20\u7684\u539F\u59CB\u63CF\u8FF0\u503C */
  oriDesc: string;
  /**
   * \u5185\u90E8\u751F\u6210\u7684\u5B9E\u9645\u63CF\u8FF0\u503C\uFF0C\u53EF\u80FD\u548C oriDesc \u76F8\u7B49\uFF0C
   * \u5728\u6CA1\u4EBA\u5DE5\u6307\u5B9A desc \u6216 \u6307\u5B9A\u7684 desc \u503C\u548C\u5DF2\u6709 mutate desc \u91CD\u590D\u65F6\uFF0C\u5185\u90E8\u4F1A\u65B0\u751F\u6210\u4E00\u4E2A
   */
  desc: string;
  /** \u6B64\u51FD\u6570\u53EF\u83B7\u53D6\u6700\u65B0\u7684\u5FEB\u7167 */
  getSnap: () => T;
  /** snap \u53EA\u4EE3\u8868\u751F\u6210 witness \u90A3\u4E00\u523B\u5BF9\u5E94\u7684\u5171\u4EAB\u72B6\u6001\u7684\u5FEB\u7167 */
  snap: T;
}
`,paraId:7,tocIndex:2},{value:"\u652F\u6301\u4EE5",paraId:8,tocIndex:3},{value:"IMutateFnLooseItem",paraId:8,tocIndex:3},{value:"\u683C\u5F0F\u5B9A\u4E49\u53EF\u53D8\u51FD\u6570",paraId:8,tocIndex:3},{value:`  /** \u4F9D\u8D56\u9879\u5217\u8868\uFF0C\u6709 task \u65E0 fn \u65F6\uFF0C\u53EF\u4F5C\u4E3A task \u7684\u4F9D\u8D56\u6536\u96C6\u51FD\u6570 */
  deps?: (state: StateType<T>) => P;
  /**
   * defalt: false
   * \u4E3A true \u65F6\u8868\u793A\u4F9D\u8D56\u5168\u90E8\u7531 deps \u51FD\u6570\u63D0\u4F9B\uFF0Cfn \u6267\u884C\u8FC7\u7A0B\u4E2D\u4E0D\u6536\u96C6\u4EFB\u4F55\u4F9D\u8D56
   */
  onlyDeps?: boolean;
  /** fn \u548C deps \u5747\u53EF\u4EE5\u6536\u96C6\u4F9D\u8D56\uFF0C\u5BF9\u5E94\u5B58\u5728 task \u7684\u573A\u666F\uFF0Cdeps \u6216 fn \u4E24\u8005\u4FDD\u8BC1\u81F3\u5C11\u6709\u4E00\u4E2A */
  fn?: MutateFn<T, P>;
  task?: MutateTask<T, P>;
  /** default: false, task \u662F\u5426\u7ACB\u5373\u6267\u884C */
  immediate?: boolean;
  /**
   * default: undefined\uFF0C\u662F\u5426\u68C0\u6D4B\u6B7B\u5FAA\u73AF\uFF0C\u8BBE\u7F6E\u4E3A false \u8868\u793A\u4E0D\u68C0\u67E5
   * \u672A\u8BBE\u5B9A\u65F6\uFF0C\u4F7F\u7528 atom\u3001share \u63A5\u53E3\u8BBE\u5B9A\u7684 checkDeadCycle \u503C
   */
  checkDeadCycle?: boolean;
  /** \u5EFA\u8BAE\u7528\u6237\u6307\u5B9A\uFF0C\u65E0\u6307\u5B9A\u65F6\u5185\u90E8\u4F1A\u81EA\u52A8\u751F\u6210\u552F\u4E00 desc */
  desc?: FnDesc;
`,paraId:9,tocIndex:3},{value:"\u5B9A\u4E49\u540C\u6B65\u53EF\u53D8\u51FD\u6570",paraId:10,tocIndex:4},{value:`import { mutate } from 'helux';

const witness = mutate(state)({
  fn: (draft) => (draft.b = draft.a + 1),
});
`,paraId:11,tocIndex:4},{value:"\u5B9A\u4E49\u5F02\u6B65\u53EF\u53D8\u51FD\u6570\uFF0Ctask \u6267\u884C\u65F6\u673A\u9075\u5FAA\u4EE5\u4E0B\u89C4\u5F8B\uFF1A",paraId:12,tocIndex:5},{value:"fn \u548C task \u540C\u65F6\u5B58\u5728\u65F6\uFF0C\u6CA1\u6709\u6307\u5B9A",paraId:13,tocIndex:5},{value:"immediate",paraId:13,tocIndex:5},{value:"\uFF0C",paraId:13,tocIndex:5},{value:"immediate",paraId:13,tocIndex:5},{value:"\u4F1A\u9ED8\u8BA4\u4E3A ",paraId:13,tocIndex:5},{value:"false",paraId:13,tocIndex:5},{value:"\uFF0C\u9996\u6B21\u6267\u884C\u4EC5\u89E6\u53D1 fn\uFF0C\u540E\u7EED\u6267\u884C\u4EC5\u89E6\u53D1 task",paraId:13,tocIndex:5},{value:"fn \u548C task \u540C\u65F6\u5B58\u5728\u65F6\uFF0C\u6307\u5B9A\u4E86",paraId:13,tocIndex:5},{value:"immediate",paraId:13,tocIndex:5},{value:"\u4E3A true\uFF0C\u9996\u6B21\u6267\u884C\u65E2\u89E6\u53D1 fn \u4E5F \u89E6\u53D1 task\uFF08\u5148 fn \u540E task\uFF09\uFF0C\u540E\u7EED\u6267\u884C\u4EC5\u89E6\u53D1 task",paraId:13,tocIndex:5},{value:"\u4EC5 task \u5B58\u5728\u65F6\uFF0C\u6CA1\u6709\u6307\u5B9A",paraId:13,tocIndex:5},{value:"immediate",paraId:13,tocIndex:5},{value:"\uFF0C",paraId:13,tocIndex:5},{value:"immediate",paraId:13,tocIndex:5},{value:"\u4F1A\u9ED8\u8BA4\u4E3A ",paraId:13,tocIndex:5},{value:"true",paraId:13,tocIndex:5},{value:"\uFF0C\u9996\u6B21\u6267\u884C\u89E6\u53D1 task\uFF0C\u540E\u7EED\u6267\u884C\u7EE7\u7EED\u89E6\u53D1 task",paraId:13,tocIndex:5},{value:"\u4EC5 task \u5B58\u5728\u65F6\uFF0C\u6307\u5B9A\u4E86 ",paraId:13,tocIndex:5},{value:"immediate",paraId:13,tocIndex:5},{value:"\u4F1A\u9ED8\u8BA4\u4E3A false\uFF0C\u9996\u6B21\u6267\u884C\u4E0D\u89E6\u53D1 task\uFF0C\u540E\u7EED\u6267\u884C\u624D\u4F1A\u89E6\u53D1 task",paraId:13,tocIndex:5},{value:"task \u548C fn \u540C\u65F6\u5B58\u5728\uFF0C\u672A\u8BBE\u5B9A",paraId:14,tocIndex:5},{value:"immediate",paraId:14,tocIndex:5},{value:"\uFF0C\u9996\u6B21\u6267\u884C mutate \u4E0D\u89E6\u53D1 task",paraId:14,tocIndex:5},{value:`const witness = mutate(state)({
  // deps \u7528\u4E8E\u6536\u96C6\u4F9D\u8D56\uFF0C\u540C\u65F6\u8FD4\u56DE\u7ED3\u679C\u4F1A\u900F\u4F20\u7ED9 taskFnParams.input \u6570\u7EC4
  deps: () => [state.a, state.b],
  fn: (draft, { input }) => (draft.c = input[0] + input[1] + 1),
  task: async ({ input }) => {
    draft.c = input[0] + input[1] + 1;
  },
});
`,paraId:15,tocIndex:5},{value:"task \u548C fn \u540C\u65F6\u5B58\u5728\uFF0C\u8BBE\u5B9A",paraId:16,tocIndex:5},{value:"immediate",paraId:16,tocIndex:5},{value:"\u4E3A",paraId:16,tocIndex:5},{value:"true",paraId:16,tocIndex:5},{value:"\uFF0C\u9996\u6B21\u6267\u884C mutate \u5148\u89E6\u53D1 fn \u518D\u89E6\u53D1 task",paraId:16,tocIndex:5},{value:`const witness = mutate(state)({
  deps: () => [state.a, state.b],
  fn: (draft, { input }) => (draft.c = input[0] + input[1] + 1),
  task: async ({ draft, input }) => {
    draft.c = input[0] + input[1] + 1;
  },
  immediate: true,
});
`,paraId:17,tocIndex:5},{value:"\u4EC5 task \u5B58\u5728\uFF0C\u672A\u8BBE\u5B9A",paraId:18,tocIndex:5},{value:"immediate",paraId:18,tocIndex:5},{value:"\uFF0C\u9996\u6B21\u6267\u884C\u89E6\u53D1 task",paraId:18,tocIndex:5},{value:`const witness = mutate(state)({
  deps: () => [state.a, state.b],
  task: async ({ draft, input }) => {
    draft.c = input[0] + input[1] + 1;
  },
});
`,paraId:19,tocIndex:5},{value:"\u4EC5 task \u5B58\u5728\uFF0C\u8BBE\u5B9A",paraId:20,tocIndex:5},{value:"immediate",paraId:20,tocIndex:5},{value:"\u4E3A",paraId:20,tocIndex:5},{value:"false",paraId:20,tocIndex:5},{value:"\uFF0C\u9996\u6B21\u6267\u884C\u4E0D\u89E6\u53D1 task",paraId:20,tocIndex:5},{value:`const witness = mutate(state)({
  deps: () => [state.a, state.b],
  task: async ({ draft, input }) => {
    draft.c = input[0] + input[1] + 1;
  },
  immediate: false,
});
`,paraId:21,tocIndex:5},{value:"immediate",paraId:22,tocIndex:6},{value:"\u7528\u4E8E\u63A7\u5236\u9996\u6B21\u6267\u884C mutate \u65F6\u662F\u5426\u9700\u8981\u89E6\u53D1 task\uFF0C\u5177\u4F53\u63A7\u5236\u89C4\u5219\u89C1 ",paraId:22,tocIndex:6},{value:"task",paraId:23,tocIndex:6},{value:" \u8BF4\u660E\u3002",paraId:22,tocIndex:6},{value:"\u4F9D\u8D56\u9879\u6536\u96C6\u51FD\u6570\uFF0Cfn \u548C deps \u540C\u65F6\u5B58\u5728\u65F6\uFF0C\u6536\u96C6\u5230\u7684\u4F9D\u8D56\u7ED3\u679C\u4E3A fn \u548C deps \u7684\u5E76\u96C6\u3002",paraId:24,tocIndex:7},{value:`import { share, mutate } from 'helux';
const [state] = share({ a: 1, b: 1, c: 0 });

const witness = mutate(state)({
  deps: () => [state.b],
  fn: (draft) => (draft.c = draft.a + draft.b + 1),
});

// \u7B49\u540C\u4E8E\u5199\u4E3A
const witness = mutate(state)({
  deps: () => [state.b], // deps \u8FD4\u56DE\u7ED3\u679C\u4F1A\u900F\u4F20\u7ED9 params.input \u6570\u7EC4
  fn: (draft, params) => (draft.c = draft.a + params.input[0] + 1),
});
`,paraId:25,tocIndex:7},{value:"\u6709 task \u65E0 fn \u65F6\uFF0C\u53EF\u4F5C\u4E3A task \u7684\u4F9D\u8D56\u6536\u96C6\u51FD\u6570",paraId:26,tocIndex:7},{value:`import { share, mutate } from 'helux';
const [state] = share({ a: 1, b: 1, c: 0 });

const witness = mutate(state)({
  deps: () => [state.a, state.b], // deps \u8FD4\u56DE\u7ED3\u679C\u4F1A\u900F\u4F20\u7ED9 taskFnParams.input \u6570\u7EC4
  task: async ({ draft, input }) => {
    draft.c = input[0] + input[1] + 1;
  },
});
`,paraId:27,tocIndex:7},{value:"task \u51FD\u6570\u5185\u90E8\u5E76\u4E0D\u4F1A\u6709\u4F9D\u8D56\u6536\u96C6\u884C\u4E3A\uFF0C\u9700\u5C06\u5168\u90E8\u4F9D\u8D56\u63D0\u524D\u5B9A\u4E49\u5230 deps \u51FD\u6570\u8FD4\u56DE\u503C\u91CC\u3002",paraId:28},{value:"\u9ED8\u8BA4",paraId:29,tocIndex:8},{value:"false",paraId:29,tocIndex:8},{value:"\uFF0C\u4E3A ",paraId:29,tocIndex:8},{value:"true",paraId:29,tocIndex:8},{value:" \u65F6\u8868\u793A\u4F9D\u8D56\u5168\u90E8\u7531 deps \u51FD\u6570\u63D0\u4F9B\uFF0Cfn \u6267\u884C\u8FC7\u7A0B\u4E2D\u4E0D\u6536\u96C6\u4EFB\u4F55\u4F9D\u8D56",paraId:29,tocIndex:8},{value:`import { share, mutate } from 'helux';
const [state] = share({ a: 1, b: 1, c: 0 });

const witness = mutate(state)({
  deps: () => [state.a],
  onlyDeps: true,
  task: async ({ draft, input }) => {
    // \u6B64\u65F6 b \u7684\u53D8\u5316\u4E0D\u4F1A\u5F15\u8D77 task \u6267\u884C
    draft.c = input[0] + state.b + 1;
  },
});
`,paraId:30,tocIndex:8},{value:"\u614E\u7528\u6B64\u53C2\u6570\uFF0C\u53EF\u80FD\u4F1A\u7167\u6210\u4F9D\u8D56\u4E22\u5931\u7684\u60C5\u51B5\u4EA7\u751F\uFF0C\u4EC5\u5F53\u9700\u8981\u9501\u5B9A\u4F9D\u8D56\u505A\u4E00\u4E9B\u7279\u6B8A\u5904\u7406\u65F6\u53EF\u7528\u6B64\u53C2\u6570",paraId:31},{value:"\u9ED8\u8BA4 ",paraId:32,tocIndex:9},{value:"undefined",paraId:32,tocIndex:9},{value:"\uFF0C\u662F\u5426\u68C0\u6D4B\u6B7B\u5FAA\u73AF\uFF0C\u8BBE\u7F6E\u4E3A ",paraId:32,tocIndex:9},{value:"false",paraId:32,tocIndex:9},{value:" \u8868\u793A\u4E0D\u68C0\u67E5\uFF0C\u672A\u8BBE\u5B9A\u65F6\uFF0C\u4F7F\u7528 atom\u3001share \u63A5\u53E3\u8BBE\u5B9A\u7684 ",paraId:32,tocIndex:9},{value:"checkDeadCycle",paraId:32,tocIndex:9},{value:" \u503C\u3002",paraId:32,tocIndex:9},{value:"\u8BFB\u53D6\u81EA\u5DF1\u6539\u53D8\u81EA\u5DF1\uFF0C\u51FA\u73B0\u6B7B\u5FAA\u73AF",paraId:33,tocIndex:9},{value:`import { share, mutate } from 'helux';
const [state] = share({ a: 1, b: 1, c: 0 });

const witness = mutate(state)({
  fn: (draft) => (draft.a += 1),
});
`,paraId:34,tocIndex:9},{value:"\u6CA1\u6307\u5B9A\u65F6\u5185\u90E8\u4F1A\u81EA\u52A8\u751F\u6210\u552F\u4E00 desc\uFF0C\u6307\u5B9A\u4E86\u5982\u51FA\u73B0\u91CD\u590D\u4F1A\u88AB\u4E22\u5F03\uFF0C\u5185\u90E8\u8FD8\u662F\u4E3A\u4E4B\u751F\u6210\u552F\u4E00 desc",paraId:35,tocIndex:10},{value:`const witness = mutate(state)({
  fn: (draft) => (draft.b = draft.a + 1),
  desc: 'myWitness',
});
`,paraId:36,tocIndex:10},{value:"mutate",paraId:37,tocIndex:11},{value:"\u8FD4\u56DE\u7ED3\u679C",paraId:37,tocIndex:11},{value:"witness",paraId:37,tocIndex:11},{value:"\u53EF\u7528\u4E8E\u5E2E\u52A9\u7528\u6237\u91CD\u65B0\u8FD0\u884C",paraId:37,tocIndex:11},{value:"mutate",paraId:37,tocIndex:11},{value:"\u5B9A\u4E49\u7684\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:37,tocIndex:11},{value:"\u5B58\u5728\u540C\u6B65\u51FD\u6570 fn \u65F6\uFF0C\u8FD0\u884C\u624D\u6709\u6548\uFF0C\u9ED8\u8BA4\u4E0D\u629B\u51FA\u9519\u8BEF\uFF0C\u9700\u7528\u6237\u81EA\u5DF1\u8BFB\u53D6\u5143\u7EC4\u7B2C\u4E8C\u4F4D\u53C2\u6570\u505A\u5904\u7406",paraId:38,tocIndex:12},{value:`const witness = mutate(state)({
  fn: (draft) => (draft.a += 1),
});

// \u8FD4\u56DE\u5143\u7EC4\uFF0C\u7B2C\u4E00\u4F4D\u53C2\u6570\u4E3A\u6700\u65B0\u5FEB\u7167\uFF0C\u7B2C\u4E8C\u4F4D\u662F\u9519\u8BEF
const [snap, err] = witness.run();
if (err) {
  // handle err
}
`,paraId:39,tocIndex:12},{value:"\u8FD0\u884C\u540C\u6B65\u51FD\u6570\u5E76\u629B\u51FA\u9519\u8BEF",paraId:40,tocIndex:12},{value:`try {
  const [snap] = witness.run(true);
} catch (err) {
  // handle err
}
`,paraId:41,tocIndex:12},{value:"\u5B58\u5728\u5F02\u6B65\u51FD\u6570 task \u65F6\uFF0C\u8FD0\u884C\u624D\u6709\u6548\uFF0C\u9ED8\u8BA4\u4E0D\u629B\u51FA\u9519\u8BEF\uFF0C\u9700\u7528\u6237\u81EA\u5DF1\u8BFB\u53D6\u5143\u7EC4\u7B2C\u4E8C\u4F4D\u53C2\u6570\u505A\u5904\u7406",paraId:42,tocIndex:13},{value:`const witness = mutate(state)({
  fn: (draft) => (draft.a += 1),
});

// \u8FD4\u56DE\u5143\u7EC4\uFF0C\u7B2C\u4E00\u4F4D\u53C2\u6570\u4E3A\u6700\u65B0\u5FEB\u7167\uFF0C\u7B2C\u4E8C\u4F4D\u662F\u9519\u8BEF
const [snap, err] = await witness.runTask();
if (err) {
  // handle err
}
`,paraId:43,tocIndex:13},{value:"\u8FD0\u884C\u540C\u6B65\u51FD\u6570 task \u5E76\u629B\u51FA\u9519\u8BEF",paraId:44,tocIndex:13},{value:`try {
  const [snap] = await witness.runTask(true);
} catch (err) {
  // handle err
}
`,paraId:45,tocIndex:13}]},94947:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(76357);const a=[{value:"\u76D1\u542C\u4E8B\u4EF6",paraId:0,tocIndex:0},{value:"\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"\u6307\u5357/\u4E8B\u4EF6",paraId:2}]},69946:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(38225);const a=[{value:"\u5168\u91CF\u6D3E\u751F\u51FD\u6570\u7684\u5F02\u6B65\u4EFB\u52A1\u9664\u4E86\u89C2\u5BDF\u5230\u6570\u636E\u4F9D\u8D56\u53D8\u5316\u540E\u88AB\u89E6\u53D1\u6267\u884C\u7684\u65B9\u5F0F\uFF0C\u8FD8\u53EF\u4F7F\u7528 ",paraId:0,tocIndex:0},{value:"runDeriveTask",paraId:0,tocIndex:0},{value:" \u63A5\u53E3\u4EBA\u5DE5\u89E6\u53D1\u5BF9\u5E94\u7684\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1",paraId:0,tocIndex:0},{value:`import { derive, atom, runDeriveTask } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom] = atom(1);
const plus100Result = derive({
  fn: () => 0,
  // \u5728 deps \u8FD4\u56DE\u7ED3\u679C\u91CC\u9501\u5B9A\u4F9D\u8D56
  deps: () => [numAtom.val],
  // input \u6570\u7EC4\u5373 deps \u51FD\u6570\u8FD4\u56DE\u7ED3\u679C
  task: async ({ input }) => {
    await delay();
    return input[0] + 100;
  },
});

async function test() {
  // \u6253\u5370\u4E24\u6B21\u7ED3\u679C\uFF0C\u5DF2\u7ECF\u4E0D\u76F8\u540C
  const [ret1] = await runDeriveTask(plus100Result);
  console.log(ret1.val);
  const [ret2] = await runDeriveTask(plus100Result);
  console.log(ret2.val);
}
`,paraId:1,tocIndex:1},{value:"runDeriveTask",paraId:2},{value:"\u7B2C\u4E8C\u4F4D\u4E3A",paraId:2},{value:"throwErr",paraId:2},{value:"\uFF0C\u8868\u793A\u662F\u5426\u629B\u51FA\u9519\u8BEF\uFF0C\u9ED8\u8BA4 ",paraId:2},{value:"false",paraId:2},{value:"\uFF0C\u6B64\u65F6\u9519\u8BEF\u4F20\u5730\u7ED9\u5143\u7EC4\u7B2C\u4E8C\u4F4D\u53C2\u6570",paraId:2},{value:`const [ret1, err] = await runDeriveTask(plus100Result, true);
if (err) {
  // handle err
}
`,paraId:3},{value:"\u53EF\u8BBE\u7F6E",paraId:4},{value:"throwErr",paraId:4},{value:"\u4E3A",paraId:4},{value:"true",paraId:4},{value:"\uFF0C\u8868\u793A\u629B\u51FA\u9519\u8BEF\uFF0C\u6B64\u65F6\u7528\u6237\u9700\u8981\u81EA\u5DF1",paraId:4},{value:"try catch",paraId:4},{value:"\u5E76\u5904\u7406\u9519\u8BEF",paraId:4},{value:`try {
  const [ret1] = await runDeriveTask(plus100Result, true);
} catch (err) {
  // handle err
}
`,paraId:5},{value:"\u5982\u76EE\u6807\u6D3E\u751F\u7ED3\u679C\u5BF9\u5E94\u6D3E\u751F\u51FD\u6570\u5B9A\u4E49\u91CC\u6CA1\u6709",paraId:6},{value:"task",paraId:6},{value:"\u5F02\u6B65\u8BA1\u7B97\u4EFB\u52A1\uFF0C\u5219\u6267\u884C",paraId:6},{value:"runDeriveTask",paraId:6},{value:"\u65E0\u4EFB\u4F55\u4F5C\u7528\uFF0C\u53EA\u662F\u8FD4\u56DE\u4E0A\u6700\u8FD1\u4E00\u6B21\u751F\u6210\u7684\u6D3E\u751F\u7ED3\u679C",paraId:6},{value:`// \u5982 plus100Result \u65E0 task\uFF0Cret1 \u8868\u793A\u6700\u8FD1\u4E00\u6B21\u751F\u6210\u7684\u6D3E\u751F\u7ED3\u679C
const [ret1] = await runDeriveTask(plus100Result);
`,paraId:7}]},91407:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(61882);const a=[{value:"\u5168\u91CF\u6D3E\u751F\u51FD\u6570\u9664\u4E86\u89C2\u5BDF\u5230\u6570\u636E\u4F9D\u8D56\u53D8\u5316\u540E\u88AB\u89E6\u53D1\u6267\u884C\u7684\u65B9\u5F0F\uFF0C\u8FD8\u53EF\u4F7F\u7528 ",paraId:0,tocIndex:0},{value:"runDerive",paraId:0,tocIndex:0},{value:" \u63A5\u53E3\u4EBA\u5DE5\u89E6\u53D1\u5BF9\u5E94\u7684\u6D3E\u751F\u51FD\u6570",paraId:0,tocIndex:0},{value:`import { derive, atom, runDerive } from 'helux';

const [numAtom] = atom(1);
const plus100Result = derive(() => numAtom.val + Date.now());

// \u6253\u5370\u4E24\u6B21\u7ED3\u679C\uFF0C\u5DF2\u7ECF\u4E0D\u76F8\u540C
const [ret1] = runDerive(plus100Result);
console.log(ret1.val);
const [ret2] = runDerive(plus100Result);
console.log(ret2.val);
`,paraId:1,tocIndex:1},{value:"runDerive",paraId:2,tocIndex:1},{value:"\u7B2C\u4E8C\u4F4D\u4E3A",paraId:2,tocIndex:1},{value:"throwErr",paraId:2,tocIndex:1},{value:"\uFF0C\u8868\u793A\u662F\u5426\u629B\u51FA\u9519\u8BEF\uFF0C\u9ED8\u8BA4 ",paraId:2,tocIndex:1},{value:"false",paraId:2,tocIndex:1},{value:"\uFF0C\u6B64\u65F6\u9519\u8BEF\u4F20\u5730\u7ED9\u5143\u7EC4\u7B2C\u4E8C\u4F4D\u53C2\u6570",paraId:2,tocIndex:1},{value:`const [ret1, err] = runDerive(plus100Result, true);
if (err) {
  // handle err
}
`,paraId:3,tocIndex:1},{value:"\u53EF\u8BBE\u7F6E",paraId:4,tocIndex:1},{value:"throwErr",paraId:4,tocIndex:1},{value:"\u4E3A",paraId:4,tocIndex:1},{value:"true",paraId:4,tocIndex:1},{value:"\uFF0C\u8868\u793A\u629B\u51FA\u9519\u8BEF\uFF0C\u6B64\u65F6\u7528\u6237\u9700\u8981\u81EA\u5DF1",paraId:4,tocIndex:1},{value:"try catch",paraId:4,tocIndex:1},{value:"\u5E76\u5904\u7406\u9519\u8BEF",paraId:4,tocIndex:1},{value:`try {
  const [ret1] = runDerive(plus100Result, true);
} catch (err) {
  // handle err
}
`,paraId:5,tocIndex:1}]},72818:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(89335);const a=[{value:"\u6D3E\u751F\u51FD\u6570\u7684\u5F02\u6B65\u4EFB\u52A1\u9664\u4E86\u89C2\u5BDF\u5230\u6570\u636E\u4F9D\u8D56\u53D8\u5316\u540E\u88AB\u89E6\u53D1\u6267\u884C\u7684\u65B9\u5F0F\uFF0C\u8FD8\u53EF\u4F7F\u7528 ",paraId:0,tocIndex:0},{value:"runMutateTask",paraId:0,tocIndex:0},{value:" \u63A5\u53E3\u4EBA\u5DE5\u89E6\u53D1\u5BF9\u5E94\u7684\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1",paraId:0,tocIndex:0},{value:`import { derive, atom, runMutateTask } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom] = atom(1);
const plus100Result = derive({
  fn: () => 0,
  // \u5728 deps \u8FD4\u56DE\u7ED3\u679C\u91CC\u9501\u5B9A\u4F9D\u8D56
  deps: () => [numAtom.val],
  // input \u6570\u7EC4\u5373 deps \u51FD\u6570\u8FD4\u56DE\u7ED3\u679C
  task: async ({ input }) => {
    await delay();
    return input[0] + 100;
  },
});

async function test() {
  // \u6253\u5370\u4E24\u6B21\u7ED3\u679C\uFF0C\u5DF2\u7ECF\u4E0D\u76F8\u540C
  const [ret1] = await runMutateTask(plus100Result);
  console.log(ret1.val);
  const [ret2] = await runMutateTask(plus100Result);
  console.log(ret2.val);
}
`,paraId:1,tocIndex:1},{value:"runMutateTask",paraId:2},{value:"\u7B2C\u4E8C\u4F4D\u4E3A",paraId:2},{value:"throwErr",paraId:2},{value:"\uFF0C\u8868\u793A\u662F\u5426\u629B\u51FA\u9519\u8BEF\uFF0C\u9ED8\u8BA4 ",paraId:2},{value:"false",paraId:2},{value:"\uFF0C\u6B64\u65F6\u9519\u8BEF\u4F20\u5730\u7ED9\u5143\u7EC4\u7B2C\u4E8C\u4F4D\u53C2\u6570",paraId:2},{value:`const [ret1, err] = await runMutateTask(plus100Result, true);
if (err) {
  // handle err
}
`,paraId:3},{value:"\u53EF\u8BBE\u7F6E",paraId:4},{value:"throwErr",paraId:4},{value:"\u4E3A",paraId:4},{value:"true",paraId:4},{value:"\uFF0C\u8868\u793A\u629B\u51FA\u9519\u8BEF\uFF0C\u6B64\u65F6\u7528\u6237\u9700\u8981\u81EA\u5DF1",paraId:4},{value:"try catch",paraId:4},{value:"\u5E76\u5904\u7406\u9519\u8BEF",paraId:4},{value:`try {
  const [ret1] = await runMutateTask(plus100Result, true);
} catch (err) {
  // handle err
}
`,paraId:5},{value:"\u5982\u76EE\u6807\u6D3E\u751F\u7ED3\u679C\u5BF9\u5E94\u6D3E\u751F\u51FD\u6570\u5B9A\u4E49\u91CC\u6CA1\u6709",paraId:6},{value:"task",paraId:6},{value:"\u5F02\u6B65\u8BA1\u7B97\u4EFB\u52A1\uFF0C\u5219\u6267\u884C",paraId:6},{value:"runMutateTask",paraId:6},{value:"\u65E0\u4EFB\u4F55\u4F5C\u7528\uFF0C\u53EA\u662F\u8FD4\u56DE\u4E0A\u6700\u8FD1\u4E00\u6B21\u751F\u6210\u7684\u6D3E\u751F\u7ED3\u679C",paraId:6},{value:`// \u5982 plus100Result \u65E0 task\uFF0Cret1 \u8868\u793A\u6700\u8FD1\u4E00\u6B21\u751F\u6210\u7684\u6D3E\u751F\u7ED3\u679C
const [ret1] = await runMutateTask(plus100Result);
`,paraId:7}]},14268:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(8846);const a=[{value:"\u91CD\u65B0\u89E6\u53D1",paraId:0,tocIndex:0},{value:"mutate",paraId:0,tocIndex:0},{value:"\u5B9A\u4E49\u7684",paraId:0,tocIndex:0},{value:"fn",paraId:0,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C",paraId:0,tocIndex:0}]},36871:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(68257);const a=[{value:"atom",paraId:0,tocIndex:0},{value:"\u652F\u6301\u4EFB\u610F\u6570\u636E\u7C7B\u578B\uFF0C\u76F4\u63A5\u8BFB\u53D6\u65F6\u9700\u8981\u624B\u52A8\u62C6\u7BB1\uFF0C",paraId:0,tocIndex:0},{value:"share",paraId:0,tocIndex:0},{value:"\u4EC5\u652F\u6301\u5B57\u5178\u7C7B\u578B\uFF0C\u56E0\u8FD4\u56DE\u7ED3\u679C\u662F\u5B57\u5178\u5BF9\u8C61\uFF0C\u65E0\u88C5\u7BB1\u884C\u4E3A\uFF0C\u53EF\u4EE5\u76F4\u63A5\u8BFB\u53D6\u76EE\u6807\u4EFB\u610F\u8282\u70B9\u503C",paraId:0,tocIndex:0},{value:`import { share } from 'helux';

const [sharedObj] = share({ info: { born: 2023 } });
console.log(sharedObj); // sharedObj: {info: { born: 2023 }}
`,paraId:1,tocIndex:0},{value:"\u5176\u4ED6\u4F7F\u7528\u65B9\u5F0F\u5747\u548C",paraId:2,tocIndex:0},{value:"atom",paraId:3,tocIndex:0},{value:"\u4FDD\u6301\u4E00\u81F4\u3002",paraId:2,tocIndex:0}]},94452:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(22378);const a=[{value:"sharex",paraId:0,tocIndex:0},{value:" \u8FD4\u56DE\u5171\u4EAB\u4E0A\u4E0B\u6587 ",paraId:0,tocIndex:0},{value:"ctx",paraId:0,tocIndex:0},{value:"\uFF0C",paraId:0,tocIndex:0},{value:"share",paraId:0,tocIndex:0},{value:" \u8FD4\u56DE\u5143\u7EC4\u7ED3\u6784 ",paraId:0,tocIndex:0},{value:"[ state, setState, ctx ]",paraId:0,tocIndex:0},{value:"\uFF0C \u5C06 ",paraId:0,tocIndex:0},{value:"ctx.state",paraId:0,tocIndex:0},{value:" \u548C ",paraId:0,tocIndex:0},{value:"ctx.setState",paraId:0,tocIndex:0},{value:" \u653E\u7F6E\u5230\u5143\u7EC4\u7684\u7B2C\u4E00\u4F4D\u548C\u7B2C\u4E8C\u6B21\u53C2\u6570\u5904\u3002",paraId:0,tocIndex:0},{value:`import { share, sharex } from 'helux';

// \u8FD4\u56DE\u5143\u7EC4\uFF0C\u5143\u7EC4\u7684\u7B2C\u4E00\u4F4D\u548C\u7B2C\u4E8C\u6B21\u53C2\u6570\u5373\u662F state setState
const [obj, setObj, sharedCtx] = share({ a: 1, b: 2 });

// \u8FD4\u56DE\u5B57\u5178\u5BF9\u8C61\uFF0C\u5BF9\u8C61\u91CC\u53EF\u89E3\u6784\u51FA state setState
const sharedCtx = sharex(1);
const { state: obj, setState: setObj } = sharedCtx;
`,paraId:1,tocIndex:0},{value:"\u5176\u4ED6\u4F7F\u7528\u65B9\u5F0F\u5747\u548C",paraId:2,tocIndex:0},{value:"atom",paraId:3,tocIndex:0},{value:"\u4FDD\u6301\u4E00\u81F4\u3002",paraId:2,tocIndex:0}]},40964:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(97930);const a=[{value:"signal",paraId:0,tocIndex:0},{value:"\u63A5\u53E3\u5141\u8BB8\u7528\u6237\u76F4\u63A5\u5C06\u5171\u4EAB\u72B6\u6001\u7684\u6570\u636E\u76F4\u63A5\u7ED1\u5B9A\u5230\u89C6\u56FE\uFF0C\u9996\u6B21\u6E32\u67D3\u5B8C\u6BD5\u5373\u6536\u96C6\u5E76\u9501\u5B9A\u5BF9\u5E94\u7684\u6570\u636E\u4F9D\u8D56\u3002",paraId:0,tocIndex:0},{value:"\u7ED1\u5B9A",paraId:1,tocIndex:1},{value:"atom",paraId:1,tocIndex:1},{value:"\u5355\u4E2A\u503C",paraId:1,tocIndex:1},{value:"\u63D0\u4F9B\u522B\u540D",paraId:2,tocIndex:2},{value:"$",paraId:2,tocIndex:2},{value:"\u8BA9\u4EE3\u7801\u4E66\u5199\u66F4\u7B80\u6D01",paraId:2,tocIndex:2},{value:"\u652F\u6301",paraId:3,tocIndex:3},{value:"$(val, format)",paraId:3,tocIndex:3},{value:"\u8C03\u7528\u6765\u4E2A\u6027\u5316\u6E32\u67D3\u7ED3\u679C",paraId:3,tocIndex:3},{value:"\u4E00\u6B21 signal \u8C03\u7528\u7ED1\u5B9A",paraId:4,tocIndex:4},{value:"atom",paraId:4,tocIndex:4},{value:"\u3001",paraId:4,tocIndex:4},{value:"share",paraId:4,tocIndex:4},{value:"\u591A\u4E2A\u503C\uFF0C\u4F20\u5165\u4E00\u4E2A\u56DE\u8C03\u51FD\u6570\uFF0C\u8FD4\u56DE\u4E00\u4E2A jsx \u7247\u6BB5\u5373\u53EF\uFF0C\u5982\u9700\u62BD\u8C61\u4E3A\u7EC4\u4EF6\u53EF\u4F7F\u7528",paraId:4,tocIndex:4},{value:"block",paraId:5,tocIndex:4},{value:"\u3002",paraId:4,tocIndex:4}]},88238:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(87268);const a=[{value:"\u4E3A\u5B57\u5178\u5BF9\u8C61\u751F\u6210\u540C\u6B65\u51FD\u6570\uFF0C\u6B64\u63A5\u53E3\u504F\u5411\u4E8E\u5E93\u5F00\u53D1\u8005\uFF0C\u63A8\u8350\u4F7F\u7528",paraId:0,tocIndex:0},{value:"\u5171\u4EAB\u4E0A\u4E0B\u6587/sync",paraId:1,tocIndex:0},{value:"\u66FF\u4EE3\uFF0C\u7701\u7565\u6389\u4E3B\u52A8\u7ED1\u5B9A\u76EE\u6807\u5171\u4EAB\u72B6\u6001\u7684\u6B65\u9AA4\u3002",paraId:0,tocIndex:0},{value:"\u672C\u7AE0\u8282\u5C55\u793A\u57FA\u7840\u7528\u6CD5\uFF0C\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:2},{value:"\u6307\u5357/\u53CC\u5411\u7ED1\u5B9A",paraId:3},{value:"\u652F\u6301\u7ED1\u5B9A\u4E00\u5C42\u6216\u591A\u5C42\u8DEF\u5F84\u7684\u76EE\u6807\u503C\u505A\u6570\u636E\u540C\u6B65",paraId:4,tocIndex:2},{value:"\u4F7F\u7528",paraId:5},{value:"ctx.sync",paraId:5},{value:"\uFF0C\u5199\u6CD5\u66F4\u7B80\u4FBF\uFF0C\u65E0\u7ED1\u5B9A\u76EE\u6807\u5171\u4EAB\u72B6\u6001\u6B65\u9AA4\u3002",paraId:5}]},59951:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(86296);const a=[{value:"\u4E3A\u539F\u59CB\u503C\uFF0C\u6216\u4E00\u5C42\u8DEF\u5F84\u7684\u5B57\u5178\u5BF9\u8C61\u751F\u6210\u540C\u6B65\u51FD\u6570\uFF0C\u6B64\u63A5\u53E3\u504F\u5411\u4E8E\u5E93\u5F00\u53D1\u8005\uFF0C\u63A8\u8350\u4F7F\u7528",paraId:0,tocIndex:0},{value:"\u5171\u4EAB\u4E0A\u4E0B\u6587/syncer",paraId:1,tocIndex:0},{value:"\u66FF\u4EE3\uFF0C\u7701\u7565\u6389\u4E3B\u52A8\u7ED1\u5B9A\u76EE\u6807\u5171\u4EAB\u72B6\u6001\u7684\u6B65\u9AA4\u3002",paraId:0,tocIndex:0},{value:"\u672C\u7AE0\u8282\u5C55\u793A\u57FA\u7840\u7528\u6CD5\uFF0C\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:2},{value:"\u6307\u5357/\u53CC\u5411\u7ED1\u5B9A",paraId:3},{value:"\u4F7F\u7528",paraId:4},{value:"ctx.syncer",paraId:4},{value:"\uFF0C\u5199\u6CD5\u66F4\u7B80\u4FBF\uFF0C\u65E0\u7ED1\u5B9A\u76EE\u6807\u5171\u4EAB\u72B6\u6001\u6B65\u9AA4\u3002",paraId:4},{value:"\u4F7F\u7528",paraId:5},{value:"ctx.syncer",paraId:5},{value:"\uFF0C\u5199\u6CD5\u66F4\u7B80\u4FBF\uFF0C\u65E0\u7ED1\u5B9A\u76EE\u6807\u5171\u4EAB\u72B6\u6001\u6B65\u9AA4\u3002",paraId:5},{value:"syncer",paraId:6},{value:"\u751F\u6210\u540C\u6B65\u51FD\u6570\u65F6\uFF0C\u9488\u5BF9\u540C\u4E00\u4E2A\u8DEF\u5F84\u603B\u662F\u8FD4\u56DE\u4E0D\u53D8\u7684\u5F15\u7528",paraId:6}]},79438:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(68285);const a=[{value:"watchEffect",paraId:0,tocIndex:0},{value:"\u7528\u4E8E\u89C2\u5BDF\u6570\u636E\u53D8\u5316\uFF0C\u5E76\u505A\u5BF9\u5E94\u7684\u5904\u7406\u903B\u8F91\uFF0C\u89C2\u5BDF\u7684\u7C92\u5EA6\u53EF\u4EE5\u4EFB\u610F\u5B9A\u5236\u3002",paraId:0,tocIndex:0},{value:"\u533A\u522B\u4E8E",paraId:1,tocIndex:0},{value:"watch",paraId:1,tocIndex:0},{value:"\uFF0C",paraId:1,tocIndex:0},{value:"watchEffect",paraId:1,tocIndex:0},{value:"\u56DE\u8C03\u4F1A\u7ACB\u5373\u6267\u884C\uFF0C\u81EA\u52A8\u5BF9\u9996\u6B21\u8FD0\u884C\u65F6\u51FD\u6570\u5185\u8BFB\u53D6\u5230\u7684\u503C\u5B8C\u6210\u53D8\u5316\u76D1\u542C\u3002",paraId:1,tocIndex:0},{value:"\u672C\u7AE0\u8282\u5C55\u793A\u57FA\u7840\u7528\u6CD5\uFF0C\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:2},{value:"\u6307\u5357/\u89C2\u5BDF",paraId:3},{value:"\u6216",paraId:2},{value:"\u57FA\u7840api/\u89C2\u5BDF",paraId:4},{value:`import { watchEffect, getSnap } from ' helux ';
const [priceState, setPrice] = share({ a: 1 });

// \u89C2\u5BDF priceState.a \u7684\u53D8\u5316
watchEffect(() => {
  console.log(\`found price.a changed from \${getSnap(priceState).a} to \${priceState.a}\`);
});
`,paraId:5,tocIndex:1}]},19836:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(53722);const a=[{value:"watch",paraId:0,tocIndex:0},{value:"\u7528\u4E8E\u89C2\u5BDF\u6570\u636E\u53D8\u5316\uFF0C\u5E76\u505A\u5BF9\u5E94\u7684\u5904\u7406\u903B\u8F91\uFF0C\u89C2\u5BDF\u7684\u7C92\u5EA6\u53EF\u4EE5\u4EFB\u610F\u5B9A\u5236\u3002",paraId:0,tocIndex:0},{value:"\u672C\u7AE0\u8282\u5C55\u793A\u57FA\u7840\u7528\u6CD5\uFF0C\u66F4\u591A\u7528\u6CD5\u67E5\u9605",paraId:1},{value:"\u6307\u5357/\u89C2\u5BDF",paraId:2},{value:"watch \u53EF\u89C2\u5BDF\u5171\u4EAB\u72B6\u6001\u8DDF\u5BF9\u8C61\u7684\u53D8\u5316\uFF0C\u7B2C\u4E8C\u4F4D\u53C2\u6570\u53EF\u5199\u4E3A",paraId:3,tocIndex:2},{value:"()=>[]",paraId:3,tocIndex:2},{value:"\u6216",paraId:3,tocIndex:2},{value:"{deps:()=>[]}",paraId:3,tocIndex:2},{value:"\u8BBE\u7F6E",paraId:4,tocIndex:5},{value:"immediate",paraId:4,tocIndex:5},{value:"\u4E3A true \u65F6\uFF0Cwatch \u56DE\u8C03\u9996\u6B21\u6267\u884C\u4F1A\u81EA\u52A8\u6536\u96C6\u4F9D\u8D56\uFF0C\u6B64\u65F6\u5982\u679C\u5B58\u5728\u8BFB\u53D6\u81EA\u5DF1\u4FEE\u6539\u81EA\u5DF1\u7684\u884C\u4E3A\uFF0C\u4F1A\u9020\u6210\u6B7B\u5FAA\u73AF\u3002",paraId:4,tocIndex:5},{value:"\u6B7B\u5FAA\u73AF\u4EA7\u751F\u540E\uFF0C\u6846\u67B6\u4F1A\u5B9A\u4F4D\u5230\u5177\u4F53\u7684\u51FD\u6570\u4F4D\u7F6E\u5E76\u544A\u77E5\u539F\u56E0\uFF0C\u7528\u6237\u53EF\u6253\u5F00\u63A7\u5236\u53F0\u67E5\u770B",paraId:5,tocIndex:5},{value:`import { watch, atom } from 'helux';

const [state, setAtom] = atom({ a: 1 });

watch(
  () => {
    // \u274C \u8BFB\u53D6 a \u4FEE\u6539 a\uFF0C\u89E6\u53D1\u6B7B\u5FAA\u73AF
    setAtom((draft) => {
      draft.a += 1;
    });
  },
  { immediate: true },
);
`,paraId:6,tocIndex:5}]},63725:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(63277);const a=[]},98413:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(25793);const a=[{value:"\u5305\u542B\u4EE5\u4E0B\u5E38\u7528\u94A9\u5B50",paraId:0,tocIndex:0},{value:"useAtom",paraId:1,tocIndex:0},{value:" \u4F7F\u7528",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5143\u7EC4",paraId:2,tocIndex:0},{value:"useAtomX",paraId:3,tocIndex:0},{value:" \u4F7F\u7528",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5B57\u5178",paraId:2,tocIndex:0},{value:"useReactive",paraId:4,tocIndex:0},{value:" \u4F7F\u7528",paraId:2,tocIndex:0},{value:"reactive",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5143\u7EC4",paraId:2,tocIndex:0},{value:"useReactiveX",paraId:5,tocIndex:0},{value:" \u4F7F\u7528",paraId:2,tocIndex:0},{value:"reactive",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5B57\u5178",paraId:2,tocIndex:0},{value:"useDerived",paraId:6,tocIndex:0},{value:" \u4F7F\u7528\u5168\u91CF\u6D3E\u751F\u7ED3\u679C",paraId:2,tocIndex:0},{value:"useOnEvent",paraId:7,tocIndex:0},{value:" \u4F7F\u7528\u4E8B\u4EF6\u76D1\u542C",paraId:2,tocIndex:0},{value:"useWatch",paraId:8,tocIndex:0},{value:" \u4F7F\u7528\u89C2\u5BDF",paraId:2,tocIndex:0},{value:"useWatchEffect",paraId:9,tocIndex:0},{value:" \u4F7F\u7528\u89C2\u5BDF\uFF0C\u7ACB\u5373\u8FD0\u884C\u5E76\u5728\u9996\u6B21\u8FD0\u884C\u65F6\u6536\u96C6\u5230\u4F9D\u8D56",paraId:2,tocIndex:0},{value:"useGlobalId",paraId:10,tocIndex:0},{value:" \u4F7F\u7528",paraId:2,tocIndex:0},{value:"globalId",paraId:2,tocIndex:0},{value:"useMutate",paraId:11,tocIndex:0},{value:" \u4F7F\u7528\u53EF\u53D8\u672C\u5730\u72B6\u6001",paraId:2,tocIndex:0},{value:"useService",paraId:12,tocIndex:0},{value:" \u4F7F\u7528\u670D\u52A1",paraId:2,tocIndex:0},{value:"useActionLoading",paraId:13,tocIndex:0},{value:" \u4F7F\u7528",paraId:2,tocIndex:0},{value:"action",paraId:2,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:2,tocIndex:0},{value:"useMutateLoading",paraId:14,tocIndex:0},{value:" \u4F7F\u7528",paraId:2,tocIndex:0},{value:"mutate",paraId:2,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:2,tocIndex:0},{value:"useLocalForceUpdate",paraId:15,tocIndex:0},{value:" \u4F7F\u7528\u66F4\u65B0\u5F53\u524D\u7EC4\u4EF6\u5B9E\u4F8B\u51FD\u6570",paraId:2,tocIndex:0},{value:"useGlobalForceUpdate",paraId:16,tocIndex:0},{value:" \u4F7F\u7528\u66F4\u65B0\u6240\u6709\u8BFB\u53D6\u4E86\u5171\u4EAB\u72B6\u6001\u7684\u7EC4\u4EF6\u5B9E\u4F8B\u7684\u51FD\u6570",paraId:2,tocIndex:0}]},21998:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(78457);const a=[{value:"\u7EC4\u4EF6\u4E2D\u4F7F\u7528",paraId:0,tocIndex:0},{value:"action",paraId:0,tocIndex:0},{value:"\u51FD\u6570\u7684\u6267\u884C\u72B6\u6001\uFF0C\u6B64\u51FD\u6570\u662F\u4E00\u4E2A\u6052\u5B89\u5168\u51FD\u6570\uFF0C\u4F20\u5165\u4EFB\u4F55",paraId:0,tocIndex:0},{value:"desc",paraId:0,tocIndex:0},{value:"\u5747\u80FD\u8FD4\u56DE\u72B6\u6001\uFF0C\u5982\u679C\u4F20\u5165\u7684\u662F\u4E0D\u5B58\u5728\u7684",paraId:0,tocIndex:0},{value:"action desc",paraId:0,tocIndex:0},{value:"\u5219\u8FD4\u56DE\u4E00\u4E2A\u5047\u7684\u72B6\u6001",paraId:0,tocIndex:0},{value:"\u7C7B\u578B\u63CF\u8FF0\u4E3A",paraId:1,tocIndex:0},{value:`function useActionLoading<T = SharedState>(
  target?: T,
): [
  SafeLoading, // \u83B7\u53D6\u5404\u4E2A action desc \u7684\u8FD0\u884C\u72B6\u6001
  SetState<LoadingState>, // \u4EBA\u5DE5\u4FEE\u6539\u6267\u884C\u72B6\u6001\uFF08\u5927\u591A\u6570\u65F6\u5019\u90FD\u4E0D\u9700\u8981\u7528\u5230\u6B64\u529F\u80FD\uFF09
  IInsRenderInfo,
];
`,paraId:2,tocIndex:0},{value:"\u6B64\u51FD\u6570\u504F\u5411\u4E8E\u63D0\u4F9B\u7ED9\u5E93\u5F00\u53D1\u8005\uFF0C\u63A8\u8350\u9605\u8BFB",paraId:3},{value:"\u6A21\u5757\u5316/defineActions",paraId:4},{value:"\u4E86\u89E3\u548C\u4F7F\u7528\u914D\u5957\u751F\u6210\u7684",paraId:3},{value:"useLoading",paraId:3},{value:"\u4F1A\u66F4\u65B9\u4FBF",paraId:3}]},95777:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(56950);const a=[{value:"useAtomX",paraId:0,tocIndex:0},{value:"\u548C",paraId:0,tocIndex:0},{value:"useAtom",paraId:0,tocIndex:0},{value:"\u4F7F\u7528\u65B9\u5F0F\u5B8C\u5168\u4E00\u6837\uFF0C\u533A\u522B\u4E8E",paraId:0,tocIndex:0},{value:"useAtom",paraId:0,tocIndex:0},{value:"\u8FD4\u56DE\u5143\u7EC4\u7ED3\u6784\uFF0C",paraId:0,tocIndex:0},{value:"useAtomX",paraId:0,tocIndex:0},{value:"\u8FD4\u56DE\u7684\u662F\u5B57\u5178\u7ED3\u6784",paraId:0,tocIndex:0},{value:"\u5176\u4ED6\u4F7F\u7528\u65B9\u5F0F\u53EF\u53C2\u8003",paraId:1},{value:"useAtom",paraId:2},{value:"useAtomX",paraId:3,tocIndex:1},{value:"\u53EF\u66FF\u6362\u4E3A",paraId:3,tocIndex:1},{value:"ctx.useStateX",paraId:3,tocIndex:1},{value:"\uFF0C\u4E66\u5199\u66F4\u7B80\u4FBF\u3002",paraId:3,tocIndex:1}]},98146:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(57202);const a=[{value:"\u7EC4\u4EF6\u4E2D\u4F7F\u7528\u5171\u4EAB\u72B6\u6001\uFF0C\u53EA\u63A5\u53D7",paraId:0,tocIndex:0},{value:"atom",paraId:0,tocIndex:0},{value:"\uFF0C",paraId:0,tocIndex:0},{value:"share",paraId:0,tocIndex:0},{value:"\u8FD4\u56DE\u7684\u5171\u4EAB\u72B6\u6001\uFF0C\u4F20\u5165\u5176\u4ED6\u5BF9\u8C61\u5219\u4F1A\u62A5\u9519\u3002",paraId:0,tocIndex:0},{value:"\u4F7F\u7528",paraId:1,tocIndex:1},{value:"atom",paraId:1,tocIndex:1},{value:" \u8FD4\u56DE\u7684\u5171\u4EAB\u72B6\u6001\u65F6\uFF0C\u4F1A\u81EA\u52A8\u62C6\u7BB1\uFF0C\u4F1A\u8FD4\u56DE",paraId:1,tocIndex:1},{value:"[state, setState]",paraId:1,tocIndex:1},{value:"\u7ED3\u6784\u63D0\u4F9B\u4E2A\u7528\u6237\u8BFB\u72B6\u6001\u6216\u6539\u72B6\u6001\u3002",paraId:1,tocIndex:1},{value:"\u4F7F\u7528",paraId:2},{value:"ctx.useState",paraId:2},{value:"\uFF0C\u5199\u6CD5\u66F4\u7B80\u4FBF\uFF0C\u65E0\u7ED1\u5B9A\u76EE\u6807\u5171\u4EAB\u72B6\u6001\u6B65\u9AA4\u3002",paraId:2},{value:"useAtom",paraId:3,tocIndex:5},{value:"\u652F\u6301\u900F\u4F20",paraId:3,tocIndex:5},{value:"IUseSharedStateOptions",paraId:3,tocIndex:5},{value:"\u53EF\u9009\u53C2\u6570\uFF0C\u7C7B\u578B\u63CF\u8FF0\u5982\u4E0B",paraId:3,tocIndex:5},{value:`  /**
   * default: every \uFF0C\u8BBE\u7F6E\u4F9D\u8D56\u6536\u96C6\u7B56\u7565
   */
  collectType?: 'no' | 'first' | 'every';
  /**
   * \u8BBE\u7F6E\u89C6\u56FEid
   */
  id?: NumStrSymbol;
  /**
   * default: true \uFF0C\u662F\u5426\u4EE5 pure \u6A21\u5F0F\u4F7F\u7528\u72B6\u6001\uFF0C\u6B64\u53C2\u6570\u53EA\u5F71\u54CD\u5B57\u5178\u6570\u636E\u7684\u4F9D\u8D56\u6536\u96C6\u89C4\u5219
   */
  pure?: boolean;
  /**
   * \u8BBE\u7F6E\u56FA\u5B9A\u7684\u4F9D\u8D56\u9879
   */
  deps?: (readOnlyState: T) => any[] | void;
  /**
   * default: true\uFF0C\u662F\u5426\u8BB0\u5F55\u6570\u7EC4\u81EA\u8EAB\u4F9D\u8D56
   */
  arrDep?: boolean;
  /**
   * default: true\uFF0C\u662F\u5426\u8BB0\u5F55\u6570\u7EC4\u4E0B\u6807\u4F9D\u8D56
   * \`\`\`
   */
  arrIndexDep?: boolean;
`,paraId:4,tocIndex:5},{value:"\u9ED8\u8BA4\u503C: ",paraId:5,tocIndex:6},{value:"every",paraId:5,tocIndex:6},{value:" \uFF0C\u8BBE\u7F6E\u4E3A ",paraId:5,tocIndex:6},{value:"first",paraId:5,tocIndex:6},{value:" \u6216 ",paraId:5,tocIndex:6},{value:"no",paraId:5,tocIndex:6},{value:" \u53EF\u4EE5\u8FDB\u4E00\u6B65\u63D0\u9AD8\u7EC4\u4EF6\u6E32\u67D3\u6027\u80FD\uFF0C\u4F46\u9700\u8981\u6CE8\u610F\u4E3A ",paraId:5,tocIndex:6},{value:"first",paraId:5,tocIndex:6},{value:" \u65F6\u5982\u679C\u7EC4\u4EF6\u7684\u4F9D\u8D56\u662F\u53D8\u5316\u7684\uFF0C\u4F1A\u9020\u6210\u4F9D\u8D56\u4E22\u5931\u7684\u60C5\u51B5\u4EA7\u751F\uFF0C\u89E6\u53D1\u7EC4\u4EF6\u4E0D\u4F1A\u91CD\u6E32\u67D3\u7684 bug\uFF0C\u8BBE\u4E3A ",paraId:5,tocIndex:6},{value:"no",paraId:5,tocIndex:6},{value:" \u65F6\u4E0D\u4F1A\u4ECE ui \u6E32\u67D3\u91CC\u6536\u96C6\u5230\u4F9D\u8D56\uFF0C\u9700 ",paraId:5,tocIndex:6},{value:"deps",paraId:5,tocIndex:6},{value:" \u51FD\u6570\u8865\u5145\u4F9D\u8D56",paraId:5,tocIndex:6},{value:`1 no \uFF0C\u6B64\u65F6\u4F9D\u8D56\u4EC5\u9760 deps \u63D0\u4F9B
2 first \uFF0C\u4EC5\u9996\u8F6E\u6E32\u67D3\u6536\u96C6\u4F9D\u8D56\uFF0C\u540E\u7EED\u6E32\u67D3\u6D41\u7A0B\u4E0D\u6536\u96C6
3 every \uFF0C\u6BCF\u4E00\u8F6E\u6E32\u67D3\u6D41\u7A0B\u90FD\u5B9E\u65F6\u6536\u96C6\uFF0C\u5141\u8BB8\u4E0D\u540C\u7684\u6E32\u67D3\u7ED3\u679C\u6709\u4E0D\u540C\u7684\u4F9D\u8D56\u9879
`,paraId:6,tocIndex:6},{value:"\u5728 ICreateOptionsFull.rules \u91CC\u914D\u7F6E\u66F4\u65B0\u7684 ids \u5305\u542B\u7684\u503C\u6307\u7684\u5C31\u662F\u6B64\u5904\u914D\u7F6E\u7684 id\uFF0C\u6B64 id \u5C5E\u4E8E\u4F20\u5165\u7684 sharedState \uFF0C\u5373\u548C\u5171\u4EAB\u72B6\u6001\u7ED1\u5B9A\u4E86\u5BF9\u5E94\u5173\u7CFB\uFF0C\u610F\u5473\u7740\u7EC4\u4EF6\u4F7F\u7528\u4E0D\u540C\u7684 sharedState \u65F6\u4F20\u5165\u4E86\u76F8\u540C\u7684 id\uFF0C\u662F\u76F8\u4E92\u9694\u79BB\u7684",paraId:7,tocIndex:7},{value:"\u5982\u9700\u8865\u5145\u4E00\u4E9B\u7EC4\u4EF6\u6E32\u67D3\u8FC7\u7A0B\u4E2D\u4E0D\u4F53\u73B0\u7684\u989D\u5916\u4F9D\u8D56\u65F6\uFF0C\u53EF\u8BBE\u7F6E",paraId:8,tocIndex:8},{value:"deps",paraId:8,tocIndex:8},{value:"\u51FD\u6570\uFF0C\u6B64\u65F6\u7EC4\u4EF6\u7684\u4F9D\u8D56\u662F deps \u8FD4\u56DE\u4F9D\u8D56\u548C\u6E32\u67D3\u5B8C\u6BD5\u6536\u96C6\u5230\u7684\u4F9D\u8D56\u5408\u96C6",paraId:8,tocIndex:8},{value:"deps",paraId:9},{value:"\u4F9D\u8D56\u51FD\u6570\u4EC5\u5728\u7EC4\u4EF6\u9996\u6B21\u6E32\u67D3\u65F6\u6267\u884C\uFF0C\u540E\u7EED\u4E0D\u518D\u6267\u884C\uFF0C\u540C\u65F6\u8BBE\u7F6E",paraId:9},{value:"collectType",paraId:9},{value:"\u4E3A",paraId:9},{value:"no",paraId:9},{value:"\u4E0D\u4F1A\u5F71\u54CD",paraId:9},{value:"deps",paraId:9},{value:"\u6536\u96C6\u4F9D\u8D56\uFF0C\u53EF\u4EE5\u628A",paraId:9},{value:"deps",paraId:9},{value:"\u5F53\u505A\u4F9D\u8D56\u9501\u5B9A\u529F\u80FD\u5B9E\u7528\u3002",paraId:9},{value:"\u9ED8\u8BA4 ",paraId:10,tocIndex:9},{value:"true",paraId:10,tocIndex:9},{value:"\uFF0C\u662F\u5426\u8BB0\u5F55\u6570\u7EC4\u81EA\u8EAB\u4F9D\u8D56\uFF0C\u5F53\u786E\u8BA4\u662F\u5B69\u5B50\u7EC4\u4EF6\u81EA\u5DF1\u8BFB\u6570\u7EC4\u4E0B\u6807\u6E32\u67D3\u7684\u573A\u666F\uFF0C\u53EF\u8BBE\u7F6E\u4E3A ",paraId:10,tocIndex:9},{value:"false",paraId:10,tocIndex:9},{value:`// \u9ED8\u8BA4 true: \u8BB0\u5F55\u6570\u7EC4\u81EA\u8EAB\u4F9D\u8D56
const [dict] = useAtom(dictAtom);
// \u4EE5\u4E0B\u8BFB\u503C\u64CD\u4F5C\uFF0C\u6536\u96C6\u5230\u4F9D\u8D56\u6709 2 \u9879\uFF0C\u662F dict, dict.list[0]
dict.list[0];

// \u91CD\u7F6E list\uFF0C\u5F15\u53D1\u5F53\u524D\u7EC4\u4EF6\u91CD\u6E32\u67D3
setDictAtom((draft) => (draft.list = draft.list.slice()));

// false: \u4E0D\u8BB0\u5F55\u6570\u7EC4\u81EA\u8EAB\u4F9D\u8D56\uFF0C\u9002\u7528\u4E8E\u5B69\u5B50\u7EC4\u4EF6\u81EA\u5DF1\u8BFB\u6570\u7EC4\u4E0B\u6807\u6E32\u67D3\u7684\u573A\u666F
const [dict] = useAtom(dictAtom, { arrDep: false });
// \u4EE5\u4E0B\u8BFB\u503C\u64CD\u4F5C\uFF0C\u6536\u96C6\u5230\u4F9D\u8D56\u53EA\u6709 1 \u9879\uFF0C\u662F dict.list[0]
dict.list[0];

// \u91CD\u7F6E list\uFF0C\u4E0D\u4F1A\u5F15\u53D1\u5F53\u524D\u7EC4\u4EF6\u91CD\u6E32\u67D3
setDictAtom((draft) => (draft.list = draft.list.slice()));
`,paraId:11,tocIndex:9},{value:"\u9ED8\u8BA4",paraId:12,tocIndex:10},{value:" true",paraId:12,tocIndex:10},{value:"\uFF0C\u662F\u5426\u8BB0\u5F55\u6570\u7EC4\u4E0B\u6807\u4F9D\u8D56\uFF0C\u5F53\u901A\u8FC7\u5FAA\u73AF\u6570\u7EC4\u751F\u6210\u5B69\u5B50\u7684\u573A\u666F\uFF0C\u53EF\u8BBE\u7F6E\u4E3A ",paraId:12,tocIndex:10},{value:"false",paraId:12,tocIndex:10},{value:"\uFF0C\u51CF\u5C11\u7EC4\u4EF6\u81EA\u8EAB\u7684\u4F9D\u8D56\u8BB0\u5F55\u6570\u91CF\uFF0C\u6B64\u53C2\u6570\u5728 arrDep=true \u65F6\u8BBE\u7F6E\u6709\u6548\uFF0CarrDep=false \u65F6\uFF0C",paraId:12,tocIndex:10},{value:"arrIndexDep",paraId:12,tocIndex:10},{value:" \u88AB\u81EA\u52A8\u5F3A\u5236\u8BBE\u4E3A ",paraId:12,tocIndex:10},{value:"true",paraId:12,tocIndex:10},{value:` arrDep=true arrIndexDep = true
 // deps: list list[0] list[...]

 arrDep=true arrIndexDep = false
 // deps: list

 arrDep=false
 // deps: list[0] list[...]
`,paraId:13,tocIndex:10},{value:"\u9ED8\u8BA4",paraId:14,tocIndex:11},{value:" true",paraId:14,tocIndex:11},{value:"\uFF0C\u662F\u5426\u4EE5 pure \u6A21\u5F0F\u4F7F\u7528\u72B6\u6001\uFF0C\u6B64\u53C2\u6570\u53EA\u5F71\u54CD\u5B57\u5178\u6570\u636E\u7684\u4F9D\u8D56\u6536\u96C6\u89C4\u5219",paraId:14,tocIndex:11},{value:`1 \u4E3A true\uFF0C\u8868\u793A\u72B6\u6001\u4EC5\u7528\u4E8E\u5F53\u524D\u7EC4\u4EF6ui\u6E32\u67D3\uFF0C\u6B64\u6A21\u5F0F\u4E0B\u4E0D\u4F1A\u6536\u96C6\u4E2D\u95F4\u6001\u5B57\u5178\u4F9D\u8D56\uFF0C\u53EA\u8BB0\u5F55\u5B57\u5178\u6700\u957F\u4F9D\u8D56
2 \u4E3A false\uFF0C\u8868\u793A\u72B6\u6001\u4E0D\u53EA\u662F\u7528\u4E8E\u5F53\u524D\u7EC4\u4EF6ui\u6E32\u67D3\uFF0C\u8FD8\u4F1A\u900F\u4F20\u7ED9 memo \u7684\u5B50\u7EC4\u4EF6\uFF0C\u900F\u4F20\u7ED9 useEffect \u4F9D\u8D56\u6570\u7EC4\uFF0C
\u6B64\u6A21\u5F0F\u4E0B\u4F1A\u6536\u96C6\u4E2D\u95F4\u6001\u5B57\u5178\u4F9D\u8D56\uFF0C\u4E0D\u4E22\u5F03\u8BB0\u5F55\u8FC7\u7684\u5B57\u5178\u4F9D\u8D56
`,paraId:15,tocIndex:11},{value:"\u793A\u4F8B\u6F14\u793A ",paraId:16,tocIndex:11},{value:"pure",paraId:16,tocIndex:11},{value:`\u4E3A true \u548C false \u65F6\uFF0C\u6536\u96C6\u5230\u7684\u4F9D\u8D56\u5BF9\u6BD4\u7ED3\u679C
`,paraId:16,tocIndex:11},{value:"pure = true \uFF0C\u62E5\u6709\u66F4\u597D\u7684\u91CD\u6E32\u67D3\u547D\u4E2D\u7CBE\u51C6\u5EA6",paraId:17},{value:`// \u91CD\u65B0\u8D4B\u503C\u4E86 extra\uFF0C\u4F46\u5176\u5B9E extra.list, extra.mask \u5B69\u5B50\u8282\u70B9\u6CA1\u53D8\u5316\uFF0C
// helux \u5185\u90E8\u7ECF\u8FC7\u6BD4\u8F83 extra.list, extra.mask \u503C\u53D1\u73B0\u65E0\u53D8\u5316\u540E\u4E0D\u4F1A\u91CD\u6E32\u67D3 Demo
setState(draft=> draft.extra = { ...draft.extra });

// \u{1F47B} \u4F46\u8981\u6CE8\u610F\uFF0C\u6B64\u65F6\u5982\u679C extra \u4F20\u7ED9\u4E86 useEffect\uFF0C\u5E76\u4E0D\u4F1A\u56E0\u4E3A extra\u7684\u53D8\u5316\u800C\u5F15\u8D77 Effect \u91CD\u65B0\u6267\u884C
useEffect(()=>{//...logic}, [state.extra]);
// \u5982\u6267\u884C\u4E86\u5219\u662F\u56E0\u4E3A\u5176\u4ED6\u4F9D\u8D56\u5F15\u8D77\u7EC4\u4EF6\u91CD\u6E32\u67D3\u521A\u597D\u987A\u5E26\u89E6\u53D1\u4E86 Effect \u6267\u884C

// \u6240\u4EE5\u8FD9\u91CC\u5982\u9700\u8981\u4E2D\u95F4\u6001\u4F9D\u8D56\u4E5F\u80FD\u6B63\u5E38\u6536\u96C6\u5230\uFF0C\u6709\u4EE5\u4E0B\u4E24\u79CD\u65B9\u5F0F
// 1 \u3010\u63A8\u8350\u3011\u4EBA\u5DE5\u8865\u4E0A extrta \u4F9D\u8D56\uFF08\u76F8\u5F53\u4E8E\u56FA\u5B9A\u4F4F\u4F9D\u8D56\uFF09
useAtom(dictAtom, { deps: state=>state.extra });
// 2 \u8BBE\u7F6E pure \u4E3A false
useAtom(dictAtom, { pure: false });
`,paraId:18}]},23512:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(27156);const a=[{value:"\u7EC4\u4EF6\u4E2D\u4F7F\u7528",paraId:0,tocIndex:0},{value:"derive",paraId:0,tocIndex:0},{value:"\u8FD4\u56DE\u7684\u6D3E\u751F\u7ED3\u679C",paraId:0,tocIndex:0},{value:"\u8BFB\u53D6\u7B2C\u4E8C\u4F4D",paraId:1,tocIndex:3},{value:"status",paraId:1,tocIndex:3},{value:"\u53C2\u6570\u611F\u77E5\u72B6\u6001\u53D8\u5316",paraId:1,tocIndex:3}]},8176:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(71667);const a=[{value:"\u5F3A\u5236\u66F4\u65B0\u8BA2\u9605\u4E86\u67D0\u4E2A\u8282\u70B9\u53D8\u5316\u7684\u6240\u6709\u7EC4\u4EF6\u5B9E\u4F8B",paraId:0,tocIndex:0},{value:"\u8C28\u614E\u4F7F\u7528\u6B64\u529F\u80FD\uFF0C\u4F1A\u89E6\u53D1\u5927\u9762\u79EF\u7684\u66F4\u65B0\uFF0C\u63A8\u8350\u8BBE\u5B9A presetDeps\u3001overWriteDeps \u51FD\u6570\u51CF\u5C11\u66F4\u65B0\u8303\u56F4",paraId:1},{value:`const updateAllAtomIns = useGlobalForceUpdate(someShared);
// \u548C\u4ECE ctx \u4E0A\u83B7\u53D6\u7684 useForceUpdate \u6548\u679C\u4E00\u6837\uFF0CuseForceUpdate \u81EA\u52A8\u7ED1\u5B9A\u4E86\u5BF9\u5E94\u7684\u5171\u4EAB\u72B6\u6001
const updateAllAtomIns = ctx.useForceUpdate();
`,paraId:2},{value:"\u7C7B\u578B\u63CF\u8FF0\u4E3A",paraId:3},{value:`function useGlobalForceUpdate<T = any>(
  sharedState: T,
  presetDeps?: (sharedState: T) => any[],
): (overWriteDeps?: ((sharedState: T) => any[]) | Dict | null) => void;
`,paraId:4},{value:"\u7531\u4E8E\u6307\u5B9A\u4E86\u66F4\u65B0\u8303\u56F4",paraId:5},{value:"state.a",paraId:5},{value:"\uFF0C\u4E0B\u8FF0\u4F8B\u5B50\u4E2D Demo2 \u56E0\u672A\u4F7F\u7528\u5230",paraId:5},{value:"state.a",paraId:5},{value:"\u5C06\u4E0D\u88AB\u66F4\u65B0",paraId:5},{value:"\u652F\u6301\u8C03\u7528\u65F6\u91CD\u5199\u66F4\u65B0\u8303\u56F4",paraId:6,tocIndex:4},{value:`updateSomeAtomIns((state) => [state.c]); // \u672C\u6B21\u66F4\u65B0\u53EA\u66F4\u65B0 c \u76F8\u5173\u7684\u5B9E\u4F8B

// \u91CD\u5199\u4E3A null\uFF0C\u8868\u793A\u66F4\u65B0\u6240\u6709\u5B9E\u4F8B\uFF0C\u5F3A\u5236\u8986\u76D6\u53EF\u80FD\u5B58\u5728\u7684 presetDeps
updateSomeAtomIns(null);

// \u8FD4\u56DE\u7A7A\u6570\u7EC4\u4E0D\u4F1A\u505A\u4EFB\u4F55\u66F4\u65B0
updateSomeAtomIns((state) => []);

// \u8FD4\u56DE\u91CC\u5305\u542B\u4E86\u81EA\u8EAB\u4E5F\u4F1A\u89E6\u53D1\u66F4\u65B0\u6240\u6709\u5B9E\u4F8B
updateSomeAtomIns((state) => [state]);
`,paraId:7,tocIndex:4}]},98953:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(76197);const a=[{value:"\u4F7F\u7528\u5168\u5C40 id\uFF0C\u914D\u5408",paraId:0,tocIndex:0},{value:"ICreationAtomOptions.rules",paraId:0,tocIndex:0},{value:"\u91CC\u7684",paraId:0,tocIndex:0},{value:"globalIds",paraId:0,tocIndex:0},{value:"\u53C2\u6570\uFF0C\u6EE1\u8DB3\u6761\u4EF6\u65F6\u88AB\u89E6\u53D1\u5237\u65B0",paraId:0,tocIndex:0},{value:"\u66F4\u65B0",paraId:1,tocIndex:0},{value:"rules",paraId:1,tocIndex:0},{value:"\u914D\u7F6E\u53EF\u9605\u8BFB",paraId:1,tocIndex:0},{value:"rules",paraId:2,tocIndex:0},{value:"\u4E86\u89E3",paraId:1,tocIndex:0}]},76423:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(43162);const a=[{value:"\u5F3A\u5236\u66F4\u65B0\u5F53\u524D\u7EC4\u4EF6\u5B9E\u4F8B",paraId:0,tocIndex:0}]},6354:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(59237);const a=[{value:"\u4F7F\u7528\u53EF\u53D8\u7684\u672C\u5730\u72B6\u6001\uFF08\u6307\u7684\u662F",paraId:0,tocIndex:0},{value:"setter\u56DE\u8C03\u91CC\u53EF\u53D8",paraId:0,tocIndex:0},{value:"\uFF09\uFF0C\u6BCF\u6B21\u4FEE\u6539\u540E\u90FD\u4F1A\u751F\u6210\u4E00\u4EFD\u7ED3\u6784\u5171\u4EAB\u7684\u65B0\u6570\u636E",paraId:0,tocIndex:0}]},35866:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(6801);const a=[{value:"\u7EC4\u4EF6\u4E2D\u4F7F\u7528",paraId:0,tocIndex:0},{value:"mutate",paraId:0,tocIndex:0},{value:"\u51FD\u6570\u7684\u6267\u884C\u72B6\u6001\uFF0C\u6B64\u51FD\u6570\u662F\u4E00\u4E2A\u6052\u5B89\u5168\u51FD\u6570\uFF0C\u4F20\u5165\u4EFB\u4F55",paraId:0,tocIndex:0},{value:"desc",paraId:0,tocIndex:0},{value:"\u5747\u80FD\u8FD4\u56DE\u72B6\u6001\uFF0C\u5982\u679C\u4F20\u5165\u7684\u662F\u4E0D\u5B58\u5728\u7684",paraId:0,tocIndex:0},{value:"mutate desc",paraId:0,tocIndex:0},{value:"\u5219\u8FD4\u56DE\u4E00\u4E2A\u5047\u7684\u72B6\u6001",paraId:0,tocIndex:0},{value:"\u7C7B\u578B\u63CF\u8FF0\u4E3A",paraId:1,tocIndex:0},{value:`function useMutateLoading<T = SharedState>(
  target?: T,
): [
  SafeLoading, // \u83B7\u53D6\u5404\u4E2A mutate desc \u7684\u8FD0\u884C\u72B6\u6001
  SetState<LoadingState>, // \u4EBA\u5DE5\u4FEE\u6539\u6267\u884C\u72B6\u6001\uFF08\u5927\u591A\u6570\u65F6\u5019\u90FD\u4E0D\u9700\u8981\u7528\u5230\u6B64\u529F\u80FD\uFF09
  IInsRenderInfo,
];
`,paraId:2,tocIndex:0},{value:"\u6B64\u51FD\u6570\u504F\u5411\u4E8E\u63D0\u4F9B\u7ED9\u5E93\u5F00\u53D1\u8005\uFF0C\u63A8\u8350\u9605\u8BFB",paraId:3},{value:"\u6A21\u5757\u5316/defineMutateDerive",paraId:4},{value:"\u4E86\u89E3\u548C\u4F7F\u7528\u914D\u5957\u751F\u6210\u7684",paraId:3},{value:"useLoading",paraId:3},{value:"\u4F1A\u66F4\u65B9\u4FBF",paraId:3}]},38366:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(76989);const a=[{value:"\u7EC4\u4EF6\u4E2D\u76D1\u542C\u4E8B\u4EF6\uFF0C\u4F1A\u5728\u7EC4\u4EF6\u9500\u6BC1\u65F6\u81EA\u52A8\u53D6\u6D88\u76D1\u542C",paraId:0,tocIndex:0},{value:"useOnEvent",paraId:1,tocIndex:3},{value:" \u5185\u90E8\u505A\u4E86\u4F18\u5316\uFF0C\u4E8B\u4EF6\u56DE\u8C03\u91CC\u603B\u662F\u53EF\u83B7\u53D6\u5916\u90E8\u6700\u65B0\u503C\uFF0C\u65E0\u95ED\u5305\u9677\u9631\u95EE\u9898",paraId:1,tocIndex:3},{value:"\u5148\u70B9\u51FB ",paraId:2},{value:"change",paraId:2},{value:" \u6309\u94AE\uFF0C\u518D\u70B9\u51FB ",paraId:2},{value:"emitEvent",paraId:2},{value:" \u6309\u94AE\uFF0C\u53EF\u89C2\u5BDF\u5230\u5F39\u51FA\u63D0\u793A\u91CC\u7684 ",paraId:2},{value:"num",paraId:2},{value:" \u503C\u4E3A\u6700\u65B0\u503C",paraId:2}]},5212:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(23630);const a=[{value:"useReactiveX",paraId:0,tocIndex:0},{value:"\u548C",paraId:0,tocIndex:0},{value:"useReactive",paraId:0,tocIndex:0},{value:"\u4F7F\u7528\u65B9\u5F0F\u5B8C\u5168\u4E00\u6837\uFF0C\u533A\u522B\u4E8E",paraId:0,tocIndex:0},{value:"useReactive",paraId:0,tocIndex:0},{value:"\u8FD4\u56DE\u5143\u7EC4\u7ED3\u6784\uFF0C",paraId:0,tocIndex:0},{value:"useReactiveX",paraId:0,tocIndex:0},{value:"\u8FD4\u56DE\u7684\u662F\u5B57\u5178\u7ED3\u6784",paraId:0,tocIndex:0},{value:"\u5176\u4ED6\u4F7F\u7528\u65B9\u5F0F\u53EF\u53C2\u8003",paraId:1},{value:"useReactive",paraId:2}]},89311:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(42060);const a=[{value:"useReactive",paraId:0,tocIndex:0},{value:"\u548C",paraId:0,tocIndex:0},{value:"useAtom",paraId:0,tocIndex:0},{value:"\u4F7F\u7528\u65B9\u5F0F\u5B8C\u5168\u4E00\u6837\uFF0C\u533A\u522B\u5982\u4E0B\uFF1A",paraId:0,tocIndex:0},{value:"useReactive",paraId:1,tocIndex:0},{value:"\u6CA1\u6709\u8FD4\u56DE",paraId:1,tocIndex:0},{value:"setState",paraId:1,tocIndex:0},{value:"\u53E5\u67C4\uFF0C\u8FD4\u56DE\u7684",paraId:1,tocIndex:0},{value:"state",paraId:1,tocIndex:0},{value:"\u662F\u53EF\u8BFB\u53EF\u5199\u7684\u5BF9\u8C61\u3002",paraId:1,tocIndex:0},{value:"useAtom",paraId:2,tocIndex:0},{value:"\u8FD4\u56DE",paraId:2,tocIndex:0},{value:"[state, setState]",paraId:2,tocIndex:0},{value:"\u7ED3\u679C\uFF0C",paraId:2,tocIndex:0},{value:"state",paraId:2,tocIndex:0},{value:"\u662F\u53EA\u8BFB\u5BF9\u8C61\uFF0C\u4FEE\u6539\u5FC5\u987B\u4F7F\u7528",paraId:2,tocIndex:0},{value:"setState",paraId:2,tocIndex:0},{value:"\u3002",paraId:2,tocIndex:0},{value:"\u5176\u4ED6\u4F7F\u7528\u65B9\u5F0F\u53EF\u53C2\u8003",paraId:3},{value:"useAtom",paraId:4},{value:"useReactive",paraId:5,tocIndex:1},{value:" \u8FD4\u56DE\u7ED3\u679C\u4E3A ",paraId:5,tocIndex:1},{value:"[reactive, reactiveRoot, renderInfo]",paraId:5,tocIndex:1},{value:"\uFF0C",paraId:5,tocIndex:1},{value:"reactive",paraId:5,tocIndex:1},{value:" \u6307\u5411\u62C6\u7BB1\u540E\u7684\u72B6\u6001\u5F15\u7528\uFF0C",paraId:5,tocIndex:1},{value:"reactiveRoot",paraId:5,tocIndex:1},{value:" \u6307\u5411\u62C6\u539F\u59CB\u72B6\u6001\u5F15\u7528\uFF0C\u5177\u4F53\u5982\u4F55\u4F7F\u7528\u89C1\u4E0B\u9762\u793A\u4F8B\u3002",paraId:5,tocIndex:1},{value:"useReactive",paraId:6,tocIndex:1},{value:"\u53EF\u66FF\u6362\u4E3A",paraId:6,tocIndex:1},{value:"ctx.useReactive",paraId:6,tocIndex:1},{value:"\uFF0C\u4E66\u5199\u66F4\u7B80\u4FBF\u3002",paraId:6,tocIndex:1},{value:"\u7531\u4E8E",paraId:7,tocIndex:2},{value:"reactive",paraId:7,tocIndex:2},{value:" \u6307\u5411\u62C6\u7BB1\u540E\u7684\u72B6\u6001\u5F15\u7528\uFF0C\u5BF9\u4E8E\u539F\u59CB\u7C7B\u578B atom\uFF0C\u62C6\u7BB1\u540E\u5C31\u6307\u5411\u539F\u59CB\u503C\u4E86\uFF0C\u6B64\u65F6\u53EF\u4F7F\u7528\u7B2C\u4E8C\u4F4D\u53C2\u6570",paraId:7,tocIndex:2},{value:"reactiveRoot",paraId:7,tocIndex:2},{value:"\u6765\u64CD\u4F5C",paraId:7,tocIndex:2},{value:".val",paraId:7,tocIndex:2},{value:"\u4FEE\u6539\u72B6\u6001",paraId:7,tocIndex:2},{value:"\u5F53\u7136\u4E86\u4E5F\u53EF\u4EE5\u4F7F\u7528\u9876\u5C42",paraId:8},{value:"reactive",paraId:8},{value:"\u6765\u4FEE\u6539",paraId:8},{value:"\u8FDB\u4E00\u6B65\u4F7F\u7528",paraId:9},{value:"signal",paraId:9},{value:"\u6765\u7B80\u5316\u5199\u6CD5",paraId:9}]},96019:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(1906);const a=[{value:"\u4F7F\u7528\u670D\u52A1\u529F\u80FD\uFF0C\u8BE5\u51FD\u6570\u6709\u4E24\u4E2A\u4F5C\u7528\u3002",paraId:0,tocIndex:0},{value:"1 \u53EF\u66FF\u4EE3",paraId:1,tocIndex:0},{value:"useCallback",paraId:1,tocIndex:0},{value:"\uFF0C\u8FD4\u56DE\u7A33\u5B9A\u7684\u5355\u4E2A\u51FD\u6570\u6216\u591A\u4E2A\u51FD\u6570\u96C6\u5408\uFF0C\u540C\u65F6\u51FD\u6570\u5185\u90E8\u59CB\u7EC8\u53EF\u4EE5\u8BFB\u53D6\u5230\u5916\u90E8\u7684\u6700\u65B0\u503C\uFF0C\u65E0\u95ED\u5305\u9677\u9631\u3002",paraId:1,tocIndex:0},{value:"2 \u53EF\u66FF\u4EE3",paraId:2,tocIndex:0},{value:"forwardRef",paraId:2,tocIndex:0},{value:"\uFF0C\u65E0\u9700",paraId:2,tocIndex:0},{value:"forwardRef",paraId:2,tocIndex:0},{value:"\u5C42\u5C42 ref \u4E5F\u80FD\u5B9E\u73B0\u7956\u5148\u7EC4\u4EF6\u8C03\u5B69\u5B50\u7EC4\u4EF6\u65B9\u6CD5\u3002",paraId:2,tocIndex:0},{value:"\u70B9\u51FB\u6765\u81EA\u5B69\u5B50\u7EC4\u4EF6\u7684",paraId:3},{value:"call change",paraId:3},{value:"\u6309\u94AE\uFF0C\u7236\u4EB2\u7EC4\u4EF6\u91CD\u6E32\u67D3\u4E86\u800C\u88AB",paraId:3},{value:"memo",paraId:3},{value:"\u7684\u5B69\u5B50\u7EC4\u4EF6\u4E0D\u4F1A\u88AB\u91CD\u6E32\u67D3\uFF0C\u8BF4\u660E",paraId:3},{value:"srv.change",paraId:3},{value:"\u662F\u7A33\u5B9A\u7684\uFF0C\u7136\u540E\u518D\u70B9\u51FB",paraId:3},{value:"seeNum",paraId:3},{value:"\u6309\u94AE\uFF0C\u5F39\u51FA\u6700\u65B0\u503C\u8BF4\u660E\u65E0\u95ED\u5305\u9677\u9631",paraId:3},{value:"\u4F7F\u7528",paraId:4,tocIndex:4},{value:"useService",paraId:4,tocIndex:4},{value:"\u8BA9\u7956\u5148\u8C03\u7528\u5B69\u5B50\u65B9\u6CD5\u53EA\u9700\u5B8C\u6210\u4EE5\u4E0B\u6B65\u9AA4\u5373\u53EF",paraId:4,tocIndex:4},{value:"1 \u7956\u5148\u7EC4\u4EF6\u4F7F\u7528",paraId:5,tocIndex:4},{value:"useRef",paraId:5,tocIndex:4},{value:"\u751F\u6210",paraId:5,tocIndex:4},{value:"ref",paraId:5,tocIndex:4},{value:"\u540E\u4F20\u9012\u7ED9",paraId:5,tocIndex:4},{value:"srvRef={storeSrv(srvRef)}",paraId:5,tocIndex:4},{value:"2 \u4E2D\u95F4\u7EC4\u4EF6\u7EE7\u7EED\u900F\u4F20",paraId:6,tocIndex:4},{value:"props.srvRef",paraId:6,tocIndex:4},{value:"\u5373\u53EF",paraId:6,tocIndex:4},{value:"3 \u5B69\u5B50\u7EC4\u4EF6\u5C06",paraId:7,tocIndex:4},{value:"props",paraId:7,tocIndex:4},{value:"\u4F20\u9012\u7ED9",paraId:7,tocIndex:4},{value:"useService",paraId:7,tocIndex:4},{value:"\u65B9\u6CD5\u7B2C\u4E8C\u4F4D\u53C2\u6570\uFF0C\u5219\u7956\u5148\u7EC4\u4EF6\u53EF\u8C03\u7528",paraId:7,tocIndex:4},{value:"useService",paraId:7,tocIndex:4},{value:"\u914D\u7F6E\u7684\u6240\u6709\u65B9\u6CD5",paraId:7,tocIndex:4}]},92180:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(50522);const a=[{value:"useWatchEffect",paraId:0,tocIndex:0},{value:" \u529F\u80FD\u540C ",paraId:0,tocIndex:0},{value:"watchEffect",paraId:0,tocIndex:0},{value:"\u4E00\u6837\uFF0C\u533A\u522B\u5728\u4E8E ",paraId:0,tocIndex:0},{value:"useWatchEffect",paraId:0,tocIndex:0},{value:" \u4F1A\u7ACB\u5373\u6267\u884C\u56DE\u8C03\uFF0C\u81EA\u52A8\u5BF9\u9996\u6B21\u8FD0\u884C\u65F6\u51FD\u6570\u5185\u8BFB\u53D6\u5230\u7684\u503C\u5B8C\u6210\u53D8\u5316\u76D1\u542C\u3002",paraId:0,tocIndex:0},{value:"\u5176\u4ED6\u4F7F\u7528\u65B9\u5F0F\u53EF\u53C2\u8003",paraId:1},{value:"watchEffect",paraId:2},{value:"useWatchEffect",paraId:3},{value:"\u56DE\u8C03\u7684\u9996\u6B21\u8FD0\u884C\u7684\u6267\u884C\u65F6\u673A\u662F\u5728\u7EC4\u4EF6\u6302\u8F7D\u5B8C\u6BD5\u540E\u624D\u6267\u884C",paraId:3}]},35723:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(69387);const a=[{value:"\u7EC4\u4EF6\u4E2D\u89C2\u5BDF\u5171\u4EAB\u72B6\u6001\u53D8\u5316\u3002",paraId:0,tocIndex:0},{value:"\u7C7B\u578B\u63CF\u8FF0",paraId:1,tocIndex:0},{value:`function useWatch(
  watchFn: (fnParams: IWatchFnParams) => void,
  options: WatchOptionsType,
);

type WatchOptionsType = WatchFnDeps | IWatchOptions;

interface IWatchOptions {
  deps?: WatchFnDeps;
  /**
   * default: false\uFF0C
   * \u5982\u6CA1\u6709\u5B9A\u4E49 deps \u4F9D\u8D56\uFF0C\u9700\u8BBE\u7F6E immediate\uFF0C\u8FD9\u6837\u53EF\u4EE5\u8BA9 watch \u9996\u6B21\u6267\u884C\u540E\u6536\u96C6\u5230\u76F8\u5173\u4F9D\u8D56\uFF0C
   * \u5F53\u7136\u4E5F\u53EF\u4EE5\u5B9A\u4E49\u4E86 deps \u4F9D\u8D56\u7684\u60C5\u51B5\u4E0B\u8BBE\u7F6E immediate \u4E3A true\uFF0C\u8FD9\u6837\u6574\u4E2A watch \u51FD\u6570\u7684\u4F9D\u8D56\u662F
   * deps \u5B9A\u4E49\u7684\u548C watch \u9996\u6B21\u6267\u884C\u540E\u6536\u96C6\u5230\u7684\u4E24\u8005\u5408\u5E76\u7684\u7ED3\u679C
   */
  immediate?: boolean;
  /**
   * default: false
   * \u662F\u5426\u629B\u51FA\u9519\u8BEF\uFF0C\u9ED8\u8BA4\u4E0D\u629B\u51FA\uFF08\u91CD\u6267\u884C\u51FD\u6570\u53EF\u72EC\u7ACB\u8BBE\u5B9A\u629B\u51FA\uFF09\uFF0C\u9519\u8BEF\u4F1A\u53D1\u9001\u7ED9\u63D2\u4EF6
   */
  throwErr?: boolean;
}
type WatchFnDeps = () => any[] | undefined;
`,paraId:2,tocIndex:0},{value:"useWatch",paraId:3},{value:"\u56DE\u8C03\u7684\u9996\u6B21\u8FD0\u884C\u7684\u6267\u884C\u65F6\u673A\u662F\u5728\u7EC4\u4EF6\u6302\u8F7D\u5B8C\u6BD5\u540E\u624D\u6267\u884C",paraId:3},{value:"\u89C2\u5BDF\u6839\u5BF9\u8C61\u53D8\u5316",paraId:4,tocIndex:3},{value:"\u89C2\u5BDF\u5BF9\u8C61\u5B50\u8282\u70B9\u53D8\u5316",paraId:5},{value:"\u70B9\u51FB",paraId:6},{value:"changeB",paraId:6},{value:"\uFF0C\u4E0D\u4F1A\u89E6\u53D1\u63D0\u793A",paraId:6},{value:"useWatch",paraId:7,tocIndex:4},{value:" \u5185\u90E8\u505A\u4E86\u4F18\u5316\uFF0C\u89C2\u5BDF\u56DE\u8C03\u91CC\u603B\u662F\u53EF\u83B7\u53D6\u5916\u90E8\u6700\u65B0\u503C\uFF0C\u65E0\u95ED\u5305\u9677\u9631\u95EE\u9898",paraId:7,tocIndex:4},{value:"\u5148\u70B9\u51FB ",paraId:8},{value:"changeNum",paraId:8},{value:" \u6309\u94AE\uFF0C\u518D\u70B9\u51FB ",paraId:8},{value:"change",paraId:8},{value:" \u6309\u94AE\uFF0C\u53EF\u89C2\u5BDF\u5230\u5F39\u51FA\u63D0\u793A\u91CC\u7684 ",paraId:8},{value:"num",paraId:8},{value:" \u503C\u4E3A\u6700\u65B0\u503C",paraId:8}]},81571:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(5059);const a=[{value:"\u57FA\u7840",paraId:0,tocIndex:0},{value:"atom",paraId:1,tocIndex:0},{value:" \u521B\u5EFA",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5143\u7EC4",paraId:2,tocIndex:0},{value:"atomx",paraId:3,tocIndex:0},{value:" \u521B\u5EFA",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5B57\u5178",paraId:2,tocIndex:0},{value:"share",paraId:4,tocIndex:0},{value:" \u521B\u5EFA\u5B57\u5178\u578B",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5143\u7EC4",paraId:2,tocIndex:0},{value:"sharex",paraId:5,tocIndex:0},{value:" \u521B\u5EFA\u5B57\u5178\u578B",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5B57\u5178",paraId:2,tocIndex:0},{value:"signal",paraId:6,tocIndex:0},{value:" \u521B\u5EFA",paraId:2,tocIndex:0},{value:"signal",paraId:2,tocIndex:0},{value:"\u54CD\u5E94\u533A\u57DF\uFF0C\u5B9E\u73B0dom\u7C92\u5EA6\u66F4\u65B0",paraId:2,tocIndex:0},{value:"block",paraId:7,tocIndex:0},{value:" \u521B\u5EFA",paraId:2,tocIndex:0},{value:"block",paraId:2,tocIndex:0},{value:"\u5757\u54CD\u5E94\u533A\u57DF\uFF0C\u5B9E\u73B0\u5757\u7C92\u5EA6\u66F4\u65B0",paraId:2,tocIndex:0},{value:"dynamicBlock",paraId:8,tocIndex:0},{value:" \u7EC4\u4EF6\u6E32\u67D3\u8FC7\u7A0B\u4E2D\u521B\u5EFA\u52A8\u6001",paraId:2,tocIndex:0},{value:"block",paraId:2,tocIndex:0},{value:"\u5757\u54CD\u5E94\u533A\u57DF\uFF0C\u5B9E\u73B0\u5757\u7C92\u5EA6\u66F4\u65B0",paraId:2,tocIndex:0},{value:"derive",paraId:9,tocIndex:0},{value:" \u5B9A\u4E49\u5355\u4E2A\u5168\u91CF\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"deriveDict",paraId:10,tocIndex:0},{value:" \u6279\u91CF\u5B9A\u4E49\u5168\u91CF\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"defineDeriveTask",paraId:11,tocIndex:0},{value:" \u7C7B\u578B\u8F85\u52A9\u51FD\u6570\uFF0C\u5B9A\u4E49\u5168\u91CF\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1\uFF0C\u81EA\u52A8\u63A8\u5BFC deps \u8FD4\u56DE\u7C7B\u578B",paraId:2,tocIndex:0},{value:"defineDeriveFnItem",paraId:12,tocIndex:0},{value:" \u7C7B\u578B\u8F85\u52A9\u51FD\u6570\uFF0C\u5B9A\u4E49\u5168\u91CF\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1",paraId:2,tocIndex:0},{value:"runDerive",paraId:13,tocIndex:0},{value:" \u4EBA\u5DE5\u89E6\u53D1\u5168\u91CF\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"runDeriveTask",paraId:14,tocIndex:0},{value:" \u4EBA\u5DE5\u89E6\u53D1\u5168\u91CF\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1",paraId:2,tocIndex:0},{value:"mutate",paraId:15,tocIndex:0},{value:" \u5B9A\u4E49\u5355\u4E2A\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"mutateDict",paraId:16,tocIndex:0},{value:" \u6279\u91CF\u5B9A\u4E49\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"runMutate",paraId:17,tocIndex:0},{value:" \u4EBA\u5DE5\u89E6\u53D1\u53EF\u53D8\u6D3E\u751F\u51FD\u6570",paraId:2,tocIndex:0},{value:"runMutateTask",paraId:18,tocIndex:0},{value:" \u4EBA\u5DE5\u89E6\u53D1\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\u5F02\u6B65\u4EFB\u52A1",paraId:2,tocIndex:0},{value:"action",paraId:19,tocIndex:0},{value:" \u521B\u5EFA\u4FEE\u6539\u72B6\u6001\u7684 action \u540C\u6B65\u6216\u5F02\u6B65\u51FD\u6570",paraId:2,tocIndex:0},{value:"watch",paraId:20,tocIndex:0},{value:" \u521B\u5EFA\u89C2\u5BDF\u6570\u636E\u53D8\u5316\u7684\u76D1\u542C\u51FD\u6570",paraId:2,tocIndex:0},{value:"watchEffect",paraId:21,tocIndex:0},{value:" \u521B\u5EFA\u89C2\u5BDF\u6570\u636E\u53D8\u5316\u7684\u76D1\u542C\u51FD\u6570\uFF0C\u7ACB\u5373\u8FD0\u884C\u5E76\u5728\u9996\u6B21\u8FD0\u884C\u65F6\u6536\u96C6\u5230\u4F9D\u8D56",paraId:2,tocIndex:0},{value:"syncer",paraId:22,tocIndex:0},{value:" \u6D45\u5C42\u6B21\u5BF9\u8C61\u7684\u540C\u6B65\u51FD\u6570\u751F\u6210\u5668\uFF0C\u8F85\u52A9\u53CC\u5411\u7ED1\u5B9A",paraId:2,tocIndex:0},{value:"sync",paraId:23,tocIndex:0},{value:" \u6DF1\u5C42\u6B21\u5BF9\u8C61\u7684\u540C\u6B65\u51FD\u6570\u751F\u6210\u5668\uFF0C\u8F85\u52A9\u53CC\u5411\u7ED1\u5B9A",paraId:2,tocIndex:0},{value:"emit",paraId:24,tocIndex:0},{value:" \u53D1\u5C04\u4E8B\u4EF6",paraId:2,tocIndex:0},{value:"on",paraId:25,tocIndex:0},{value:" \u76D1\u542C\u4E8B\u4EF6",paraId:2,tocIndex:0},{value:"\u5171\u4EAB\u4E0A\u4E0B\u6587",paraId:26,tocIndex:0},{value:"\u5171\u4EAB\u4E0A\u4E0B\u6587\u5BF9\u8C61\u91CC\u7684api\u57FA\u672C\u548C\u9876\u5C42api\u4FDD\u6301\u4E00\u81F4\uFF0C\u533A\u522B\u5728\u4E8E\uFF0C\u9876\u5C42api\u9700\u8981\u6307\u5B9A\u76EE\u6807\u5171\u4EAB\u72B6\u6001\uFF0C\u5171\u4EAB\u4E0A\u4E0B\u6587api\u5BFC\u51FA\u65F6\u4E00\u81EA\u52A8\u7ED1\u5B9A\u5F53\u524D\u5171\u4EAB\u72B6\u6001\u3002",paraId:27,tocIndex:0},{value:`import { action, atom } from 'helux';

const ctx = atomx(1);

action(ctx.state)()(/** action \u51FD\u6570\u5B9A\u4E49 */)
// \u7B49\u6548\u4E8E
ctx.aciton()(/** action \u51FD\u6570\u5B9A\u4E49 */)

`,paraId:28,tocIndex:0},{value:"Hooks",paraId:29,tocIndex:0},{value:"useAtom",paraId:30,tocIndex:0},{value:" \u4F7F\u7528",paraId:31,tocIndex:0},{value:"atom",paraId:31,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5143\u7EC4",paraId:31,tocIndex:0},{value:"useAtomX",paraId:32,tocIndex:0},{value:" \u4F7F\u7528",paraId:31,tocIndex:0},{value:"atom",paraId:31,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5B57\u5178",paraId:31,tocIndex:0},{value:"useReactive",paraId:33,tocIndex:0},{value:" \u4F7F\u7528",paraId:31,tocIndex:0},{value:"reactive",paraId:31,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5143\u7EC4",paraId:31,tocIndex:0},{value:"useReactiveX",paraId:34,tocIndex:0},{value:" \u4F7F\u7528",paraId:31,tocIndex:0},{value:"reactive",paraId:31,tocIndex:0},{value:"\u5BF9\u8C61\uFF0C\u8FD4\u56DE\u5B57\u5178",paraId:31,tocIndex:0},{value:"useDerived",paraId:35,tocIndex:0},{value:" \u4F7F\u7528\u5168\u91CF\u6D3E\u751F\u7ED3\u679C",paraId:31,tocIndex:0},{value:"useOnEvent",paraId:36,tocIndex:0},{value:" \u4F7F\u7528\u4E8B\u4EF6\u76D1\u542C",paraId:31,tocIndex:0},{value:"useWatch",paraId:37,tocIndex:0},{value:" \u4F7F\u7528\u89C2\u5BDF",paraId:31,tocIndex:0},{value:"useWatchEffect",paraId:38,tocIndex:0},{value:" \u4F7F\u7528\u89C2\u5BDF\uFF0C\u7ACB\u5373\u8FD0\u884C\u5E76\u5728\u9996\u6B21\u8FD0\u884C\u65F6\u6536\u96C6\u5230\u4F9D\u8D56",paraId:31,tocIndex:0},{value:"useGlobalId",paraId:39,tocIndex:0},{value:" \u4F7F\u7528",paraId:31,tocIndex:0},{value:"globalId",paraId:31,tocIndex:0},{value:"useMutate",paraId:40,tocIndex:0},{value:" \u4F7F\u7528\u53EF\u53D8\u672C\u5730\u72B6\u6001",paraId:31,tocIndex:0},{value:"useService",paraId:41,tocIndex:0},{value:" \u4F7F\u7528\u670D\u52A1",paraId:31,tocIndex:0},{value:"useActionLoading",paraId:42,tocIndex:0},{value:" \u4F7F\u7528",paraId:31,tocIndex:0},{value:"action",paraId:31,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:31,tocIndex:0},{value:"useMutateLoading",paraId:43,tocIndex:0},{value:" \u4F7F\u7528",paraId:31,tocIndex:0},{value:"mutate",paraId:31,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:31,tocIndex:0},{value:"useLocalForceUpdate",paraId:44,tocIndex:0},{value:" \u4F7F\u7528\u66F4\u65B0\u5F53\u524D\u7EC4\u4EF6\u5B9E\u4F8B\u51FD\u6570",paraId:31,tocIndex:0},{value:"useGlobalForceUpdate",paraId:45,tocIndex:0},{value:" \u4F7F\u7528\u66F4\u65B0\u6240\u6709\u8BFB\u53D6\u4E86\u5171\u4EAB\u72B6\u6001\u7684\u7EC4\u4EF6\u5B9E\u4F8B\u7684\u51FD\u6570",paraId:31,tocIndex:0},{value:"\u5DE5\u5177",paraId:46,tocIndex:0},{value:"init",paraId:47,tocIndex:0},{value:" \u521D\u59CB\u5316\u4E00\u4E9B\u8FD0\u884C\u914D\u7F6E\u9879",paraId:48,tocIndex:0},{value:"flush",paraId:49,tocIndex:0},{value:" \u4E3B\u52A8\u89E6\u53D1\u63D0\u4EA4",paraId:48,tocIndex:0},{value:"reactive",paraId:48,tocIndex:0},{value:"\u5BF9\u8C61\u53D8\u66F4\u6570\u636E",paraId:48,tocIndex:0},{value:"reactiveDesc",paraId:50,tocIndex:0},{value:" \u4E3A",paraId:48,tocIndex:0},{value:"reactive",paraId:48,tocIndex:0},{value:"\u5BF9\u8C61\u7684\u6700\u8FD1\u4E00\u6B21\u53D8\u66F4\u6DFB\u52A0\u63D0\u4EA4\u63CF\u8FF0",paraId:48,tocIndex:0},{value:"addMiddleware",paraId:51,tocIndex:0},{value:" \u6DFB\u52A0\u4E2D\u95F4\u4EF6",paraId:48,tocIndex:0},{value:"addPlugin",paraId:52,tocIndex:0},{value:" \u6DFB\u52A0\u63D2\u4EF6",paraId:48,tocIndex:0},{value:"cst",paraId:53,tocIndex:0},{value:" \u5E38\u91CF\u5BF9\u8C61\u5408\u96C6",paraId:48,tocIndex:0},{value:"getAtom",paraId:54,tocIndex:0},{value:" \u83B7\u53D6",paraId:48,tocIndex:0},{value:"atom",paraId:48,tocIndex:0},{value:"\u5BF9\u8C61\u7684\u771F\u5B9E\u503C\u5F15\u7528",paraId:48,tocIndex:0},{value:"getSnap",paraId:55,tocIndex:0},{value:" \u83B7\u53D6",paraId:48,tocIndex:0},{value:"atom",paraId:48,tocIndex:0},{value:"\u5BF9\u8C61\u7684\u5FEB\u7167",paraId:48,tocIndex:0},{value:"getActionLoading",paraId:56,tocIndex:0},{value:" \u83B7\u53D6",paraId:48,tocIndex:0},{value:"action",paraId:48,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:48,tocIndex:0},{value:"getDeriveLoading",paraId:57,tocIndex:0},{value:" \u83B7\u53D6",paraId:48,tocIndex:0},{value:"derive",paraId:48,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:48,tocIndex:0},{value:"getMutateLoading",paraId:58,tocIndex:0},{value:" \u83B7\u53D6",paraId:48,tocIndex:0},{value:"mutate",paraId:48,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:48,tocIndex:0},{value:"isAtom",paraId:59,tocIndex:0},{value:" \u5224\u65AD\u662F\u5426\u662F",paraId:48,tocIndex:0},{value:"atom",paraId:48,tocIndex:0},{value:"\u63A5\u53E3\u8FD4\u56DE\u7684\u5BF9\u8C61",paraId:48,tocIndex:0},{value:"isDerivedAtom",paraId:60,tocIndex:0},{value:" \u5224\u65AD\u662F\u5426\u662F",paraId:48,tocIndex:0},{value:"derive",paraId:48,tocIndex:0},{value:"\u63A5\u53E3\u8FD4\u56DE\u7684\u7ED3\u679C",paraId:48,tocIndex:0},{value:"isDiff",paraId:61,tocIndex:0},{value:" \u6BD4\u8F83\u4E24\u4E2A\u503C\u662F\u5426\u4E00\u6837",paraId:48,tocIndex:0},{value:"shallowCompare",paraId:62,tocIndex:0},{value:" \u6D45\u6BD4\u8F83\u4E24\u4E2A\u5BF9\u8C61",paraId:48,tocIndex:0},{value:"markRaw",paraId:63,tocIndex:0},{value:" \u6807\u8BB0\u5BF9\u8C61\u4E0D\u4F1A\u8F6C\u53D8\u4E3A\u4EE3\u7406\u5BF9\u8C61",paraId:48,tocIndex:0}]},80814:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(11196);const a=[]},40582:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(13458);const a=[{value:"\u6DFB\u52A0\u4E2D\u95F4\u4EF6",paraId:0,tocIndex:0},{value:`import { addMiddleware, Middleware } from 'helux';

const myMiddleware: Middleware = (mid) => {
  console.log('my middleware');
};

addMiddleware(myMiddleware);
`,paraId:1,tocIndex:1}]},72048:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(16989);const a=[{value:"\u6DFB\u52A0\u63D2\u4EF6",paraId:0,tocIndex:0},{value:"\u63D2\u4EF6\u5F00\u53D1\u53EF\u67E5\u770B",paraId:1},{value:"\u6307\u5357/\u63D2\u4EF6",paraId:2},{value:"\u4E86\u89E3\u66F4\u591A",paraId:1},{value:`import { HeluxPluginDevtool } from '@helux/plugin-devtool';
import { addPlugin } from 'helux';

addPlugin(HeluxPluginDevtool);
`,paraId:3,tocIndex:1}]},34617:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(11179);const a=[{value:"helux \u63D0\u4F9B\u4E2A\u7528\u6237\u7684\u4F7F\u7528\u5E38\u91CF\u5BF9\u8C61\u901A\u8FC7",paraId:0,tocIndex:0},{value:"cst",paraId:0,tocIndex:0},{value:"\u5BFC\u51FA",paraId:0,tocIndex:0},{value:`type Cst = {
  VER: string;
  LIMU_VER: string;
  EVENT_NAME: {
    ON_DATA_CHANGED: 'ON_DATA_CHANGED';
    ON_SHARE_CREATED: 'ON_SHARE_CREATED';
  };
  RECORD_LOADING: {
    NO: 'no';
    PRIVATE: 'private';
    GLOBAL: 'global';
  };
};
`,paraId:1,tocIndex:0}]},17926:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(46392);const a=[{value:"\u4E3B\u52A8\u89E6\u53D1\u63D0\u4EA4",paraId:0,tocIndex:0},{value:"reactive",paraId:0,tocIndex:0},{value:"\u5BF9\u8C61\u53D8\u66F4\u6570\u636E",paraId:0,tocIndex:0}]},68804:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(66647);const a=[{value:"\u83B7\u53D6",paraId:0,tocIndex:0},{value:"action",paraId:0,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001\uFF0C\u83B7\u53D6\u5F02\u6B65\u51FD\u6570\u6267\u884C\u72B6\u6001\u624D\u6709\u662F\u4F1A\u53D8\u5316\u7684\u3002",paraId:0,tocIndex:0},{value:`import { share, action, getActionLoading } from 'helux';

const { state } = sharex({ a: 1, b: 2 });

const hiAction = action(state)()(({ draft, payload }) => {
  draft.a += 100;
}, 'hiAction');

const ld = getActionLoading(state);
console.log(ld.hiAction); // { loading, ok, err };
`,paraId:1,tocIndex:1}]},10095:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(39540);const a=[{value:"\u83B7\u53D6 atom \u5BF9\u8C61\u7684\u771F\u5B9E\u503C\u5F15\u7528\uFF0C\u5BF9",paraId:0,tocIndex:0},{value:"atom",paraId:0,tocIndex:0},{value:"\u8FD4\u56DE\u7ED3\u679C\u81EA\u52A8\u62C6\u7BB1\uFF0C\u5BF9",paraId:0,tocIndex:0},{value:"share",paraId:0,tocIndex:0},{value:"\u8FD4\u56DE\u7ED3\u679C\u5219\u4E0D\u62C6\u7BB1",paraId:0,tocIndex:0},{value:`import { atom, share, getAtom } from 'helux';

const [state1] = atom({ a: 1, b: 2 });
const [state2] = share({ a: 1, b: 2 });

console.log(state1); // { val: {a:1, b:2} }
console.log(state2); // {a:1, b:2}

console.log(getAtom(state1)); // {a:1, b:2}
console.log(getAtom(state2)); // {a:1, b:2}
`,paraId:1,tocIndex:1}]},912:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(30293);const a=[{value:"\u83B7\u53D6",paraId:0,tocIndex:0},{value:"derive",paraId:0,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001\uFF0C\u83B7\u53D6\u5F02\u6B65\u51FD\u6570\u6267\u884C\u72B6\u6001\u624D\u6709\u662F\u4F1A\u53D8\u5316\u7684\u3002",paraId:0,tocIndex:0},{value:`import { derive, atom, getDeriveLoading } from 'helux';

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const [numAtom] = atom(1);
const plus100Result = derive({
  fn: () => 0,
  // \u5728 deps \u8FD4\u56DE\u7ED3\u679C\u91CC\u9501\u5B9A\u4F9D\u8D56
  deps: () => [numAtom.val],
  // input \u6570\u7EC4\u5373 deps \u51FD\u6570\u8FD4\u56DE\u7ED3\u679C
  task: async ({ input }) => {
    await delay();
    return input[0] + 100;
  },
});

getDeriveLoading(plus100Result); // { loading, ok, err };
`,paraId:1,tocIndex:1}]},57713:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(33849);const a=[{value:"\u83B7\u53D6",paraId:0,tocIndex:0},{value:"mutate",paraId:0,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001\uFF0C\u83B7\u53D6\u5F02\u6B65\u51FD\u6570\u6267\u884C\u72B6\u6001\u624D\u6709\u662F\u4F1A\u53D8\u5316\u7684\u3002",paraId:0,tocIndex:0},{value:`const witness = mutate(state)({
  deps: () => [state.a, state.b],
  fn: (draft, { input }) => (draft.c = input[0] + input[1] + 1),
  task: async ({ input }) => {
    draft.c = input[0] + input[1] + 1;
  },
  immediate: true,
  desc: 'm1',
});

const ld = getMutateLoading(state);
console.log(ld.m1); // { loading, ok, err };
`,paraId:1,tocIndex:1}]},37964:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(39518);const a=[{value:"\u83B7\u53D6 atom \u5BF9\u8C61\u7684\u5FEB\u7167",paraId:0,tocIndex:0},{value:`/**
 * isPrevSnap \u9ED8\u8BA4\u503C\u4E3A true\uFF0C\u8868\u793A\u8FD4\u56DE\u524D\u4E00\u523B\u7684\u5FEB\u7167\uFF0C\u8BBE\u4E3A false \u8868\u793A\u8FD4\u56DE\u6700\u65B0\u5FEB\u7167
 */
function getSnap<T = Dict>(state: T, isPrevSnap?: boolean): T;
`,paraId:1,tocIndex:0},{value:`import { getSnap, share } from 'helux';

const { state, setDraft } = share({ a: 1, b: 2 });

console.log(getSnap(state)); // {a:1, b:2}
console.log(state); // {a:1, b:2}

setDraft((draft) => (draft.a = 100));

console.log(getSnap(state)); // {a:1, b:2}
console.log(state); // {a:100, b:2}
`,paraId:2,tocIndex:2},{value:`import { getSnap, share } from 'helux';

const { state, setDraft } = share({ a: 1, b: 2 });

console.log(getSnap(state)); // {a:1, b:2}
console.log(state); // {a:1, b:2}

setDraft((draft) => (draft.a = 100));

console.log(getSnap(state, false)); // {a:100, b:2}
`,paraId:3,tocIndex:3}]},20584:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(79515);const a=[{value:"\u5305\u542B\u4EE5\u4E0B\u5E38\u7528\u5DE5\u5177\u51FD\u6570",paraId:0,tocIndex:0},{value:"init",paraId:1,tocIndex:0},{value:" \u521D\u59CB\u5316\u4E00\u4E9B\u8FD0\u884C\u914D\u7F6E\u9879",paraId:2,tocIndex:0},{value:"flush",paraId:3,tocIndex:0},{value:" \u4E3B\u52A8\u89E6\u53D1\u63D0\u4EA4",paraId:2,tocIndex:0},{value:"reactive",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\u53D8\u66F4\u6570\u636E",paraId:2,tocIndex:0},{value:"reactiveDesc",paraId:4,tocIndex:0},{value:" \u4E3A",paraId:2,tocIndex:0},{value:"reactive",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\u7684\u6700\u8FD1\u4E00\u6B21\u53D8\u66F4\u6DFB\u52A0\u63D0\u4EA4\u63CF\u8FF0",paraId:2,tocIndex:0},{value:"addMiddleware",paraId:5,tocIndex:0},{value:" \u6DFB\u52A0\u4E2D\u95F4\u4EF6",paraId:2,tocIndex:0},{value:"addPlugin",paraId:6,tocIndex:0},{value:" \u6DFB\u52A0\u63D2\u4EF6",paraId:2,tocIndex:0},{value:"cst",paraId:7,tocIndex:0},{value:" \u5E38\u91CF\u5BF9\u8C61\u5408\u96C6",paraId:2,tocIndex:0},{value:"getAtom",paraId:8,tocIndex:0},{value:" \u83B7\u53D6",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\u7684\u771F\u5B9E\u503C\u5F15\u7528",paraId:2,tocIndex:0},{value:"getSnap",paraId:9,tocIndex:0},{value:" \u83B7\u53D6",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u5BF9\u8C61\u7684\u5FEB\u7167",paraId:2,tocIndex:0},{value:"getActionLoading",paraId:10,tocIndex:0},{value:" \u83B7\u53D6",paraId:2,tocIndex:0},{value:"action",paraId:2,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:2,tocIndex:0},{value:"getDeriveLoading",paraId:11,tocIndex:0},{value:" \u83B7\u53D6",paraId:2,tocIndex:0},{value:"derive",paraId:2,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:2,tocIndex:0},{value:"getMutateLoading",paraId:12,tocIndex:0},{value:" \u83B7\u53D6",paraId:2,tocIndex:0},{value:"mutate",paraId:2,tocIndex:0},{value:"\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:2,tocIndex:0},{value:"isAtom",paraId:13,tocIndex:0},{value:" \u5224\u65AD\u662F\u5426\u662F",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:"\u63A5\u53E3\u8FD4\u56DE\u7684\u5BF9\u8C61",paraId:2,tocIndex:0},{value:"isDerivedAtom",paraId:14,tocIndex:0},{value:" \u5224\u65AD\u662F\u5426\u662F",paraId:2,tocIndex:0},{value:"derive",paraId:2,tocIndex:0},{value:"\u63A5\u53E3\u8FD4\u56DE\u7684\u7ED3\u679C",paraId:2,tocIndex:0},{value:"isDiff",paraId:15,tocIndex:0},{value:" \u6BD4\u8F83\u4E24\u4E2A\u503C\u662F\u5426\u4E00\u6837",paraId:2,tocIndex:0},{value:"shallowCompare",paraId:16,tocIndex:0},{value:" \u6D45\u6BD4\u8F83\u4E24\u4E2A\u5BF9\u8C61",paraId:2,tocIndex:0},{value:"markRaw",paraId:17,tocIndex:0},{value:" \u6807\u8BB0\u5BF9\u8C61\u4E0D\u4F1A\u8F6C\u53D8\u4E3A\u4EE3\u7406\u5BF9\u8C61",paraId:2,tocIndex:0}]},31104:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(3823);const a=[{value:"\u521D\u59CB\u5316\u4E00\u4E9B\u8FD0\u884C\u914D\u7F6E\u9879",paraId:0,tocIndex:0},{value:"\u7C7B\u578B\u63CF\u8FF0",paraId:1,tocIndex:0},{value:`interface IInitOptions {
  /**
   * defaut: true\uFF0C
   * \u662F\u5426\u662F createRoot(dom).render(comp) \u6A21\u5F0F\u6E32\u67D3\u6839\u7EC4\u4EF6\uFF0C\u6B64\u914D\u7F6E\u53EA\u9488\u5BF9 react 18 \u6709\u6548
   */
  isRootRender?: boolean;
}
`,paraId:2,tocIndex:0},{value:`\u5982\u679C\u4F7F\u7528 react 18\uFF0C\u9ED8\u8BA4\u76F8\u4FE1\u7528\u6237\u91C7\u7528\u7684\u662F createRoot(dom).render(comp) \u65B9\u5F0F\u6E32\u67D3\u6839\u7EC4\u4EF6\uFF0C
\u5185\u90E8\u7684 useSync \u4F1A\u8D70\u5230\u771F\u5B9E\u7684 useSyncExternalStore \u8C03\u7528\u903B\u8F91\uFF08 \u975E 18 \u63D0\u4F9B\u7684\u662F\u5047\u7684 useSyncExternalStore \u5B9E\u73B0 \uFF09\uFF0C
\u800C\u5982\u679C\u7528\u6237\u5B9E\u9645\u4E0A\u5E76\u672A\u5728 18 \u4F7F\u7528 createRoot \u65B9\u5F0F\u6E32\u67D3\u65F6\uFF0C\u771F\u5B9E\u7684 useSyncExternalStore \u5185\u90E8\u4F1A\u629B\u51FA\u4E00\u4E2A\u9519\u8BEF\uFF1A
`,paraId:3,tocIndex:2},{value:"dispatcher.useSyncExternalStore is not a function",paraId:3,tocIndex:2},{value:"\u3002",paraId:3,tocIndex:2},{value:"\u6B64\u65F6\u7528\u6237\u53EF\u4EE5\u8BBE\u7F6E ",paraId:4,tocIndex:2},{value:"isRootRender",paraId:4,tocIndex:2},{value:" \u4E3A false \u6D88\u9664\u6B64\u9519\u8BEF\u63D0\u793A\u3002",paraId:4,tocIndex:2},{value:`init({ isRootRender: false });
`,paraId:5,tocIndex:2}]},84522:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(7036);const a=[{value:"\u5224\u65AD\u662F\u5426\u662F",paraId:0,tocIndex:0},{value:"atom",paraId:0,tocIndex:0},{value:"\u63A5\u53E3\u8FD4\u56DE\u7684\u5BF9\u8C61",paraId:0,tocIndex:0},{value:`import { atom, share } from 'helux';

const [state1] = atom(1);
const [state2] = share({ a: 1, b: 2 });

isAtom(state1); // true
isAtom(state2); // false
`,paraId:1,tocIndex:1},{value:"\u4F20\u5165\u5176\u4ED6\u975E",paraId:2,tocIndex:1},{value:"atom",paraId:2,tocIndex:1},{value:"\u8FD4\u56DE\u7684\u503C\u90FD\u4F1A\u8FD4\u56DE ",paraId:2,tocIndex:1},{value:"false",paraId:2,tocIndex:1},{value:`isAtom(1); // false
isAtom(); // false
isAtom([]); // false
isAtom({ a: 1 }); // false
`,paraId:3,tocIndex:1}]},97685:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(52921);const a=[{value:"\u5224\u65AD\u662F\u5426\u662F",paraId:0,tocIndex:0},{value:"derive",paraId:0,tocIndex:0},{value:"\u63A5\u53E3\u8FD4\u56DE\u7684\u7ED3\u679C",paraId:0,tocIndex:0},{value:`import { atom, derive, deriveDict, isDerivedAtom } from 'helux';

const [state1] = atom(1);

const result1 = derive(() => state1.val + 1); // { val: 2 }
const result2 = deriveDict(() => ({ num: state1.val + 1 })); // { num: 2 }

isDerivedAtom(result1); // true
isDerivedAtom(result2); // false
`,paraId:1,tocIndex:1},{value:"\u4F20\u5165\u5176\u4ED6\u975E",paraId:2,tocIndex:1},{value:"derive",paraId:2,tocIndex:1},{value:"\u8FD4\u56DE\u7684\u503C\u90FD\u4F1A\u8FD4\u56DE ",paraId:2,tocIndex:1},{value:"false",paraId:2,tocIndex:1},{value:`isDerivedAtom(1); // false
isDerivedAtom(); // false
isDerivedAtom([]); // false
isDerivedAtom({ a: 1 }); // false
`,paraId:3,tocIndex:1}]},47624:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(80892);const a=[{value:"\u6BD4\u8F83\u4E24\u4E2A\u503C\u662F\u5426\u4E00\u6837",paraId:0,tocIndex:0},{value:`import { isDiff } from 'helux';

isDiff(1, 1); // true
isDiff(1, 2); // false
`,paraId:1,tocIndex:2},{value:"atom",paraId:2,tocIndex:3},{value:"\u5BF9\u8C61\u578B\u8282\u70B9\u53EF\u501F\u52A9",paraId:2,tocIndex:3},{value:"isDiff",paraId:2,tocIndex:3},{value:"\u51FD\u6570\u6BD4\u8F83\u662F\u5426\u76F8\u7B49\uFF0C\u56E0\u8282\u70B9\u662F\u4EE3\u7406\u5BF9\u8C61\uFF0C\u76F4\u63A5\u6BD4\u8F83\u7684\u8BDD\uFF0C\u5B83\u4EEC\u59CB\u7EC8\u662F\u4E0D\u76F8\u7B49\u7684\uFF0C\u800C isDiff \u51FD\u6570\u5185\u90E8\u4F1A\u6BD4\u8F83\u6570\u636E\u7248\u672C\u53F7\u5E76\u7ED9\u51FA\u6B63\u786E\u7684\u7ED3\u679C",paraId:2,tocIndex:3},{value:`import { isDiff } from 'helux';

const { b, c } = state1.val;
setAtom((draft) => (draft.b.b1 = 100));
const { b: newB, c: newC } = state1.val;

// \u{1F449} \u6B64\u65F6 b\uFF0Cc \u8282\u70B9\u662F\u4EE3\u7406\u5BF9\u8C61\uFF0C\u76F4\u63A5\u6BD4\u8F83\u7684\u8BDD\uFF0C\u5B83\u4EEC\u59CB\u7EC8\u662F\u4E0D\u76F8\u7B49\u7684\uFF0C\u9700\u501F\u52A9 isDiff \u6BD4\u8F83
isDiff(b, newB); // true
isDiff(c, newC); // false\uFF0Cc \u8282\u70B9\u672A\u53D1\u751F\u8FC7\u53D8\u5316
`,paraId:3,tocIndex:3}]},37657:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(56007);const a=[{value:"\u6807\u8BB0\u5BF9\u8C61\u4E3A\u539F\u59CB\u5BF9\u8C61\uFF0C\u88AB\u6807\u8BB0\u540E\u7684\u5BF9\u8C61\u4E0D\u4F1A\u88AB\u4EE3\u7406\uFF0C\u6709\u52A9\u4E8E\u96C6\u6210\u4E00\u4E9B\u7B2C\u4E09\u65B9\u7279\u6B8A\u7684\u590D\u6742\u5BF9\u8C61\uFF0C\u907F\u514D\u989D\u5916\u7684\u6027\u80FD\u635F\u8017\uFF0C\u4F46\u662F\u9700\u8981\u6CE8\u610F\u7684\u662F\uFF0C\u88AB\u6807\u8BB0\u540E\u8BE5\u5BF9\u8C61\u5931\u53BB\u4E86",paraId:0,tocIndex:0},{value:"\u7ED3\u6784\u5171\u4EAB",paraId:0,tocIndex:0},{value:"\u7279\u6027\uFF0C\u8BFB\u53D6\u65F6\u4E0D\u518D\u4F1A\u88AB\u6D45\u590D\u5236\uFF0C\u540E\u679C\u662F\u591A\u4EFD\u5FEB\u7167\u91CC\u7684\u6B64\u5BF9\u8C61\u6307\u5411\u7684\u662F\u540C\u4E2A\u4E00\u5F15\u7528",paraId:0,tocIndex:0},{value:"\u6B64\u7279\u6027\u6765\u81EA\u4E8E",paraId:1},{value:"limu-3.12.0",paraId:1},{value:"\u63D0\u4F9B\u7684\u65B0\u63A5\u53E3",paraId:1},{value:"markRaw",paraId:1},{value:`import { markRaw, atom } from 'helux';

const [ state, setState, ctx ] = atom({ a: { } });

setState(draft=>{
  draft.a.k1 = markRaw(AComplexThridObject);
});

function Demo(){
  const [ state ] = ctx.useState();
  // \u7531\u4E8E state.a.k1 \u8FD4\u56DE\u503C\u4E0D\u518D\u8F6C\u53D8\u4E3A\u4EE3\u7406\uFF0C
  // \u6545\u4F9D\u8D56\u4E0D\u4F1A\u7EE7\u7EED\u5411\u4E0B\u6536\u96C6\uFF0C\u5F53\u524D\u7EC4\u4EF6\u6536\u96C6\u5230\u4F9D\u8D56\u4E3A state.a.k1
  const k5 = state.a.k1.k2.k3.k4.k5;
}
`,paraId:2,tocIndex:1}]},34058:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(71044);const a=[{value:"\u4E3A",paraId:0,tocIndex:0},{value:"reactive",paraId:0,tocIndex:0},{value:"\u5BF9\u8C61\u7684\u6700\u8FD1\u4E00\u6B21\u53D8\u66F4\u6DFB\u52A0\u63D0\u4EA4\u63CF\u8FF0\uFF0C\u65B9\u4FBF",paraId:0,tocIndex:0},{value:"helux-devtool",paraId:0,tocIndex:0},{value:"\u53EF\u8FFD\u6EAF\u53D8\u66F4\u8BB0\u5F55",paraId:0,tocIndex:0},{value:"\u5EFA\u8BAE\u4F7F\u7528",paraId:1},{value:"actions",paraId:1},{value:"\u4FEE\u6539\u72B6\u6001\uFF0C\u53EF\u53C2\u8003",paraId:1},{value:"\u6A21\u5757\u5316/defineActions",paraId:2},{value:`import { reactiveDesc, atomx } from 'helux';

const ctx = atomx({ a: 1, b: 2 });
const { reactive } = ctx;

async function changeA() {
  reactive.a += 100;
  reactiveDesc('changeA');
}
`,paraId:3,tocIndex:1}]},99319:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(14632);const a=[{value:"\u6D45\u6BD4\u8F83\u4E24\u4E2A\u5BF9\u8C61",paraId:0,tocIndex:0},{value:"\u5BF9\u4E8E\u6570\u7EC4\u7ED3\u6784\u7684\u6570\u636E\uFF0C\u9ED8\u8BA4\u53EA\u8FFD\u8E2A\u5230\u4E0B\u6807\u4F4D\u7F6E\uFF0C\u53EF\u914D\u5408\u5DE5\u5177\u51FD\u6570",paraId:1,tocIndex:1},{value:"shallowCompare",paraId:1,tocIndex:1},{value:"\u505A\u7CBE\u51C6\u6E32\u67D3",paraId:1,tocIndex:1}]},73205:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(26335);const a=[]},22173:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(10721);const a=[{value:"\u9664\u4E86\u53EF\u4EE5\u901A\u8FC7\u5C01\u88C5",paraId:0,tocIndex:0},{value:"setState",paraId:0,tocIndex:0},{value:" \u8C03\u7528\u8FBE\u5230\u4FEE\u6539\u72B6\u6001\u7684\u76EE\u7684",paraId:0,tocIndex:0},{value:`const [numState, setState] = share({ num: 1 }); // { num: 1 }
function methodA(input: number) {
  setState((draft) => (draft.num = input));
}
`,paraId:1,tocIndex:0},{value:"helux",paraId:2,tocIndex:0},{value:"\u8FD8\u63D0\u4F9B",paraId:2,tocIndex:0},{value:"action",paraId:2,tocIndex:0},{value:"\u5DE5\u5382\u51FD\u6570\u521B\u5EFA\u4E13\u7528\u4E8E\u4FEE\u6539\u72B6\u6001\u7684 action \u540C\u6B65\u6216\u5F02\u6B65\u51FD\u6570\uFF0C\u901A\u8FC7 action \u51FD\u6570\u8C03\u7528\u6709 2 \u5927\u597D\u5904",paraId:2,tocIndex:0},{value:"\u63A5\u5165 devltool \u540E\u72B6\u6001\u4FEE\u6539\u5386\u53F2\u53EF\u8BE6\u7EC6\u8FFD\u6EAF",paraId:3,tocIndex:0},{value:"\u5F02\u6B65\u51FD\u6570\u53EF\u81EA\u52A8\u4EAB\u53D7\u4E0B\u6587\u63D0\u5230\u7684",paraId:4,tocIndex:0},{value:"loading",paraId:4,tocIndex:0},{value:"\u7BA1\u7406\u80FD\u529B",paraId:4,tocIndex:0},{value:"\u6B64\u63A5\u53E3\u504F\u5411\u5E95\u5C42\uFF0C\u5728\u5927\u578B\u9879\u76EE\u91CC\u6279\u91CF\u5B9A\u4E49\u548C\u7BA1\u7406 action \u51FD\u6570\uFF0C\u63A8\u8350\u9605\u8BFB",paraId:5},{value:"\u6A21\u5757\u5316",paraId:6},{value:"\u4E86\u89E3",paraId:5},{value:"defineActions",paraId:5},{value:"\uFF0C\u62E5\u6709\u66F4\u597D\u7684\u5F00\u53D1\u4F53\u9A8C\u548C\u53EF\u7EF4\u62A4\u6027",paraId:5},{value:"\u5B9A\u4E49\u6709\u4E1A\u52A1\u542B\u4E49\u7684\u540C\u6B65 action \u5E76\u7EA6\u675F\u5165\u53C2\u7C7B\u578B",paraId:7,tocIndex:1},{value:`const hiAction = action<[number, string]>()(({ draft, payload }) => {
  draft.a += 100;
}, 'hi action');

hiAction(1, 1); // \u274C \u7B2C\u4E8C\u4F4D\u53C2\u6570\u5C06\u63D0\u793A\uFF1A\u7C7B\u578B\u201Cnumber\u201D\u7684\u53C2\u6570\u4E0D\u80FD\u8D4B\u7ED9\u7C7B\u578B\u201Cstring\u201D\u7684\u53C2\u6570
`,paraId:8,tocIndex:1},{value:"\u5B9A\u4E49\u6709\u4E1A\u52A1\u542B\u4E49\u7684\u5F02\u6B65 action \u5E76\u7EA6\u675F\u5165\u53C2\u7C7B\u578B",paraId:9,tocIndex:2},{value:`const hiAsyncAction = action<[number, string]>()(async ({ draft, payload }) => {
  draft.a += 100;
  await delay(); // \u8FDB\u5165\u4E0B\u4E00\u6B21\u4E8B\u4EF6\u5FAA\u73AF\u5FAE\u4EFB\u52A1\u6267\u884C\u524D\uFF0C\u89E6\u53D1\u63D0\u4EA4 draft \u53D8\u66F4\u6570\u636E
  draft.a += 100;
  return true;
}, 'hiAsyncAction');

// \u274C \u7B2C\u4E8C\u4F4D\u53C2\u6570\u5C06\u63D0\u793A\uFF1A\u7C7B\u578B\u201Cnumber\u201D\u7684\u53C2\u6570\u4E0D\u80FD\u8D4B\u7ED9\u7C7B\u578B\u201Cstring\u201D\u7684\u53C2\u6570
const { result, snap, err } = await hiAsyncAction(1, 1);
`,paraId:10,tocIndex:2},{value:"\u914D\u5408 ",paraId:11,tocIndex:2},{value:"useActionLoading",paraId:11,tocIndex:2},{value:" \u94A9\u5B50\u53EF\u81EA\u52A8\u611F\u77E5\u6267\u884C\u72B6\u6001",paraId:11,tocIndex:2},{value:`const [ld] = useActionLoading();
const { loading, ok, err } = ld.hiAsyncAction;
`,paraId:12,tocIndex:2},{value:"\u591A\u6B21\u70B9\u51FB ",paraId:13},{value:"hiAsyncAction",paraId:13},{value:" \u89C1\u89E6\u53D1\u7EC4\u4EF6\u6E32\u67D3\u6355\u83B7\u5230 action \u629B\u51FA\u7684\u9519\u8BEF",paraId:13}]},68399:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(55289);const a=[]},56309:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(78373);const a=[{value:"\u9605\u8BFB\u6B64\u7AE0\u8282\u53EF\u5FEB\u901F\u4E86\u89E3",paraId:0,tocIndex:0},{value:"atom",paraId:0,tocIndex:0},{value:"\u63A5\u53E3\u7B80\u5355\u7528\u6CD5\uFF0C\u66F4\u591A\u4F7F\u7528\u65B9\u5F0F\u8BF7\u67E5\u9605",paraId:0,tocIndex:0},{value:"atom \u63A5\u53E3\u6587\u6863",paraId:1,tocIndex:0},{value:"\u3002",paraId:0,tocIndex:0},{value:"\u4F7F\u7528",paraId:2,tocIndex:1},{value:"atom",paraId:2,tocIndex:1},{value:"\u5B9A\u4E49\u5168\u5C40\u5171\u4EAB\u72B6\u6001\uFF0C\u8BE5\u72B6\u6001\u662F\u4E00\u4E2A\u5F15\u7528\u7A33\u5B9A\u7684\u53EA\u8BFB\u4EE3\u7406\u5BF9\u8C61\uFF0C\u59CB\u7EC8\u53EF\u4EE5\u8BBF\u95EE\u5230\u6700\u65B0\u7ED3\u679C",paraId:2,tocIndex:1},{value:`import { atom } from 'helux';
const [numAtom] = atom(1); // { val: 1 }
`,paraId:3,tocIndex:1},{value:"atom",paraId:4,tocIndex:1},{value:"\u652F\u6301\u4EFB\u610F\u6570\u636E\u7C7B\u578B\uFF0C\u76F4\u63A5\u8BFB\u53D6\u65F6\u9700\u8981\u624B\u52A8\u62C6\u7BB1\uFF0C",paraId:4,tocIndex:1},{value:"share",paraId:4,tocIndex:1},{value:"\u4EC5\u652F\u6301\u5B57\u5178\u7C7B\u578B\uFF0C\u56E0\u8FD4\u56DE\u7ED3\u679C\u662F\u5B57\u5178\u5BF9\u8C61\uFF0C\u65E0\u88C5\u7BB1\u884C\u4E3A\uFF0C\u53EF\u4EE5\u76F4\u63A5\u8BFB\u53D6\u76EE\u6807\u4EFB\u610F\u8282\u70B9\u503C",paraId:4,tocIndex:1},{value:`import { share } from 'helux';

const [sharedObj] = share({ info: { born: 2023 } });
console.log(sharedObj); // sharedObj: {info: { born: 2023 }}
`,paraId:5,tocIndex:1},{value:"\u4F18\u5148\u8003\u8651 share \u5171\u4EAB\u5B57\u5178\u5BF9\u8C61\uFF0C\u7531\u4E8E",paraId:6},{value:"share",paraId:6},{value:"\u63A5\u53E3\u6CA1\u6709\u88C5\u7BB1",paraId:6},{value:"{val: T}",paraId:6},{value:" \u7684\u64CD\u4F5C\uFF0C\u5F53\u5171\u4EAB\u5BF9\u8C61\u4E3A ",paraId:6},{value:"object",paraId:6},{value:" \u65F6\uFF0C\u53EF\u4F18\u5148\u4F7F\u7528",paraId:6},{value:"share",paraId:6},{value:"\u6765\u5171\u4EAB\u5BF9\u8C61\uFF0C\u907F\u514D\u4E00\u4E9B\u65E0\u81EA\u52A8\u62C6\u7BB1\u7684\u573A\u666F\u591A\u505A\u4E00\u6B21",paraId:6},{value:".val",paraId:6},{value:"\u53D6\u503C\u64CD\u4F5C",paraId:6},{value:"\u4E5F\u53EF\u4EE5\u4F7F\u7528\u5DE5\u5382\u51FD\u6570\u5B9A\u4E49\uFF08\u2764\uFE0F \u63A8\u8350\uFF09",paraId:7},{value:`const [numAtom] = atom(() => 1);
const [objAtom] = atom(() => ({ a: 1, b: { b1: 1 } }));
`,paraId:8},{value:"atom",paraId:9},{value:" \u8FD4\u56DE\u5143\u7EC4\u5B8C\u6574\u7ED3\u6784\u4E3A",paraId:9},{value:"[ state, setState, ctx ]",paraId:9},{value:"\uFF0C\u4E5F\u53EF\u4F7F\u7528 ",paraId:9},{value:"atomx",paraId:9},{value:" \u76F4\u63A5\u8FD4\u56DE\u5171\u4EAB\u4E0A\u4E0B\u6587 ",paraId:9},{value:"ctx",paraId:9},{value:"\uFF0C\u4E24\u79CD\u5199\u6CD5\u533A\u522B\u4EC5\u5728\u4E8E\uFF0C",paraId:9},{value:"atom",paraId:9},{value:" \u76F4\u63A5\u5C06 ",paraId:9},{value:"ctx.state",paraId:9},{value:" \u548C ",paraId:9},{value:"ctx.setState",paraId:9},{value:" \u653E\u7F6E\u5230\u5143\u7EC4\u7684\u7B2C\u4E00\u4F4D\u548C\u7B2C\u4E8C\u6B21\u53C2\u6570\u5904\uFF0C\u5BF9\u9F50\u4E86",paraId:9},{value:"react.useState",paraId:9},{value:"\u63A5\u53E3\u98CE\u683C\uFF0C\u8BA9 react \u7528\u6237\u53EF 0 \u6210\u672C\u4E0A\u624B\u3002",paraId:9},{value:`import { atom, atomx } from 'helux';

// \u8FD4\u56DE\u5143\u7EC4\uFF0C\u5143\u7EC4\u7684\u7B2C\u4E00\u4F4D\u548C\u7B2C\u4E8C\u6B21\u53C2\u6570\u5373\u662F state setState
const [numAtom, setAtom, atomCtx] = atom(1);

// \u8FD4\u56DE\u5B57\u5178\u5BF9\u8C61\uFF0C\u5BF9\u8C61\u91CC\u53EF\u89E3\u6784\u51FA state setState
const atomCtx = atomx(1);
const { state: numAtom, setState: setAtom } = atomCtx;
`,paraId:10},{value:"\u5171\u4EAB\u4E0A\u4E0B\u6587\u66F4\u591A\u529F\u80FD\u67E5\u9605",paraId:11},{value:"\u8FDB\u9636/\u6A21\u5757\u5316",paraId:12},{value:"\u3001",paraId:11},{value:"API/\u5171\u4EAB\u4E0A\u4E0B\u6587",paraId:13},{value:"\u4E86\u89E3",paraId:11},{value:"\u94A9\u5B50 ",paraId:14,tocIndex:2},{value:"useAtom",paraId:14,tocIndex:2},{value:" \u8FD4\u56DE\u4E00\u4E2A\u5143\u7EC4\uFF0C\u4F7F\u7528\u65B9\u5F0F\u5927\u4F53\u5BF9\u9F50 ",paraId:14,tocIndex:2},{value:"react.useState",paraId:14,tocIndex:2},{value:" \u63A5\u53E3\uFF0C\u552F\u4E00\u7684\u533A\u522B\u662F",paraId:14,tocIndex:2},{value:"setter",paraId:14,tocIndex:2},{value:"\u63D0\u4F9B\u7684\u56DE\u8C03\u53C2\u6570\u662F\u4E00\u4E2A\u8349\u7A3F\u5BF9\u8C61\uFF0C\u53EF\u57FA\u4E8E\u8349\u7A3F\u5BF9\u8C61\u76F4\u63A5\u4FEE\u6539\uFF0C\u8FD9\u4E2A\u5DEE\u5F02\u70B9\u4E0B\u9762\u4F1A\u518D\u6B21\u63D0\u5230\u3002",paraId:14,tocIndex:2},{value:"\u63A8\u8350\u4E86\u89E3\u548C\u4F7F\u7528",paraId:15},{value:"\u6A21\u5757\u5316/defineAtcions",paraId:16},{value:"\u5B9A\u4E49\u4FEE\u6539\u65B9\u6CD5\uFF0C\u6709\u5229\u4E8E\u7EF4\u62A4\u6216\u6269\u5C55",paraId:15},{value:"\u5728\u7EC4\u4EF6\u5185\u4F7F\u7528",paraId:17},{value:"useAtom",paraId:17},{value:"\u63A5\u53E3\u6765\u83B7\u5F97\u7EC4\u4EF6\u5185\u4F7F\u7528\u7684\u5171\u4EAB\u5BF9\u8C61\uFF0C\u6570\u636E\u53D8\u66F4\u540E\u81EA\u52A8\u901A\u77E5\u7EC4\u4EF6\u91CD\u6E32\u67D3",paraId:17},{value:"\u53EF\u8C03\u7528\u7EC4\u4EF6\u5916\u90E8",paraId:18},{value:"atom",paraId:18},{value:"\u8FD4\u56DE\u7684 set \u53E5\u67C4\u4FEE\u6539\uFF0C\u6548\u679C\u548C ",paraId:18},{value:"useAtom",paraId:18},{value:" \u8FD4\u56DE\u7684\u53E5\u67C4\u5B8C\u5168\u7B49\u6548",paraId:18},{value:"\u53EF\u4F7F\u7528",paraId:19},{value:"ctx.useState",paraId:19},{value:"\u6765\u7B80\u5316",paraId:19},{value:"useAtom(xxxState)",paraId:19},{value:"\u5199\u6CD5\uFF0C",paraId:19},{value:"ctx",paraId:19},{value:"\u6765\u81EA\u4E8E",paraId:19},{value:"atom",paraId:19},{value:"\u8FD4\u56DE\u7684\u5143\u7EC4\u7B2C\u4E09\u4F4D\u53C2\u6570\u3001\u6216",paraId:19},{value:"atomx",paraId:19},{value:"\u63A5\u53E3\u8FD4\u56DE\u7ED3\u679C",paraId:19},{value:"\u56DE\u8C03\u91CC\u57FA\u4E8E\u8349\u7A3F\u4FEE\u6539\uFF0C\u4FEE\u6539\u7ED3\u675F\u540E\uFF0C\u751F\u6210\u4E00\u4EFD\u65B0\u7684\u5177\u6709\u7ED3\u6784\u5171\u4EAB\u7279\u6027\u7684\u72B6\u6001\uFF0C\u8FD9\u4E2A\u662F\u548C",paraId:20},{value:"react.setState",paraId:20},{value:"\u6700\u5927\u7684\u5DEE\u522B\u4E4B\u5904\uFF0C\u9700\u8981\u6CE8\u610F\u533A\u522B\u5BF9\u5F85\u3002",paraId:20},{value:`const [shared, setShared] = share({
  info: { name: 'helux', age: 1 },
  desc: 'awesome lib',
});

function changName(name) {
  setShared((draft) => {
    draft.info.name = name;
  });
}
`,paraId:21},{value:"\u6CE8\u610F react.setState \u63D0\u4F9B\u7684\u56DE\u8C03\u53C2\u6570\u4E0D\u80FD\u76F4\u63A5\u4FEE\u6539\uFF0C\u9700\u8981\u62F7\u8D1D\u4E3A\u4E00\u4EFD\u65B0\u7684\u5F15\u7528\u540E\uFF0C\u57FA\u4E8E\u65B0\u5F15\u7528\u4FEE\u6539\u624D\u751F\u6548",paraId:22}]},15910:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(86204);const a=[{value:"\u9664\u4E86\u5BF9",paraId:0,tocIndex:0},{value:"$",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"block",paraId:0,tocIndex:0},{value:"\u8FD9\u4E9B\u9759\u6001\u8282\u70B9\u5EFA\u7ACB\u8D77\u89C6\u56FE\u5BF9\u6570\u636E\u53D8\u5316\u7684\u4F9D\u8D56\u5173\u7CFB\uFF0C\u4F7F\u7528",paraId:0,tocIndex:0},{value:"useAtom",paraId:0,tocIndex:0},{value:"\u65B9\u5F0F\u7684\u7EC4\u4EF6\u6E32\u67D3\u671F\u95F4\u5C06\u5B9E\u65F6\u6536\u96C6\u5230\u6570\u636E\u4F9D\u8D56",paraId:0,tocIndex:0},{value:"\u7EC4\u4EF6\u65F6\u8BFB\u53D6\u6570\u636E\u8282\u70B9\u503C\u65F6\u5C31\u4EA7\u751F\u4E86\u4F9D\u8D56\uFF0C\u8FD9\u4E9B\u4F9D\u8D56\u88AB\u6536\u96C6\u5230",paraId:1,tocIndex:1},{value:"helux",paraId:1,tocIndex:1},{value:"\u5185\u90E8\u4E3A\u6BCF\u4E2A\u7EC4\u4EF6\u521B\u5EFA\u7684\u5B9E\u4F8B\u4E0A\u4E0B\u6587\u91CC\u6682\u5B58\u7740\uFF0C\u4F5C\u4E3A\u66F4\u65B0\u51ED\u636E\u6765\u4F7F\u7528\u3002",paraId:1,tocIndex:1},{value:`const { state, setDraft, useState } = atomx({ a: 1, b: { b1: 1 } });

// \u4FEE\u6539\u8349\u7A3F\uFF0C\u751F\u6210\u5177\u6709\u6570\u636E\u7ED3\u6784\u5171\u4EAB\u7684\u65B0\u72B6\u6001\uFF0C\u5F53\u524D\u4FEE\u6539\u53EA\u4F1A\u89E6\u53D1 Demo1 \u7EC4\u4EF6\u6E32\u67D3
const changeObj = () => setDraft((draft) => (draft.a = Math.random()));

function Demo1() {
  const [obj] = useState();
  // \u4EC5\u5F53 obj.a \u53D1\u751F\u53D8\u5316\u65F6\u624D\u89E6\u53D1\u91CD\u6E32\u67D3
  return <h1>{obj.a}</h1>;
}

function Demo2() {
  const [obj] = useState();
  // \u4EC5\u5F53 obj.b.b1 \u53D1\u751F\u53D8\u5316\u65F6\u624D\u89E6\u53D1\u91CD\u6E32\u67D3
  return <h1>{obj.b.b1}</h1>;
}
`,paraId:2,tocIndex:1},{value:"\u5B58\u5728 ",paraId:3,tocIndex:2},{value:"if",paraId:3,tocIndex:2},{value:" \u6761\u4EF6\u65F6\uFF0C\u6BCF\u4E00\u8F6E\u6E32\u67D3\u671F\u95F4\u6536\u96C6\u7684\u4F9D\u8D56\u5C06\u5B9E\u65F6\u53D1\u751F\u53D8\u5316",paraId:3,tocIndex:2},{value:`import { atomx } from 'helux';

const { state, setDraft, useState } = atomx({ a: 1, b: { b1: 1 } });
const changeA = () => setDraft((draft) => (draft.a += 1));
const changeB = () => setDraft((draft) => (draft.a.b1 += 1));

function Demo1() {
  const [obj] = useState();
  // \u5927\u4E8E 3 \u65F6\uFF0C\u4F9D\u8D56\u4E3A a, b.b1
  if (obj.a > 3) {
    return (
      <h1>
        {obj.a} - {obj.b.b1}
      </h1>
    );
  }

  return <h1>{obj.a}</h1>;
}
`,paraId:4,tocIndex:2},{value:"\u5148\u70B9\u51FB\u4E0B\u8FF0\u793A\u4F8B",paraId:5,tocIndex:2},{value:"changeB1",paraId:5,tocIndex:2},{value:"\u6309\u94AE\uFF0C\u53D1\u73B0\u5E76\u4E0D\u4F1A\u89E6\u53D1\u91CD\u6E32\u67D3\uFF0C\u7136\u540E\u518D\u70B9\u51FB",paraId:5,tocIndex:2},{value:"plusA",paraId:5,tocIndex:2},{value:"\u6309\u94AE\uFF0C\u5F85\u5230",paraId:5,tocIndex:2},{value:"a",paraId:5,tocIndex:2},{value:"\u503C\u5927\u4E8E 3 \u65F6\uFF0C\u70B9\u51FB",paraId:5,tocIndex:2},{value:"changeB1",paraId:5,tocIndex:2},{value:"\u6309\u94AE\uFF0C\u6B64\u65F6\u7EC4\u4EF6\u5C06\u88AB\u91CD\u6E32\u67D3\uFF0C\u70B9\u51FB",paraId:5,tocIndex:2},{value:"minusA",paraId:5,tocIndex:2},{value:"\u6309\u94AE\uFF0C\u5F85\u5230",paraId:5,tocIndex:2},{value:"a",paraId:5,tocIndex:2},{value:"\u503C\u5C0F\u4E8E 3 \u65F6\uFF0C\u70B9\u51FB",paraId:5,tocIndex:2},{value:"changeB1",paraId:5,tocIndex:2},{value:"\u6309\u94AE\uFF0C\u6B64\u65F6\u7EC4\u4EF6\u5C06\u88AB\u4E0D\u88AB\u91CD\u6E32\u67D3",paraId:5,tocIndex:2},{value:"\u5F97\u76CA\u4E8E",paraId:6,tocIndex:3},{value:"limu",paraId:6,tocIndex:3},{value:"\u4EA7\u751F\u7684\u7ED3\u6784\u5171\u4EAB\u6570\u636E\uFF0C",paraId:6,tocIndex:3},{value:"helux",paraId:6,tocIndex:3},{value:"\u5185\u90E8\u53EF\u4EE5\u9AD8\u6548\u7684\u6BD4\u8F83\u5FEB\u7167\u53D8\u66F4\u90E8\u5206\uFF0C\u5F53\u7528\u6237\u91CD\u590D\u8BBE\u7F6E\u76F8\u540C\u7684\u503C\u7EC4\u4EF6\u5C06\u4E0D\u88AB\u6E32\u67D3",paraId:6,tocIndex:3},{value:`import { atomx } from 'helux';

const { state, setDraft, useState } = atomx({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});
const changeB1 = () => setDraft((draft) => (draft.b.b1 = { ...draft.b.b1 }));
const changeB1_Ok_oldValue = () =>
  setDraft((draft) => (draft.b.b1.ok = draft.b.b1.ok));
const changeB1_Ok_newValue = () =>
  setDraft((draft) => (draft.b.b1.ok = !draft.b.b1.ok));

// \u8C03\u7528 changeB1_Ok_oldValue changeB1 Demo1 \u4E0D\u4F1A\u88AB\u91CD\u6E32\u67D3
// \u8C03\u7528 changeB1_Ok_newValue \uFF0CDemo1 \u88AB\u91CD\u6E32\u67D3
function Demo1() {
  const [obj] = useState();
  return <h1>obj.b.b1.ok {\`\${obj.b.b1.ok}\`}</h1>;
}
`,paraId:7,tocIndex:3},{value:"\u9700\u8981\u4EBA\u5DE5\u505A\u6BD4\u8F83\u7684\u573A\u666F\uFF0C\u5BF9\u8C61\u578B\u8282\u70B9\u53EF\u501F\u52A9",paraId:8,tocIndex:4},{value:"isDiff",paraId:8,tocIndex:4},{value:"\u51FD\u6570\u6BD4\u8F83\u662F\u5426\u76F8\u7B49",paraId:8,tocIndex:4},{value:"\u70B9\u51FB triggerCompre\uFF0C\u89C2\u5BDF compare tip \u7ED3\u679C",paraId:9},{value:"\u4E5F\u53EF\u4EE5\u501F\u52A9",paraId:10,tocIndex:5},{value:"getSnap",paraId:10,tocIndex:5},{value:"\u51FD\u6570\u83B7\u53D6\u5FEB\u7167\u5BF9\u8C61\u6765\u76F4\u63A5\u6BD4\u8F83",paraId:10,tocIndex:5},{value:`import { getSnap } from 'helux';

const snap1 = getSnap(state1); // \u4FEE\u6539\u524D\u7684\u5FEB\u7167
setAtom((draft) => (draft.b.b1 = 100));
const snap2 = getSnap(state1); // \u4FEE\u6539\u540E\u7684\u5FEB\u7167
const { b: newB, c: newC } = state1.val;

console.log(snap1.val.b !== snap2.val.b); // true
console.log(snap1.val.c !== snap2.val.c); // false\uFF0Cc \u8282\u70B9\u672A\u53D1\u751F\u8FC7\u53D8\u5316
`,paraId:11,tocIndex:5}]},65921:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(248);const a=[{value:"derive",paraId:0,tocIndex:1},{value:" \u63A5\u53E3\u8BE5\u63A5\u53D7\u4E00\u4E2A\u6D3E\u751F\u51FD\u6570\u5B9E\u73B0\uFF0C\u8FD4\u56DE\u4E00\u4E2A\u5168\u65B0\u7684\u6D3E\u751F\u503C\u5BF9\u8C61\uFF0C\u8BE5\u5BF9\u8C61\u662F\u4E00\u4E2A\u53EA\u53EF\u8BFB\u7684\u7A33\u5B9A\u5F15\u7528\uFF0C\u5168\u5C40\u4F7F\u7528\u53EF\u603B\u662F\u8BFB\u53D6\u5230\u6700\u65B0\u503C\u3002",paraId:0,tocIndex:1},{value:"derive",paraId:1,tocIndex:2},{value:"\u63A5\u53D7\u4EFB\u610F\u6570\u636E\u7C7B\u578B\u7684\u8FD4\u56DE\u7ED3\u679C\uFF0C\u81EA\u52A8\u88C5\u7BB1\u4E3A",paraId:1,tocIndex:2},{value:"{val:T}",paraId:1,tocIndex:2},{value:"\u7ED3\u6784\uFF0C\u6D3E\u751F\u51FD\u6570\u9996\u6B21\u8FD0\u884C\u540E\u4F1A\u6536\u96C6\u5230\u76F8\u5173\u6570\u636E\u4F9D\u8D56\uFF0C\u540E\u7EED\u4EC5\u5728\u8FD9\u4E9B\u4F9D\u8D56\u53D1\u751F\u53D8\u5316\u540E\u624D\u4F1A\u91CD\u8FD0\u884C\u5E76\u8BA1\u7B97\u51FA\u65B0\u7ED3\u679C",paraId:1,tocIndex:2},{value:`import { atom, derive } from 'helux';

const [numAtom] = atom(5);
const [info] = share({
  a: 50,
  c: { c1: 100, c2: 1000 },
  list: [{ name: 'one', age: 1 }],
});

// \u4EC5\u5728 numAtom.val \u6216 info.c.c1 \u53D1\u751F\u53D8\u5316\u540E\u624D\u4F1A\u91CD\u8FD0\u884C\u8BA1\u7B97\u51FA\u65B0\u7684 result
const result = derive(() => {
  return numAtom.val + info.c.c1;
});
`,paraId:2,tocIndex:2},{value:"\u7EC4\u4EF6\u4E2D\u53EF\u4F7F\u7528",paraId:3,tocIndex:2},{value:"useDerived",paraId:3,tocIndex:2},{value:"\u83B7\u53D6\u5230\u6D3E\u751F\u7ED3\u679C\uFF0C\u4F20\u5165\u7684\u662F",paraId:3,tocIndex:2},{value:"derive",paraId:3,tocIndex:2},{value:"\u8FD4\u56DE\u7ED3\u679C\u5219\u4F1A\u81EA\u52A8\u62C6\u7BB1",paraId:3,tocIndex:2},{value:"\u8FD4\u56DE\u7ED3\u679C\u4E3A\u5B57\u5178\u5BF9\u8C61\u7C7B\u578B\u65F6\uFF0C\u53EF\u4F7F\u7528",paraId:4},{value:"driveDict",paraId:4},{value:"\u6765\u514D\u53BB\u81EA\u52A8\u88C5\u7BB1\u8FC7\u7A0B",paraId:4},{value:`import { driveDict } from 'helux';

const result = driveDict(() => {
  return { plusValue: numAtom.val + info.c.c1 };
});
`,paraId:5},{value:"\u652F\u6301\u914D\u7F6E ",paraId:6,tocIndex:3},{value:"task",paraId:6,tocIndex:3},{value:" \u5F02\u6B65\u8BA1\u7B97\u4EFB\u52A1\u6765\u5B9E\u73B0\u5F02\u6B65\u6D3E\u751F\u7ED3\u679C",paraId:6,tocIndex:3},{value:`const [sharedState, setState] = share({ a: 1, b: { b1: { b2: 200 } } });

const result = derive({
  // \u5B9A\u4E49\u4F9D\u8D56\u9879
  deps: () => [sharedState.a, sharedState.b.b1.b2] as const,
  // \u5B9A\u4E49\u521D\u59CB\u503C\u8BA1\u7B97\u51FD\u6570
  fn: ({ input: [a, b2] }) => ({ val: a + b2 }),
  // \u5B9A\u4E49\u5F02\u6B65\u8BA1\u7B97\u4EFB\u52A1\uFF0C\u9ED8\u8BA4\u9996\u6B21\u4E0D\u6267\u884C\uFF0C\u53EF\u8BBE\u7F6E immediate \u89E6\u53D1\u9996\u6B21\u6267\u884C
  task: async ({ input: [a, b2] }) => {
    await delay(1000);
    return { val: a + b2 + 1 };
  },
  // immediate: true,
});
`,paraId:7,tocIndex:3},{value:"\u7EC4\u4EF6\u4E2D\u53EF\u4F7F\u7528",paraId:8,tocIndex:3},{value:"useDerived",paraId:8,tocIndex:3},{value:"\u83B7\u53D6\u5230\u5F02\u6B65\u6D3E\u751F\u7ED3\u679C\u548C\u6D3E\u751F\u51FD\u6570\u6267\u884C\u72B6\u6001",paraId:8,tocIndex:3},{value:`function Demo() {
  const [num, status] = useDerived(result);
  if (status.loading) return <h1>loading...</h1>;
  if (!status.ok) return <h1>{status.err.message}</h1>;
  return <h1>num</h1>;
}
`,paraId:9,tocIndex:3},{value:"\u70B9\u51FB",paraId:10},{value:"changeA",paraId:10},{value:"3 \u6B21\u540E\uFF0C\u5C06\u89E6\u53D1 task \u629B\u51FA\u5F02\u5E38\u5230\u7EC4\u4EF6\u4E2D",paraId:10},{value:"\u6D3E\u751F\u51FD\u6570\u9664\u4E86\u89C2\u5BDF\u5230\u6570\u636E\u4F9D\u8D56\u53D8\u5316\u540E\u88AB\u89E6\u53D1\u6267\u884C\u7684\u65B9\u5F0F\uFF0C\u8FD8\u53EF\u4F7F\u7528 ",paraId:11,tocIndex:4},{value:"runDerive",paraId:11,tocIndex:4},{value:" \u63A5\u53E3\u4EBA\u5DE5\u89E6\u53D1\u5BF9\u5E94\u7684\u6D3E\u751F\u51FD\u6570",paraId:11,tocIndex:4},{value:`import { runDerive } from 'helux';
const result = derive(() => {
  return numAtom.val + info.c.c1;
});

runDerive(result);
`,paraId:12,tocIndex:4},{value:"\u5F02\u6B65\u4EFB\u52A1\u53EF\u4F7F\u7528",paraId:13},{value:"runDeriveTask",paraId:13},{value:"\u89E6\u53D1\u91CD\u6267\u884C",paraId:13},{value:`import { runDeriveTask } from 'helux'
const result = derive({ task: ... });

runDeriveTask(result);
`,paraId:14},{value:"\u7531\u4E8E ",paraId:15,tocIndex:5},{value:"atom",paraId:15,tocIndex:5},{value:" \u548C ",paraId:15,tocIndex:5},{value:"share",paraId:15,tocIndex:5},{value:" \u8FD4\u56DE\u7684\u5BF9\u8C61\u5929\u751F\u81EA\u5E26\u4F9D\u8D56\u8FFD\u8E2A\u7279\u6027\uFF0C\u5F53\u5171\u4EAB\u5BF9\u8C61 a \u7684\u53D1\u751F\u53D8\u5316\u540E\u9700\u8981\u81EA\u52A8\u5F15\u8D77\u5171\u4EAB\u72B6\u6001 b \u7684\u67D0\u4E9B\u8282\u70B9\u53D8\u5316\u65F6\uFF0C\u53EF\u5B9A\u4E49 ",paraId:15,tocIndex:5},{value:"mutate",paraId:15,tocIndex:5},{value:" \u51FD\u6570\u6765\u5B8C\u6210\u8FD9\u79CD\u53D8\u5316\u7684\u8FDE\u9501\u53CD\u5E94\u5173\u7CFB\uFF0C\u5BF9\u6570\u636E\u505A\u6700\u5C0F\u7C92\u5EA6\u7684\u66F4\u65B0",paraId:15,tocIndex:5},{value:"\u53EA\u4FEE\u6539\u5171\u4EAB\u72B6\u6001\u7684\u5355\u4E2A\u503C\u65F6\uFF0C\u5B9A\u4E49\u4E00\u4E2A ",paraId:16,tocIndex:6},{value:"mutate",paraId:16,tocIndex:6},{value:" \u51FD\u6570\u5373\u53EF",paraId:16,tocIndex:6},{value:`const [numAtom] = atom(3000);

const [finalPriceState] = share(
  { finalPrice: 0, otherInfo: { desc: 'other' } },
  {
    // \u5F53 numAtom \u53D8\u5316\u65F6\uFF0C\u91CD\u8BA1\u7B97 finalPrice \u8282\u70B9\u7684\u503C
    mutate: (draft) => (draft.finalPrice = numAtom.val - 600),
  },
);
`,paraId:17,tocIndex:6},{value:"\u9700\u8981\u54CD\u5E94\u591A\u4E2A\u4E0D\u540C\u4E0A\u6E38\u72B6\u6001\u7684\u503C\u53D8\u5316\uFF0C\u8BA1\u7B97\u591A\u4E2A\u8282\u70B9\u65B0\u503C\u65F6\uFF0C\u5B9A\u4E49 ",paraId:18,tocIndex:7},{value:"mutate",paraId:18,tocIndex:7},{value:" \u4E3A\u5BF9\u8C61\u5373\u53EF",paraId:18,tocIndex:7},{value:`const [priceState] = share({
  base1: 1,
  base2: { forStudent: 1, forTeacher: 2 },
});
const [finalPriceState] = share(
  // \u8FD9\u91CC\u4EC5\u8D1F\u8D23\u5B9A\u4E49\u521D\u59CB\u503C\uFF0C\u53D8\u5316\u89C4\u5219\u89C1 options.mutate \u5B9A\u4E49
  { final1: 0, final2: { student: 0, teacher: 0 } },
  {
    // \u5B9A\u4E49 mutate \u914D\u7F6E\uFF0C\u5B8C\u6210\u76F8\u5173\u7684\u6570\u636E\u53D8\u5316\u76D1\u542C\u548C\u4FEE\u6539\u51FD\u6570\u5B9A\u4E49\uFF0C\u540D\u5B57\u53EF\u6309\u573A\u666F\u5B9A\u4E49\uFF0C\u65B9\u4FBF\u914D\u5408 devtool \u5DE5\u5177\u505A\u53D8\u5316\u8FFD\u8E2A
    mutate: {
      // \u4EC5\u5F53 priceState \u7684 base1 \u53D8\u5316\u65F6\uFF0C\u8BA1\u7B97 finalAtom \u7684 final1 \u503C
      changeFinal1: (draft) => (draft.final1 = priceState.base1 + 20),
      // \u4EC5\u5F53 priceState \u7684 base2.forStudent \u53D8\u5316\u65F6\uFF0C\u8BA1\u7B97 finalAtom \u7684 final2.student \u503C
      changeFinal2: (draft) =>
        (draft.final2.student = priceState.base2.forStudent + 100),
    },
  },
);

function Demo() {
  const [final] = useAtom(finalPriceState);
  // \u5F53 priceState \u7684 base1 \u53D8\u5316\u540E\uFF0C\u4F1A\u6B64\u5904\u91CD\u6E32\u67D3
  return <h1>final.final2.student {final.final2.student}</h1>;
}
`,paraId:19,tocIndex:7},{value:"\u4E5F\u53EF\u5B9A\u4E49 ",paraId:20,tocIndex:7},{value:"mutate",paraId:20,tocIndex:7},{value:" \u4E3A\u6570\u7EC4",paraId:20,tocIndex:7},{value:`{
  mutate: [
    {
      desc: 'changeFinal1',
      fn: (draft) => (draft.final1 = priceState.base1 + 20),
    },
    {
      desc: 'changeFinal2',
      fn: (draft) => (draft.final2.student = priceState.base2.forStudent + 100),
    },
  ];
}
`,paraId:21,tocIndex:7},{value:"\u5982\u5B58\u5728\u5F02\u6B65\u7684\u8BA1\u7B97\u573A\u666F\uFF0C\u5BF9 ",paraId:22,tocIndex:8},{value:"mutate",paraId:22,tocIndex:8},{value:" \u51FD\u6570\u65B0\u589E ",paraId:22,tocIndex:8},{value:"task",paraId:22,tocIndex:8},{value:" \u5F02\u6B65\u8BA1\u7B97\u51FD\u6570\u914D\u7F6E\u5373\u53EF\u3002",paraId:22,tocIndex:8},{value:"\u9996\u6B21\u8BA1\u7B97\u7ED3\u679C\u4E0D\u9700\u8981\u5F02\u6B65\u4EFB\u52A1\u624D\u80FD\u5F97\u51FA\u65F6\uFF0C\u4F9D\u8D56\u53EF\u5728 fn \u91CC\u786E\u5B9A",paraId:23,tocIndex:8},{value:`const [finalPriceState] = share(
  { retA: 0, time: 0 },
  {
    mutate: {
      retA: {
        // \u8BA1\u7B97\u51FA retA \u503C\u5E76\u5199\u5165
        fn: (draft, [a, b]) => (draft.retA = priceState.a + numAtom.val),
        task: async ({ setState }) => {
          // \u9ED8\u8BA4\u9996\u6B21\u4E0D\u6267\u884C
          await delay(1000);
          // some async logic here ...
          setState((draft) => {
            draft.retA = priceState.a + numAtom.val;
          });
        },
      },
    },
  },
);
`,paraId:24,tocIndex:8},{value:"\u9996\u6B21\u8BA1\u7B97\u7ED3\u679C\u9700\u8981\u5F02\u6B65\u4EFB\u52A1\u624D\u80FD\u5F97\u51FA\u65F6\uFF0C\u4F9D\u8D56\u53EF\u5728 deps \u91CC\u786E\u5B9A",paraId:25,tocIndex:8},{value:`const [finalPriceState] = share({ retA: 0, time: 0 }, {
  mutate: {
    retA: {
      // \u5B9A\u4E49\u597D\u4E0A\u6E38\u6570\u636E\u4F9D\u8D56
      deps: [priceState.a , numAtom.val],
      task: async ({ setState }) => { ... },
      // \u89E6\u53D1task\u7ACB\u5373\u6267\u884C\uFF0C\u9ED8\u8BA4\u60C5\u51B5 task \u9996\u6B21\u4E0D\u6267\u884C
      immediate: true,
    },
  },
});
`,paraId:26,tocIndex:8},{value:"deps\u3001fn \u3001task \u53EF\u540C\u65F6\u5B9A\u4E49\uFF0C\u5B58\u5728\u6709 task \u7684\u60C5\u51B5\u4E0B\uFF0C fn \u53EA\u4F1A\u9996\u6B21\u6267\u884C\u4E00\u6B21\uFF0Ctask \u8981\u4E0D\u8981\u6267\u884C\u53D6\u51B3\u4E8E immediate \u503C",paraId:27,tocIndex:8},{value:`const [finalPriceState] = share({ retA: 0, time: 0 }, {
  mutate: {
    retA: {
      // \u5B9A\u4E49\u597D\u4E0A\u6E38\u6570\u636E\u4F9D\u8D56
      deps: [priceState.a , numAtom.val],
      // \u8FD9\u91CC\u901A\u8FC7\u7B2C\u4E8C\u4F4D\u53C2\u6570 input \u53EF\u62FF\u5230 deps \u7684\u8FD4\u56DE\u503C\u5E76\u590D\u7528
      fn: (draft, [a, b]) => draft.retA = a + b,
      task: async ({ setState }) => { ... },
      immediate: true,
    },
  },
});
`,paraId:28,tocIndex:8},{value:"mutate",paraId:29,tocIndex:8},{value:"\u7684\u5F02\u6B65\u6D3E\u751F\u51FD\u6570\u4E5F\u53EF\u5199\u4E3A\u6570\u7EC4\uFF0C\u6570\u7EC4\u91CC\u53EF\u540C\u65F6\u5305\u542B\u540C\u6B65\u8BA1\u7B97\u51FD\u6570\u3001\u5F02\u6B65\u8BA1\u7B97\u51FD\u6570\u3002",paraId:29,tocIndex:8},{value:`const [finalPriceState] = share({ retA: 0, time: 0 }, {
  mutate: [ { fn, desc, task, immediate }, ... ]
});
`,paraId:30,tocIndex:8},{value:"\u4E0A\u8FF0\u4F8B\u5B50\u90FD\u662F\u5728\u5B9A\u4E49",paraId:31,tocIndex:9},{value:"share",paraId:31,tocIndex:9},{value:"\u6216",paraId:31,tocIndex:9},{value:"atom",paraId:31,tocIndex:9},{value:"\u5171\u4EAB\u5BF9\u8C61\u65F6\u540C\u65F6\u5B9A\u4E49\u7684\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\uFF0C\u4E5F\u53EF\u5148\u5B9A\u4E49\u5171\u4EAB\u5BF9\u8C61\uFF0C\u518D\u901A\u8FC7\u9876\u5C42 api ",paraId:31,tocIndex:9},{value:"mutate",paraId:31,tocIndex:9},{value:" \u6216\u5171\u4EAB\u5BF9\u8C61\u4E0A\u4E0B\u6587 api ",paraId:31,tocIndex:9},{value:"mutate",paraId:31,tocIndex:9},{value:" \u5BF9\u5171\u4EAB\u5BF9\u8C61\u5B9A\u4E49",paraId:31,tocIndex:9},{value:"\u53EF\u53D8\u6D3E\u751F",paraId:31,tocIndex:9},{value:"\u901A\u8FC7\u9876\u5C42 api \u5B9A\u4E49",paraId:32,tocIndex:9},{value:"\u53EF\u53D8\u6D3E\u751F",paraId:32,tocIndex:9},{value:`import { atom, share, mutate } from 'helux';

const [baseAtom] = atom(1);
const [numAtom] = atom(3000);
const [obj] = share({ a: 1 });

// \u4E3A atom \u5BF9\u8C61\u521B\u5EFA mutate \u51FD\u6570
mutate(numAtom)({
  fn: (draft) => (draft.val = baseAtom.val + 100),
  desc: 'mutateNumAtomVal',
});

// \u4E3A shared \u5BF9\u8C61\u521B\u5EFA mutate \u51FD\u6570
mutate(obj)({
  fn: (draft) => (draft.a = baseAtom.val + 100),
  desc: 'mutateObjVal',
});
`,paraId:33,tocIndex:9},{value:"\u901A\u8FC7\u5171\u4EAB\u5BF9\u8C61\u4E0A\u4E0B\u6587 api \u5B9A\u4E49",paraId:34,tocIndex:9},{value:"\u53EF\u53D8\u6D3E\u751F",paraId:34,tocIndex:9},{value:`const [numAtom, , numCtx] = atom(3000); // \u8FD4\u56DE\u5143\u7EC4\u4E3A [ atom, setAtom, ctx ]
const [obj, , objCtx] = share({ a: 1 }); // \u8FD4\u56DE\u5143\u7EC4\u4E3A [ shared, setState, ctx ]

// \u4F20\u5165\u7684\u53C2\u6570\u4E00\u6837\uFF0C\u76F8\u6BD4\u9876\u5C42 api\uFF0C\u5C11\u4E86\u4E00\u6B21\u5171\u4EAB\u5BF9\u8C61\u7684\u7ED1\u5B9A
// before: mutate(sharedState)(fnItem)
// after:  ctx.mutate(fnItem)
ctx.mutate({ ... });
objCtx.mutate({ ... });
`,paraId:35,tocIndex:9},{value:"mutate",paraId:36,tocIndex:10},{value:"\u51FD\u6570\u9ED8\u8BA4\u8FD0\u884C\u65F6\u673A\u662F\u57FA\u4E8E\u76D1\u542C\u7684\u6570\u636E\u53D8\u66F4\u540E\u88AB\u89E6\u53D1\u8FD0\u884C\u7684\uFF0C\u4E5F\u652F\u6301\u4EBA\u5DE5\u8C03\u7528\u7684\u65B9\u5F0F\u4E3B\u52A8\u89E6\u53D1\u91CD\u8FD0\u884C",paraId:36,tocIndex:10},{value:"\u89E6\u53D1",paraId:37,tocIndex:10},{value:"options.mutate",paraId:37,tocIndex:10},{value:"\u91CC\u7684\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\u91CD\u8FD0\u884C",paraId:37,tocIndex:10},{value:`import { runMutate, runMutateTask } from 'helux';

// \u89E6\u53D1 someState \u7684 retA mutate \u914D\u7F6E\u7684\u540C\u6B65\u51FD\u6570\uFF0C\u5982\u5B58\u5728\u624D\u4F1A\u6267\u884C
runMutate(someState, 'retA');

// \u89E6\u53D1 someState \u7684 retA mutate \u914D\u7F6E\u7684\u5F02\u6B65\u51FD\u6570\uFF0C\u5982\u5B58\u5728\u624D\u4F1A\u6267\u884C
runMutateTask(someState, 'retA');
`,paraId:38,tocIndex:10},{value:"\u4E5F\u53EF\u4EE5\u57FA\u4E8E ",paraId:39,tocIndex:10},{value:"mutate",paraId:39,tocIndex:10},{value:"\u63A5\u53E3\u8FD4\u56DE\u7684\u5BF9\u8C61\u89E6\u53D1\u91CD\u8FD0\u884C",paraId:39,tocIndex:10},{value:`const witness = mutate(idealPriceState)(fnItem);

// \u547C\u53EB fnItem \u914D\u7F6E\u7684\u540C\u6B65\u51FD\u6570
witness.run();
// \u547C\u53EB fnItem \u914D\u7F6E\u7684\u5F02\u6B65\u51FD\u6570
witness.runTask();
`,paraId:40,tocIndex:10},{value:"derive",paraId:41,tocIndex:11},{value:"\u56DE\u8C03\u91CC\u7684\u4F9D\u8D56\u5FC5\u987B\u63D0\u524D\u58F0\u660E\uFF0C\u4E0D\u80FD\u653E\u5230\u6761\u4EF6\u8BED\u53E5\u91CC\uFF0C\u5426\u5219\u53EF\u80FD\u7167\u6210\u4F9D\u8D56\u4E22\u5931\u3002",paraId:41,tocIndex:11},{value:"\u9519\u8BEF\u793A\u4F8B",paraId:42,tocIndex:11},{value:`const result = derive(() => {
  if( state.x ) return 2;
  return state.y + 1;
});
`,paraId:43,tocIndex:11},{value:"\u6B63\u786E\u793A\u4F8B",paraId:44,tocIndex:11},{value:`const result = derive(() => {
  const { x, y } = state;
  if (x) return 2;
  y + 1;
});
`,paraId:45,tocIndex:11}]},93753:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(56067);const a=[{value:"\u5185\u90E8\u63D0\u4F9B\u4E8B\u4EF6\u603B\u7EBF\u8BA9\u7528\u6237\u53EF\u4EE5\u5168\u5C40\u4F7F\u7528",paraId:0,tocIndex:0},{value:`import { emit } from 'helux';

emit('xxx_event', 1, 2, 3);
`,paraId:1,tocIndex:1},{value:`import { on } from 'helux';

const off = on('xxx_event', (...args) => {
  console.log('received args ', args);
});
off(); // \u53D6\u6D88\u76D1\u542C
`,paraId:2,tocIndex:2},{value:"\u7EC4\u4EF6\u5185\u4F7F\u7528 ",paraId:3,tocIndex:3},{value:"useOnEvent",paraId:3,tocIndex:3},{value:" \u94A9\u5B50\u51FD\u6570\u76D1\u542C\uFF0C\u518D\u7EC4\u4EF6\u9500\u6BC1\u540E\u4F1A\u81EA\u52A8\u53D6\u6D88\u76D1\u542C",paraId:3,tocIndex:3},{value:`import { useOnEvent } from 'helux';

function Demo() {
  useOnEvent('xxx_event', (...args) => {
    console.log('received args ', args);
  });
}
`,paraId:4,tocIndex:3}]},81488:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(20062);const a=[{value:"helux",paraId:0,tocIndex:0},{value:" \u662F\u4E00\u4E2A\u96C6",paraId:0,tocIndex:0},{value:"atom",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"signal",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"\u4F9D\u8D56\u8FFD\u8E2A",paraId:0,tocIndex:0},{value:"\u4E3A\u4E00\u4F53\uFF0C\u652F\u6301\u7EC6\u7C92\u5EA6\u54CD\u5E94\u5F0F\u66F4\u65B0\u7684\u72B6\u6001\u5F15\u64CE\uFF0C\u517C\u5BB9\u6240\u6709\u7C7B react \u5E93\uFF0C\u5305\u62EC react18\u3002",paraId:0,tocIndex:0},{value:"\u76F8\u6BD4\u73B0\u9636\u6BB5\u5F00\u6E90\u793E\u533A\u8F83\u51FA\u540D\u7684\u72B6\u6001\u7BA1\u7406\u5E93\uFF08",paraId:1,tocIndex:0},{value:"redux",paraId:1,tocIndex:0},{value:"\uFF0C",paraId:1,tocIndex:0},{value:"recoil",paraId:1,tocIndex:0},{value:"\uFF0C",paraId:1,tocIndex:0},{value:"jotai",paraId:1,tocIndex:0},{value:"\uFF0C",paraId:1,tocIndex:0},{value:"zustand",paraId:1,tocIndex:0},{value:"\uFF0C",paraId:1,tocIndex:0},{value:"mobx",paraId:1,tocIndex:0},{value:"\u7B49\uFF09\uFF0C\u5B83\u62E5\u6709\u4EE5\u4E0B\u4F18\u52BF",paraId:1,tocIndex:0},{value:"\u5185\u7F6E\u4F9D\u8D56\u8FFD\u8E2A\u7279\u6027\uFF0C\u57FA\u4E8E\u6700\u5FEB\u7684\u4E0D\u53EF\u53D8 js \u5E93",paraId:2,tocIndex:0},{value:"limu",paraId:2,tocIndex:0},{value:"\u5F00\u53D1\uFF0C\u62E5\u6709\u8D85\u5F3A\u6027\u80FD",paraId:2,tocIndex:0},{value:"atom",paraId:2,tocIndex:0},{value:" \u652F\u6301\u4EFB\u610F\u6570\u636E\u7ED3\u6784\u4E14\u81EA\u5E26\u4F9D\u8D56\u6536\u96C6\u529F\u80FD\uFF0C \u65E0\u9700\u62C6\u5206\u5F88\u7EC6\uFF0C\u5929\u7136\u5BF9 DDD \u9886\u57DF\u9A71\u52A8\u8BBE\u8BA1\u53CB\u597D",paraId:2,tocIndex:0},{value:"\u5185\u7F6E ",paraId:2,tocIndex:0},{value:"signal",paraId:2,tocIndex:0},{value:" \u54CD\u5E94\u673A\u5236\uFF0C\u5B9E\u73B0 0 hook \u7F16\u7801 dom \u7C92\u5EA6\u6216\u5757\u7C92\u5EA6\u7684\u66F4\u65B0",paraId:2,tocIndex:0},{value:"\u5185\u7F6E ",paraId:2,tocIndex:0},{value:"loading",paraId:2,tocIndex:0},{value:" \u6A21\u5757\uFF0C\u53EF\u7BA1\u7406\u6240\u6709\u5F02\u6B65\u4EFB\u52A1\u7684\u8FD0\u884C\u72B6\u6001\u3001\u5E76\u6355\u6349\u9519\u8BEF\u629B\u7ED9\u7EC4\u4EF6\u3001\u63D2\u4EF6",paraId:2,tocIndex:0},{value:"\u5185\u7F6E ",paraId:2,tocIndex:0},{value:"sync",paraId:2,tocIndex:0},{value:" \u7CFB\u5217 api\uFF0C\u652F\u6301",paraId:2,tocIndex:0},{value:"\u53CC\u5411\u7ED1\u5B9A",paraId:2,tocIndex:0},{value:"\uFF0C\u8F7B\u677E\u5E94\u5BF9\u8868\u5355\u5904\u7406",paraId:2,tocIndex:0},{value:"\u5185\u7F6E ",paraId:2,tocIndex:0},{value:"reactive",paraId:2,tocIndex:0},{value:" \u54CD\u5E94\u5F0F\u5BF9\u8C61\uFF0C\u652F\u6301\u6570\u636E\u53D8\u66F4\u76F4\u63A5\u9A71\u52A8\u5173\u8054 ui \u6E32\u67D3",paraId:2,tocIndex:0},{value:"\u5185\u7F6E ",paraId:2,tocIndex:0},{value:"define",paraId:2,tocIndex:0},{value:" \u7CFB\u5217 api\uFF0C\u65B9\u4FBF\u5BF9\u72B6\u6001\u6A21\u5757\u5316\u62BD\u8C61\uFF0C\u8F7B\u677E\u9A7E\u9A6D\u5927\u578B\u524D\u7AEF\u5E94\u7528\u67B6\u6784",paraId:2,tocIndex:0},{value:"\u5185\u7F6E\u4E8B\u4EF6\u7CFB\u7EDF",paraId:2,tocIndex:0},{value:"\u652F\u6301\u53EF\u53D8\u6D3E\u751F\uFF0C\u9002\u7528\u4E8E\u5F53\u5171\u4EAB\u5BF9\u8C61 a \u90E8\u5206\u8282\u70B9\u53D8\u5316\u9700\u5F15\u8D77\u5176\u4ED6\u8282\u70B9\u81EA\u52A8\u53D8\u5316\u7684\u573A\u666F\uFF0C\u6570\u636E\u66F4\u65B0\u7C92\u5EA6\u66F4\u5C0F",paraId:2,tocIndex:0},{value:"\u652F\u6301\u5168\u91CF\u6D3E\u751F\uFF0C\u9002\u7528\u4E8E\u4E0D\u9700\u8981\u5BF9\u6570\u636E\u505A\u7EC6\u7C92\u5EA6\u66F4\u65B0\u7684\u573A\u666F",paraId:2,tocIndex:0},{value:"\u5168\u91CF\u6D3E\u751F\u3001\u53EF\u53D8\u6D3E\u751F\u5747\u652F\u6301\u5F02\u6B65\u4EFB\u52A1",paraId:2,tocIndex:0},{value:"\u5168\u91CF\u6D3E\u751F\u3001\u53EF\u53D8\u6D3E\u751F\u9664\u6570\u636E\u53D8\u66F4\u9A71\u52A8\u6267\u884C\u5916\uFF0C\u8FD8\u652F\u6301\u4EBA\u5DE5\u91CD\u65B0\u89E6\u53D1\u8FD0\u884C",paraId:2,tocIndex:0},{value:"\u652F\u6301\u4E2D\u95F4\u4EF6\u3001\u63D2\u4EF6\u7CFB\u7EDF\uFF0C\u53EF\u65E0\u7F1D\u5BF9\u63A5 redux \u751F\u6001\u76F8\u5173\u5DE5\u5177\u5E93",paraId:2,tocIndex:0},{value:"100% ts \u7F16\u7801\uFF0C\u7C7B\u578B\u5B89\u5168",paraId:2,tocIndex:0}]},56182:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(28712);const a=[{value:`npm i helux
# pnpm i helux
# yarn add helux
`,paraId:0,tocIndex:1},{value:"\u6765\u81EA unpkg\uFF0C\u6539\u53D8\u7248\u672C\u53F7\u67E5\u770B",paraId:1,tocIndex:2},{value:"\u5176\u4ED6\u4EA7\u7269",paraId:1,tocIndex:2},{value:`<script src="https://unpkg.com/helux@3.6.3/dist/index.global.js"><\/script>
`,paraId:2,tocIndex:2},{value:"\u6765\u81EA jsdelivr\uFF0C\u6539\u53D8\u7248\u672C\u53F7\u67E5\u770B",paraId:3,tocIndex:2},{value:"\u5176\u4ED6\u4EA7\u7269",paraId:3,tocIndex:2},{value:`<script src="https://cdn.jsdelivr.net/npm/helux@3.6.3/dist/index.global.js"><\/script>
`,paraId:4,tocIndex:2},{value:"\u5185\u90E8\u7CFB\u7EDF\u5EFA\u8BAE\u590D\u5236\u5230\u81EA\u5DF1\u7684 cdn \u670D\u52A1\u7BA1\u7406\uFF0C\u4E0D\u8981\u4F9D\u8D56\u516C\u7F51 cdn \u63D0\u4F9B\u7684\u8D44\u6E90\u3002",paraId:5}]},18460:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(68083);const a=[{value:"\u4E2D\u95F4\u4EF6\u662F\u4E00\u4E2A\u540C\u6B65\u51FD\u6570\uFF0C\u5728\u72B6\u6001\u63D0\u4EA4\u524D\u88AB\u8C03\u7528\uFF0C\u53EF\u901A\u8FC7\u4E2D\u95F4\u4EF6\u51FD\u505A\u4E00\u4E9B\u7EDF\u4E00\u64CD\u4F5C\uFF0C\u4F8B\u5982\u6570\u4FEE\u6539\u8349\u7A3F\u7684\u65F6\u95F4\u5C5E\u6027",paraId:0,tocIndex:0},{value:`import { Middleware } from 'helux';

const markTimeMiddleWare: Middleware = (params) => {
  const { sharedKey, moduleName, draft } = params;
  draft.time = Date.now();
};
`,paraId:1,tocIndex:1},{value:`import { addMiddleware } from 'helux';

addMiddleware(markTimeMiddleWare);
`,paraId:2,tocIndex:2}]},9956:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(92632);const a=[{value:"\u6A21\u578B\u5BF9\u8C61\u76F8\u5BF9",paraId:0,tocIndex:0},{value:"\u6A21\u5757\u5316",paraId:1,tocIndex:0},{value:"\u8981\u8F7B\u91CF\u4E00\u4E9B\uFF0C\u9002\u5408\u5904\u7406\u8F83\u5C0F\u529F\u80FD\u5355\u65F6\u805A\u5408\u7BA1\u7406\u76F8\u5173\u72B6\u6001\u4E0E\u64CD\u4F5C\uFF0C\u63D0\u4F9B",paraId:0,tocIndex:0},{value:"model",paraId:0,tocIndex:0},{value:"\u548C",paraId:0,tocIndex:0},{value:"modelFactory",paraId:0,tocIndex:0},{value:"\u6765\u5FEB\u901F\u5B8C\u6210\u6B64\u64CD\u4F5C",paraId:0,tocIndex:0},{value:"model",paraId:2,tocIndex:1},{value:" \u51FD\u6570\u56DE\u8C03\u63D0\u4F9B\u4E00\u4E2A",paraId:2,tocIndex:1},{value:"api",paraId:2,tocIndex:1},{value:"\u5BF9\u8C61\uFF0C\u5305\u542B\u4E86\u5927\u90E8\u5206",paraId:2,tocIndex:1},{value:"helux",paraId:2,tocIndex:1},{value:"\u9876\u5C42 api \u63A5\u53E3\uFF0C\u53EF\u4EE5\u4F7F\u7528\u6B64\u5BF9\u8C61\u6765\u751F\u6210\u4E1A\u52A1\u6A21\u578B\u5BF9\u8C61",paraId:2,tocIndex:1},{value:`import 'model' from 'helux';

const userModel = model((api) => {
  // api\u5BF9\u8C61 \u6709\u8BE6\u7EC6\u7684\u7C7B\u578B\u63D0\u793A
  const userCtx = api.shareState({ a: 1, b: 2 });
  const { state, setState } = userCtx;
  const someResult = api.deriveAtom(() => state.a + 100);

  function changeA() {
    setState((draft) => {
      draft.a += 1;
    });
  }

  return {
    changeA,
    state,
    someResult,
    setState,
  };
});
`,paraId:3,tocIndex:1},{value:"\u63D0\u4F9B\u66F4\u9AD8\u9636\u7684 ",paraId:4,tocIndex:2},{value:"modelFactory",paraId:4,tocIndex:2},{value:" \u51FD\u6570\uFF0C\u5E2E\u52A9\u7528\u6237\u521B\u5EFA\u53EF\u514B\u9686\u4F7F\u7528\u7684 model \u5DE5\u5382\u51FD\u6570\uFF0C\u505A\u5230\u903B\u8F91\u590D\u7528\u4F46\u72B6\u6001\u9694\u79BB\u7684\u6548\u679C",paraId:4,tocIndex:2},{value:`import 'modelFactory' from 'helux';

const factory = modelFactory((api, extra) => {
  const userCtx = api.shareState({ a: 1, b: 2 }, { moduleName: extra });
  const { state, setState } = userCtx;
  const someResult = api.deriveAtom(() => state.a + 100);

  function changeA() {
    setState((draft) => {
      draft.a += 1;
    });
  }

  return {
    changeA,
    state,
    someResult,
    setState,
  };
});
const model1 = factory.build('Model1');
const model2 = factory.build('Model2');
`,paraId:5,tocIndex:2}]},15893:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(94030);const a=[{value:"\u5C3D\u7BA1",paraId:0,tocIndex:0},{value:"atom",paraId:0,tocIndex:0},{value:"\u5171\u4EAB\u4E0A\u4E0B\u6587\u63D0\u4F9B\u4E86",paraId:0,tocIndex:0},{value:"action",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"derive",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"mutate",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"userState",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"userActionLoading",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"userMutateLoading",paraId:0,tocIndex:0},{value:"\u7B49\u4E00\u7CFB\u5217 api \u65B9\u4FBF\u7528\u6237\u4F7F\u7528\u5404\u9879\u529F\u80FD\uFF0C\u4F46\u8FD9\u4E9B api \u6BD4\u8F83\u96F6\u788E\uFF0C\u5904\u7406\u5927\u578B\u524D\u7AEF\u5E94\u7528\u65F6\u7528\u6237\u66F4\u5E0C\u671B\u9762\u5411\u9886\u57DF\u6A21\u578B\u5BF9\u72B6\u6001\u7684",paraId:0,tocIndex:0},{value:"state",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"derive",paraId:0,tocIndex:0},{value:"\u3001",paraId:0,tocIndex:0},{value:"action",paraId:0,tocIndex:0},{value:"\u5EFA\u6A21\uFF0C\u6545\u5171\u4EAB\u4E0A\u4E0B\u6587\u8FD8\u63D0\u4F9B",paraId:0,tocIndex:0},{value:"define",paraId:0,tocIndex:0},{value:"\u7CFB\u5217 api \u6765\u8F7B\u677E\u9A7E\u9A6D\u6B64\u7C7B\u573A\u666F\u3002",paraId:0,tocIndex:0},{value:"\u4E3A\u4E86\u5F00\u53D1\u8005\u5DE5\u5177\u80FD\u591F\u67E5\u770B",paraId:1,tocIndex:0},{value:"\u6A21\u5757\u5316",paraId:1,tocIndex:0},{value:"\u76F8\u5173\u53D8\u66F4\u52A8\u4F5C\u8BB0\u5F55\uFF0C\u914D\u7F6E",paraId:1,tocIndex:0},{value:"moduleName",paraId:1,tocIndex:0},{value:"\u5373\u53EF",paraId:1,tocIndex:0},{value:`atom({ name: 'helux', age: 1 }, { moduleName: 'user' });
`,paraId:2,tocIndex:0},{value:"\u6279\u91CF\u5B9A\u4E49\u72B6\u6001\u5BF9\u5E94\u7684\u4FEE\u6539\u51FD\u6570\uFF0C\u8FD4\u56DE ",paraId:3,tocIndex:2},{value:"{ actions, eActions, getLoading, useLoading, useLoadingInfo }",paraId:3,tocIndex:2},{value:"\uFF0C \u7EC4\u4EF6\u4E2D\u53EF\u901A\u8FC7 useLoading \u8BFB\u53D6\u5F02\u6B65\u51FD\u6570\u7684\u6267\u884C\u4E2D\u72B6\u6001 loading\u3001\u662F\u5426\u6B63\u5E38\u6267\u884C\u7ED3\u675F ok\u3001\u4EE5\u53CA\u6267\u884C\u51FA\u73B0\u7684\u9519\u8BEF err\uFF0C \u5176\u4ED6\u5730\u65B9\u53EF\u901A\u8FC7 getLoading \u83B7\u53D6",paraId:3,tocIndex:2},{value:`// \u3010\u53EF\u9009\u3011\u7EA6\u675F\u5404\u4E2A\u51FD\u6570\u5165\u53C2 payload \u7C7B\u578B
type Payloads = {
  changeA1: number;
  foo: boolean | undefined;
  // \u4E0D\u5F3A\u5236\u8981\u6C42\u4E3A\u6BCF\u4E00\u4E2Aaction key \u90FD\u5B9A\u4E49 payload \u7C7B\u578B\u7EA6\u675F\uFF0C\u4F46\u4E3A\u4E86\u53EF\u7EF4\u62A4\u6027\u5EFA\u8BAE\u90FD\u8865\u4E0A
};

// \u4E0D\u7EA6\u675F payloads \u7C7B\u578B\u65F6\u5199\u4E3A ctx.defineActions()({ ... });
const { actions, eActions, useLoading, getLoading } =
  ctx.defineActions<Payloads>()({
    // \u540C\u6B65 action\uFF0C\u76F4\u63A5\u4FEE\u6539\u8349\u7A3F
    changeA1({ draft, payload }) {
      draft.a.b.c += payload;
    },
    // \u540C\u6B65 action\uFF0C\u8FD4\u56DE\u7ED3\u679C
    changeA2({ draft, payload }) {
      draft.a.b.c += payload;
      return true;
    },
    // \u540C\u6B65 action\uFF0C\u76F4\u63A5\u4FEE\u6539\u8349\u7A3F\u6DF1\u8282\u70B9\u6570\u636E\uFF0C\u4F7F\u7528 merge \u4FEE\u6539\u6D45\u8282\u70B9\u6570\u636E
    changeA3({ draft, payload, merge }) {
      draft.a.b.c += payload;
      merge({ c: 'new desc' }); // \u7B49\u6548\u4E8E draft.c = 'new desc';
      return true;
    },
    // \u5F02\u6B65 action\uFF0C\u76F4\u63A5\u4FEE\u6539\u8349\u7A3F
    async foo1({ draft, payload }) {
      await delay(3000);
      draft.a.b.c += 1000;
    },
    // \u5F02\u6B65 action\uFF0C\u591A\u6B21\u76F4\u63A5\u4FEE\u6539\u8349\u7A3F\uFF0C\u5408\u5E76\u4FEE\u6539\u591A\u4E2A\u72B6\u6001\uFF0C\u540C\u65F6\u8FD4\u56DE\u4E00\u4E2A\u7ED3\u679C
    async foo2({ draft, payload, merge }) {
      draft.a.b.c += 1000;
      await delay(3000); // \u8FDB\u5165\u4E0B\u4E00\u6B21\u4E8B\u4EF6\u5FAA\u73AF\u89E6\u53D1\u8349\u7A3F\u63D0\u4EA4
      draft.a.b.c += 1000;
      await delay(3000); // \u518D\u6B21\u8FDB\u5165\u4E0B\u4E00\u6B21\u4E8B\u4EF6\u5FAA\u73AF\u89E6\u53D1\u8349\u7A3F\u63D0\u4EA4
      const { list, total } = await fetchList();
      merge({ list, total }); // \u7B49\u4EF7\u4E8E draft.list = list, draft.tatal = total
      return true;
    },
  });
`,paraId:4,tocIndex:2},{value:"\u591A\u4E2A action \u7EC4\u5408\u4E3A\u4E00\u4E2A\u65B0\u7684 action",paraId:5,tocIndex:2},{value:`const { actions, eActions, useLoading, getLoading } =
  ctx.defineActions<Payloads>()({
    foo() {},
    bar() {},
    baz() {
      actions.foo();
      actions.bar();
    },
  });
`,paraId:6,tocIndex:2},{value:"\u8C03\u7528 ",paraId:7,tocIndex:2},{value:"actions.xxx",paraId:7,tocIndex:2},{value:" \u6267\u884C\u4FEE\u6539\u52A8\u4F5C\uFF0Cactions \u65B9\u6CD5\u8C03\u7528\u53EA\u8FD4\u56DE\u7ED3\u679C\uFF0C\u5982\u51FA\u73B0\u5F02\u5E38\u5219\u629B\u51FA\uFF0C\u540C\u65F6\u4E5F\u4F1A\u53D1\u9001\u7ED9\u63D2\u4EF6\u548C\u4F34\u751F loading \u72B6\u6001",paraId:7,tocIndex:2},{value:`// \u8C03\u7528\u540C\u6B65action\u51FD\u6570
const result = actions.changeA([1, 1]);

// \u8C03\u7528\u5F02\u6B65action\u51FD\u6570
actions.foo2().then(console.log);
`,paraId:8,tocIndex:2},{value:"\u5982\u5B89\u88C5\u4E86[helux-devtool \u63D2\u4EF6]\uFF0C\u53EF\u89C2\u5BDF\u5230 action \u63D0\u4EA4\u8BB0\u5F55\uFF0C\u53EF\u5F88\u65B9\u4FBF\u5730\u5BF9\u72B6\u6001\u53D8\u66F4\u5386\u53F2\u505A\u56DE\u6EAF",paraId:9},{value:"\u8C03\u7528 ",paraId:10},{value:"eActions.xxx",paraId:10},{value:" \u6267\u884C\u4FEE\u6539\u52A8\u4F5C\uFF0CeActions \u65B9\u6CD5\u8C03\u7528\u53EA\u8FD4\u56DE\u7ED3\u679C\u5F62\u5982",paraId:10},{value:"{result, snap, err}",paraId:10},{value:"\uFF0C\u9ED8\u8BA4\u4E0D\u629B\u51FA\u5F02\u5E38\uFF0C\u51FA\u73B0\u5F02\u5E38\u4F1A\u540C\u65F6\u53D1\u9001\u7ED9\u63D2\u4EF6\u548C\u4F34\u751F loading \u72B6\u6001\uFF0C\u5E76\u8D4B\u7ED9\u8FD4\u56DE\u5BF9\u8C61\u91CC\u7684",paraId:10},{value:"err",paraId:10},{value:"\u5C5E\u6027\u3002",paraId:10},{value:`const { result, snap, err } = eActions.changeA([1, 1]);
if (err) {
  // handle err
}
`,paraId:11},{value:"\u8C03\u7528 ",paraId:12},{value:"eActions.xxx",paraId:12},{value:" \u5E76\u629B\u51FA\u51FA\u73B0\u7684\u5F02\u5E38",paraId:12},{value:`// \u6B64\u65F6\u9519\u8BEF\u65E2\u53D1\u7ED9\u63D2\u4EF6\u548C\u4F34\u751Floading\u72B6\u6001\uFF0C\u4E5F\u5411\u4E0A\u629B\u51FA\uFF0C\u7528\u6237\u9700\u81EA\u5DF1 catch
try {
  const { result, snap } = eActions.changeA([1, 1], true);
} catch (err) {
  // handle err
}
`,paraId:13},{value:"\u7EC4\u4EF6\u4E2D\u4F7F\u7528 ",paraId:14},{value:"useLoading",paraId:14},{value:" \u83B7\u53D6\u5404\u4E2A action \u51FD\u6570\u7684\u6267\u884C\u72B6\u6001 ",paraId:14},{value:"{loading, ok, err}",paraId:14},{value:`function Demo() {
  // \u83B7\u5F97 foo bar baz 3 \u4E2A ation \u51FD\u6570\u7684\u6267\u884C\u72B6\u6001
  const { foo, bar, baz } = useLoading();
}
`,paraId:15},{value:"\u7EC4\u4EF6\u4E2D\u4F7F\u7528 ",paraId:16},{value:"getLoading",paraId:16},{value:" \u83B7\u53D6\u5404\u4E2A action \u51FD\u6570\u7684\u6267\u884C\u72B6\u6001 ",paraId:16},{value:"{loading, ok, err}",paraId:16},{value:`// \u83B7\u5F97 foo bar baz 3 \u4E2A ation \u51FD\u6570\u7684\u6267\u884C\u72B6\u6001
const { foo, bar, baz } = getLoading();
`,paraId:17},{value:"\u70B9\u51FB 2 \u6B21 changeC1 \u6309\u94AE\u540E\uFF0C\u89E6\u53D1\u7EC4\u4EF6\u5C55\u793A\u5F02\u6B65 action \u51FD\u6570\u91CC\u7684\u9519\u8BEF\u4FE1\u606F",paraId:18},{value:"\u6279\u91CF\u5B9A\u4E49\u72B6\u6001\u5BF9\u5E94\u7684\u5168\u91CF\u6D3E\u751F\u51FD\u6570\uFF0C\u8FD4\u56DE\u7ED3\u679C\u5F62\u5982",paraId:19,tocIndex:3},{value:"{ result, helper: { [key]: runDeriveFn, runDeriveTask, useDerived, useDerivedInfo } }",paraId:19,tocIndex:3},{value:`type DR = {
  a: { result: number };
  c: { deps: [number, string]; result: number };
  // \u4E0D\u5F3A\u5236\u8981\u6C42\u4E3A\u6BCF\u4E00\u4E2A result key \u90FD\u5B9A\u4E49 deps \u8FD4\u56DE\u7C7B\u578B\u7EA6\u675F\u548C result \u7C7B\u578B\u7EA6\u675F\uFF0C\u4F46\u4E3A\u4E86\u53EF\u7EF4\u62A4\u6027\u5EFA\u8BAE\u90FD\u8865\u4E0A
};

const df = ctx.defineFullDerive<DR>()({
  a: () => priceState.a.b.c + 10000,
  b: () => priceState.a.b.c + 20000,
  c: {
    // DR['c']['result'] \u5C06\u7EA6\u675F\u6B64\u5904\u7684 deps \u8FD4\u56DE\u7C7B\u578B
    deps: () => [priceState.a.b1.c1, priceState.info.name],
    fn: () => 1,
    async task(params) {
      const [c1, name] = params.input; // \u83B7\u5F97\u7C7B\u578B\u63D0\u793A
      await delay(2000);
      return 1 + c1;
    },
  },
});
`,paraId:20,tocIndex:3},{value:"\u91CD\u65B0\u8FD0\u884C\u540C\u6B65\u6D3E\u751F\u51FD\u6570",paraId:21,tocIndex:3},{value:`df.helper.a.runDeriveFn();
`,paraId:22,tocIndex:3},{value:"\u91CD\u65B0\u8FD0\u884C\u5F02\u6B65\u6D3E\u751F\u51FD\u6570",paraId:23,tocIndex:3},{value:`df.helper.a.runDeriveTask();
`,paraId:24,tocIndex:3},{value:"\u7EC4\u4EF6\u5916\u8BFB\u53D6\u5168\u91CF\u6D3E\u751F\u7ED3\u679C",paraId:25,tocIndex:3},{value:"\u7ED3\u679C\u5747\u5DF2\u81EA\u52A8\u62C6\u7BB1",paraId:26},{value:`console.log(df.result.a); // number
console.log(df.result.b); // number
console.log(df.result.c); // number
`,paraId:27},{value:"\u7EC4\u4EF6\u4E2D\u8BFB\u53D6\u5168\u91CF\u6D3E\u751F\u7ED3\u679C\uFF0C\u5E76\u8BFB\u53D6\u5F02\u6B65\u6D3E\u751F\u4EFB\u52A1\u7684\u6267\u884C\u72B6\u6001",paraId:28},{value:`function Price() {
  const [price, , info] = ctx.useState();
  const a = df.helper.a.useDerived();
  const [c, status] = df.helper.c.useDerivedInfo();

  return (
    <div>
      {price.a.b.c}
      <h3>derived a: {a}</h3>
      <h3>
        derived c: {c} {status.loading ? 'loading...' : ''}
      </h3>
    </div>
  );
}
`,paraId:29},{value:"\u70B9\u51FB 2 \u6B21 changeC1 \u6309\u94AE\u540E\uFF0C\u89E6\u53D1\u7EC4\u4EF6\u5C55\u793A\u5F02\u6B65\u6D3E\u751F\u51FD\u6570\u91CC\u7684\u9519\u8BEF\u4FE1\u606F",paraId:30},{value:"\u6279\u91CF\u5B9A\u4E49\u72B6\u6001\u5BF9\u5E94\u7684\u81EA\u6211\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\uFF0C\u8FD4\u56DE\u7ED3\u679C\u5F62\u5982",paraId:31,tocIndex:4},{value:"{ witnessDict, getLoading, useLoading, useLoadingInfo }",paraId:31,tocIndex:4},{value:"\u81EA\u6211\u53EF\u53D8\u6D3E\u751F\u9700\u8981\u6CE8\u610F\u4FEE\u6539\u5173\u7CFB\uFF0C\u5426\u5219\u4F1A\u5F15\u8D77\u6B7B\u5FAA\u73AF\uFF0C\u5185\u90E8\u4F1A\u5C3D\u529B\u62E6\u4F4F\u6B7B\u5FAA\u73AF\u5E76\u7ED9\u7528\u6237\u63D0\u793A",paraId:32},{value:`const ctx = sharex(
  {
    a: { b: { c: 1 }, b1: { c1: 1 } },
    info: { name: 'helux', extraName: 'helux cool' },
  },
  { moduleName: 'deriveM' },
);
const { state } = ctx;

const dm = ctx.defineMutateSelf()({
  // a.b.c \u53D8\u5316\u540E\uFF0C\u4FEE\u6539 a.b1.c1
  toBeDrive: (draft, { state }) => {
    draft.a.b1.c1 = state.a.b.c + 1000;
  },
  changeB: {
    // \u901A\u8FC7 deps \u663E\u793A\u5B9A\u4E49\u4F9D\u8D56
    deps: () => [state.info.name],
    async task({ draft, input }) {
      await delay(1000);
      draft.info.extraName = \`\${input[0]}_\${Date.now()}\`;
    },
  },
});
`,paraId:33},{value:"\u5168\u65B0\u5B9A\u4E49\u4E00\u4E2A\u72B6\u6001\u5BF9\u8C61\u5E76\u5BF9\u5176\u6279\u91CF\u5B9A\u4E49\u6D3E\u751F\u51FD\u6570\uFF0C\u8FD9\u4E9B\u51FD\u6570\u7684\u8BA1\u7B97\u4F9D\u8D56\u6E90\u53EF\u4EE5\u662F\u5F53\u524D",paraId:34,tocIndex:5},{value:"ctx.state",paraId:34,tocIndex:5},{value:"\u4E5F\u53EF\u4EE5\u662F\u5176\u4ED6\u72B6\u6001\uFF0C\u8FD4\u56DE\u7ED3\u679C\u5F62\u5982",paraId:34,tocIndex:5},{value:"{ derivedState, useDerivedState, witnessDict, getLoading, useLoading, useLoadingInfo }",paraId:34,tocIndex:5},{value:`import { sharex } from 'helux';

const ctx = sharex(
  {
    a: { b: { c: 1 }, b1: { c1: 1 } },
    info: { name: 'helux', extraName: 'helux cool' },
  },
  { moduleName: 'deriveM' },
);
const { state } = ctx;

const dm = ctx.defineMutateDerive({
  a: 1,
  b: '2',
  c: 3,
})({
  // a.b.c \u53D8\u5316\u4FEE\u6539 newState.a
  changeA: (draft) => (draft.a = state.a.b.c + 100),
  changeB: {
    // name \u53D8\u5316\u4FEE\u6539 newState.b
    deps: () => [state.info.name],
    async task(params) {
      await delay(1000);
      params.draft.b = state.info.name + 'ccc';
    },
  },
});
`,paraId:35,tocIndex:5},{value:"\u70B9\u51FB changeC\uFF0C\u89E6\u53D1 a \u53D8\u5316\uFF0C\u70B9\u51FB changeName\uFF0C\u89E6\u53D1 b \u53D8\u5316",paraId:36},{value:"\u5F53",paraId:37,tocIndex:6},{value:"defineActions",paraId:37,tocIndex:6},{value:"\uFF0C",paraId:37,tocIndex:6},{value:"defineFullDerive",paraId:37,tocIndex:6},{value:"\uFF0C",paraId:37,tocIndex:6},{value:"defineMutateSelf",paraId:37,tocIndex:6},{value:"\uFF0C",paraId:37,tocIndex:6},{value:"defineMutateDerive",paraId:37,tocIndex:6},{value:"\u6279\u91CF\u5B9A\u4E49\u7684\u51FD\u6570\u8FC7\u591A\u65F6\uFF0C\u5EFA\u8BAE\u5C06\u5176\u5206\u6563\u5230\u5404\u4E2A\u6587\u4EF6\u72EC\u7ACB\u7EF4\u62A4\uFF0C\u9876\u5C42\u76EE\u5F55\u7EDF\u4E00\u5BFC\u51FA\u7ED9\u4E0A\u5C42\u4F7F\u7528\uFF0C\u8FD9\u6837\u6709\u5229\u4E8E\u7EF4\u62A4\u548C\u6269\u5C55\u3002",paraId:37,tocIndex:6},{value:"\u63A8\u8350\u591A\u6587\u4EF6\u4EE3\u7801\u76EE\u5F55\u7ED3\u6784\u5982\u4E0B",paraId:38,tocIndex:6},{value:`
  `,paraId:39},{value:`
    `,paraId:40},{value:`
      modules
      `,paraId:40},{value:"\u6A21\u5757\u6839\u76EE\u5F55",paraId:40},{value:`
      `,paraId:40},{value:`
        `,paraId:41},{value:`
          user
          `,paraId:41},{value:"\u7528\u6237\u4FE1\u606F",paraId:41},{value:`
          `,paraId:41},{value:`
            `,paraId:42},{value:"index.ts",paraId:42},{value:"\u5BFC\u51FA\u6A21\u5757\u6570\u636E",paraId:42},{value:`
            `,paraId:42},{value:"actions",paraId:42},{value:"\u3010\u53EF\u9009\u3011\u52A8\u4F5C\u51FD\u6570",paraId:42},{value:`
            `,paraId:42},{value:"deriveFull",paraId:42},{value:"\u3010\u53EF\u9009\u3011\u5168\u91CF\u6D3E\u751F",paraId:42},{value:`
            `,paraId:42},{value:"deriveMutate",paraId:42},{value:"\u3010\u53EF\u9009\u3011\u53EF\u53D8\u6D3E\u751F",paraId:42},{value:`
            `,paraId:42},{value:"deriveSelf",paraId:42},{value:"\u3010\u53EF\u9009\u3011\u81EA\u6211\u53EF\u53D8\u6D3E\u751F",paraId:42},{value:`
            `,paraId:42},{value:"mutateState",paraId:42},{value:"\u3010\u53EF\u9009\u3011\u53EF\u53D8\u6D3E\u751F\u5BF9\u5E94\u5BBF\u4E3B\u72B6\u6001",paraId:42},{value:`
            `,paraId:42},{value:"state",paraId:42},{value:"\u3010\u5FC5\u987B\u3011\u6A21\u5757\u5BF9\u5E94\u72B6\u6001",paraId:42},{value:`
          `,paraId:42},{value:`
        `,paraId:41},{value:`
        `,paraId:41},{value:"other-module",paraId:41},{value:"\u5176\u4ED6\u4E1A\u52A1\u6A21\u5757...",paraId:41},{value:`
      `,paraId:41},{value:`
    `,paraId:40},{value:`
    `,paraId:40},{value:`
      pages`,paraId:40},{value:"\u9875\u9762\u7EC4\u4EF6",paraId:40},{value:`
      `,paraId:40},{value:`
         `,paraId:43},{value:"page-foo",paraId:43},{value:"\u9875\u97621",paraId:43},{value:`
      `,paraId:43},{value:`
    `,paraId:40},{value:`
    `,paraId:40},{value:`
      components
      `,paraId:40},{value:"\u516C\u5171\u7EC4\u4EF6\u76EE\u5F55",paraId:40},{value:`
      `,paraId:40},{value:`
    `,paraId:40},{value:`
    `,paraId:40},{value:`
      ...
      `,paraId:40},{value:"\u5176\u4ED6\u76EE\u5F55",paraId:40},{value:`
      `,paraId:40},{value:`
    `,paraId:40},{value:`
  `,paraId:40},{value:"index.ts",paraId:44,tocIndex:7},{value:"\u5BFC\u51FA\u76EE\u5F55\u5982\u4E0B",paraId:44,tocIndex:7},{value:`import * as actions from './actions'; // action \u51FD\u6570\u5B9A\u4E49
import * as deriveFull from './deriveFull'; // \u5168\u91CF\u6D3E\u751F\u7ED3\u679C\u5B9A\u4E49
import * as deriveMutate from './deriveMutate'; // \u65B0\u5BF9\u8C61\u6765\u53EF\u53D8\u6D3E\u751F\u7ED3\u679C\u5B9A\u4E49
import * as deriveSelf from './deriveSelf'; // \u81EA\u6211\u53EF\u53D8\u6D3E\u751F\u7ED3\u679C\u5B9A\u4E49
import { mutateStateFn } from './mutateState';
import { ctx } from './state';

// ctx \u4E8C\u6B21\u5BFC\u51FA
export { ctx } from './state';
// action \u5BF9\u8C61\uFF0C\u53EF\u7B80\u5199\u4E3A ac
export const action = ctx.defineActions()(actions);
// \u5168\u91CF\u6D3E\u751F\u5BF9\u8C61\uFF0C\u53EF\u7B80\u5199\u4E3A df
export const deriveF = ctx.defineFullDerive()(deriveFull);
// \u81EA\u6211\u53EF\u53D8\u6D3E\u751F\u5BF9\u8C61\uFF0C\u53EF\u7B80\u5199\u4E3A ds
export const deriveS = ctx.defineMutateSelf()(deriveSelf);
// \u5168\u65B0\u53EF\u53D8\u6D3E\u751F\u5BF9\u8C61\uFF0C\u53EF\u7B80\u5199\u4E3A dm
export const deriveM = ctx.defineMutateDerive(mutateStateFn)(deriveMutate);
`,paraId:45,tocIndex:7},{value:"state",paraId:46,tocIndex:8},{value:"\u662F\u6A21\u5757\u7684\u72B6\u6001\u5B9A\u4E49\uFF0C\u6587\u4EF6\u5185\u5982\u5982\u4E0B",paraId:46,tocIndex:8},{value:`import { sharex } from 'helux';
import type {
  IActionTaskParams,
  DraftType,
  UnconfirmedArg,
  IMutateTaskParam,
  IMutateFnItem,
  IMutateFnParams,
} from 'helux';

export function getInitial() {
  return {
    a: 1,
    f: 1,
    g: 1,
    k: 1,
    list: [],
    // ... \u5176\u4ED6\u7565
  };
}

// \u6B64\u5904\u53EF\u4EE5\u662F atomx \u6216 sharex \uFF0C\u770B\u7528\u6237\u5177\u4F53\u4F7F\u7528\u54EA\u4E00\u4E2A\uFF0C\u63A8\u8350\u5B57\u5178\u5BF9\u8C61\u6709\u6548\u8003\u8003 sharex
export const ctx = sharex(getInitial, { moduleName: 'CompWithModule' });
export const { state } = ctx;

export type State = typeof ctx.state; // \u72B6\u6001\u7C7B\u578B
export type Draft = DraftType<State>; // \u8349\u7A3F\u7C7B\u578B\uFF0CDraftType \u4F1A\u81EA\u52A8\u62C6\u7BB1 Atom \u7C7B\u578B\u503C\u51FA\u6765
export type ActionTaskParams<P = UnconfirmedArg> = IActionTaskParams<State, P>; // action \u51FD\u6570\u56DE\u8C03\u53C2\u6570\u7C7B\u578B
export type MutateFnItem<P = any[]> = IMutateFnItem<State, P>; // mutate \u5BF9\u8C61\u7C7B\u578B\uFF0C\u7528\u4E8E\u8F85\u52A9\u5B9A\u4E49 task
export type MutateFnParams<P = any[]> = IMutateFnParams<State, P>; // mutate \u51FD\u6570\u53C2\u6570\u7C7B\u578B\uFF0C\u7528\u4E8E\u8F85\u52A9\u5B9A\u4E49 task
export type MutateTaskParam<P = UnconfirmedArg> = IMutateTaskParam<State, P>; // mutate \u5F02\u6B65\u51FD\u6570\u53C2\u6570\u7C7B\u578B
`,paraId:47,tocIndex:8},{value:"mutateState",paraId:48,tocIndex:9},{value:"\u662F\u53EF\u53D8\u6D3E\u751F\u5BF9\u5E94\u7684\u72B6\u6001\u5B9A\u4E49\uFF0C\u6587\u4EF6\u5185\u5982\u5982\u4E0B",paraId:48,tocIndex:9},{value:`import {
  UnconfirmedArg,
  IMutateTaskParam,
  IMutateFnItem,
  DraftType,
} from 'helux';

/** get initial mutate state */
export function mutateStateFn() {
  return {
    a: 1,
    b: 1,
    c: 1,
    d: 1,
  };
}

export type State = ReturnType<typeof mutateStateFn>; // \u72B6\u6001\u7C7B\u578B
export type Draft = DraftType<State>; // \u8349\u7A3F\u7C7B\u578B\uFF0CDraftType \u4F1A\u81EA\u52A8\u62C6\u7BB1 Atom \u7C7B\u578B\u503C\u51FA\u6765
export type MutateFnItem<P = UnconfirmedArg> = IMutateFnItem<State, P>; // mutate \u5BF9\u8C61\u7C7B\u578B\uFF0C\u7528\u4E8E\u8F85\u52A9\u5B9A\u4E49 task
export type MutateTaskParam<P = UnconfirmedArg> = IMutateTaskParam<State, P>; // mutate \u5F02\u6B65\u51FD\u6570\u53C2\u6570\u7C7B\u578B
`,paraId:49,tocIndex:9},{value:"actions",paraId:50,tocIndex:10},{value:"\u6587\u4EF6\u5B9A\u4E49\u591A\u4E2A\u52A8\u4F5C\u51FD\u6570\uFF0C\u5185\u5BB9\u5982\u4E0B",paraId:50,tocIndex:10},{value:`import { ActionTaskParams } from './state';

export function changeA(params: ActionTaskParams<number>) {
  return 2;
}

export function changeF(params: ActionTaskParams<number>) {
  params.draft.f += 100;
}
`,paraId:51,tocIndex:10},{value:"deriveFull",paraId:52,tocIndex:11},{value:"\u6587\u4EF6\u5B9A\u4E49\u591A\u4E2A\u5168\u91CF\u6D3E\u751F\u51FD\u6570\uFF0C\u5185\u5BB9\u5982\u4E0B",paraId:52,tocIndex:11},{value:`import {
  IDeriveFnParams,
  IDeriveFnItem,
  defineDeriveFnItem,
  defineDeriveTask,
} from 'helux';
import { state } from './state';
import { delay } from '../../../logic/util';

export function go(params: IDeriveFnParams) {
  return state.f + 100;
}

export function test() {
  const map: Record<number, any> = {};
  state.list.forEach((item) => (map[item.id] = item));
  return map;
}

/**
 * \u901A\u8FC7 IDeriveFnItem \u4E3B\u52A8\u7EA6\u675F\u7ED3\u679C\u8FD4\u56DE\u7C7B\u578B\u548Cdeps \u8FD4\u56DE\u7C7B\u578B\uFF0C\u540C\u65F6 deps \u8FD4\u56DE\u7C7B\u578B\u81EA\u52A8\u900F\u4F20\u7ED9 params.input
 */
export const fTask: IDeriveFnItem<number, [number]> = {
  deps: () => [state.f],
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000);
    return params.prevResult + 100;
  },
};

/**
 * \u901A\u8FC7 IDeriveFnItem \u7C7B\u578B\u540C\u65F6\u7EA6\u675F fn \u548C task \u7684\u8FD4\u56DE\u7C7B\u578B\uFF0C\u7EA6\u675F deps \u7684\u8FD4\u56DE\u7C7B\u578B
 */
export const fTask2 = defineDeriveFnItem<IDeriveFnItem<number, [number]>>({
  deps: () => [state.f],
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000);
    return params.prevResult + 100;
  },
});

/**
 * \u901A\u8FC7 defineDeriveTask \u4EC5\u7EA6\u675F\u7ED3\u679C\u8FD4\u56DE\u7C7B\u578B\uFF0C\u540C\u65F6\u81EA\u52A8\u63A8\u5BFC\u51FA deps \u8FD4\u56DE\u7C7B\u578B\u5E76\u900F\u4F20\u7ED9 params.input
 */
export const f2 = defineDeriveTask(() => [state.f] as const)<number>({
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000);
    return params.prevResult + 100;
  },
});
`,paraId:53,tocIndex:11},{value:"deriveMutate",paraId:54,tocIndex:12},{value:"\u6587\u4EF6\u5B9A\u4E49\u591A\u4E2A\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\uFF0C\u5185\u5BB9\u5982\u4E0B",paraId:54,tocIndex:12},{value:`import { Draft, MutateFnItem } from './mutateState';
import { ctx } from './state';

/**
 * \u5173\u6CE8\u81EA\u8EAB b \u7684\u53D8\u5316
 */
export function plusAByB(draft: Draft) {
  draft.a = draft.b + 1;
}

/**
 * \u5173\u6CE8 ctx.state.j \u7684\u53D8\u5316
 */
export function changeC(draft: Draft) {
  draft.c = ctx.state.j + 1;
}

/**
 * \u5B9A\u4E49\u5F02\u6B65\u8BA1\u7B97\u4EFB\u52A1
 * MutateFnItemType<[number]> \u7EA6\u675F\u4E86 deps \u8FD4\u56DE\u7C7B\u578B\u548C task \u91CC\u7684 input \u7C7B\u578B
 */
export const changeDTask: MutateFnItem<[number]> = {
  deps: () => [ctx.state.j],
  // \u65E0 fn \u51FD\u6570\uFF0Ctask \u4F1A\u7ACB\u5373\u6267\u884C
  task: async ({ draft, input }) => {
    draft.d = input[0] + 1;
  },
};

export const changeDTask2: MutateFnItem<[number]> = {
  deps: () => [ctx.state.j],
  // \u4E3B\u52A8\u5B9A\u4E49 fn \u51FD\u6570\uFF0Ctask \u4E0D\u4F1A\u7ACB\u5373\u6267\u884C
  fn: (draft) => (draft.d = 0),
  task: async ({ draft, input }) => {
    draft.d = input[0] + 1;
  },
};
`,paraId:55,tocIndex:12},{value:"deriveSelf",paraId:56,tocIndex:13},{value:"\u6587\u4EF6\u5B9A\u4E49\u6A21\u5757\u72B6\u6001\u81EA\u8EAB\u7684\u591A\u4E2A\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\uFF0C\u5185\u5BB9\u5982\u4E0B",paraId:56,tocIndex:13},{value:`import { Draft, MutateFnItem, MutateFnParams } from './state';

/**
 * \u5BF9\u5E94 mutateFnItem.fn
 */
export function plusK(draft: Draft) {
  draft.k = draft.g + 1;
}

export function plusK2(draft: Draft, params: MutateFnParams) {
  draft.k = draft.g + 1;
}

/**
 * \u5BF9\u5E94 mutateFnItem.task
 */
export const jTask: MutateFnItem<[number]> = {
  deps: (state) => {
    return [state.g];
  },
  task: async ({ draft, input }) => {
    draft.j = input[0] + 2;
  },
};
`,paraId:57,tocIndex:13}]},80456:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(19562);const a=[{value:"\u63D2\u4EF6\u662F\u4E00\u4E2A\u666E\u901A\u5BF9\u8C61\uFF0C\u5305\u542B\u6709",paraId:0,tocIndex:0},{value:"install",paraId:0,tocIndex:0},{value:"\u5C5E\u6027\uFF0C\u5176\u503C\u5BF9\u5E94\u4E00\u4E2A\u51FD\u6570\uFF0C",paraId:0,tocIndex:0},{value:"helux",paraId:0,tocIndex:0},{value:"\u8C03\u7528\u8BE5\u51FD\u6570\u540E\uFF0C\u4F1A\u5C06\u4E00\u4E2A\u63D2\u4EF6\u4E0A\u4E0B\u6587\u5BF9\u8C61\u900F\u4F20\u7ED9\u7528\u6237\uFF0C\u7528\u6237\u53EF\u4F7F\u7528\u8BE5\u4E0A\u4E0B\u6587\u76D1\u542C\u6765\u81EA",paraId:0,tocIndex:0},{value:"helux",paraId:0,tocIndex:0},{value:"\u5185\u90E8\u7684\u5404\u79CD\u884C\u4E3A\u4E8B\u4EF6\u5E76\u505A\u5BF9\u5E94\u7684\u5904\u7406\uFF0C\u4F8B\u5982",paraId:0,tocIndex:0},{value:"helux-plugin-devtool",paraId:0,tocIndex:0},{value:"\u63D2\u4EF6\u63A5\u6536\u72B6\u6001\u5DF2\u6539\u53D8\u4E8B\u4EF6\uFF0C\u5E76\u5C06\u5176\u5BF9\u5E94\u7684\u5FEB\u7167\u5199\u5165\u5230 redux \u5F00\u53D1\u5DE5\u5177\u7684\u72B6\u6001\u4E2D\uFF0C\u65B9\u4FBF\u7528\u6237\u53EF\u89C6\u5316\u67E5\u770B\u6574\u4E2A\u5E94\u7528\u7684\u72B6\u6001\u6811\u3002",paraId:0,tocIndex:0},{value:"\u57FA\u4E8E",paraId:1,tocIndex:1},{value:"cst",paraId:1,tocIndex:1},{value:"\u53D8\u91CF\u5BFC\u51FA\u4E8B\u4EF6\u540D",paraId:1,tocIndex:1},{value:`import { IPlugin, cst } from 'helux';

const MyPlugin: IPlugin = {
  install(pluginCtx) {
    pluginCtx.on(cst.EVENT_NAME.ON_DATA_CHANGED, (dataInfo) => {
      // do some staff here
    });
    pluginCtx.on(cst.EVENT_NAME.ON_SHARE_CREATED, (dataInfo) => {
      // do some staff here
    });
  },
  name: pluginName,
};
`,paraId:2,tocIndex:1},{value:"\u57FA\u4E8Ets\u7684\u7C7B\u578B\u63D0\u793A\u611F\u77E5\u4E8B\u4EF6\u540D",paraId:3,tocIndex:1},{value:`const MyPlugin: IPlugin = {
  install(pluginCtx) {
    // \u8FD9\u91CC\u8F93\u5165 '' \u540E\u5C06\u81EA\u52A8\u63D0\u793A\u4E8B\u4EF6\u540D
    pluginCtx.on('', ()=>{ });
  },
  name: 'MyPlugin',
};
`,paraId:4,tocIndex:1},{value:`import { addPlugin } from 'helux';

addPlugin(MyPlugin);
`,paraId:5,tocIndex:2},{value:"ON_SHARE_CREATED\uFF0C\u5171\u4EAB\u72B6\u6001\u521B\u5EFA\u65F6\u7684\u4E8B\u4EF6",paraId:6,tocIndex:3},{value:"ON_DATA_CHANGED\uFF0C\u5171\u4EAB\u72B6\u6001\u53D8\u5316\u65F6\u7684\u4E8B\u4EF6",paraId:7,tocIndex:3},{value:"\u82E5\u9700\u8981\u5176\u4ED6\u4E8B\u4EF6\u53EF\u4EE5\u63D0",paraId:8},{value:"issue",paraId:8},{value:"\u8BA9",paraId:8},{value:"helux-core",paraId:8},{value:"\u5185\u90E8\u53BB\u5B9E\u73B0",paraId:8}]},49213:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(45914);const a=[{value:"\u9605\u8BFB\u6B64\u7AE0\u8282\u53EF\u7B80\u5355\u4E86\u89E3",paraId:0,tocIndex:0},{value:"helux",paraId:0,tocIndex:0},{value:"\u5E38\u7528\u63A5\u53E3\u5E76\u5FEB\u901F\u5B66\u4F1A\u4F7F\u7528\u5B83\u4EEC\u3002",paraId:0,tocIndex:0},{value:"\u{1F31F} ",paraId:1},{value:"helux",paraId:1},{value:"\u7684\u57FA\u7840\u4F7F\u7528\u65B9\u5F0F\u5B8C\u5168\u5BF9\u9F50",paraId:1},{value:"React.useState",paraId:1},{value:"\uFF0C\u770B\u5B8C\u672C\u7AE0\u8282\u4F60\u5C31\u53EF\u4EE5\u5F88\u4E1D\u6ED1\u5730\u5728\u9879\u76EE\u91CC\u5B9E\u8DF5",paraId:1},{value:"helux",paraId:1},{value:"\u4E86\uFF0C\u66F4\u591A\u9AD8\u7EA7\u4F7F\u7528\u65B9\u5F0F\uFF0C\u53EF\u5411\u540E\u7EE7\u7EED\u9605\u8BFB",paraId:1},{value:"Atom",paraId:2},{value:"\u3001",paraId:1},{value:"Signal",paraId:3},{value:"\u3001",paraId:1},{value:"\u4F9D\u8D56\u8FFD\u8E2A",paraId:4},{value:"\u3001",paraId:1},{value:"\u54CD\u5E94\u5F0F",paraId:5},{value:"\u3001",paraId:1},{value:"\u53CC\u5411\u7ED1\u5B9A",paraId:6},{value:"\u3001",paraId:1},{value:"\u6D3E\u751F",paraId:7},{value:"\u3001",paraId:1},{value:"\u89C2\u5BDF",paraId:8},{value:"\u3001",paraId:1},{value:"Action",paraId:9},{value:"\u3001",paraId:1},{value:"\u6A21\u5757\u5316",paraId:10},{value:" \u7B49\u7AE0\u8282\u505A\u6DF1\u5165\u4E86\u89E3",paraId:1},{value:"\u652F\u6301\u5B9A\u4E49\u4EFB\u610F\u6570\u636E\u7ED3\u6784 atom \u5BF9\u8C61\uFF0C\u88AB\u5305\u88C5\u4E3A",paraId:11,tocIndex:1},{value:"{val:T}",paraId:11,tocIndex:1},{value:"\u7ED3\u6784",paraId:11,tocIndex:1},{value:`import { atom } from 'helux';

// \u539F\u59CB\u7C7B\u578B atom
const [numAtom] = atom(1);
// \u5B57\u5178\u5BF9\u8C61\u7C7B\u578B atom
const [objAtom] = atom({ a: 1, b: { b1: 1 } });
`,paraId:12,tocIndex:1},{value:"\u539F\u59CB\u503C\u4FEE\u6539",paraId:13,tocIndex:2},{value:`const [numAtom, setAtom] = atom(1);
setAtom(100);
`,paraId:14,tocIndex:2},{value:"\u5B57\u5178\u5BF9\u8C61\u4FEE\u6539\uFF0C\u57FA\u4E8E",paraId:15,tocIndex:2},{value:"setAtom",paraId:15,tocIndex:2},{value:"\u63A5\u53E3\u56DE\u8C03\u91CC\u7684\u8349\u7A3F\u5BF9\u8C61\u76F4\u63A5\u4FEE\u6539\u5373\u53EF",paraId:15,tocIndex:2},{value:`const [numAtom, setAtom] = atom({ a: 1, b: { b1: 1 } });
setAtom((draft) => {
  // draft \u5DF2\u62C6\u7BB1 { val: T } \u4E3A T
  draft.b.b1 += 1;
});
`,paraId:16,tocIndex:2},{value:"\u6216\u57FA\u4E8E",paraId:17,tocIndex:2},{value:"reactive",paraId:17,tocIndex:2},{value:"\u54CD\u5E94\u5F0F\u5BF9\u8C61\u4FEE\u6539\uFF0C\u6570\u636E\u53D8\u66F4\u5728\u4E0B\u4E00\u6B21\u4E8B\u4EF6\u5FAA\u73AF\u5FAE\u4EFB\u52A1\u5F00\u59CB\u524D\u88AB\u63D0\u4EA4\u3002",paraId:17,tocIndex:2},{value:`const [numAtom, setAtom, {reactive}] = atom({ a: 1, b: { b1: 1 } });
function change(){
  reactive.b.b1 += 1;
}
`,paraId:18,tocIndex:2},{value:"\u6216\u5B9A\u4E49",paraId:19,tocIndex:2},{value:"action",paraId:19,tocIndex:2},{value:"\u4FEE\u6539",paraId:19,tocIndex:2},{value:`const [numAtom, setAtom, { action, defineActions }] = atom({ a: 1, b: { b1: 1 } });
// \u65B9\u5F0F1\uFF1A\u88F8\u5199 action
const change = action()(({draft})=>{
 draft.b.b1 += 1;
}, 'change');
change(); // \u89E6\u53D1\u53D8\u66F4

// \u65B9\u5F0F2\uFF1A\u8C03\u7528\u53EF\u8BFB\u6027\u66F4\u53CB\u597D\u7684 defineActions
const { actions } = defineActions()({
  change({draft}){
    draft.b.b1 += 1;
  },
  // \u53EF\u4EE5\u7EE7\u7EED\u5B9A\u4E49\u5176\u4ED6 action
});
actions.change(); // \u89E6\u53D1\u53D8\u66F4
`,paraId:20,tocIndex:2},{value:"\u53EF\u89C2\u5BDF\u6574\u4E2A\u6839\u5BF9\u8C61\u53D8\u5316\uFF0C\u4E5F\u53EF\u4EE5\u89C2\u5BDF\u90E8\u5206\u8282\u70B9\u53D8\u5316",paraId:21,tocIndex:3},{value:`import { atom, watch, getSnap } from 'helux';

watch(
  () => {
    console.log(\`change from \${getSnap(numAtom).val} to \${numAtom.val}\`);
  },
  () => [atom],
);

watch(
  () => {
    console.log(
      \`change from \${getSnap(numAtom).val.b.b1} to \${numAtom.val.b.b1}\`,
    );
  },
  () => [objAtom.val.b.b1],
);
`,paraId:22,tocIndex:3},{value:"derive",paraId:23,tocIndex:5},{value:" \u63A5\u53E3\u63A5\u53D7\u4E00\u4E2A\u6D3E\u751F\u51FD\u6570\u5B9E\u73B0\uFF0C\u8FD4\u56DE\u4E00\u4E2A\u5168\u65B0\u7684\u6D3E\u751F\u503C\u5BF9\u8C61\uFF0C\u8BE5\u5BF9\u8C61\u662F\u4E00\u4E2A\u53EA\u53EF\u8BFB\u7684\u7A33\u5B9A\u5F15\u7528\uFF0C\u5168\u5C40\u4F7F\u7528\u53EF\u603B\u662F\u8BFB\u53D6\u5230\u6700\u65B0\u503C\u3002",paraId:23,tocIndex:5},{value:`import { atom, derive } from 'helux';

const [numAtom, setAtom] = atom(1);
const plus100 = derive(() => atom.val + 100);

setAtom(100);
console.log(plus100); // { val: 200 }

setAtom(100); // \u8BBE\u7F6E\u76F8\u540C\u7ED3\u679C\uFF0C\u6D3E\u751F\u51FD\u6570\u4E0D\u4F1A\u518D\u6B21\u6267\u884C
`,paraId:24,tocIndex:5},{value:"\u4F7F\u7528\u5DF2\u6D3E\u751F\u7ED3\u679C\u7EE7\u7EED\u6D3E\u751F\u65B0\u7684\u7ED3\u679C",paraId:25,tocIndex:5},{value:`const plus100 = derive(() => atom.val + 100);
const plus200 = derive(() => plus100.val + 200);
`,paraId:26,tocIndex:5},{value:"\u66F4\u591A\u9AD8\u7EA7\u529F\u80FD\u53EF\u9605\u8BFB",paraId:27,tocIndex:5},{value:"\u5F00\u59CB/\u6D3E\u751F",paraId:28,tocIndex:5},{value:"\u4E86\u89E3\u3002",paraId:27,tocIndex:5},{value:"\u5F53\u5171\u4EAB\u5BF9\u8C61 a \u7684\u53D1\u751F\u53D8\u5316\u540E\u9700\u8981\u81EA\u52A8\u5F15\u8D77\u5171\u4EAB\u72B6\u6001 b \u7684\u67D0\u4E9B\u8282\u70B9\u53D8\u5316\u65F6\uFF0C\u53EF\u5B9A\u4E49 ",paraId:29,tocIndex:6},{value:"mutate",paraId:29,tocIndex:6},{value:" \u51FD\u6570\u6765\u5B8C\u6210\u8FD9\u79CD\u53D8\u5316\u7684\u8FDE\u9501\u53CD\u5E94\u5173\u7CFB\uFF0C\u5BF9\u6570\u636E\u505A\u6700\u5C0F\u7C92\u5EA6\u7684\u66F4\u65B0",paraId:29,tocIndex:6},{value:`import { atom, derive } from 'helux';

const  [ objAtom1, setAtom ] = atom({a:1,b:{b1:1}});

const [objAtom2] = atom(
  { plusA100: 0 }
  {
    // \u5F53 objAtom1.val.a \u53D8\u5316\u65F6\uFF0C\u91CD\u8BA1\u7B97 plusA100 \u8282\u70B9\u7684\u503C
    mutate: {
      changePlusA100: (draft) => draft.plusA100 = objAtom1.val.a + 100,
    }
  },
);

setAtom(draft=>{ draft.a=100 });
console.log(objAtom2.val.plusA100); // 200
`,paraId:30,tocIndex:6},{value:"react \u7EC4\u4EF6\u901A\u8FC7",paraId:31,tocIndex:7},{value:"useAtom",paraId:31,tocIndex:7},{value:" \u94A9\u5B50\u53EF\u4F7F\u7528 atom \u5171\u4EAB\u5BF9\u8C61\uFF0C\u8BE5\u94A9\u5B50\u8FD4\u56DE\u4E00\u4E2A\u5143\u7EC4\uFF0C\u4F7F\u7528\u65B9\u5F0F\u548C ",paraId:31,tocIndex:7},{value:"react.useState",paraId:31,tocIndex:7},{value:" \u7C7B\u4F3C\uFF0C\u533A\u522B\u5728\u4E8E\u5BF9\u4E8E\u975E\u539F\u59CB\u5BF9\u8C61\uFF0C\u56DE\u8C03\u63D0\u4F9B\u8349\u7A3F\u4F9B\u7528\u6237\u76F4\u63A5\u4FEE\u6539\uFF0C\u5185\u90E8\u4F1A\u751F\u6210\u7ED3\u6784\u5316\u5171\u4EAB\u7684\u65B0\u72B6\u6001",paraId:31,tocIndex:7},{value:"atom \u5BF9\u8C61\u5929\u7136\u662F\u5168\u5C40\u5171\u4EAB\u7684\uFF0C\u53EF\u5C06 atom \u5BF9\u8C61\u63D0\u4F9B\u7ED9\u591A\u4E2A\u7EC4\u4EF6\u5B9E\u4F8B\u4F7F\u7528",paraId:32}]},29388:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(52995);const a=[{value:"\u56E0",paraId:0,tocIndex:0},{value:"atom",paraId:0,tocIndex:0},{value:" \u8FD4\u56DE\u7684 ",paraId:0,tocIndex:0},{value:"state",paraId:0,tocIndex:0},{value:" \u662F\u53EA\u53EF\u8BFB\u6570\u636E\uFF0C\u53D8\u66F4\u5FC5\u987B\u914D\u5408",paraId:0,tocIndex:0},{value:"setState",paraId:0,tocIndex:0},{value:"\uFF0C\u540C\u65F6 ",paraId:0,tocIndex:0},{value:"atom",paraId:0,tocIndex:0},{value:" \u4E5F\u63D0\u4F9B\u54CD\u5E94\u5F0F\u5BF9\u8C61\uFF0C\u53EF\u76F4\u63A5\u64CD\u4F5C\u4FEE\u6539\uFF0C\u53D8\u5316\u90E8\u5206\u6570\u636E\u4F1A\u5728\u4E0B\u4E00\u6B21\u4E8B\u4EF6\u5FAA\u73AF\u5FAE\u4EFB\u52A1\u5F00\u59CB\u524D\u6267\u884C",paraId:0,tocIndex:0},{value:`import { atom } from 'helux';
import { delay } from '@helux/demo-utils';

// reactive \u5DF2\u81EA\u52A8\u62C6\u7BB1
const { state, reactive } = atomx({ a: 1, b: { b1: { b2: 1, ok: true } } });

async function change() {
  reactive.a = 100;
  console.log(state.val.a); // 1
  await delay(1);
  console.log(state.val.a); // 100
}
`,paraId:1,tocIndex:1},{value:"\u6216\u4F7F\u7528",paraId:2,tocIndex:1},{value:"share",paraId:2,tocIndex:1},{value:"\u8FD4\u56DE\u7684",paraId:2,tocIndex:1},{value:"reactive",paraId:2,tocIndex:1},{value:"\u4FEE\u6539",paraId:2,tocIndex:1},{value:`import { share } from 'helux';
import { delay } from '@helux/demo-utils';

const [state, , { reactive }] = share({ a: 1, b: { b1: { b2: 1, ok: true } } });
// or
const { state, reactive } = sharex({ a: 1, b: { b1: { b2: 1, ok: true } } });

// \u76F8\u6BD4 atom.state\uFF0C\u5C11\u4E86\u4E3B\u52A8\u62C6\u7BB1\u7684\u8FC7\u7A0B
async function change() {
  reactive.a = 100;
  console.log(state.a); // 1
  await delay(1);
  console.log(state.a); // 100
}
`,paraId:3,tocIndex:1},{value:"\u7EC4\u4EF6\u4E2D\u53EF\u4F7F\u7528",paraId:4,tocIndex:2},{value:"useReactive",paraId:4,tocIndex:2},{value:"\u94A9\u5B50\u6765\u83B7\u5F97\u54CD\u5E94\u5F0F\u5BF9\u8C61",paraId:4,tocIndex:2},{value:`import { sharex } from 'helux';

const { reactive, useReactive } = sharex({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});

// \u5B9A\u65F6\u4FEE\u6539 a b2
setTimeout(() => {
  reactive.a += 1;
  reactive.b.b1.b2 += 1;
}, 2000);

// \u7EC4\u4EF6\u5916\u90E8\u4FEE\u6539 ok
function toogleOkOut() {
  reactive.b.b1.ok = !reactive.b.b1.ok;
}

function Demo() {
  const [reactive] = useReactive();
  return <h1>{reactive.a}</h1>;
}
function Demo2() {
  const [reactive] = useReactive();
  return <h1>{reactive.b.b1.b2}</h1>;
}
function Demo3() {
  const [reactive] = useReactive();
  // \u7EC4\u4EF6\u5185\u90E8\u5207\u6362 ok
  const toogle = () => (reactive.b.b1.ok = !reactive.b.b1.ok);
  return <h1>{\`\${reactive.b.b1.ok}\`}</h1>;
}
`,paraId:5,tocIndex:2},{value:"\u53EF\u76F4\u63A5\u5C06 ",paraId:6,tocIndex:3},{value:"reactive",paraId:6,tocIndex:3},{value:" \u503C\u4F20\u7ED9 ",paraId:6,tocIndex:3},{value:"$",paraId:6,tocIndex:3},{value:"\u539F\u59CB\u503C\u54CD\u5E94\u6216",paraId:6,tocIndex:3},{value:"block",paraId:6,tocIndex:3},{value:"\u5757\u54CD\u5E94",paraId:6,tocIndex:3},{value:`import { $, block, sharex } from 'helux';

const { reactive } = sharex({
  a: 1,
  b: { b1: { b2: 1, ok: true } },
});

function InSignalZone() {
  return <h1>{$(reactive.a)}</h1>;
}

const InBlockZone = block(() => {
  return (
    <div>
      <h3>{reactive.a}</h3>
      <h3>{reactive.b.b1.b2}</h3>
    </div>
  );
});
`,paraId:7,tocIndex:3},{value:"input",paraId:8,tocIndex:4},{value:"\u7EC4\u4EF6\u5B9E\u65F6\u8F93\u5165\u8FC7\u7A0B\u4E2D\uFF0C\u9700\u4E3B\u52A8\u8C03\u7528",paraId:8,tocIndex:4},{value:"flush",paraId:8,tocIndex:4},{value:"\u63A5\u53E3\u5237\u65B0\u72B6\u6001\uFF0C\u907F\u514D\u4E2D\u6587\u8F93\u5165\u6CD5\u51FA\u73B0\u4E2D\u6587\u65E0\u6CD5\u63D0\u793A\u7684\u95EE\u9898\u3002",paraId:8,tocIndex:4}]},43802:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(88785);const a=[{value:"signal",paraId:0,tocIndex:0},{value:"\u54CD\u5E94\u673A\u5236\u5141\u8BB8\u7528\u6237\u8DF3\u8FC7",paraId:0,tocIndex:0},{value:"useAtom",paraId:0,tocIndex:0},{value:"\u76F4\u63A5\u5C06\u6570\u636E\u7ED1\u5B9A\u5230\u89C6\u56FE\uFF0C\u5B9E\u73B0 ",paraId:0,tocIndex:0},{value:"0 hook",paraId:0,tocIndex:0},{value:"\u7F16\u7801\u3001",paraId:0,tocIndex:0},{value:"dom \u7C92\u5EA6",paraId:0,tocIndex:0},{value:"\u6216",paraId:0,tocIndex:0},{value:"\u5757\u7C92\u5EA6",paraId:0,tocIndex:0},{value:"\u66F4\u65B0\u3002",paraId:0,tocIndex:0},{value:"\u4F7F\u7528",paraId:1,tocIndex:1},{value:"$",paraId:1,tocIndex:1},{value:"\u7B26\u53F7\u7ED1\u5B9A\u5355\u4E2A\u539F\u59CB\u503C\u521B\u5EFA\u4FE1\u53F7\u54CD\u5E94\u5757\uFF0C\u5B9E\u73B0 dom \u7C92\u5EA6\u66F4\u65B0",paraId:1,tocIndex:1},{value:`import { $ } from 'helux';

// \u6570\u636E\u53D8\u66F4\u4EC5\u89E6\u53D1 $\u7B26\u53F7\u533A\u57DF\u5185\u91CD\u6E32\u67D3
<h1>{$(numAtom)}</h1> // \u5305\u542B\u539F\u59CB\u503C\u7684atom\u53EF\u5B89\u5168\u7ED1\u5B9A
<h1>{$(shared.b.b1)}</h1>// \u5BF9\u8C61\u578B\u9700\u81EA\u5DF1\u53D6\u5230\u539F\u59CB\u503C\u7ED1\u5B9A
`,paraId:2,tocIndex:1},{value:"\u70B9\u51FB\u4E0B\u8FF0\u793A\u4F8B",paraId:3},{value:"click me",paraId:3},{value:"\u6309\u94AE\uFF0C\u5305\u88C5\u5757\u989C\u8272\u672A\u53D8\uFF0C",paraId:3},{value:"update at",paraId:3},{value:"\u503C\u672A\u53D8\uFF0C\u8868\u793A\u6574\u4E2A\u7EC4\u4EF6\u9664\u4E86",paraId:3},{value:"$()",paraId:3},{value:"\u5305\u88F9\u533A\u57DF\u88AB\u91CD\u6E32\u67D3\u4E4B\u5916\uFF0C\u5176\u4ED6\u5730\u65B9\u90FD\u6CA1\u6709\u88AB\u91CD\u6E32\u67D3",paraId:3},{value:"\u4F7F\u7528",paraId:4,tocIndex:2},{value:"block",paraId:4,tocIndex:2},{value:"\u7ED1\u5B9A\u591A\u4E2A\u539F\u59CB\u503C\u521B\u5EFA\u5C40\u90E8\u54CD\u5E94\u5757\uFF0C\u5B9E\u73B0\u5757\u7C92\u5EA6\u66F4\u65B0",paraId:4,tocIndex:2},{value:`// UserBlock \u5DF2\u88AB memo
const UserBlock = block(() => (
  <div>
    name: {user.name}
    desc: {user.detail.desc}
  </div>
));

// \u5176\u4ED6\u5730\u65B9\u4F7F\u7528 UserBlock
<UserBlock />;
`,paraId:5,tocIndex:2}]},14635:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(48207);const a=[{value:"\u63D0\u4F9B",paraId:0,tocIndex:0},{value:"syncer",paraId:0,tocIndex:0},{value:" \u548C ",paraId:0,tocIndex:0},{value:"sync",paraId:0,tocIndex:0},{value:"\u51FD\u6570\u751F\u6210\u6570\u636E\u540C\u6B65\u5668\uFF0C\u53EF\u76F4\u63A5\u7ED1\u5B9A\u5230\u8868\u8FBE\u76F8\u5173",paraId:0,tocIndex:0},{value:"onChange",paraId:0,tocIndex:0},{value:"\u4E8B\u4EF6\uFF0C\u540C\u6B65\u5668\u4F1A\u81EA\u52A8\u63D0\u53D6\u4E8B\u4EF6\u503C\u5E76\u4FEE\u6539\u5171\u4EAB\u72B6\u6001\uFF0C\u8FBE\u5230",paraId:0,tocIndex:0},{value:"\u53CC\u5411\u7ED1\u5B9A",paraId:0,tocIndex:0},{value:"\u7684\u6548\u679C\uFF01",paraId:0,tocIndex:0},{value:"\u53EA\u6709\u4E00\u5C42 json path \u7684\u5BF9\u8C61\uFF0C\u53EF\u4EE5\u4F7F\u7528 ",paraId:1,tocIndex:1},{value:"syncer",paraId:1,tocIndex:1},{value:" \u751F\u6210\u6570\u636E\u540C\u6B65\u5668\u6765\u7ED1\u5B9A",paraId:1,tocIndex:1},{value:`const { syncer, state } = sharex({ a: 1, b: { b1: 1 }, c: true });

<input value={state.a} onChange={syncer.a} />;
<input type="checkbox" checked={state.c} onChange={syncer.c} />;
`,paraId:2,tocIndex:1},{value:"syncer",paraId:3,tocIndex:1},{value:"\u4F1A\u81EA\u52A8\u5206\u6790\u662F\u5426\u662F\u4E8B\u4EF6\u5BF9\u8C61\uFF0C\u662F\u5C31\u63D0\u53D6\u503C\u4E0D\u662F\u5C31\u76F4\u63A5\u4F20\u503C\uFF0C\u6240\u4EE5\u4E5F\u53EF\u4EE5\u5F88\u65B9\u4FBF\u7684\u7ED1\u5B9A ui \u7EC4\u4EF6\u5E93",paraId:3,tocIndex:1},{value:`import { Select } from 'antd';

<Select value={state.a} onChange={syncer.a} />;
`,paraId:4,tocIndex:1},{value:"\u539F\u59CB\u503C atom \u7ED1\u5B9A\u65F6\uFF0C\u4F20\u9012",paraId:5},{value:"syncer",paraId:5},{value:"\u81EA\u8EAB\u5373\u53EF",paraId:5},{value:`import { atomx } from 'helux';
const { syncer, useState } = atomx('');

function Demo1() {
  const [state] = useState();
  return <input value={state} onChange={syncer} />;
}
`,paraId:6},{value:"\u591A\u5C42 json path \u7684\u5BF9\u8C61\uFF0C\u4F7F\u7528 ",paraId:7,tocIndex:2},{value:"sync",paraId:7,tocIndex:2},{value:" \u751F\u6210\u6570\u636E\u540C\u6B65\u5668\u6765\u7ED1\u5B9A\uFF0C\u53EF\u901A\u8FC7\u56DE\u8C03\u8BBE\u5B9A\u7ED1\u5B9A\u8282\u70B9",paraId:7,tocIndex:2},{value:`// \u6570\u636E\u81EA\u52A8\u540C\u6B65\u5230 to.b.b1 \u4E0B
<input value={state.b.b1} onChange={sync((to) => to.b.b1)} />
`,paraId:8,tocIndex:2},{value:"\u53EF\u4F20\u9012\u8DEF\u5F84\u5B57\u7B26\u4E32\u6570\u7EC4\u5B9A\u4E49\u7ED1\u5B9A\u76EE\u6807\u8282\u70B9",paraId:9},{value:`<input value={state.b.b1} onChange={sync(['b', 'b1'])} />
`,paraId:10},{value:"sync",paraId:11,tocIndex:3},{value:" \u51FD\u6570\u63D0\u4F9B ",paraId:11,tocIndex:3},{value:"before",paraId:11,tocIndex:3},{value:" \u56DE\u8C03\u7ED9\u7528\u6237\uFF0C\u652F\u6301\u6570\u636E\u63D0\u4EA4\u524D\u505A\u4E8C\u6B21\u4FEE\u6539",paraId:11,tocIndex:3},{value:`<input
  value={num}
  onChange={sync(
    (to) => to.b.b1,
    (val) => {
      return val === '888' ? 'boom' : val;
    },
  )}
/>
`,paraId:12,tocIndex:3},{value:"\u8F93\u5165 ",paraId:13},{value:"888",paraId:13},{value:" \u5C06\u89E6\u53D1\u7BE1\u6539\u6570\u636E\u903B\u8F91",paraId:13},{value:"\u652F\u6301",paraId:14},{value:"before",paraId:14},{value:"\u56DE\u8C03\u91CC\u4FEE\u6539\u5176\u4ED6\u503C",paraId:14},{value:`<input
  value={num}
  onChange={sync(
    (to) => to.b.b1,
    (val, params) => {
      if (val === '888') {
        params.draft.b2 = 'b2 changed';
        return 'boom';
      }
    },
  )}
/>
`,paraId:15},{value:"\u8F93\u5165 ",paraId:16},{value:"888",paraId:16},{value:" \u5C06\u89E6\u53D1\u591A\u4E2A\u6570\u636E\u88AB\u7BE1\u6539",paraId:16}]},5210:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(85639);const a=[{value:"helux",paraId:0,tocIndex:0},{value:"\u5728\u5185\u90E8\u4E3A\u5B9E\u73B0\u66F4\u667A\u80FD\u7684\u81EA\u52A8\u89C2\u5BDF\u53D8\u5316\u505A\u4E86\u5927\u91CF\u4F18\u5316\u5DE5\u4F5C\uFF0C\u540C\u65F6\u4E5F\u66B4\u9732\u4E86\u76F8\u5173\u63A5\u53E3\u652F\u6301\u7528\u6237\u5728\u4E00\u4E9B\u7279\u6B8A\u573A\u666F\u505A\u4EBA\u5DE5\u7684\u89C2\u5BDF\u53D8\u5316\u3002",paraId:0,tocIndex:0},{value:"\u4F7F\u7528",paraId:1,tocIndex:2},{value:"watch",paraId:1,tocIndex:2},{value:"\u53EF\u89C2\u5BDF atom \u5BF9\u8C61\u81EA\u8EAB\u53D8\u5316\u6216\u4EFB\u610F\u591A\u4E2A\u5B50\u8282\u70B9\u7684\u53D8\u5316\u3002",paraId:1,tocIndex:2},{value:"\u89C2\u5BDF\u51FD\u6570\u7ACB\u5373\u6267\u884C\uFF0C\u9996\u6B21\u6267\u884C\u65F6\u6536\u96C6\u5230\u76F8\u5173\u4F9D\u8D56",paraId:2,tocIndex:2},{value:`import { share, watch, getSnap } from 'helux';

const [priceState, setPrice] = share({ a: 1 });

watch(
  () => {
    // \u9996\u6B21\u6267\u884C\u65E5\u5FD7\u5982\u4E0B
    // price change from 1 to 1
    //
    // \u53CD\u590D\u8C03\u7528 changePrice\uFF0C\u65E5\u5FD7\u53D8\u5316\u5982\u4E0B
    // price change from 1 to 101
    // price change from 101 to 201
    console.log(
      \`price change from \${getSnap(priceState).a} to \${priceState.a}\`,
    );
  },
  { immediate: true },
);

const changePrice = () =>
  setPrice((draft) => {
    draft.a += 100;
  });
`,paraId:3,tocIndex:2},{value:"\u89C2\u5BDF\u51FD\u6570\u4E0D\u7ACB\u5373\u6267\u884C\uFF0C\u901A\u8FC7 deps \u51FD\u6570\u5B9A\u4E49\u9700\u8981\u89C2\u5BDF\u7684\u6570\u636E\uFF0C\u89C2\u5BDF\u7684\u7C92\u5EA6\u53EF\u4EE5\u4EFB\u610F\u5B9A\u5236",paraId:4,tocIndex:2},{value:`const [priceState, setPrice] = share({ a: 1 });
const [numAtom, setNum] = atom(3000);

// \u89C2\u5BDF priceState.a \u7684\u53D8\u5316
watch(
  () => {
    console.log(\`found price.a changed: () => [priceState.a]\`);
  },
  () => [priceState.a],
  // \u6216\u5199\u4E3A
  // { deps: () => [priceState.a] }
);

// \u89C2\u5BDF\u6574\u4E2A priceState \u7684\u53D8\u5316
watch(
  () => {
    console.log(\`found price changed: [ priceState ]\`);
  },
  () => [priceState],
);

// \u89C2\u5BDF\u6574\u4E2A priceState \u548C numAtom \u7684\u53D8\u5316
watch(
  () => {
    console.log(\`found price or numAtom changed: ()=>[ priceState, numAtom ]\`);
  },
  () => [priceState, numAtom],
);
`,paraId:5,tocIndex:2},{value:"\u5373\u8BBE\u7F6E\u4F9D\u8D56\u51FD\u6570\u4E5F\u8BBE\u7F6E\u7ACB\u5373\u6267\u884C\uFF0C\u6B64\u65F6\u7684\u4F9D\u8D56\u7531 ",paraId:6,tocIndex:2},{value:"deps",paraId:6,tocIndex:2},{value:" \u548C ",paraId:6,tocIndex:2},{value:"watch",paraId:6,tocIndex:2},{value:" \u5171\u540C\u6536\u96C6\u5230\u5E76\u5408\u5E76\u800C\u5F97\u3002",paraId:6,tocIndex:2},{value:`watch(
  () => {
    const { a } = priceState;
    console.log(\`found one of them changed: [ priceState.a, numAtom ]\`);
  },
  { deps: () => [numAtom], immediate: true },
);
`,paraId:7,tocIndex:2},{value:"watchEffect",paraId:8,tocIndex:3},{value:"\u56DE\u8C03\u4F1A\u7ACB\u5373\u6267\u884C\uFF0C\u81EA\u52A8\u5BF9\u9996\u6B21\u8FD0\u884C\u65F6\u51FD\u6570\u5185\u8BFB\u53D6\u5230\u7684\u503C\u5B8C\u6210\u53D8\u5316\u76D1\u542C",paraId:8,tocIndex:3},{value:`import { watchEffect, getSnap } from ' helux ';
const [priceState, setPrice] = share({ a: 1 });

// \u89C2\u5BDF priceState.a \u7684\u53D8\u5316
watchEffect(() => {
  console.log(\`found price.a changed from \${getSnap(priceState).a} to \${priceState.a}\`);
});
`,paraId:9,tocIndex:3},{value:"\u63D0\u4F9B",paraId:10,tocIndex:5},{value:"useWatch",paraId:10,tocIndex:5},{value:"\u8BA9\u5F00\u53D1\u8005\u5728\u7EC4\u4EF6\u5185\u90E8\u89C2\u5BDF\u53D8\u5316",paraId:10,tocIndex:5},{value:"\u7EC4\u4EF6\u9500\u6BC1\u65F6\uFF0Chelux \u4F1A\u81EA\u52A8\u53D6\u6D88 useWatch \u5BF9\u5E94\u7684\u89C2\u5BDF\u76D1\u542C\u51FD\u6570",paraId:11},{value:"useWatch \u65E0\u95ED\u5305\u9677\u9631\u95EE\u9898\uFF0C\u603B\u80FD\u611F\u77E5\u95ED\u5305\u5916\u7684\u6700\u65B0\u503C",paraId:12},{value:"\u5728\u7EC4\u4EF6\u4E2D\u4F7F\u7528 ",paraId:13,tocIndex:8},{value:"useWatchEffect",paraId:13,tocIndex:8},{value:" \u6765\u5B8C\u6210\u72B6\u6001\u53D8\u5316\u76D1\u542C\uFF0C\u4F1A\u5728\u7EC4\u4EF6\u9500\u6BC1\u65F6\u81EA\u52A8\u53D6\u6D88\u76D1\u542C\u3002",paraId:13,tocIndex:8},{value:"useWatchEffect",paraId:14,tocIndex:8},{value:" \u529F\u80FD\u540C ",paraId:14,tocIndex:8},{value:"watchEffect``\u4E00\u6837\uFF0C\u533A\u522B\u5728\u4E8E ",paraId:14,tocIndex:8},{value:"useWatchEffect` \u4F1A\u7ACB\u5373\u6267\u884C\u56DE\u8C03\uFF0C\u81EA\u52A8\u5BF9\u9996\u6B21\u8FD0\u884C\u65F6\u51FD\u6570\u5185\u8BFB\u53D6\u5230\u7684\u503C\u5B8C\u6210\u53D8\u5316\u76D1\u542C\u3002",paraId:14,tocIndex:8}]},34250:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(5426);const a=[]},4250:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(25286);const a=[]},6867:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(96924);const a=[]},71575:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(95394);const a=[{value:"\u80FD\u591F\u76D1\u542C\u5171\u4EAB\u72B6\u6001\u67D0\u4E9B\u6570\u636E\u8282\u70B9\u53D8\u5316\u6267\u884C\uFF0C\u5E76\u8FD4\u56DE\u4E00\u4EFD\u5168\u65B0\u6570\u636E\u7684\u51FD\u6570\uFF0C\u79F0\u4E4B\u4E3A",paraId:0,tocIndex:1},{value:"\u5168\u91CF\u6D3E\u751F",paraId:0,tocIndex:1},{value:"\u51FD\u6570",paraId:0,tocIndex:1},{value:"\u5168\u91CF\u6D3E\u751F\u51FD\u6570\u9996\u6B21\u6267\u884C\u65F6\u4F1A\u6536\u96C6\u5230\u5F53\u524D\u51FD\u6570\u5BF9\u5916\u90E8\u7684\u5404\u4E2A\u6570\u636E\u4F9D\u8D56\u5E76\u8BB0\u5F55\u4E0B\u6765\u3002",paraId:1,tocIndex:1},{value:`import { derive, atom } from 'helux';

const [numAtom] = atom(1); // { val: 1 }
const plus100Result = derive(() => numAtom.val + 100); // { val: 101 }
`,paraId:2,tocIndex:1},{value:"\u80FD\u591F\u76D1\u542C\u5171\u4EAB\u72B6\u6001\u81EA\u8EAB\u67D0\u4E9B\u6570\u636E\u8282\u70B9\u53D8\u5316\u6216\u5176\u4ED6\u5171\u4EAB\u72B6\u6001\u7684\u67D0\u4E9B\u6570\u636E\u8282\u70B9\u53D8\u5316\uFF0C\u5E76\u89E6\u53D1\u4FEE\u6539\u5171\u4EAB\u72B6\u6001\u81EA\u8EAB\u5176\u4ED6\u6570\u636E\u8282\u70B9\u53D8\u5316\u7684\u51FD\u6570\uFF0C\u79F0\u4E4B\u4E3A",paraId:3,tocIndex:2},{value:"\u53EF\u53D8\u6D3E\u751F",paraId:3,tocIndex:2},{value:"\u51FD\u6570",paraId:3,tocIndex:2},{value:"\u53EF\u53D8\u6D3E\u751F\u51FD\u6570\u9996\u6B21\u6267\u884C\u65F6\u4F1A\u6536\u96C6\u5230\u5F53\u524D\u51FD\u6570\u5BF9\u5916\u90E8\u7684\u5404\u4E2A\u6570\u636E\u4F9D\u8D56\u5E76\u8BB0\u5F55\u4E0B\u6765\u3002",paraId:4,tocIndex:2},{value:`const [state, setState, ctx] = atom({ a: 1, b: 0 }, {
  // \u81EA\u8EAB\u7684a \u53D8\u5316\u65F6\u8BA1\u7B97 b
  mutate: draft => draft.b = draft.a + 1;
});
`,paraId:5,tocIndex:3},{value:`const [ state1 ] = atom({a:1});
const [state, setState, ctx] = atom({ a: 1 }, {
  // state1.a \u53D8\u5316\u65F6\u8BA1\u7B97\u81EA\u8EAB a
  mutate: draft => draft.a = state1.a + 1;
});
\`\`
`,paraId:6,tocIndex:4}]},50021:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(79618);const a=[]},98730:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(74355);const a=[]},21849:function(f,n,e){e.r(n),e.d(n,{texts:function(){return a}});var p=e(62252);const a=[]},4991:function(f,n){n.Z=`import { share, watch } from 'helux';

const [priceState, setState] = share({ a: 1, c: 0 });

// \u89C2\u5BDF\u6574\u4E2A priceState \u7684\u53D8\u5316
const ret = watch(
  () => {
    console.log(\`found price changed: [ priceState ]\`);
  },
  () => [priceState],
);

ret.unwatch(); // \u53D6\u6D88\u89C2\u5BDF\u540E\uFF0Cwatch \u4E0D\u4F1A\u518D\u88AB\u81EA\u52A8\u89E6\u53D1

function changeState() {
  setState(draft => void (draft.a += 100));
}

function run() {
  ret.run(); // \u4EBA\u5DE5\u89E6\u53D1\u59CB\u7EC8\u6709\u6548\uFF0C\u548C unwatch \u662F\u5426\u6267\u884C\u6CA1\u5173\u7CFB
}

// for react demo renderer
export default () => (
  <div>
    <h1>after calling unwatch</h1>
    <button type="button" onClick={changeState}>change state will not trigger watch</button>
    <br />
    <br />
    <button type="button" onClick={run}>run will still trigger watch</button>
  </div>
);
`},83227:function(f,n){n.Z=`import { atom, share, watch } from 'helux';

const [priceState] = share({ a: 1 });
const [numAtom] = atom(3000);

// \u89C2\u5BDF\u6574\u4E2A priceState \u7684\u53D8\u5316
watch(
  () => {
    console.log(\`found price changed: [ priceState ]\`);
  },
  () => [priceState],
);

// \u89C2\u5BDF\u6574\u4E2A priceState \u548C numAtom \u7684\u53D8\u5316
watch(
  () => {
    console.log(\`found price or numAtom changed: ()=>[ priceState, numAtom ]\`);
  },
  () => [priceState, numAtom],
);

export default () => ''; // \u8F85\u52A9\u6E32\u67D3
`},41185:function(f,n){n.Z=`import { share, watch } from 'helux';

const [priceState] = share({ a: 1 });

// \u89C2\u5BDF priceState.a \u7684\u53D8\u5316
watch(
  () => {
    console.log(\`found price.a changed: () => [priceState.a]\`);
  },
  () => [priceState.a],
  // \u6216\u5199\u4E3A
  // { deps: () => [priceState.a] }
);

export default () => ''; // \u8F85\u52A9\u6E32\u67D3
`},4197:function(f,n){n.Z=`export function dictFactory() {
  return {
    name: 'dict',
    a: {
      b: { c: 1 },
      b1: { c1: 1 },
    },
    info: { name: 'helux', age: 1 },
    desc: 'awesome lib',
    extra: {
      list: [],
      mark: 'extra',
      toBeDrive: 0,
      prefixedMark: '',
      newName: '',
    },
    f: 1,
    g: 1,
  };
}
`},24596:function(f,n){n.Z=`import { MarkUpdate } from '@helux/demo-utils';
import { atom, useAtom } from 'helux';
import { dictFactory } from './data';

const [dictAtom] = atom(dictFactory);

function PureDemo(props: { pure: boolean }) {
  // pure \u4E0D\u5199\uFF0C\u9ED8\u8BA4\u4E3A true
  const [state, , info] = useAtom(dictAtom, { pure: props.pure });
  const { extra, name, desc } = state;
  // \u8FD9\u91CC\u7EE7\u7EED\u4E0B\u94BB\u8BFB\u53D6\u4E86 state.extra \u7684\u5B50\u8282\u70B9\uFF0C\u6545state.extra \u7B97\u4F5C\u4E00\u4E2A\u4E2D\u95F4\u6001\u7684\u4F9D\u8D56
  const { list, mark } = extra;

  return (
    <MarkUpdate info={info}>
      <div>{name}</div>
      <div>{desc}</div>
      <div>{list.length}</div>
      <div>{mark}</div>
    </MarkUpdate>
  );
}

export default () => (
  <>
    <PureDemo pure={true} />
    <PureDemo pure={false} />
  </>
);
`},66956:function(f,n){n.Z=`// @ts-nocheck
import React from 'react';
import './index.less';
import * as codes from './codes';

const c = '#e8ae56';

const orderedKeys = [
  'quickStart',
  'atom',
  'derive',
  'watch',
  'reactive',
  'signal',
  'modular',
  'useAtom',
  'useDerived',
];

function noDupPush(list: string[], item: string) {
  if (!list.includes(item)) {
    list.push(item);
  }
}

function renderItems(name: string) {
  const st = (toMatch: string) => ({ color: name === toMatch ? c : '' });

  const codeDict: any = codes;
  const keys = orderedKeys.slice();
  Object.keys(codeDict).forEach(key => noDupPush(keys, key));
  return keys.map(key => (
    <div key={key} className="menuWrap" data-name={key} style={st(key)}>{key}</div>
  ));
}

export default React.memo(({ onClick, name }: any) => {
  const handleClick = e => {
    const name = e.target.dataset.name;
    if (name) {
      onClick?.(name);
    }
  };
  return (
    <div style={{ width: '120px' }} onClick={handleClick}>
      {renderItems(name)}
    </div>
  );
});
`},65333:function(f,n){n.Z=`import React from 'react'
import * as helux from 'helux'
import { Hook, Console, Decode } from 'console-feed';
import './index.less';

class HeluxConsole extends React.Component<any, { logs: any[] }> {
  state = {
    logs: [],
  }

  componentDidMount() {
    Hook(window.console, (log) => {
      this.setState(({ logs }) => ({ logs: [...logs, Decode(log)] }))
    });
    console.log(\`Welcome to helux playground (helux ver: \${helux.cst.VER})^_^\`);
  }

  render() {
    const clear = () => this.setState({ logs: [] });
    return (
      <div className="liveConsoleWrap">
        <button type="button" style={{ position: 'absolute', right: '12px', top: '1px', zIndex: 2000 }} onClick={clear}>clear</button>
        <div className="liveConsole">
          <Console logs={this.state.logs} variant="dark" />
        </div>
      </div>
    )
  }
}

export default React.memo(HeluxConsole);
`},38016:function(f,n){n.Z=`import React from "react";
import { IconButton } from "./icons/IconButton";

const stControlWrap: React.CSSProperties = { width: '156px', transform: 'translateX(-105px)' };
const stWrap: React.CSSProperties = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  padding: "8px",
  boxSizing: "border-box",
  backgroundColor: "transparent",
  left: "50%",
  top: "26px",
  width: "60px",
  transform: 'translateX(-15px)',
};

export const Tools: React.FC<any> = (props) => {
  const { mode, onControlClick, onRunClick, copyUrl, saveCode, resetCode, recoverCode } = props;
  const liveBtnStyle = mode === 'live' ? { backgroundColor: 'lightskyblue' } : {};
  const lagBtnStyle = mode === 'lag' ? { backgroundColor: 'lightskyblue' } : {};
  const manualBtnStyle = mode === 'manual' ? { backgroundColor: 'lightskyblue' } : {};

  return <div style={stWrap}>
    <div style={stControlWrap}>
      <IconButton
        name="\u5B9E\u65F6"
        title="\u9884\u89C8\u533A\u5B9E\u65F6\u54CD\u5E94\u7F16\u8F91\u5668\u4EE3\u7801"
        style={liveBtnStyle}
        onClick={() => onControlClick('live')}
      />
      <IconButton
        name="\u5EF6\u65F6"
        title="\u9884\u89C8\u533A\u5EF6\u65F6\u54CD\u5E94\u7F16\u8F91\u5668\u4EE3\u7801"
        style={lagBtnStyle}
        onClick={() => onControlClick('lag')}
      />
      <IconButton
        name="\u624B\u52A8"
        title="\u624B\u52A8\u70B9\u51FB\u8FD0\u884C\u540E\uFF0C\u9884\u89C8\u533A\u624D\u54CD\u5E94\u7F16\u8F91\u5668\u4EE3\u7801"
        style={manualBtnStyle}
        onClick={() => onControlClick('manual')}
      />
    </div>
    <IconButton name="\u91CD\u7F6E" title="\u91CD\u7F6E\u4EE3\u7801" onClick={resetCode} />
    {(mode === 'manual' || mode === 'lag') && <IconButton name="\u4FDD\u5B58" title="\u4FDD\u5B58\u4EE3\u7801" onClick={() => saveCode()} />}
    <IconButton name="\u6062\u590D" title="\u6062\u590D\u4FDD\u5B58\u4EE3\u7801" onClick={recoverCode} />
    {mode === 'manual' && <IconButton name="\u8FD0\u884C" title="\u8FD0\u884C\u4EE3\u7801" onClick={() => onRunClick?.()} />}
    <IconButton name="copy" title="\u590D\u5236\u5F53\u524D\u793A\u4F8B\u94FE\u63A5" onClick={() => copyUrl?.()} />
  </div>
}
`},14759:function(f,n){n.Z=`// @ts-nocheck
import React from 'react';
import './index.less';
import * as codes from './codes';

const labelAlias: any = {
  atom: {
    dict_atomx: 'dict(atomx)',
    dict_sharex: 'dict(sharex)',
  },
  reactive: {
    dict_atomx: 'dict(atomx)',
  },
  useReactive: {
    primitive_atomx: 'primitive(atomx)',
  },
};

function getLabel(name: string, subName: string) {
  return labelAlias[name]?.[subName] || subName;
}

function renderItems(name: string, subName: string) {
  const st = (toMatch: string) => subName === toMatch
    ? { backgroundColor: 'rgb(100, 90, 183)', color: '#fff' }
    : { backgroundColor: '', color: 'rgb(100, 90, 183)' };

  const codeDict: any = codes;
  const subDict = codeDict[name] || {};
  return Object.keys(subDict).map(key => (
    <div key={key} className="topBarItem" data-name={key} style={st(key)}>{getLabel(name, key)}</div>
  ));
}

export default React.memo(({ onClick, name, subName }: any) => {
  const handleClick = e => {
    const subName = e.target.dataset.name;
    if (subName) {
      onClick?.(subName);
    }
  };

  return (
    <div className="topBar" onClick={handleClick}>
      <span className='samples'>{renderItems(name, subName)}</span>
    </div>
  );
});
`},90123:function(f,n){n.Z=`import { share } from "helux";

const [codeContext,setCodeContext,codeCtx] = share<{
  key:string,
  code:string
}>({key:"",code:"",})

export {
  codeContext,
  setCodeContext,
  codeCtx
}
`},91069:function(f,n){n.Z=`
const primitive = \`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\\\`num is \\\${num.val}\\\`);
};

render(<button onClick={change}>change {$(num)}</button>);
\`;

const dict = \`
const [dict, setDict] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDict(draft => {
    // draft was already unboxed from { val: T } to T
    draft.b.b1.b2 += 100;
  })
  console.log('proxy dict.val.b ', dict.val.b);
  console.log('original dict.val.b ', limu.original(dict.val.b));
};

render(<button onClick={ change } > change { $(dict.val.b.b1.b2)}</button>);
\`;

const dict_atomx = \`
// stateRoot was still boxed,
// state was already unboxed from { val: T } to T
const { state, stateRoot, setDraft } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
  console.log('stateRoot.val.b.b1.b2 is ', stateRoot.val.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
\`;

const dict_sharex = \`
// state === stateRoot when use sharex
const { state, stateRoot, setDraft } = sharex({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  setDraft(draft => draft.b.b1.b2 += 100);
  console.log('state.b.b1.b2 is ', state.b.b1.b2);
  console.log('stateRoot.b.b1.b2 is ', stateRoot.b.b1.b2);
};

render(<button onClick={change}>change {$(state.b.b1.b2)}</button>);
\`;

export default {
  primitive,
  dict,
  dict_atomx,
  dict_sharex,
} as Record<string, string>;
`},95863:function(f,n){n.Z=`
// render(<button onClick={change}>change</button>);

// const changeBtnStr = \`render(<button onClick={change}>change</button>);\`

const primitive = \`
const [ num, setNum ] = atom(1);
const result = derive(()=> num.val + 1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\\\`num is \\\${num.val}\\\`);
  console.log(\\\`result is \\\${result.val}\\\`);
};

render(<button onClick={change}>change {$(result.val)}</button>);
\`;

const dict = \`
const [ num, setNum ] = atom(1);
// deriveDict has no boxed behavior
const result = deriveDict(()=> ({ plus1: num.val + 1, plus100: num.val + 100 }));

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\\\`num is \\\${num.val}\\\`);
  console.log('result is', result);
};

render(<button onClick={change}>change {$(result.plus1)} {$(result.plus100)}</button>);
\`;

export default {
  primitive,
  dict,
} as Record<string, string>;
`},1160:function(f,n){n.Z=`export { default as quickStart } from './quickStart';
export { default as atom } from './atom';
export { default as derive } from './derive';
export { default as watch } from './watch';
export { default as reactive } from './reactive';
export { default as signal } from './signal';
export { default as modular } from './modular';
export { default as useAtom } from './useAtom';
export { default as useDerived } from './useDerived';
export { default as useReactive } from './useReactive';
export { default as useWatch } from './useWatch';
`},8657:function(f,n){n.Z=`

const defineActions = \`
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
\`;

export default {
  defineActions,
} as Record<string, string>;
`},40029:function(f,n){n.Z=`const HelloHelux = \`
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
\`;

const HelloHeluxDict = \`
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
\`;

const DataBindWidthHook = \`
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
\`;

const DataBindWidthNoHook = \`
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
\`;

const DictDataBindWidthHook = \`
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
\`

const DictDataBindWidthNoHookUsingBlock = \`
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
\`


const ChangeStateWithActions = \`
const ctx = sharex({str: 'hello helux', asyncClicked: 0});
const delay = (ms=1000)=> new Promise(r=>setTimeout(r, ms));
const { actions, useLoading } = ctx.defineActions()({
  // sync action
  changeStr({ draft }) {
    draft.str = \\\`changed at \\\${Date.now()}\\\`;
  },
  // async action
  async changeStrAsync({ draft }) {
    await delay();
    draft.str = \\\`async changed at \\\${Date.now()}\\\`;
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
\`;

export default {
  HelloHelux,
  HelloHeluxDict,
  DataBindWidthHook,
  DataBindWidthNoHook,
  DictDataBindWidthHook,
  DictDataBindWidthNoHookUsingBlock,
  ChangeStateWithActions,
} as Record<string, string>;
`},90610:function(f,n){n.Z=`

const primitive = \`
const [ num, , { reactiveRoot } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
  setTimeout(()=>{
    console.log(\\\`num is \\\${num.val}\\\`);
  },0);
};

render(<button onClick={change}>change {$(num)}</button>);
\`;

const primitive_flush = \`
const [ num, , { reactiveRoot, flush: flushChanged } ] = atom(1);

const change = ()=> {
  reactiveRoot.val++; // commit at next tick
  flushChanged(); // commit changed data immediately
  console.log(\\\`num is \\\${num.val}\\\`);
};

render(<button onClick={change}>change {$(num)}</button>);
\`;

const dict = \`
// use unboxed reactive insteadof boxed reactiveRoot
const [dict, , { reactive }] = atom({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  reactive.b.b1.b2 += 100; // already unboxed
  setTimeout(()=>{
    console.log('reactive.b.b1.b2 is ', reactive.b.b1.b2);
  },0);
};

render(<button onClick={ change }> change { $(reactive.b.b1.b2)}</button>);
\`;

const dict_atomx = \`
// state was already unboxed from { val: T } to T
const { reactive } = atomx({ a: 1, b: { b1: { b2: 1 } } });

const change = () => {
  reactive.b.b1.b2 += 100; // already unboxed
  setTimeout(()=>{
    console.log('reactive.b.b1.b2 is ', reactive.b.b1.b2);
  },0);
};

render(<button onClick={change}>change {$(reactive.b.b1.b2)}</button>);
\`;


export default {
  primitive,
  primitive_flush,
  dict,
  dict_atomx,
} as Record<string, string>;
`},72936:function(f,n){n.Z=`const primitive = \`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\\\`num is \\\${num.val}\\\`);
};

render(<button onClick={change}>change {signal(num)}</button>);
\`;

const alias = \`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\\\`num is \\\${num.val}\\\`);
};

// use $ instead of signal to wrap shared state primitive value
render(<button onClick={change}>change {$(num)}</button>);
\`;

const format = \`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\\\`num is \\\${num.val}\\\`);
};

render(<button onClick={change}>change {$(num, (val)=>\\\`this is num \\\${val}\\\`)}</button>);
\`;

const block = \`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev=>prev+1);
  console.log(\\\`num is \\\${num.val}\\\`);
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
\`;

export default {
  primitive,
  alias,
  format,
  block,
} as Record<string, string>;
`},69912:function(f,n){n.Z=`
const primitive = \`
const [ num, setNum ] = atom(1);

const change = ()=> {
  setNum(prev => prev + 1);
  console.log(\\\`num is \\\${num.val}\\\`);
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
\`;

export default {
  primitive,
} as Record<string, string>;
`},6896:function(f,n){n.Z=`
const primitive = \`
const [ num, setNum ] = atom(1);
const result = derive(()=> num.val + 100);

const change = ()=> {
  setNum(prev => prev + 1);
  console.log(\\\`num is \\\${num.val}\\\`);
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
\`;

export default {
  primitive,
} as Record<string, string>;
`},36935:function(f,n){n.Z=`
const primitive = \`
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
\`;

const primitive_atomx = \`
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
\`;

export default {
  primitive,
  primitive_atomx,
} as Record<string, string>;
`},99661:function(f,n){n.Z=`
const primitive = \`
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
\`;

const dict = \`
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
\`;

export default {
  primitive,
  dict,
} as Record<string, string>;
`},30129:function(f,n){n.Z=`



const primitive = \`
const [num, setNum] = atom(1);
watch(
  // watch cb
  () => {
    console.log(\\\`change from \\\${getSnap(num).val} to \\\${num.val}\\\`);
  },
  // deps cb
  () => [num],
);

const change = () => {
  setNum(prev => prev + 1);
  console.log(\\\`num is \\\${num.val}\\\`);
};

render(<button onClick={change}>change {$(num)}</button>);
\`;

const dict = \`
const [dict, setDict] = atom({ a: 1, b: { b1: { b2: 1 } } });
watch(
  // watch cb
  () => {
    console.log(\\\`change from \\\${getSnap(dict).val.b.b1.b2} to \\\${dict.val.b.b1.b2}\\\`);
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

\`;

export default {
  primitive,
  dict,
} as Record<string, string>;
`},54066:function(f,n){n.Z=`import { ReactNode, ButtonHTMLAttributes } from "react"
import { ResetIcon } from "./Reset"
import { SaveIcon } from "./Save"

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
}

const defaultStyle = {
  width: "52px",
  height: "28x",
  cursor: "pointer",
  borderRadius: "12px",
  textAlign: 'center',
};

const icons: Record<string, ReactNode> = {
  save: <SaveIcon />,
  reset: <ResetIcon />,
  run: 'Run',
  copy: 'Copy',
}
export const IconButton: React.FC<IconButtonProps> = (props) => {
  const { name, style, ...rest } = props;
  console.log('style', style);
  const uiName = icons[name] || name;
  const stBtn = Object.assign({}, defaultStyle, style || {});
  return <button style={stBtn} {...rest} type="button">{uiName}</button>
}
`},4390:function(f,n){n.Z=`import { SVGProps } from "react";

export function ResetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="currentColor" strokeWidth="2" d="M20 8c-1.403-2.96-4.463-5-8-5a9 9 0 1 0 0 18a9 9 0 0 0 9-9m0-9v6h-6"></path></svg>
  )
}
`},28687:function(f,n){n.Z=`import { SVGProps } from "react";

export function SaveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M23.681 6.158L17.843.32a1.093 1.093 0 0 0-.771-.32H1.092C.489 0 .001.489.001 1.091v21.817c0 .603.489 1.091 1.091 1.091h21.817c.603 0 1.091-.489 1.091-1.091V6.928c0-.301-.122-.574-.32-.771zM6.549 2.182h6.546v5.819H6.546zm0 19.635v-5.818h10.905v5.818zm15.273 0h-2.185v-6.908c0-.603-.489-1.091-1.091-1.091H5.455c-.603 0-1.091.489-1.091 1.091v6.909H2.182V2.181h2.182V9.09c0 .603.489 1.091 1.091 1.091h8.728c.603 0 1.091-.489 1.091-1.091V2.181h1.344l5.199 5.199z"></path></svg>
  )
}
`},70232:function(f,n){n.Z=`.simple-playground-wrap {
  height: 800px;
  background-color: #ffffff;
  padding: 12px 0;
}

.simple-playground-wrap .prism-code {
  height: 740px;
}

.simple-playground-wrap .topBarItem {
  display: inline-block;
  height: 22px;
  color: #fff;
  padding: 0 6px;
  font-size: 14px;
  line-height: 22px;
  margin: 2px 5px;
}

.simple-playground-wrap .topBarItem:hover {
  cursor: pointer;
}

.simple-playground-wrap .menuWrap:hover {
  cursor: pointer;
}

.simple-playground-wrap .liveConsoleWrap {
  position: relative;
  height: 50%;
}

.simple-playground-wrap .liveConsole {
  background-color: #242424;
  height: 100%;
  overflow-y: auto;
}

.leftMenuWrap {
  width: 120px;
  display: inline-block;
  vertical-align: top;
  padding: 38px 0 0 12px;
  box-sizing: border-box;
}

.playground-wrap {
  width: 100vw;
  height: calc(100vh - 76px);
  position: fixed;
  left: 0px;
  top: 76px;
  z-index: 1;
  background-color: rgb(255, 255, 255);
}

/** \u7F8E\u5316\u6EDA\u52A8\u6761 [Start] */
.playground-wrap .prism-code:-webkit-scrollbar {
  width: 5px !important;
  height: 5px !important;
}

.playground-wrap .prism-code::-webkit-scrollbar-track {
  width: 5px !important;
  background: hsla(0, 0%, 100%, 0.1) !important;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

.playground-wrap .prism-code::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 100%, 0.2) !important;
  background-color: #c1c1c1 !important;
  background-clip: padding-box;
  min-height: 28px;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}

.playground-wrap .prism-code::-webkit-scrollbar-thumb:hover {
  background-color: #443082 !important;
}

.playground-wrap .prism-code {
  height: calc(100vh - 138px);
}

.playground-wrap .liveErr {
  color: red;
}

.playground-wrap .liveConsoleWrap {
  position: relative;
  height: 50%;
}

.playground-wrap .liveConsole {
  background-color: #242424;
  height: 100%;
  overflow-y: auto;
}

.playground-wrap .menuWrap {
  display: block;
  height: 28px;
  color: #4f5866;
  font-size: 16px;
  line-height: 28px;
  text-decoration: none;
  transition: all 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playground-wrap .topBar {
  width: 200%;
  height: 28px;
  z-index: 200;
  border: 1px solid #443782;
  box-sizing: border-box;
  position: relative;
  display: flex;
}

.playground-wrap .topBar>.samples {
  display: flex;
  flex-grow: 1;
}

.playground-wrap .topBarItem {
  display: inline-block;
  height: 22px;
  color: #fff;
  padding: 0 6px;
  font-size: 14px;
  line-height: 22px;
  margin: 2px 5px;
}

.playground-wrap .topBarItem:hover {
  cursor: pointer;
}

.playground-wrap .menuWrap:hover {
  cursor: pointer;
}
`},9258:function(f,n){n.Z=`import React, { useCallback, useEffect } from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import copyTo from 'copy-to-clipboard';
import qs from "qs";
import * as prism from 'prism-react-renderer';
import * as helux from 'helux';
import { useWatch } from 'helux';
import localforage from 'localforage';
// TODO toast \u65E0\u6548
// import { toast } from 'react-toastify';

import ApiMenus from './ApiMenus';
import TopBar from './TopBar';
import Console from './Console';
import * as codes from './codes';
import './index.less';
import { Tools } from './Tools';
import { setCodeContext, codeContext } from './codeContext';

function getCode(name: any, subName: any) {
  const codeDict: any = codes;
  return codeDict[name]?.[subName] || '';
}

const scope = { helux, React, ...helux };
const subNames: Record<string, string> = {
  quickStart: 'HelloHelux',
  atom: 'primitive',
  derive: 'primitive',
  modular: 'defineActions',
};
const cachedSubNames: any = {};
const obj = qs.parse(window.location.search, { ignoreQueryPrefix: true });
const name: string = (obj.n || 'atom') as unknown as string;
const subName: string = (obj.s || 'primitive') as unknown as string;
const initCode = getCode(name, subName);
setCodeContext(draft => {
  draft.key = \`\${name}_\${subName}\`
})
function loadCode(name: any, subName: any, setCode: any) {
  localforage.getItem(\`helux_code_\${name}_\${subName}\`, (err: any, value: any) => {
    if (!err && typeof (value) === 'string' && value.trim().length > 0) {
      setCode(value);
    } else {
      setCode(getCode(name, subName));
    }
  })
}

let timer: any;

function useLogic(name = 'atom', subName = 'primitive') {
  const [info, setInfo] = React.useState({ name, subName });
  const [code, setCode] = React.useState(initCode);
  const [mode, setMode] = React.useState('live'); // live lag manual
  const [compKey, setCompKey] = React.useState(Date.now());
  const codeCacheRef = React.useRef(code);

  const clickRun = () => {
    setCode(codeCacheRef.current);
    setCompKey(Date.now());
  };
  const onControlClick = (mode: string) => {
    setMode(mode);
  };
  const copyUrl = () => {
    const url = \`\${window.location.origin}?n=\${info.name}&s=\${info.subName}\`;
    copyTo(url);
    console.log('\u590D\u5236\u5F53\u524D\u793A\u4F8B\u5206\u4EAB\u94FE\u63A5\u6210\u529F', url);
  };
  const saveCode = () => {
    localforage.setItem(\`helux_code_\${info.name}_\${info.subName}\`, codeCacheRef.current, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('\u4FDD\u5B58\u6210\u529F');
    });
  };
  const changeEditorCode = (value: string) => {
    codeCacheRef.current = value;
    setCode(value);
    setCompKey(Date.now());
  };
  const recoverCode = () => {
    localforage.getItem(\`helux_code_\${info.name}_\${info.subName}\`, (err, value: string | null) => {
      if (err) {
        return alert(err.message);
      }
      if (!value) {
        return alert('\u65E0\u6700\u8FD1\u4FDD\u5B58\u7684\u4EE3\u7801\u53EF\u6062\u590D');
      }
      changeEditorCode(value);
    });
  };
  const resetCode = () => {
    changeEditorCode(getCode(info.name, info.subName));
    console.log('\u91CD\u7F6E\u793A\u4F8B\u4EE3\u7801\u6210\u529F');
  };

  useEffect(() => {
    loadCode(name, subName, setCode);
  }, []);

  useWatch(() => {
    const curCode = codeContext.code;
    if (curCode.trim().length === 0) {
      loadCode(name, subName, setCode);
    }
  }, () => [codeContext.code]);

  const changeCode = useCallback((name: string) => {
    const subName = cachedSubNames[name] || subNames[name] || 'primitive';
    setCodeContext(draft => { draft.key = \`\${name}_\${subName}\` });
    setInfo({ name, subName });
    loadCode(name, subName, setCode);
  }, [info.name, info.subName]);

  const changeSubName = useCallback((subName: string) => {
    const { name } = info;
    cachedSubNames[name] = subName;
    setCodeContext(draft => {
      draft.key = \`\${name}_\${subName}\`;
    });

    setInfo({ name, subName });
    loadCode(name, subName, setCode);
  }, [info.name, info.subName]);

  const onEditorCodeChange = (value: string) => {
    if (mode !== 'lag') {
      // \u662F\u624B\u52A8\uFF0C\u4EC5\u4FDD\u5B58\u4EE3\u7801
      codeCacheRef.current = value;
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      changeEditorCode(value);
    }, 1000);
  };

  return {
    info, code, changeCode, changeSubName, onControlClick, mode, compKey, clickRun,
    onEditorCodeChange, copyUrl, saveCode, resetCode, recoverCode, changeEditorCode,
  };
}

export function SimplePlayground() {
  const { info, code, changeCode, changeSubName } = useLogic('quickStart', 'HelloHelux');
  return (
    <LiveProvider noInline={true} code={code} scope={scope} theme={prism.themes.vsDark}>
      <div className="simple-playground-wrap">
        <div className="leftMenuWrap">
          <ApiMenus onClick={changeCode} name={info.name} />
        </div>
        <div style={{ width: 'calc(100% - 120px)', display: 'inline-block' }}>
          <TopBar onClick={changeSubName} name={info.name} subName={info.subName} />
          <div style={{ display: "flex", height: '100%', paddingTop: '12px' }}>
            <div style={{ flex: "1 1 0px", height: '100%' }}>
              <LiveEditor style={{ flexGrow: 1 }} />
            </div>
            <div style={{ flex: "1 1 0px", height: '543px' }}>
              <div style={{ height: '90%', padding: '12px', boxSizing: 'border-box', border: '1px solid #e8ae56' }}>
                <LiveError className="liveErr" />
                <LivePreview />
              </div>
              <Console />
            </div>
          </div>
        </div>
      </div>
    </LiveProvider>
  );
}

export default () => {
  const {
    info, code, changeCode, changeSubName, onControlClick, mode, clickRun, compKey,
    onEditorCodeChange, copyUrl, saveCode, resetCode, recoverCode,
  } = useLogic(name, subName);

  return (
    <LiveProvider key={compKey} noInline={true} code={code} scope={scope} theme={prism.themes.vsDark}>
      <div className="playground-wrap">
        <div className="leftMenuWrap">
          <ApiMenus onClick={changeCode} name={info.name} />
        </div>
        <div style={{ width: 'calc(100% - 120px)', display: 'inline-block' }}>
          <TopBar onClick={changeSubName} name={info.name} subName={info.subName} />
          <div style={{ display: "flex", height: '100%', padding: '0 2px' }}>
            <div style={{ flex: "1 1 0px", height: '100%' }}>
              {mode === 'live' && <LiveEditor style={{ flexGrow: 1 }} />}
              {mode !== 'live' && <LiveEditor style={{ flexGrow: 1 }} onChange={onEditorCodeChange} />}
              <Tools
                onRunClick={clickRun}
                onControlClick={onControlClick}
                copyUrl={copyUrl}
                mode={mode}
                saveCode={saveCode}
                resetCode={resetCode}
                recoverCode={recoverCode}
              />
            </div>
            <div style={{ flex: "1 1 0px", height: 'calc(100vh - 118px)' }}>
              <div style={{ height: '50%', padding: '12px', boxSizing: 'border-box', border: '1px solid #e8ae56' }}>
                <LiveError className="liveErr" />
                <LivePreview />
              </div>
              <Console />
            </div>
          </div>
        </div>
      </div>
    </LiveProvider>
  );
};
`}}]);
