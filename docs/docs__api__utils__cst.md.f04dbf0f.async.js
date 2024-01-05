"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[5061],{61660:function(S,x,t){t.r(x);var y=t(4311),E=t(53267),D=t(82197),A=t(12620),O=t(74692),T=t(33296),L=t(12133),C=t(54996),M=t(70079),c=t(35250);function j(){var P=(0,C.eL)(),n=P.texts;return(0,c.jsx)(C.dY,{children:(0,c.jsx)(c.Fragment,{children:(0,c.jsxs)("div",{className:"markdown",children:[(0,c.jsxs)("h1",{id:"cst",children:[(0,c.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#cst",children:(0,c.jsx)("span",{className:"icon icon-link"})}),"cst"]}),(0,c.jsxs)("p",{children:[n[0].value,(0,c.jsx)("code",{children:n[1].value}),n[2].value]}),(0,c.jsx)(O.Z,{lang:"ts",children:n[3].value})]})})})}x.default=j},4311:function(S,x,t){var y=t(39114),E=t.n(y),D=t(70125),A=t.n(D),O=t(54996),T=t(70079),L=t(33296),C=t(35250),M={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var r=this,o=[];return Object.entries(e.properties||{}).forEach(function(h){var l,i=A()(h,2),f=i[0],d=i[1];o.push("".concat(f).concat((l=e.required)!==null&&l!==void 0&&l.includes(f)?"":"?",": ").concat(d.type==="object"?"object":r.toString(d)))}),o.length?"{ ".concat(o.join("; ")," }"):"{}"},array:function(e){if(e.items){var r=this.getValidClassName(e.items);return r?"".concat(r,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var r=this,o=e.signature;if(!o)return"Function";var h="oneOf"in o?o.oneOf:[o];return h.map(function(l){return"".concat(l.isAsync?"async ":"","(").concat(l.arguments.map(function(i){return"".concat(i.key,": ").concat(r.toString(i))}).join(", "),") => ").concat(r.toString(l.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(r){return JSON.stringify(r)}).join(" | ")},oneOf:function(e){var r=this;return e.oneOf.map(function(o){return r.getValidClassName(o)||r.toString(o)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},c=function(e){var r=useState(function(){return M.toString(e)}),o=_slicedToArray(r,2),h=o[0],l=o[1];return useEffect(function(){l(M.toString(e))},[e]),_jsx("code",{children:h})},j=function(e){var r,o=useRouteMeta(),h=o.frontmatter,l=useAtomAssets(),i=l.components,f=e.id||h.atomId,d=useIntl();if(!f)throw new Error("`id` properties if required for API component!");var p=i==null?void 0:i[f];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:d.formatMessage({id:"api.component.name"})}),_jsx("th",{children:d.formatMessage({id:"api.component.description"})}),_jsx("th",{children:d.formatMessage({id:"api.component.type"})}),_jsx("th",{children:d.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:p&&(r=p.propsConfig)!==null&&r!==void 0&&r.properties?Object.entries(p.propsConfig.properties).map(function(m){var v,u=_slicedToArray(m,2),a=u[0],s=u[1];return _jsxs("tr",{children:[_jsx("td",{children:a}),_jsx("td",{children:s.description||"--"}),_jsx("td",{children:_jsx(c,_objectSpread({},s))}),_jsx("td",{children:_jsx("code",{children:(v=p.propsConfig.required)!==null&&v!==void 0&&v.includes(a)?d.formatMessage({id:"api.component.required"}):JSON.stringify(s.default)||"--"})})]},a)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:d.formatMessage({id:"api.component.".concat(i?"not.found":"unavailable")},{id:f})})})})]})})},P=null},53267:function(S,x,t){var y=t(39114),E=t(35250),D=function(T){return _jsx("span",_objectSpread({className:"dumi-default-badge"},T))},A=null},33296:function(S,x,t){var y=t(39114),E=t(70125),D=t(11221),A=t(14315),O=t(70079),T=t(35250),L=null,C=function(j){var P=j.children,n=_objectWithoutProperties(j,L),e=useRef(null),r=useState(!1),o=_slicedToArray(r,2),h=o[0],l=o[1],i=useState(!1),f=_slicedToArray(i,2),d=f[0],p=f[1];return useEffect(function(){var m=e.current;if(m){var v=throttle(function(){l(m.scrollLeft>0),p(m.scrollLeft<m.scrollWidth-m.offsetWidth)},100);return v(),m.addEventListener("scroll",v),window.addEventListener("resize",v),function(){m.removeEventListener("scroll",v),window.removeEventListener("resize",v)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":h||void 0,"data-right-folded":d||void 0,children:_jsx("table",_objectSpread(_objectSpread({},n),{},{children:P}))})})},M=null},12133:function(S,x,t){t.d(x,{Z:function(){return v}});var y=t(39114),E=t.n(y),D=t(70125),A=t.n(D),O=t(79664),T=t.n(O),L=t(53474),C=t(23057),M=t(322),c=t(56261),j=t(23433),P=t(18838),n=t(70079),e=t(35250);function r(u){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",s=[];return[].concat(u).forEach(function(_,I){var g="".concat(a?"".concat(a,"-"):"").concat(I);switch(_==null?void 0:_.type){case"ul":{var b,N=((b=s[s.length-1])===null||b===void 0?void 0:b.children)||s,R=r(_.props.children||[],g);N.push.apply(N,T()(R));break}case"li":{var U=r(_.props.children,g);s.push({title:[].concat(_.props.children).filter(function(B){return B.type!=="ul"}),key:g,children:U,isLeaf:!U.length});break}default:}}),s}var o=function(a){var s=(0,n.useState)(r(a)),_=A()(s,2),I=_[0],g=_[1];return(0,n.useEffect)(function(){g(r(a))},[a]),I},h=function(a){var s=a.isLeaf,_=a.expanded;return s?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(L.r,{fill:"currentColor"})}):_?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(C.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(M.r,{fill:"currentColor"})})},l=function(a){var s=a.isLeaf,_=a.expanded;return s?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):_?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(c.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(j.r,{fill:"currentColor"})})})},i=function(){return{height:0,opacity:0}},f=function(a){var s=a.scrollHeight;return{height:s,opacity:1}},d=function(a){return{height:a?a.offsetHeight:0}},p=function(a,s){return(s==null?void 0:s.deadline)===!0||s.propertyName==="height"},m={motionName:"ant-motion-collapse",onAppearStart:i,onEnterStart:i,onAppearActive:f,onEnterActive:f,onLeaveStart:d,onLeaveActive:i,onAppearEnd:p,onEnterEnd:p,onLeaveEnd:p,motionDeadline:500},v=function(u){var a=o(u.children),s=(0,n.createRef)(),_=function(g,b){var N=b.isLeaf;N||g.shiftKey||g.metaKey||g.ctrlKey||s.current.onNodeExpand(g,b)};return(0,e.jsx)(P.Z,{className:"dumi-default-tree",icon:h,ref:s,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:E()(E()({},m),{},{motionAppear:!1}),onClick:_,treeData:[{key:"0",title:u.title||"<root>",children:a}],defaultExpandAll:!0,switcherIcon:l})}}}]);