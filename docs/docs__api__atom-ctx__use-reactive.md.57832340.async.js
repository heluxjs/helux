"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[7554],{90490:function(S,x,t){t.r(x);var D=t(4311),A=t(53267),j=t(82197),O=t(12620),b=t(74692),T=t(33296),L=t(12133),y=t(54996),C=t(70079),i=t(35250);function E(){var M=(0,y.eL)(),n=M.texts;return(0,i.jsx)(y.dY,{children:(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("div",{className:"markdown",children:[(0,i.jsxs)("h1",{id:"usereactive",children:[(0,i.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#usereactive",children:(0,i.jsx)("span",{className:"icon icon-link"})}),"useReactive"]}),(0,i.jsxs)("p",{children:[n[0].value,(0,i.jsx)("code",{children:n[1].value}),n[2].value]}),(0,i.jsx)("hr",{})]}),(0,i.jsx)(j.Z,{type:"info",children:(0,i.jsxs)("p",{children:[n[3].value,(0,i.jsx)(y.rU,{to:"/api/hooks/use-reactive",children:n[4].value}),n[5].value]})})]})})}x.default=E},4311:function(S,x,t){var D=t(39114),A=t.n(D),j=t(70125),O=t.n(j),b=t(54996),T=t(70079),L=t(33296),y=t(35250),C={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var r=this,o=[];return Object.entries(e.properties||{}).forEach(function(h){var l,c=O()(h,2),f=c[0],d=c[1];o.push("".concat(f).concat((l=e.required)!==null&&l!==void 0&&l.includes(f)?"":"?",": ").concat(d.type==="object"?"object":r.toString(d)))}),o.length?"{ ".concat(o.join("; ")," }"):"{}"},array:function(e){if(e.items){var r=this.getValidClassName(e.items);return r?"".concat(r,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var r=this,o=e.signature;if(!o)return"Function";var h="oneOf"in o?o.oneOf:[o];return h.map(function(l){return"".concat(l.isAsync?"async ":"","(").concat(l.arguments.map(function(c){return"".concat(c.key,": ").concat(r.toString(c))}).join(", "),") => ").concat(r.toString(l.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(r){return JSON.stringify(r)}).join(" | ")},oneOf:function(e){var r=this;return e.oneOf.map(function(o){return r.getValidClassName(o)||r.toString(o)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},i=function(e){var r=useState(function(){return C.toString(e)}),o=_slicedToArray(r,2),h=o[0],l=o[1];return useEffect(function(){l(C.toString(e))},[e]),_jsx("code",{children:h})},E=function(e){var r,o=useRouteMeta(),h=o.frontmatter,l=useAtomAssets(),c=l.components,f=e.id||h.atomId,d=useIntl();if(!f)throw new Error("`id` properties if required for API component!");var p=c==null?void 0:c[f];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:d.formatMessage({id:"api.component.name"})}),_jsx("th",{children:d.formatMessage({id:"api.component.description"})}),_jsx("th",{children:d.formatMessage({id:"api.component.type"})}),_jsx("th",{children:d.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:p&&(r=p.propsConfig)!==null&&r!==void 0&&r.properties?Object.entries(p.propsConfig.properties).map(function(m){var v,_=_slicedToArray(m,2),a=_[0],s=_[1];return _jsxs("tr",{children:[_jsx("td",{children:a}),_jsx("td",{children:s.description||"--"}),_jsx("td",{children:_jsx(i,_objectSpread({},s))}),_jsx("td",{children:_jsx("code",{children:(v=p.propsConfig.required)!==null&&v!==void 0&&v.includes(a)?d.formatMessage({id:"api.component.required"}):JSON.stringify(s.default)||"--"})})]},a)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:d.formatMessage({id:"api.component.".concat(c?"not.found":"unavailable")},{id:f})})})})]})})},M=null},53267:function(S,x,t){var D=t(39114),A=t(35250),j=function(T){return _jsx("span",_objectSpread({className:"dumi-default-badge"},T))},O=null},33296:function(S,x,t){var D=t(39114),A=t(70125),j=t(11221),O=t(14315),b=t(70079),T=t(35250),L=null,y=function(E){var M=E.children,n=_objectWithoutProperties(E,L),e=useRef(null),r=useState(!1),o=_slicedToArray(r,2),h=o[0],l=o[1],c=useState(!1),f=_slicedToArray(c,2),d=f[0],p=f[1];return useEffect(function(){var m=e.current;if(m){var v=throttle(function(){l(m.scrollLeft>0),p(m.scrollLeft<m.scrollWidth-m.offsetWidth)},100);return v(),m.addEventListener("scroll",v),window.addEventListener("resize",v),function(){m.removeEventListener("scroll",v),window.removeEventListener("resize",v)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":h||void 0,"data-right-folded":d||void 0,children:_jsx("table",_objectSpread(_objectSpread({},n),{},{children:M}))})})},C=null},12133:function(S,x,t){t.d(x,{Z:function(){return v}});var D=t(39114),A=t.n(D),j=t(70125),O=t.n(j),b=t(79664),T=t.n(b),L=t(53474),y=t(23057),C=t(322),i=t(56261),E=t(23433),M=t(18838),n=t(70079),e=t(35250);function r(_){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",s=[];return[].concat(_).forEach(function(u,I){var g="".concat(a?"".concat(a,"-"):"").concat(I);switch(u==null?void 0:u.type){case"ul":{var P,N=((P=s[s.length-1])===null||P===void 0?void 0:P.children)||s,R=r(u.props.children||[],g);N.push.apply(N,T()(R));break}case"li":{var U=r(u.props.children,g);s.push({title:[].concat(u.props.children).filter(function(B){return B.type!=="ul"}),key:g,children:U,isLeaf:!U.length});break}default:}}),s}var o=function(a){var s=(0,n.useState)(r(a)),u=O()(s,2),I=u[0],g=u[1];return(0,n.useEffect)(function(){g(r(a))},[a]),I},h=function(a){var s=a.isLeaf,u=a.expanded;return s?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(L.r,{fill:"currentColor"})}):u?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(y.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(C.r,{fill:"currentColor"})})},l=function(a){var s=a.isLeaf,u=a.expanded;return s?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):u?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(i.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(E.r,{fill:"currentColor"})})})},c=function(){return{height:0,opacity:0}},f=function(a){var s=a.scrollHeight;return{height:s,opacity:1}},d=function(a){return{height:a?a.offsetHeight:0}},p=function(a,s){return(s==null?void 0:s.deadline)===!0||s.propertyName==="height"},m={motionName:"ant-motion-collapse",onAppearStart:c,onEnterStart:c,onAppearActive:f,onEnterActive:f,onLeaveStart:d,onLeaveActive:c,onAppearEnd:p,onEnterEnd:p,onLeaveEnd:p,motionDeadline:500},v=function(_){var a=o(_.children),s=(0,n.createRef)(),u=function(g,P){var N=P.isLeaf;N||g.shiftKey||g.metaKey||g.ctrlKey||s.current.onNodeExpand(g,P)};return(0,e.jsx)(M.Z,{className:"dumi-default-tree",icon:h,ref:s,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:A()(A()({},m),{},{motionAppear:!1}),onClick:u,treeData:[{key:"0",title:_.title||"<root>",children:a}],defaultExpandAll:!0,switcherIcon:l})}}}]);