"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[1266],{63586:function(S,p,t){t.r(p);var A=t(31974),T=t(68804),E=t(14755),O=t(26713),D=t(81511),C=t(31177),L=t(2131),g=t(90167),M=t(70079),o=t(35250);function y(){var P=(0,g.eL)(),n=P.texts;return(0,o.jsx)(g.dY,{children:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("div",{className:"markdown",children:[(0,o.jsxs)("h1",{id:"runmutatetask",children:[(0,o.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#runmutatetask",children:(0,o.jsx)("span",{className:"icon icon-link"})}),"runMutateTask"]}),(0,o.jsxs)("p",{children:[n[0].value,(0,o.jsx)("code",{children:n[1].value}),n[2].value]}),(0,o.jsx)("hr",{})]}),(0,o.jsx)(E.Z,{type:"info",children:(0,o.jsxs)("p",{children:[n[3].value,(0,o.jsx)(g.rU,{to:"/api/base/run-mutate-task",children:n[4].value})]})})]})})}p.default=y},31974:function(S,p,t){var A=t(24325),T=t.n(A),E=t(28633),O=t.n(E),D=t(90167),C=t(70079),L=t(31177),g=t(35250),M={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var r=this,s=[];return Object.entries(e.properties||{}).forEach(function(h){var u,l=O()(h,2),f=l[0],_=l[1];s.push("".concat(f).concat((u=e.required)!==null&&u!==void 0&&u.includes(f)?"":"?",": ").concat(_.type==="object"?"object":r.toString(_)))}),s.length?"{ ".concat(s.join("; ")," }"):"{}"},array:function(e){if(e.items){var r=this.getValidClassName(e.items);return r?"".concat(r,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var r=this,s=e.signature;if(!s)return"Function";var h="oneOf"in s?s.oneOf:[s];return h.map(function(u){return"".concat(u.isAsync?"async ":"","(").concat(u.arguments.map(function(l){return"".concat(l.key,": ").concat(r.toString(l))}).join(", "),") => ").concat(r.toString(u.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(r){return JSON.stringify(r)}).join(" | ")},oneOf:function(e){var r=this;return e.oneOf.map(function(s){return r.getValidClassName(s)||r.toString(s)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},o=function(e){var r=useState(function(){return M.toString(e)}),s=_slicedToArray(r,2),h=s[0],u=s[1];return useEffect(function(){u(M.toString(e))},[e]),_jsx("code",{children:h})},y=function(e){var r,s=useRouteMeta(),h=s.frontmatter,u=useAtomAssets(),l=u.components,f=e.id||h.atomId,_=useIntl();if(!f)throw new Error("`id` properties if required for API component!");var x=l==null?void 0:l[f];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:_.formatMessage({id:"api.component.name"})}),_jsx("th",{children:_.formatMessage({id:"api.component.description"})}),_jsx("th",{children:_.formatMessage({id:"api.component.type"})}),_jsx("th",{children:_.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:x&&(r=x.propsConfig)!==null&&r!==void 0&&r.properties?Object.entries(x.propsConfig.properties).map(function(m){var v,c=_slicedToArray(m,2),i=c[0],a=c[1];return _jsxs("tr",{children:[_jsx("td",{children:i}),_jsx("td",{children:a.description||"--"}),_jsx("td",{children:_jsx(o,_objectSpread({},a))}),_jsx("td",{children:_jsx("code",{children:(v=x.propsConfig.required)!==null&&v!==void 0&&v.includes(i)?_.formatMessage({id:"api.component.required"}):JSON.stringify(a.default)||"--"})})]},i)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:_.formatMessage({id:"api.component.".concat(l?"not.found":"unavailable")},{id:f})})})})]})})},P=null},68804:function(S,p,t){var A=t(24325),T=t(35250),E=function(C){return _jsx("span",_objectSpread({className:"dumi-default-badge"},C))},O=null},31177:function(S,p,t){var A=t(24325),T=t(28633),E=t(19317),O=t(14315),D=t(70079),C=t(35250),L=null,g=function(y){var P=y.children,n=_objectWithoutProperties(y,L),e=useRef(null),r=useState(!1),s=_slicedToArray(r,2),h=s[0],u=s[1],l=useState(!1),f=_slicedToArray(l,2),_=f[0],x=f[1];return useEffect(function(){var m=e.current;if(m){var v=throttle(function(){u(m.scrollLeft>0),x(m.scrollLeft<m.scrollWidth-m.offsetWidth)},100);return v(),m.addEventListener("scroll",v),window.addEventListener("resize",v),function(){m.removeEventListener("scroll",v),window.removeEventListener("resize",v)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":h||void 0,"data-right-folded":_||void 0,children:_jsx("table",_objectSpread(_objectSpread({},n),{},{children:P}))})})},M=null},2131:function(S,p,t){t.d(p,{Z:function(){return v}});var A=t(24325),T=t.n(A),E=t(28633),O=t.n(E),D=t(12027),C=t.n(D),L=t(77324),g=t(88570),M=t(79275),o=t(60895),y=t(39865),P=t(1687),n=t(70079),e=t(35250);function r(c){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",a=[];return[].concat(c).forEach(function(d,I){var j="".concat(i?"".concat(i,"-"):"").concat(I);switch(d==null?void 0:d.type){case"ul":{var b,N=((b=a[a.length-1])===null||b===void 0?void 0:b.children)||a,B=r(d.props.children||[],j);N.push.apply(N,C()(B));break}case"li":{var R=r(d.props.children,j);a.push({title:[].concat(d.props.children).filter(function(W){return W.type!=="ul"}),key:j,children:R,isLeaf:!R.length});break}default:}}),a}var s=function(i){var a=(0,n.useState)(r(i)),d=O()(a,2),I=d[0],j=d[1];return(0,n.useEffect)(function(){j(r(i))},[i]),I},h=function(i){var a=i.isLeaf,d=i.expanded;return a?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(L.r,{fill:"currentColor"})}):d?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(g.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(M.r,{fill:"currentColor"})})},u=function(i){var a=i.isLeaf,d=i.expanded;return a?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):d?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(o.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(y.r,{fill:"currentColor"})})})},l=function(){return{height:0,opacity:0}},f=function(i){var a=i.scrollHeight;return{height:a,opacity:1}},_=function(i){return{height:i?i.offsetHeight:0}},x=function(i,a){return(a==null?void 0:a.deadline)===!0||a.propertyName==="height"},m={motionName:"ant-motion-collapse",onAppearStart:l,onEnterStart:l,onAppearActive:f,onEnterActive:f,onLeaveStart:_,onLeaveActive:l,onAppearEnd:x,onEnterEnd:x,onLeaveEnd:x,motionDeadline:500},v=function(c){var i=s(c.children),a=(0,n.createRef)(),d=function(j,b){var N=b.isLeaf;N||j.shiftKey||j.metaKey||j.ctrlKey||a.current.onNodeExpand(j,b)};return(0,e.jsx)(P.Z,{className:"dumi-default-tree",icon:h,ref:a,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:T()(T()({},m),{},{motionAppear:!1}),onClick:d,treeData:[{key:"0",title:c.title||"<root>",children:i}],defaultExpandAll:!0,switcherIcon:u})}}}]);
