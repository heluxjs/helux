"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[8740],{25252:function(S,x,t){t.r(x);var E=t(4311),j=t(53267),D=t(82197),A=t(12620),b=t(74692),O=t(33296),L=t(12133),T=t(54996),C=t(70079),d=t(35250);function y(){var M=(0,T.eL)(),a=M.texts;return(0,d.jsx)(T.dY,{children:(0,d.jsx)(d.Fragment,{children:(0,d.jsx)("div",{className:"markdown",children:(0,d.jsxs)("h1",{id:"stateval",children:[(0,d.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#stateval",children:(0,d.jsx)("span",{className:"icon icon-link"})}),"stateVal"]})})})})}x.default=y},4311:function(S,x,t){var E=t(39114),j=t.n(E),D=t(70125),A=t.n(D),b=t(54996),O=t(70079),L=t(33296),T=t(35250),C={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var n=this,o=[];return Object.entries(e.properties||{}).forEach(function(m){var c,i=A()(m,2),f=i[0],u=i[1];o.push("".concat(f).concat((c=e.required)!==null&&c!==void 0&&c.includes(f)?"":"?",": ").concat(u.type==="object"?"object":n.toString(u)))}),o.length?"{ ".concat(o.join("; ")," }"):"{}"},array:function(e){if(e.items){var n=this.getValidClassName(e.items);return n?"".concat(n,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var n=this,o=e.signature;if(!o)return"Function";var m="oneOf"in o?o.oneOf:[o];return m.map(function(c){return"".concat(c.isAsync?"async ":"","(").concat(c.arguments.map(function(i){return"".concat(i.key,": ").concat(n.toString(i))}).join(", "),") => ").concat(n.toString(c.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(n){return JSON.stringify(n)}).join(" | ")},oneOf:function(e){var n=this;return e.oneOf.map(function(o){return n.getValidClassName(o)||n.toString(o)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},d=function(e){var n=useState(function(){return C.toString(e)}),o=_slicedToArray(n,2),m=o[0],c=o[1];return useEffect(function(){c(C.toString(e))},[e]),_jsx("code",{children:m})},y=function(e){var n,o=useRouteMeta(),m=o.frontmatter,c=useAtomAssets(),i=c.components,f=e.id||m.atomId,u=useIntl();if(!f)throw new Error("`id` properties if required for API component!");var p=i==null?void 0:i[f];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:u.formatMessage({id:"api.component.name"})}),_jsx("th",{children:u.formatMessage({id:"api.component.description"})}),_jsx("th",{children:u.formatMessage({id:"api.component.type"})}),_jsx("th",{children:u.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:p&&(n=p.propsConfig)!==null&&n!==void 0&&n.properties?Object.entries(p.propsConfig.properties).map(function(h){var v,_=_slicedToArray(h,2),s=_[0],r=_[1];return _jsxs("tr",{children:[_jsx("td",{children:s}),_jsx("td",{children:r.description||"--"}),_jsx("td",{children:_jsx(d,_objectSpread({},r))}),_jsx("td",{children:_jsx("code",{children:(v=p.propsConfig.required)!==null&&v!==void 0&&v.includes(s)?u.formatMessage({id:"api.component.required"}):JSON.stringify(r.default)||"--"})})]},s)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:u.formatMessage({id:"api.component.".concat(i?"not.found":"unavailable")},{id:f})})})})]})})},M=null},53267:function(S,x,t){var E=t(39114),j=t(35250),D=function(O){return _jsx("span",_objectSpread({className:"dumi-default-badge"},O))},A=null},33296:function(S,x,t){var E=t(39114),j=t(70125),D=t(11221),A=t(14315),b=t(70079),O=t(35250),L=null,T=function(y){var M=y.children,a=_objectWithoutProperties(y,L),e=useRef(null),n=useState(!1),o=_slicedToArray(n,2),m=o[0],c=o[1],i=useState(!1),f=_slicedToArray(i,2),u=f[0],p=f[1];return useEffect(function(){var h=e.current;if(h){var v=throttle(function(){c(h.scrollLeft>0),p(h.scrollLeft<h.scrollWidth-h.offsetWidth)},100);return v(),h.addEventListener("scroll",v),window.addEventListener("resize",v),function(){h.removeEventListener("scroll",v),window.removeEventListener("resize",v)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":m||void 0,"data-right-folded":u||void 0,children:_jsx("table",_objectSpread(_objectSpread({},a),{},{children:M}))})})},C=null},12133:function(S,x,t){t.d(x,{Z:function(){return v}});var E=t(39114),j=t.n(E),D=t(70125),A=t.n(D),b=t(79664),O=t.n(b),L=t(53474),T=t(23057),C=t(322),d=t(56261),y=t(23433),M=t(18838),a=t(70079),e=t(35250);function n(_){var s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",r=[];return[].concat(_).forEach(function(l,I){var g="".concat(s?"".concat(s,"-"):"").concat(I);switch(l==null?void 0:l.type){case"ul":{var P,N=((P=r[r.length-1])===null||P===void 0?void 0:P.children)||r,R=n(l.props.children||[],g);N.push.apply(N,O()(R));break}case"li":{var U=n(l.props.children,g);r.push({title:[].concat(l.props.children).filter(function(B){return B.type!=="ul"}),key:g,children:U,isLeaf:!U.length});break}default:}}),r}var o=function(s){var r=(0,a.useState)(n(s)),l=A()(r,2),I=l[0],g=l[1];return(0,a.useEffect)(function(){g(n(s))},[s]),I},m=function(s){var r=s.isLeaf,l=s.expanded;return r?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(L.r,{fill:"currentColor"})}):l?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(T.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(C.r,{fill:"currentColor"})})},c=function(s){var r=s.isLeaf,l=s.expanded;return r?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):l?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(d.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(y.r,{fill:"currentColor"})})})},i=function(){return{height:0,opacity:0}},f=function(s){var r=s.scrollHeight;return{height:r,opacity:1}},u=function(s){return{height:s?s.offsetHeight:0}},p=function(s,r){return(r==null?void 0:r.deadline)===!0||r.propertyName==="height"},h={motionName:"ant-motion-collapse",onAppearStart:i,onEnterStart:i,onAppearActive:f,onEnterActive:f,onLeaveStart:u,onLeaveActive:i,onAppearEnd:p,onEnterEnd:p,onLeaveEnd:p,motionDeadline:500},v=function(_){var s=o(_.children),r=(0,a.createRef)(),l=function(g,P){var N=P.isLeaf;N||g.shiftKey||g.metaKey||g.ctrlKey||r.current.onNodeExpand(g,P)};return(0,e.jsx)(M.Z,{className:"dumi-default-tree",icon:m,ref:r,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:j()(j()({},h),{},{motionAppear:!1}),onClick:l,treeData:[{key:"0",title:_.title||"<root>",children:s}],defaultExpandAll:!0,switcherIcon:c})}}}]);
