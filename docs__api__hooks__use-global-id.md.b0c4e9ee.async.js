"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[4315],{70450:function(L,E,n){n.r(E);var y=n(31974),A=n(68804),C=n(14755),O=n(26713),D=n(81511),T=n(31177),S=n(2131),p=n(90167),P=n(70079),s=n(35250);function g(){var M=(0,p.eL)(),t=M.texts;return(0,s.jsx)(p.dY,{children:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)("div",{className:"markdown",children:[(0,s.jsxs)("h1",{id:"useglobalid",children:[(0,s.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#useglobalid",children:(0,s.jsx)("span",{className:"icon icon-link"})}),"useGlobalId"]}),(0,s.jsxs)("p",{children:[t[0].value,(0,s.jsx)("code",{children:t[1].value}),t[2].value,(0,s.jsx)("code",{children:t[3].value}),t[4].value]}),(0,s.jsx)("div",{children:(0,s.jsxs)("p",{children:[t[5].value,(0,s.jsx)("code",{children:t[6].value}),t[7].value,(0,s.jsx)(p.rU,{to:"/api/base/atom#rules",children:t[8].value}),t[9].value]})}),(0,s.jsxs)("h2",{id:"\u57FA\u7840\u7528\u6CD5",children:[(0,s.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u57FA\u7840\u7528\u6CD5",children:(0,s.jsx)("span",{className:"icon icon-link"})}),"\u57FA\u7840\u7528\u6CD5"]})]}),(0,s.jsx)(p.Dl,{demo:{id:"docs-api-hooks-use-global-id-demo-0"},previewerProps:{defaultShowCode:!0}})]})})}E.default=g},31974:function(L,E,n){var y=n(24325),A=n.n(y),C=n(28633),O=n.n(C),D=n(90167),T=n(70079),S=n(31177),p=n(35250),P={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var r=this,o=[];return Object.entries(e.properties||{}).forEach(function(f){var u,l=O()(f,2),h=l[0],_=l[1];o.push("".concat(h).concat((u=e.required)!==null&&u!==void 0&&u.includes(h)?"":"?",": ").concat(_.type==="object"?"object":r.toString(_)))}),o.length?"{ ".concat(o.join("; ")," }"):"{}"},array:function(e){if(e.items){var r=this.getValidClassName(e.items);return r?"".concat(r,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var r=this,o=e.signature;if(!o)return"Function";var f="oneOf"in o?o.oneOf:[o];return f.map(function(u){return"".concat(u.isAsync?"async ":"","(").concat(u.arguments.map(function(l){return"".concat(l.key,": ").concat(r.toString(l))}).join(", "),") => ").concat(r.toString(u.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(r){return JSON.stringify(r)}).join(" | ")},oneOf:function(e){var r=this;return e.oneOf.map(function(o){return r.getValidClassName(o)||r.toString(o)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},s=function(e){var r=useState(function(){return P.toString(e)}),o=_slicedToArray(r,2),f=o[0],u=o[1];return useEffect(function(){u(P.toString(e))},[e]),_jsx("code",{children:f})},g=function(e){var r,o=useRouteMeta(),f=o.frontmatter,u=useAtomAssets(),l=u.components,h=e.id||f.atomId,_=useIntl();if(!h)throw new Error("`id` properties if required for API component!");var x=l==null?void 0:l[h];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:_.formatMessage({id:"api.component.name"})}),_jsx("th",{children:_.formatMessage({id:"api.component.description"})}),_jsx("th",{children:_.formatMessage({id:"api.component.type"})}),_jsx("th",{children:_.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:x&&(r=x.propsConfig)!==null&&r!==void 0&&r.properties?Object.entries(x.propsConfig.properties).map(function(m){var v,c=_slicedToArray(m,2),i=c[0],a=c[1];return _jsxs("tr",{children:[_jsx("td",{children:i}),_jsx("td",{children:a.description||"--"}),_jsx("td",{children:_jsx(s,_objectSpread({},a))}),_jsx("td",{children:_jsx("code",{children:(v=x.propsConfig.required)!==null&&v!==void 0&&v.includes(i)?_.formatMessage({id:"api.component.required"}):JSON.stringify(a.default)||"--"})})]},i)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:_.formatMessage({id:"api.component.".concat(l?"not.found":"unavailable")},{id:h})})})})]})})},M=null},68804:function(L,E,n){var y=n(24325),A=n(35250),C=function(T){return _jsx("span",_objectSpread({className:"dumi-default-badge"},T))},O=null},31177:function(L,E,n){var y=n(24325),A=n(28633),C=n(19317),O=n(14315),D=n(70079),T=n(35250),S=null,p=function(g){var M=g.children,t=_objectWithoutProperties(g,S),e=useRef(null),r=useState(!1),o=_slicedToArray(r,2),f=o[0],u=o[1],l=useState(!1),h=_slicedToArray(l,2),_=h[0],x=h[1];return useEffect(function(){var m=e.current;if(m){var v=throttle(function(){u(m.scrollLeft>0),x(m.scrollLeft<m.scrollWidth-m.offsetWidth)},100);return v(),m.addEventListener("scroll",v),window.addEventListener("resize",v),function(){m.removeEventListener("scroll",v),window.removeEventListener("resize",v)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":f||void 0,"data-right-folded":_||void 0,children:_jsx("table",_objectSpread(_objectSpread({},t),{},{children:M}))})})},P=null},2131:function(L,E,n){n.d(E,{Z:function(){return v}});var y=n(24325),A=n.n(y),C=n(28633),O=n.n(C),D=n(12027),T=n.n(D),S=n(77324),p=n(88570),P=n(79275),s=n(60895),g=n(39865),M=n(1687),t=n(70079),e=n(35250);function r(c){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",a=[];return[].concat(c).forEach(function(d,I){var j="".concat(i?"".concat(i,"-"):"").concat(I);switch(d==null?void 0:d.type){case"ul":{var b,N=((b=a[a.length-1])===null||b===void 0?void 0:b.children)||a,B=r(d.props.children||[],j);N.push.apply(N,T()(B));break}case"li":{var R=r(d.props.children,j);a.push({title:[].concat(d.props.children).filter(function(W){return W.type!=="ul"}),key:j,children:R,isLeaf:!R.length});break}default:}}),a}var o=function(i){var a=(0,t.useState)(r(i)),d=O()(a,2),I=d[0],j=d[1];return(0,t.useEffect)(function(){j(r(i))},[i]),I},f=function(i){var a=i.isLeaf,d=i.expanded;return a?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(S.r,{fill:"currentColor"})}):d?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(p.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(P.r,{fill:"currentColor"})})},u=function(i){var a=i.isLeaf,d=i.expanded;return a?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):d?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(s.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(g.r,{fill:"currentColor"})})})},l=function(){return{height:0,opacity:0}},h=function(i){var a=i.scrollHeight;return{height:a,opacity:1}},_=function(i){return{height:i?i.offsetHeight:0}},x=function(i,a){return(a==null?void 0:a.deadline)===!0||a.propertyName==="height"},m={motionName:"ant-motion-collapse",onAppearStart:l,onEnterStart:l,onAppearActive:h,onEnterActive:h,onLeaveStart:_,onLeaveActive:l,onAppearEnd:x,onEnterEnd:x,onLeaveEnd:x,motionDeadline:500},v=function(c){var i=o(c.children),a=(0,t.createRef)(),d=function(j,b){var N=b.isLeaf;N||j.shiftKey||j.metaKey||j.ctrlKey||a.current.onNodeExpand(j,b)};return(0,e.jsx)(M.Z,{className:"dumi-default-tree",icon:f,ref:a,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:A()(A()({},m),{},{motionAppear:!1}),onClick:d,treeData:[{key:"0",title:c.title||"<root>",children:i}],defaultExpandAll:!0,switcherIcon:u})}}}]);
