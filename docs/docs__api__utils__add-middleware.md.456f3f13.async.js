"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[97],{66137:function(S,x,n){n.r(x);var y=n(4311),E=n(53267),A=n(82197),D=n(12620),O=n(74692),T=n(33296),L=n(12133),C=n(54996),M=n(70079),o=n(35250);function j(){var P=(0,C.eL)(),a=P.texts;return(0,o.jsx)(C.dY,{children:(0,o.jsx)(o.Fragment,{children:(0,o.jsxs)("div",{className:"markdown",children:[(0,o.jsxs)("h1",{id:"addmiddleware",children:[(0,o.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#addmiddleware",children:(0,o.jsx)("span",{className:"icon icon-link"})}),"addMiddleware"]}),(0,o.jsx)("p",{children:a[0].value}),(0,o.jsxs)("h2",{id:"\u57FA\u7840\u4F7F\u7528",children:[(0,o.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u57FA\u7840\u4F7F\u7528",children:(0,o.jsx)("span",{className:"icon icon-link"})}),"\u57FA\u7840\u4F7F\u7528"]}),(0,o.jsx)(O.Z,{lang:"ts",children:a[1].value})]})})})}x.default=j},4311:function(S,x,n){var y=n(39114),E=n.n(y),A=n(70125),D=n.n(A),O=n(54996),T=n(70079),L=n(33296),C=n(35250),M={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var t=this,i=[];return Object.entries(e.properties||{}).forEach(function(h){var l,c=D()(h,2),f=c[0],_=c[1];i.push("".concat(f).concat((l=e.required)!==null&&l!==void 0&&l.includes(f)?"":"?",": ").concat(_.type==="object"?"object":t.toString(_)))}),i.length?"{ ".concat(i.join("; ")," }"):"{}"},array:function(e){if(e.items){var t=this.getValidClassName(e.items);return t?"".concat(t,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var t=this,i=e.signature;if(!i)return"Function";var h="oneOf"in i?i.oneOf:[i];return h.map(function(l){return"".concat(l.isAsync?"async ":"","(").concat(l.arguments.map(function(c){return"".concat(c.key,": ").concat(t.toString(c))}).join(", "),") => ").concat(t.toString(l.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(t){return JSON.stringify(t)}).join(" | ")},oneOf:function(e){var t=this;return e.oneOf.map(function(i){return t.getValidClassName(i)||t.toString(i)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},o=function(e){var t=useState(function(){return M.toString(e)}),i=_slicedToArray(t,2),h=i[0],l=i[1];return useEffect(function(){l(M.toString(e))},[e]),_jsx("code",{children:h})},j=function(e){var t,i=useRouteMeta(),h=i.frontmatter,l=useAtomAssets(),c=l.components,f=e.id||h.atomId,_=useIntl();if(!f)throw new Error("`id` properties if required for API component!");var p=c==null?void 0:c[f];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:_.formatMessage({id:"api.component.name"})}),_jsx("th",{children:_.formatMessage({id:"api.component.description"})}),_jsx("th",{children:_.formatMessage({id:"api.component.type"})}),_jsx("th",{children:_.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:p&&(t=p.propsConfig)!==null&&t!==void 0&&t.properties?Object.entries(p.propsConfig.properties).map(function(m){var v,u=_slicedToArray(m,2),s=u[0],r=u[1];return _jsxs("tr",{children:[_jsx("td",{children:s}),_jsx("td",{children:r.description||"--"}),_jsx("td",{children:_jsx(o,_objectSpread({},r))}),_jsx("td",{children:_jsx("code",{children:(v=p.propsConfig.required)!==null&&v!==void 0&&v.includes(s)?_.formatMessage({id:"api.component.required"}):JSON.stringify(r.default)||"--"})})]},s)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:_.formatMessage({id:"api.component.".concat(c?"not.found":"unavailable")},{id:f})})})})]})})},P=null},53267:function(S,x,n){var y=n(39114),E=n(35250),A=function(T){return _jsx("span",_objectSpread({className:"dumi-default-badge"},T))},D=null},33296:function(S,x,n){var y=n(39114),E=n(70125),A=n(11221),D=n(14315),O=n(70079),T=n(35250),L=null,C=function(j){var P=j.children,a=_objectWithoutProperties(j,L),e=useRef(null),t=useState(!1),i=_slicedToArray(t,2),h=i[0],l=i[1],c=useState(!1),f=_slicedToArray(c,2),_=f[0],p=f[1];return useEffect(function(){var m=e.current;if(m){var v=throttle(function(){l(m.scrollLeft>0),p(m.scrollLeft<m.scrollWidth-m.offsetWidth)},100);return v(),m.addEventListener("scroll",v),window.addEventListener("resize",v),function(){m.removeEventListener("scroll",v),window.removeEventListener("resize",v)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":h||void 0,"data-right-folded":_||void 0,children:_jsx("table",_objectSpread(_objectSpread({},a),{},{children:P}))})})},M=null},12133:function(S,x,n){n.d(x,{Z:function(){return v}});var y=n(39114),E=n.n(y),A=n(70125),D=n.n(A),O=n(79664),T=n.n(O),L=n(53474),C=n(23057),M=n(322),o=n(56261),j=n(23433),P=n(18838),a=n(70079),e=n(35250);function t(u){var s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",r=[];return[].concat(u).forEach(function(d,I){var g="".concat(s?"".concat(s,"-"):"").concat(I);switch(d==null?void 0:d.type){case"ul":{var b,N=((b=r[r.length-1])===null||b===void 0?void 0:b.children)||r,R=t(d.props.children||[],g);N.push.apply(N,T()(R));break}case"li":{var U=t(d.props.children,g);r.push({title:[].concat(d.props.children).filter(function(B){return B.type!=="ul"}),key:g,children:U,isLeaf:!U.length});break}default:}}),r}var i=function(s){var r=(0,a.useState)(t(s)),d=D()(r,2),I=d[0],g=d[1];return(0,a.useEffect)(function(){g(t(s))},[s]),I},h=function(s){var r=s.isLeaf,d=s.expanded;return r?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(L.r,{fill:"currentColor"})}):d?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(C.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(M.r,{fill:"currentColor"})})},l=function(s){var r=s.isLeaf,d=s.expanded;return r?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):d?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(o.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(j.r,{fill:"currentColor"})})})},c=function(){return{height:0,opacity:0}},f=function(s){var r=s.scrollHeight;return{height:r,opacity:1}},_=function(s){return{height:s?s.offsetHeight:0}},p=function(s,r){return(r==null?void 0:r.deadline)===!0||r.propertyName==="height"},m={motionName:"ant-motion-collapse",onAppearStart:c,onEnterStart:c,onAppearActive:f,onEnterActive:f,onLeaveStart:_,onLeaveActive:c,onAppearEnd:p,onEnterEnd:p,onLeaveEnd:p,motionDeadline:500},v=function(u){var s=i(u.children),r=(0,a.createRef)(),d=function(g,b){var N=b.isLeaf;N||g.shiftKey||g.metaKey||g.ctrlKey||r.current.onNodeExpand(g,b)};return(0,e.jsx)(P.Z,{className:"dumi-default-tree",icon:h,ref:r,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:E()(E()({},m),{},{motionAppear:!1}),onClick:d,treeData:[{key:"0",title:u.title||"<root>",children:s}],defaultExpandAll:!0,switcherIcon:l})}}}]);