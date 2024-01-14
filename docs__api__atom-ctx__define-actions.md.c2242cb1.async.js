"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[439],{46877:function(T,p,n){n.r(p);var C=n(31974),o=n(68804),g=n(14755),y=n(26713),D=n(92645),O=n(31177),F=n(2131),L=n(30606),A=n(90167),b=n(70079),a=n(35250);function M(){var u=(0,A.eL)(),e=u.texts;return(0,a.jsx)(A.dY,{children:(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)("div",{className:"markdown",children:[(0,a.jsxs)("h1",{id:"defineactions",children:[(0,a.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#defineactions",children:(0,a.jsx)("span",{className:"icon icon-link"})}),"defineActions"]}),(0,a.jsxs)("p",{children:[e[0].value,(0,a.jsx)("code",{children:e[1].value}),e[2].value,(0,a.jsx)("code",{children:e[3].value}),e[4].value]})]}),(0,a.jsx)(g.Z,{type:"info",children:(0,a.jsxs)("p",{children:[e[5].value,(0,a.jsx)(A.rU,{to:"/guide/modular#defineactions",children:e[6].value})]})}),(0,a.jsx)("div",{className:"markdown",children:(0,a.jsx)(D.Z,{lang:"ts",children:e[7].value})})]})})}p.default=M},31974:function(T,p,n){var C=n(24325),o=n.n(C),g=n(28633),y=n.n(g),D=n(90167),O=n(70079),F=n(31177),L=n(35250),A={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var t=this,s=[];return Object.entries(e.properties||{}).forEach(function(m){var d,l=y()(m,2),f=l[0],h=l[1];s.push("".concat(f).concat((d=e.required)!==null&&d!==void 0&&d.includes(f)?"":"?",": ").concat(h.type==="object"?"object":t.toString(h)))}),s.length?"{ ".concat(s.join("; ")," }"):"{}"},array:function(e){if(e.items){var t=this.getValidClassName(e.items);return t?"".concat(t,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var t=this,s=e.signature;if(!s)return"Function";var m="oneOf"in s?s.oneOf:[s];return m.map(function(d){return"".concat(d.isAsync?"async ":"","(").concat(d.arguments.map(function(l){return"".concat(l.key,": ").concat(t.toString(l))}).join(", "),") => ").concat(t.toString(d.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(t){return JSON.stringify(t)}).join(" | ")},oneOf:function(e){var t=this;return e.oneOf.map(function(s){return t.getValidClassName(s)||t.toString(s)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},b=function(e){var t=useState(function(){return A.toString(e)}),s=_slicedToArray(t,2),m=s[0],d=s[1];return useEffect(function(){d(A.toString(e))},[e]),_jsx("code",{children:m})},a=function(e){var t,s=useRouteMeta(),m=s.frontmatter,d=useAtomAssets(),l=d.components,f=e.id||m.atomId,h=useIntl();if(!f)throw new Error("`id` properties if required for API component!");var E=l==null?void 0:l[f];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:h.formatMessage({id:"api.component.name"})}),_jsx("th",{children:h.formatMessage({id:"api.component.description"})}),_jsx("th",{children:h.formatMessage({id:"api.component.type"})}),_jsx("th",{children:h.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:E&&(t=E.propsConfig)!==null&&t!==void 0&&t.properties?Object.entries(E.propsConfig.properties).map(function(v){var x,_=_slicedToArray(v,2),i=_[0],r=_[1];return _jsxs("tr",{children:[_jsx("td",{children:i}),_jsx("td",{children:r.description||"--"}),_jsx("td",{children:_jsx(b,_objectSpread({},r))}),_jsx("td",{children:_jsx("code",{children:(x=E.propsConfig.required)!==null&&x!==void 0&&x.includes(i)?h.formatMessage({id:"api.component.required"}):JSON.stringify(r.default)||"--"})})]},i)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:h.formatMessage({id:"api.component.".concat(l?"not.found":"unavailable")},{id:f})})})})]})})},M=null},68804:function(T,p,n){var C=n(24325),o=n(35250),g=function(O){return _jsx("span",_objectSpread({className:"dumi-default-badge"},O))},y=null},30606:function(T,p,n){var C=n(70079),o=n(35250),g=function(){return(0,o.jsxs)("div",{style:{width:"100%"},children:[(0,o.jsxs)("div",{style:{width:"48%",display:"inline-block"},children:[(0,o.jsx)("h4",{children:"\u{1F4E6} \u4E86\u89E3\u66F4\u591A"}),(0,o.jsx)("p",{children:"\u6B22\u8FCE\u5165\u7FA4\u4E86\u89E3\u66F4\u591A\uFF0C\u7531\u4E8E\u5FAE\u4FE1\u8BA8\u8BBA\u7FA4\u53F7 200 \u4EBA\u5DF2\u6EE1\uFF0C\u9700\u52A0\u4F5C\u8005\u5FAE\u4FE1\u53F7\u6216 qq \u7FA4\u53F7\uFF0C\u518D\u9080\u8BF7\u4F60\u5982helux & hel\u8BA8\u8BBA\u7FA4\uFF08\u52A0\u53F7\u65F6\u8BB0\u5F97\u5907\u6CE8 helux \u6216 hel\uFF09"}),(0,o.jsx)("img",{src:"https://tnfe.gtimg.com/image/7fz74bhk84_1705216873301.png",style:{width:"100%"}})]}),(0,o.jsx)("div",{style:{width:"4%",display:"inline-block"}}),(0,o.jsxs)("div",{style:{width:"48%",display:"inline-block"},children:[(0,o.jsx)("h4",{children:"\u2764\uFE0F\u200D\u{1F525} \u8D5E\u8D4F"}),(0,o.jsx)("p",{children:"\u5C0F\u5C0F\u9F13\u52B1\uFF0C\u7ED9\u4E88\u6211\u4EEC\u66F4\u591A\u529B\u91CF\u575A\u6301\u505A\u51FA\u66F4\u597D\u7684\u5F00\u6E90\u9879\u76EE"}),(0,o.jsx)("img",{src:"https://tnfe.gtimg.com/image/5a2u6arzpo_1705217036205.png",style:{width:"100%"}})]})]})};p.Z=C.memo(g)},31177:function(T,p,n){var C=n(24325),o=n(28633),g=n(19317),y=n(14315),D=n(70079),O=n(35250),F=null,L=function(a){var M=a.children,u=_objectWithoutProperties(a,F),e=useRef(null),t=useState(!1),s=_slicedToArray(t,2),m=s[0],d=s[1],l=useState(!1),f=_slicedToArray(l,2),h=f[0],E=f[1];return useEffect(function(){var v=e.current;if(v){var x=throttle(function(){d(v.scrollLeft>0),E(v.scrollLeft<v.scrollWidth-v.offsetWidth)},100);return x(),v.addEventListener("scroll",x),window.addEventListener("resize",x),function(){v.removeEventListener("scroll",x),window.removeEventListener("resize",x)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":m||void 0,"data-right-folded":h||void 0,children:_jsx("table",_objectSpread(_objectSpread({},u),{},{children:M}))})})},A=null},2131:function(T,p,n){n.d(p,{Z:function(){return x}});var C=n(24325),o=n.n(C),g=n(28633),y=n.n(g),D=n(12027),O=n.n(D),F=n(77324),L=n(88570),A=n(79275),b=n(60895),a=n(39865),M=n(1687),u=n(70079),e=n(35250);function t(_){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",r=[];return[].concat(_).forEach(function(c,S){var j="".concat(i?"".concat(i,"-"):"").concat(S);switch(c==null?void 0:c.type){case"ul":{var P,B=((P=r[r.length-1])===null||P===void 0?void 0:P.children)||r,N=t(c.props.children||[],j);B.push.apply(B,O()(N));break}case"li":{var I=t(c.props.children,j);r.push({title:[].concat(c.props.children).filter(function(R){return R.type!=="ul"}),key:j,children:I,isLeaf:!I.length});break}default:}}),r}var s=function(i){var r=(0,u.useState)(t(i)),c=y()(r,2),S=c[0],j=c[1];return(0,u.useEffect)(function(){j(t(i))},[i]),S},m=function(i){var r=i.isLeaf,c=i.expanded;return r?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(F.r,{fill:"currentColor"})}):c?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(L.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(A.r,{fill:"currentColor"})})},d=function(i){var r=i.isLeaf,c=i.expanded;return r?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):c?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(b.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(a.r,{fill:"currentColor"})})})},l=function(){return{height:0,opacity:0}},f=function(i){var r=i.scrollHeight;return{height:r,opacity:1}},h=function(i){return{height:i?i.offsetHeight:0}},E=function(i,r){return(r==null?void 0:r.deadline)===!0||r.propertyName==="height"},v={motionName:"ant-motion-collapse",onAppearStart:l,onEnterStart:l,onAppearActive:f,onEnterActive:f,onLeaveStart:h,onLeaveActive:l,onAppearEnd:E,onEnterEnd:E,onLeaveEnd:E,motionDeadline:500},x=function(_){var i=s(_.children),r=(0,u.createRef)(),c=function(j,P){var B=P.isLeaf;B||j.shiftKey||j.metaKey||j.ctrlKey||r.current.onNodeExpand(j,P)};return(0,e.jsx)(M.Z,{className:"dumi-default-tree",icon:m,ref:r,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:o()(o()({},v),{},{motionAppear:!1}),onClick:c,treeData:[{key:"0",title:_.title||"<root>",children:i}],defaultExpandAll:!0,switcherIcon:d})}}}]);