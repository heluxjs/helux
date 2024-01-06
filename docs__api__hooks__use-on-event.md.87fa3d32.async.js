"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[1457],{94218:function(L,E,n){n.r(E);var C=n(31974),A=n(68804),g=n(14755),O=n(26713),b=n(81511),T=n(31177),S=n(2131),p=n(90167),D=n(70079),t=n(35250);function y(){var P=(0,p.eL)(),r=P.texts;return(0,t.jsx)(p.dY,{children:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"markdown",children:[(0,t.jsxs)("h1",{id:"useonevent",children:[(0,t.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#useonevent",children:(0,t.jsx)("span",{className:"icon icon-link"})}),"useOnEvent"]}),(0,t.jsx)("p",{children:r[0].value}),(0,t.jsxs)("h2",{id:"\u57FA\u7840\u7528\u6CD5",children:[(0,t.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u57FA\u7840\u7528\u6CD5",children:(0,t.jsx)("span",{className:"icon icon-link"})}),"\u57FA\u7840\u7528\u6CD5"]}),(0,t.jsxs)("h3",{id:"\u76D1\u542C\u4E8B\u4EF6",children:[(0,t.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u76D1\u542C\u4E8B\u4EF6",children:(0,t.jsx)("span",{className:"icon icon-link"})}),"\u76D1\u542C\u4E8B\u4EF6"]})]}),(0,t.jsx)(p.Dl,{demo:{id:"docs-api-hooks-use-on-event-demo-0"},previewerProps:{defaultShowCode:!0}}),(0,t.jsxs)("div",{className:"markdown",children:[(0,t.jsxs)("h3",{id:"\u65E0\u95ED\u5305\u9677\u9631",children:[(0,t.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u65E0\u95ED\u5305\u9677\u9631",children:(0,t.jsx)("span",{className:"icon icon-link"})}),"\u65E0\u95ED\u5305\u9677\u9631"]}),(0,t.jsxs)("p",{children:[(0,t.jsx)("code",{children:r[1].value}),r[2].value]})]}),(0,t.jsx)(g.Z,{type:"info",children:(0,t.jsxs)("p",{children:[r[3].value,(0,t.jsx)("code",{children:r[4].value}),r[5].value,(0,t.jsx)("code",{children:r[6].value}),r[7].value,(0,t.jsx)("code",{children:r[8].value}),r[9].value]})}),(0,t.jsx)(p.Dl,{demo:{id:"docs-api-hooks-use-on-event-demo-1"},previewerProps:{defaultShowCode:!0}})]})})}E.default=y},31974:function(L,E,n){var C=n(24325),A=n.n(C),g=n(28633),O=n.n(g),b=n(90167),T=n(70079),S=n(31177),p=n(35250),D={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var i=this,o=[];return Object.entries(e.properties||{}).forEach(function(f){var u,l=O()(f,2),h=l[0],_=l[1];o.push("".concat(h).concat((u=e.required)!==null&&u!==void 0&&u.includes(h)?"":"?",": ").concat(_.type==="object"?"object":i.toString(_)))}),o.length?"{ ".concat(o.join("; ")," }"):"{}"},array:function(e){if(e.items){var i=this.getValidClassName(e.items);return i?"".concat(i,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var i=this,o=e.signature;if(!o)return"Function";var f="oneOf"in o?o.oneOf:[o];return f.map(function(u){return"".concat(u.isAsync?"async ":"","(").concat(u.arguments.map(function(l){return"".concat(l.key,": ").concat(i.toString(l))}).join(", "),") => ").concat(i.toString(u.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(i){return JSON.stringify(i)}).join(" | ")},oneOf:function(e){var i=this;return e.oneOf.map(function(o){return i.getValidClassName(o)||i.toString(o)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},t=function(e){var i=useState(function(){return D.toString(e)}),o=_slicedToArray(i,2),f=o[0],u=o[1];return useEffect(function(){u(D.toString(e))},[e]),_jsx("code",{children:f})},y=function(e){var i,o=useRouteMeta(),f=o.frontmatter,u=useAtomAssets(),l=u.components,h=e.id||f.atomId,_=useIntl();if(!h)throw new Error("`id` properties if required for API component!");var x=l==null?void 0:l[h];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:_.formatMessage({id:"api.component.name"})}),_jsx("th",{children:_.formatMessage({id:"api.component.description"})}),_jsx("th",{children:_.formatMessage({id:"api.component.type"})}),_jsx("th",{children:_.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:x&&(i=x.propsConfig)!==null&&i!==void 0&&i.properties?Object.entries(x.propsConfig.properties).map(function(m){var v,c=_slicedToArray(m,2),s=c[0],a=c[1];return _jsxs("tr",{children:[_jsx("td",{children:s}),_jsx("td",{children:a.description||"--"}),_jsx("td",{children:_jsx(t,_objectSpread({},a))}),_jsx("td",{children:_jsx("code",{children:(v=x.propsConfig.required)!==null&&v!==void 0&&v.includes(s)?_.formatMessage({id:"api.component.required"}):JSON.stringify(a.default)||"--"})})]},s)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:_.formatMessage({id:"api.component.".concat(l?"not.found":"unavailable")},{id:h})})})})]})})},P=null},68804:function(L,E,n){var C=n(24325),A=n(35250),g=function(T){return _jsx("span",_objectSpread({className:"dumi-default-badge"},T))},O=null},31177:function(L,E,n){var C=n(24325),A=n(28633),g=n(19317),O=n(14315),b=n(70079),T=n(35250),S=null,p=function(y){var P=y.children,r=_objectWithoutProperties(y,S),e=useRef(null),i=useState(!1),o=_slicedToArray(i,2),f=o[0],u=o[1],l=useState(!1),h=_slicedToArray(l,2),_=h[0],x=h[1];return useEffect(function(){var m=e.current;if(m){var v=throttle(function(){u(m.scrollLeft>0),x(m.scrollLeft<m.scrollWidth-m.offsetWidth)},100);return v(),m.addEventListener("scroll",v),window.addEventListener("resize",v),function(){m.removeEventListener("scroll",v),window.removeEventListener("resize",v)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":f||void 0,"data-right-folded":_||void 0,children:_jsx("table",_objectSpread(_objectSpread({},r),{},{children:P}))})})},D=null},2131:function(L,E,n){n.d(E,{Z:function(){return v}});var C=n(24325),A=n.n(C),g=n(28633),O=n.n(g),b=n(12027),T=n.n(b),S=n(77324),p=n(88570),D=n(79275),t=n(60895),y=n(39865),P=n(1687),r=n(70079),e=n(35250);function i(c){var s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",a=[];return[].concat(c).forEach(function(d,I){var j="".concat(s?"".concat(s,"-"):"").concat(I);switch(d==null?void 0:d.type){case"ul":{var M,N=((M=a[a.length-1])===null||M===void 0?void 0:M.children)||a,B=i(d.props.children||[],j);N.push.apply(N,T()(B));break}case"li":{var R=i(d.props.children,j);a.push({title:[].concat(d.props.children).filter(function(W){return W.type!=="ul"}),key:j,children:R,isLeaf:!R.length});break}default:}}),a}var o=function(s){var a=(0,r.useState)(i(s)),d=O()(a,2),I=d[0],j=d[1];return(0,r.useEffect)(function(){j(i(s))},[s]),I},f=function(s){var a=s.isLeaf,d=s.expanded;return a?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(S.r,{fill:"currentColor"})}):d?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(p.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(D.r,{fill:"currentColor"})})},u=function(s){var a=s.isLeaf,d=s.expanded;return a?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):d?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(t.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(y.r,{fill:"currentColor"})})})},l=function(){return{height:0,opacity:0}},h=function(s){var a=s.scrollHeight;return{height:a,opacity:1}},_=function(s){return{height:s?s.offsetHeight:0}},x=function(s,a){return(a==null?void 0:a.deadline)===!0||a.propertyName==="height"},m={motionName:"ant-motion-collapse",onAppearStart:l,onEnterStart:l,onAppearActive:h,onEnterActive:h,onLeaveStart:_,onLeaveActive:l,onAppearEnd:x,onEnterEnd:x,onLeaveEnd:x,motionDeadline:500},v=function(c){var s=o(c.children),a=(0,r.createRef)(),d=function(j,M){var N=M.isLeaf;N||j.shiftKey||j.metaKey||j.ctrlKey||a.current.onNodeExpand(j,M)};return(0,e.jsx)(P.Z,{className:"dumi-default-tree",icon:f,ref:a,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:A()(A()({},m),{},{motionAppear:!1}),onClick:d,treeData:[{key:"0",title:c.title||"<root>",children:s}],defaultExpandAll:!0,switcherIcon:u})}}}]);
