"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[2591],{14562:function(S,g,r){r.r(g);var y=r(31974),A=r(68804),O=r(14755),T=r(26713),b=r(81511),C=r(31177),L=r(2131),s=r(90167),M=r(70079),n=r(35250);function E(){var P=(0,s.eL)(),e=P.texts;return(0,n.jsx)(s.dY,{children:(0,n.jsx)(n.Fragment,{children:(0,n.jsxs)("div",{className:"markdown",children:[(0,n.jsxs)("h1",{id:"\u5DE5\u5177",children:[(0,n.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u5DE5\u5177",children:(0,n.jsx)("span",{className:"icon icon-link"})}),"\u5DE5\u5177"]}),(0,n.jsx)("p",{children:e[0].value}),(0,n.jsxs)("ul",{children:[(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/init",children:e[1].value}),e[2].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/flush",children:e[3].value}),e[4].value,(0,n.jsx)("code",{children:e[5].value}),e[6].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/reactive-desc",children:e[7].value}),e[8].value,(0,n.jsx)("code",{children:e[9].value}),e[10].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/add-middleware",children:e[11].value}),e[12].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/add-plugin",children:e[13].value}),e[14].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/cst",children:e[15].value}),e[16].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/get-atom",children:e[17].value}),e[18].value,(0,n.jsx)("code",{children:e[19].value}),e[20].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/get-snap",children:e[21].value}),e[22].value,(0,n.jsx)("code",{children:e[23].value}),e[24].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/get-action-loading",children:e[25].value}),e[26].value,(0,n.jsx)("code",{children:e[27].value}),e[28].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/get-derive-loading",children:e[29].value}),e[30].value,(0,n.jsx)("code",{children:e[31].value}),e[32].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/get-mutate-loading",children:e[33].value}),e[34].value,(0,n.jsx)("code",{children:e[35].value}),e[36].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/is-atom",children:e[37].value}),e[38].value,(0,n.jsx)("code",{children:e[39].value}),e[40].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/is-derived-atom",children:e[41].value}),e[42].value,(0,n.jsx)("code",{children:e[43].value}),e[44].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/is-diff",children:e[45].value}),e[46].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/shallow-compare",children:e[47].value}),e[48].value]}),(0,n.jsxs)("li",{children:[(0,n.jsx)(s.rU,{to:"/api/utils/mark-raw",children:e[49].value}),e[50].value]})]})]})})})}g.default=E},31974:function(S,g,r){var y=r(24325),A=r.n(y),O=r(28633),T=r.n(O),b=r(90167),C=r(70079),L=r(31177),s=r(35250),M={toString:function(t){return typeof t.type=="string"&&t.type in this?"enum"in t?this.enum(t):this[t.type](t):t.type?this.getValidClassName(t)||t.type:"const"in t?"".concat(t.const):"oneOf"in t?this.oneOf(t):"unknown"},string:function(t){return t.type},number:function(t){return t.type},boolean:function(t){return t.type},any:function(t){return t.type},object:function(t){var i=this,o=[];return Object.entries(t.properties||{}).forEach(function(f){var d,u=T()(f,2),v=u[0],h=u[1];o.push("".concat(v).concat((d=t.required)!==null&&d!==void 0&&d.includes(v)?"":"?",": ").concat(h.type==="object"?"object":i.toString(h)))}),o.length?"{ ".concat(o.join("; ")," }"):"{}"},array:function(t){if(t.items){var i=this.getValidClassName(t.items);return i?"".concat(i,"[]"):"".concat(this.toString(t.items),"[]")}return"any[]"},element:function(t){return"<".concat(t.componentName," />")},function:function(t){var i=this,o=t.signature;if(!o)return"Function";var f="oneOf"in o?o.oneOf:[o];return f.map(function(d){return"".concat(d.isAsync?"async ":"","(").concat(d.arguments.map(function(u){return"".concat(u.key,": ").concat(i.toString(u))}).join(", "),") => ").concat(i.toString(d.returnType))}).join(" | ")},dom:function(t){return t.className||"DOM"},enum:function(t){return t.enum.map(function(i){return JSON.stringify(i)}).join(" | ")},oneOf:function(t){var i=this;return t.oneOf.map(function(o){return i.getValidClassName(o)||i.toString(o)}).join(" | ")},getValidClassName:function(t){return"className"in t&&typeof t.className=="string"&&t.className!=="__type"?t.className:null}},n=function(t){var i=useState(function(){return M.toString(t)}),o=_slicedToArray(i,2),f=o[0],d=o[1];return useEffect(function(){d(M.toString(t))},[t]),_jsx("code",{children:f})},E=function(t){var i,o=useRouteMeta(),f=o.frontmatter,d=useAtomAssets(),u=d.components,v=t.id||f.atomId,h=useIntl();if(!v)throw new Error("`id` properties if required for API component!");var j=u==null?void 0:u[v];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:h.formatMessage({id:"api.component.name"})}),_jsx("th",{children:h.formatMessage({id:"api.component.description"})}),_jsx("th",{children:h.formatMessage({id:"api.component.type"})}),_jsx("th",{children:h.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:j&&(i=j.propsConfig)!==null&&i!==void 0&&i.properties?Object.entries(j.propsConfig.properties).map(function(m){var x,_=_slicedToArray(m,2),l=_[0],a=_[1];return _jsxs("tr",{children:[_jsx("td",{children:l}),_jsx("td",{children:a.description||"--"}),_jsx("td",{children:_jsx(n,_objectSpread({},a))}),_jsx("td",{children:_jsx("code",{children:(x=j.propsConfig.required)!==null&&x!==void 0&&x.includes(l)?h.formatMessage({id:"api.component.required"}):JSON.stringify(a.default)||"--"})})]},l)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:h.formatMessage({id:"api.component.".concat(u?"not.found":"unavailable")},{id:v})})})})]})})},P=null},68804:function(S,g,r){var y=r(24325),A=r(35250),O=function(C){return _jsx("span",_objectSpread({className:"dumi-default-badge"},C))},T=null},31177:function(S,g,r){var y=r(24325),A=r(28633),O=r(19317),T=r(14315),b=r(70079),C=r(35250),L=null,s=function(E){var P=E.children,e=_objectWithoutProperties(E,L),t=useRef(null),i=useState(!1),o=_slicedToArray(i,2),f=o[0],d=o[1],u=useState(!1),v=_slicedToArray(u,2),h=v[0],j=v[1];return useEffect(function(){var m=t.current;if(m){var x=throttle(function(){d(m.scrollLeft>0),j(m.scrollLeft<m.scrollWidth-m.offsetWidth)},100);return x(),m.addEventListener("scroll",x),window.addEventListener("resize",x),function(){m.removeEventListener("scroll",x),window.removeEventListener("resize",x)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:t,"data-left-folded":f||void 0,"data-right-folded":h||void 0,children:_jsx("table",_objectSpread(_objectSpread({},e),{},{children:P}))})})},M=null},2131:function(S,g,r){r.d(g,{Z:function(){return x}});var y=r(24325),A=r.n(y),O=r(28633),T=r.n(O),b=r(12027),C=r.n(b),L=r(77324),s=r(88570),M=r(79275),n=r(60895),E=r(39865),P=r(1687),e=r(70079),t=r(35250);function i(_){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",a=[];return[].concat(_).forEach(function(c,U){var p="".concat(l?"".concat(l,"-"):"").concat(U);switch(c==null?void 0:c.type){case"ul":{var D,I=((D=a[a.length-1])===null||D===void 0?void 0:D.children)||a,R=i(c.props.children||[],p);I.push.apply(I,C()(R));break}case"li":{var N=i(c.props.children,p);a.push({title:[].concat(c.props.children).filter(function(B){return B.type!=="ul"}),key:p,children:N,isLeaf:!N.length});break}default:}}),a}var o=function(l){var a=(0,e.useState)(i(l)),c=T()(a,2),U=c[0],p=c[1];return(0,e.useEffect)(function(){p(i(l))},[l]),U},f=function(l){var a=l.isLeaf,c=l.expanded;return a?(0,t.jsx)("span",{className:"dumi-default-tree-icon",children:(0,t.jsx)(L.r,{fill:"currentColor"})}):c?(0,t.jsx)("span",{className:"dumi-default-tree-icon",children:(0,t.jsx)(s.r,{fill:"currentColor"})}):(0,t.jsx)("span",{className:"dumi-default-tree-icon",children:(0,t.jsx)(M.r,{fill:"currentColor"})})},d=function(l){var a=l.isLeaf,c=l.expanded;return a?(0,t.jsx)("span",{className:"tree-switcher-leaf-line"}):c?(0,t.jsx)("span",{className:"tree-switcher-line-icon",children:(0,t.jsx)("span",{className:"dumi-default-tree-icon",children:(0,t.jsx)(n.r,{fill:"currentColor"})})}):(0,t.jsx)("span",{className:"tree-switcher-line-icon",children:(0,t.jsx)("span",{className:"dumi-default-tree-icon",children:(0,t.jsx)(E.r,{fill:"currentColor"})})})},u=function(){return{height:0,opacity:0}},v=function(l){var a=l.scrollHeight;return{height:a,opacity:1}},h=function(l){return{height:l?l.offsetHeight:0}},j=function(l,a){return(a==null?void 0:a.deadline)===!0||a.propertyName==="height"},m={motionName:"ant-motion-collapse",onAppearStart:u,onEnterStart:u,onAppearActive:v,onEnterActive:v,onLeaveStart:h,onLeaveActive:u,onAppearEnd:j,onEnterEnd:j,onLeaveEnd:j,motionDeadline:500},x=function(_){var l=o(_.children),a=(0,e.createRef)(),c=function(p,D){var I=D.isLeaf;I||p.shiftKey||p.metaKey||p.ctrlKey||a.current.onNodeExpand(p,D)};return(0,t.jsx)(P.Z,{className:"dumi-default-tree",icon:f,ref:a,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:A()(A()({},m),{},{motionAppear:!1}),onClick:c,treeData:[{key:"0",title:_.title||"<root>",children:l}],defaultExpandAll:!0,switcherIcon:d})}}}]);
