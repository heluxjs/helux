"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[262],{31974:function(K,M,t){var g=t(24325),F=t.n(g),T=t(28633),P=t.n(T),m=t(90167),b=t(70079),B=t(31177),x=t(35250),L={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var o=this,a=[];return Object.entries(e.properties||{}).forEach(function(E){var h,n=P()(E,2),p=n[0],f=n[1];a.push("".concat(p).concat((h=e.required)!==null&&h!==void 0&&h.includes(p)?"":"?",": ").concat(f.type==="object"?"object":o.toString(f)))}),a.length?"{ ".concat(a.join("; ")," }"):"{}"},array:function(e){if(e.items){var o=this.getValidClassName(e.items);return o?"".concat(o,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var o=this,a=e.signature;if(!a)return"Function";var E="oneOf"in a?a.oneOf:[a];return E.map(function(h){return"".concat(h.isAsync?"async ":"","(").concat(h.arguments.map(function(n){return"".concat(n.key,": ").concat(o.toString(n))}).join(", "),") => ").concat(o.toString(h.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(o){return JSON.stringify(o)}).join(" | ")},oneOf:function(e){var o=this;return e.oneOf.map(function(a){return o.getValidClassName(a)||o.toString(a)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},D=function(e){var o=useState(function(){return L.toString(e)}),a=_slicedToArray(o,2),E=a[0],h=a[1];return useEffect(function(){h(L.toString(e))},[e]),_jsx("code",{children:E})},I=function(e){var o,a=useRouteMeta(),E=a.frontmatter,h=useAtomAssets(),n=h.components,p=e.id||E.atomId,f=useIntl();if(!p)throw new Error("`id` properties if required for API component!");var C=n==null?void 0:n[p];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:f.formatMessage({id:"api.component.name"})}),_jsx("th",{children:f.formatMessage({id:"api.component.description"})}),_jsx("th",{children:f.formatMessage({id:"api.component.type"})}),_jsx("th",{children:f.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:C&&(o=C.propsConfig)!==null&&o!==void 0&&o.properties?Object.entries(C.propsConfig.properties).map(function(_){var j,d=_slicedToArray(_,2),i=d[0],s=d[1];return _jsxs("tr",{children:[_jsx("td",{children:i}),_jsx("td",{children:s.description||"--"}),_jsx("td",{children:_jsx(D,_objectSpread({},s))}),_jsx("td",{children:_jsx("code",{children:(j=C.propsConfig.required)!==null&&j!==void 0&&j.includes(i)?f.formatMessage({id:"api.component.required"}):JSON.stringify(s.default)||"--"})})]},i)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:f.formatMessage({id:"api.component.".concat(n?"not.found":"unavailable")},{id:p})})})})]})})},W=null},68804:function(K,M,t){var g=t(24325),F=t(35250),T=function(b){return _jsx("span",_objectSpread({className:"dumi-default-badge"},b))},P=null},8219:function(K,M,t){t.d(M,{Z:function(){return X}});var g=t(70079),F=t(28633),T=t.n(F),P=t(24325),m=t.n(P),b=t(18207),B=t(84083),x=t.n(B),L=t(5027),D=t(73649),I=t(87067),W=t(71120),u=t(74081),e=t(41393),o=t(77786),a=t(58638),E=t(75829),h=t.n(E),n=t(35250);function p(r,l){var y,S=e;return((y=S[r])===null||y===void 0?void 0:y[l])||""}var f=m()({helux:D,React:g},D),C={quickStart:"HelloHelux",atom:"primitive",derive:"primitive",modular:"defineActions"},_={},j=x().parse(window.location.search,{ignoreQueryPrefix:!0}),d=j.n||"atom",i=j.s||"primitive",s=p(d,i);(0,a.EI)(function(r){r.key="".concat(d,"_").concat(i)});function c(r,l,y){h().getItem("helux_code_".concat(r,"_").concat(l),function(S,v){!S&&typeof v=="string"&&v.trim().length>0?y(v):y(p(r,l))})}function R(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"atom",l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"primitive",y=g.useState({name:r,subName:l}),S=T()(y,2),v=S[0],G=S[1],Y=g.useState(s),J=T()(Y,2),q=J[0],z=J[1];(0,g.useEffect)(function(){c(r,l,z)},[]),(0,D.useWatch)(function(){var N=a.U0.code;N.trim().length===0&&c(r,l,z)},function(){return[a.U0.code]});var ee=(0,g.useCallback)(function(N){var O=_[N]||C[N]||"primitive";(0,a.EI)(function(V){V.key="".concat(N,"_").concat(O)}),G({name:N,subName:O}),c(N,O,z)},[v.name,v.subName]),te=(0,g.useCallback)(function(N){var O=v.name;_[O]=N,(0,a.EI)(function(V){V.key="".concat(O,"_").concat(N)}),G({name:O,subName:N}),c(O,N,z)},[v.name,v.subName]);return{info:v,code:q,changeCode:ee,changeSubName:te}}function A(){var r=R("quickStart","HelloHelux"),l=r.info,y=r.code,S=r.changeCode,v=r.changeSubName;return(0,n.jsx)(b.nu,{noInline:!0,code:y,scope:f,theme:L.np.vsDark,children:(0,n.jsxs)("div",{className:"simple-playground-wrap",children:[(0,n.jsx)("div",{className:"leftMenuWrap",children:(0,n.jsx)(I.Z,{onClick:S,name:l.name})}),(0,n.jsxs)("div",{style:{width:"calc(100% - 120px)",display:"inline-block"},children:[(0,n.jsx)(W.Z,{onClick:v,name:l.name,subName:l.subName}),(0,n.jsxs)("div",{style:{display:"flex",height:"100%",paddingTop:"12px"},children:[(0,n.jsx)("div",{style:{flex:"1 1 0px",height:"100%"},children:(0,n.jsx)(b.uz,{style:{flexGrow:1}})}),(0,n.jsxs)("div",{style:{flex:"1 1 0px",height:"543px"},children:[(0,n.jsxs)("div",{style:{height:"90%",padding:"12px",boxSizing:"border-box",border:"1px solid #e8ae56"},children:[(0,n.jsx)(b.IF,{className:"liveErr"}),(0,n.jsx)(b.i5,{})]}),(0,n.jsx)(u.Z,{})]})]})]})]})})}var w=function(){var r=R(d,i),l=r.info,y=r.code,S=r.changeCode,v=r.changeSubName;return _jsx(LiveProvider,{noInline:!0,code:y,scope:f,theme:prism.themes.vsDark,children:_jsxs("div",{className:"playground-wrap",children:[_jsx("div",{className:"leftMenuWrap",children:_jsx(ApiMenus,{onClick:S,name:l.name})}),_jsxs("div",{style:{width:"calc(100% - 120px)",display:"inline-block"},children:[_jsx(TopBar,{onClick:v,name:l.name,subName:l.subName}),_jsxs("div",{style:{display:"flex",height:"100%",padding:"0 2px"},children:[_jsx("div",{style:{flex:"1 1 0px",height:"100%"},children:_jsx(LiveEditor,{style:{flexGrow:1}})}),_jsxs("div",{style:{flex:"1 1 0px",height:"calc(100vh - 118px)"},children:[_jsxs("div",{style:{height:"50%",padding:"12px",boxSizing:"border-box",border:"1px solid #e8ae56"},children:[_jsx(LiveError,{className:"liveErr"}),_jsx(LivePreview,{})]}),_jsx(Console,{})]})]})]})]})})};function H(r){var l=r.item,y=l.title,S=l.description,v=l.imgSrc;return(0,n.jsxs)("div",{className:"dumi-default-features-item hx-feature-item",children:[(0,n.jsx)("div",{style:{textAlign:"center"},children:(0,n.jsx)("img",{src:v,style:{width:"88px",height:"88px"}})}),(0,n.jsx)("span",{style:{color:"rgb(100, 90, 183)"},children:(0,n.jsx)("h2",{children:y})}),(0,n.jsx)("span",{style:{color:"gray"},children:(0,n.jsx)("p",{children:S})})]})}function k(r){return(0,n.jsx)("div",{className:"dumi-default-features","data-cols":"3",style:{padding:0},children:r.featureList.map(function(l){return(0,n.jsx)(H,{item:l},l.title)})})}var U=["https://tnfe.gtimg.com/image/harzqyxcgz_1651755973579.png","https://tnfe.gtimg.com/image/p40w0k40pt_1651755965504.png","https://tnfe.gtimg.com/image/fxy2nbeh43_1651755969439.png","https://tnfe.gtimg.com/image/bxzj46o32k_1651755962175.png","https://tnfe.gtimg.com/image/ngex07gcez_1651755956158.png","https://tnfe.gtimg.com/image/harzqyxcgz_1651755973579.png"];function $(r){return U[r]||U[0]}var Z=[{title:"atom",description:"atom \u652F\u6301\u4EFB\u610F\u6570\u636E\u7ED3\u6784\uFF0C\u5BF9\u975E\u539F\u59CB\u7C7B\u578B\u6570\u636E\u5185\u7F6E\u4F9D\u8D56\u6536\u96C6\u529F\u80FD\uFF0C \u610F\u5473\u7740 atom \u4E0D\u7528\u62C6\u5206\u7684\u5F88\u7EC6\uFF0C\u5929\u7136\u5BF9 DDD \u9886\u57DF\u9A71\u52A8\u8BBE\u8BA1\u53CB\u597D"},{title:"signal",description:"\u5185\u7F6E signal \u54CD\u5E94\u673A\u5236\uFF0C\u53EF\u5B9E\u73B0 0 hook \u7F16\u7801 + dom \u7C92\u5EA6\u7684\u66F4\u65B0"},{title:"\u4F9D\u8D56\u8FFD\u8E2A",description:"\u57FA\u4E8E\u6700\u5FEB\u7684\u4E0D\u53EF\u53D8 js \u5E93 limu \u505A\u5230\u8FD0\u884C\u65F6\u5BF9\u89C6\u56FE\u6E32\u67D3\u5B9E\u65F6\u6536\u96C6\u6570\u636E\u4F9D\u8D56\uFF0C\u63D0\u4F9B\u8D85\u5F3A\u6E32\u67D3\u6027\u80FD"},{title:"reactive",description:"\u63D0\u4F9B\u5168\u5C40\u54CD\u5E94\u5F0F\u5BF9\u8C61\uFF0C\u6570\u636E\u53D8\u66F4\u76F4\u63A5\u9A71\u52A8\u5173\u8054ui\u6E32\u67D3\uFF08\u9ED8\u8BA4\u5728\u4E0B\u4E00\u4E2A\u4E8B\u4EF6\u5FAA\u73AF\u5FAE\u4EFB\u52A1\u5F00\u59CB\u524D\u63D0\u4EA4\uFF0C\u652F\u6301\u4EBA\u5DE5\u63D0\u4EA4\u53D8\u66F4\u6570\u636E\uFF09"},{title:"modular",description:"\u652F\u6301\u5BF9\u72B6\u6001\u6A21\u5757\u5316\u62BD\u8C61\uFF0C\u5E76\u5185\u7F6E actions\u3001derive\u3001watch\u3001loading \u7B49\u7279\u6027\uFF0C\u8F7B\u677E\u9A7E\u9A6D\u5927\u578B\u524D\u7AEF\u5E94\u7528\u67B6\u6784"},{title:"middleware&plugin",description:"\u5185\u7F6E\u4E2D\u95F4\u4EF6\u548C\u63D2\u4EF6\u7CFB\u7EDF\uFF0C\u65E0\u7F1D\u8854\u63A5redux\u751F\u6001\u4F18\u79C0\u7EC4\u4EF6"}];Z.forEach(function(r,l){return r.imgSrc=$(l)});var Q=function(){return(0,n.jsxs)("div",{style:{width:"100%"},children:[(0,n.jsx)(A,{}),(0,n.jsx)(k,{featureList:Z}),(0,n.jsxs)("div",{style:{width:"48%",display:"inline-block"},children:[(0,n.jsx)("h4",{children:"\u{1F4E6} \u4E86\u89E3\u66F4\u591A"}),(0,n.jsx)("p",{children:"\u6B22\u8FCE\u5165\u7FA4\u4E86\u89E3\u66F4\u591A\uFF0C\u7531\u4E8E\u5FAE\u4FE1\u8BA8\u8BBA\u7FA4\u53F7 200 \u4EBA\u5DF2\u6EE1\uFF0C\u9700\u52A0\u4F5C\u8005\u5FAE\u4FE1\u53F7\u6216 qq \u7FA4\u53F7\uFF0C\u518D\u9080\u8BF7\u4F60\u5982helux & hel\u8BA8\u8BBA\u7FA4\uFF08\u52A0\u53F7\u65F6\u8BB0\u5F97\u5907\u6CE8 helux \u6216 hel\uFF09"}),(0,n.jsx)("img",{src:"https://tnfe.gtimg.com/image/7fz74bhk84_1705216873301.png",style:{width:"100%"}})]}),(0,n.jsx)("div",{style:{width:"4%",display:"inline-block"}}),(0,n.jsxs)("div",{style:{width:"48%",display:"inline-block"},children:[(0,n.jsx)("h4",{children:"\u2764\uFE0F\u200D\u{1F525} \u8D5E\u8D4F"}),(0,n.jsx)("p",{children:"\u5C0F\u5C0F\u9F13\u52B1\uFF0C\u7ED9\u4E88\u6211\u4EEC\u66F4\u591A\u529B\u91CF\u575A\u6301\u505A\u51FA\u66F4\u597D\u7684\u5F00\u6E90\u9879\u76EE"}),(0,n.jsx)("img",{src:"https://tnfe.gtimg.com/image/5a2u6arzpo_1705217036205.png",style:{width:"100%"}})]})]})},X=g.memo(Q)},8951:function(K,M,t){var g=t(24325),F=t.n(g),T=t(70079),P=t(8343),m=t(35250);function b(x){return(0,m.jsx)("svg",F()(F()({xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 24 24"},x),{},{children:(0,m.jsx)("path",{fill:"currentColor",fillRule:"evenodd",d:"M11.999 1C5.926 1 1 5.925 1 12c0 4.86 3.152 8.983 7.523 10.437c.55.102.75-.238.75-.53c0-.26-.009-.952-.014-1.87c-3.06.664-3.706-1.475-3.706-1.475c-.5-1.27-1.221-1.61-1.221-1.61c-.999-.681.075-.668.075-.668c1.105.078 1.685 1.134 1.685 1.134c.981 1.68 2.575 1.195 3.202.914c.1-.71.384-1.195.698-1.47c-2.442-.278-5.01-1.222-5.01-5.437c0-1.2.428-2.183 1.132-2.952c-.114-.278-.491-1.397.108-2.91c0 0 .923-.297 3.025 1.127A10.536 10.536 0 0 1 12 6.32a10.49 10.49 0 0 1 2.754.37c2.1-1.424 3.022-1.128 3.022-1.128c.6 1.514.223 2.633.11 2.911c.705.769 1.13 1.751 1.13 2.952c0 4.226-2.572 5.156-5.022 5.428c.395.34.747 1.01.747 2.037c0 1.47-.014 2.657-.014 3.017c0 .295.199.637.756.53C19.851 20.979 23 16.859 23 12c0-6.075-4.926-11-11.001-11"})}))}function B(x){return _jsx("svg",_objectSpread(_objectSpread({xmlns:"http://www.w3.org/2000/svg",width:"30",height:"30",viewBox:"0 0 24 24"},x),{},{children:_jsx("path",{fill:"none",stroke:"currentColor",d:"M1 22V9.76a2 2 0 0 1 .851-1.636l9.575-6.72a1 1 0 0 1 1.149 0l9.574 6.72A2 2 0 0 1 23 9.76V22a1 1 0 0 1-1 1h-5.333a1 1 0 0 1-1-1v-5.674a1 1 0 0 0-1-1H9.333a1 1 0 0 0-1 1V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"})}))}M.ZP=(0,P.zo)(function(x,L){var D=L.className;return(0,m.jsxs)("div",{className:D,children:[(0,m.jsx)("a",{className:"logo",target:"_blank",title:"\u8BBF\u95EE\u5B98\u7F51",href:x.website,children:(0,m.jsx)("img",{src:x.logo})}),(0,m.jsxs)("span",{className:"content",children:[(0,m.jsx)("div",{className:"title",children:x.name}),(0,m.jsx)("div",{className:"description",children:x.description})]}),(0,m.jsx)("a",{className:"repo",target:"_blank",title:"\u5F00\u6E90\u4ED3\u5E93",href:x.repo,children:(0,m.jsx)(b,{})})]})},{display:"flex",flexDirection:"row",border:"1px solid #ccc",margin:"8px","&:hover":{border:"1px solid #18baff"},"& > .logo":{backgroundColor:"#eaeaea",width:"64px",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column","& > img":{width:"32px",height:"32px",borderRadius:"32px"}},"& > .content":{padding:"8px",flexGrow:1,"& > .title":{fontWeight:"bold"},"& > .description":{paddingTop:"4px",color:"gray"}},"& > .website":{width:"32px",height:"32px","& > svg":{paddingTop:"16px",color:"gray"}},"& > .repo":{width:"64px",height:"64px",textAlign:"center","& > svg":{paddingTop:"16px",color:"gray"}}})},31177:function(K,M,t){var g=t(24325),F=t(28633),T=t(19317),P=t(14315),m=t(70079),b=t(35250),B=null,x=function(I){var W=I.children,u=_objectWithoutProperties(I,B),e=useRef(null),o=useState(!1),a=_slicedToArray(o,2),E=a[0],h=a[1],n=useState(!1),p=_slicedToArray(n,2),f=p[0],C=p[1];return useEffect(function(){var _=e.current;if(_){var j=throttle(function(){h(_.scrollLeft>0),C(_.scrollLeft<_.scrollWidth-_.offsetWidth)},100);return j(),_.addEventListener("scroll",j),window.addEventListener("resize",j),function(){_.removeEventListener("scroll",j),window.removeEventListener("resize",j)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":E||void 0,"data-right-folded":f||void 0,children:_jsx("table",_objectSpread(_objectSpread({},u),{},{children:W}))})})},L=null},2131:function(K,M,t){t.d(M,{Z:function(){return j}});var g=t(24325),F=t.n(g),T=t(28633),P=t.n(T),m=t(12027),b=t.n(m),B=t(77324),x=t(88570),L=t(79275),D=t(60895),I=t(39865),W=t(1687),u=t(70079),e=t(35250);function o(d){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",s=[];return[].concat(d).forEach(function(c,R){var A="".concat(i?"".concat(i,"-"):"").concat(R);switch(c==null?void 0:c.type){case"ul":{var w,H=((w=s[s.length-1])===null||w===void 0?void 0:w.children)||s,k=o(c.props.children||[],A);H.push.apply(H,b()(k));break}case"li":{var U=o(c.props.children,A);s.push({title:[].concat(c.props.children).filter(function($){return $.type!=="ul"}),key:A,children:U,isLeaf:!U.length});break}default:}}),s}var a=function(i){var s=(0,u.useState)(o(i)),c=P()(s,2),R=c[0],A=c[1];return(0,u.useEffect)(function(){A(o(i))},[i]),R},E=function(i){var s=i.isLeaf,c=i.expanded;return s?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(B.r,{fill:"currentColor"})}):c?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(x.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(L.r,{fill:"currentColor"})})},h=function(i){var s=i.isLeaf,c=i.expanded;return s?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):c?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(D.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(I.r,{fill:"currentColor"})})})},n=function(){return{height:0,opacity:0}},p=function(i){var s=i.scrollHeight;return{height:s,opacity:1}},f=function(i){return{height:i?i.offsetHeight:0}},C=function(i,s){return(s==null?void 0:s.deadline)===!0||s.propertyName==="height"},_={motionName:"ant-motion-collapse",onAppearStart:n,onEnterStart:n,onAppearActive:p,onEnterActive:p,onLeaveStart:f,onLeaveActive:n,onAppearEnd:C,onEnterEnd:C,onLeaveEnd:C,motionDeadline:500},j=function(d){var i=a(d.children),s=(0,u.createRef)(),c=function(A,w){var H=w.isLeaf;H||A.shiftKey||A.metaKey||A.ctrlKey||s.current.onNodeExpand(A,w)};return(0,e.jsx)(W.Z,{className:"dumi-default-tree",icon:E,ref:s,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:F()(F()({},_),{},{motionAppear:!1}),onClick:c,treeData:[{key:"0",title:d.title||"<root>",children:i}],defaultExpandAll:!0,switcherIcon:h})}}}]);
