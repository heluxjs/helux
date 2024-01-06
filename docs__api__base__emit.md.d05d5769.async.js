"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[3841],{69095:function(S,p,t){t.r(p);var A=t(31974),O=t(68804),E=t(14755),T=t(26713),b=t(81511),C=t(31177),L=t(2131),g=t(90167),M=t(70079),o=t(35250);function y(){var P=(0,g.eL)(),i=P.texts;return(0,o.jsx)(g.dY,{children:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)("div",{className:"markdown",children:[(0,o.jsxs)("h1",{id:"emit",children:[(0,o.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#emit",children:(0,o.jsx)("span",{className:"icon icon-link"})}),"emit"]}),(0,o.jsx)("p",{children:i[0].value}),(0,o.jsx)("hr",{})]}),(0,o.jsx)(E.Z,{type:"info",children:(0,o.jsxs)("p",{children:[i[1].value,(0,o.jsx)(g.rU,{to:"/guide/events",children:i[2].value})]})})]})})}p.default=y},31974:function(S,p,t){var A=t(24325),O=t.n(A),E=t(28633),T=t.n(E),b=t(90167),C=t(70079),L=t(31177),g=t(35250),M={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var n=this,s=[];return Object.entries(e.properties||{}).forEach(function(h){var u,l=T()(h,2),f=l[0],_=l[1];s.push("".concat(f).concat((u=e.required)!==null&&u!==void 0&&u.includes(f)?"":"?",": ").concat(_.type==="object"?"object":n.toString(_)))}),s.length?"{ ".concat(s.join("; ")," }"):"{}"},array:function(e){if(e.items){var n=this.getValidClassName(e.items);return n?"".concat(n,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var n=this,s=e.signature;if(!s)return"Function";var h="oneOf"in s?s.oneOf:[s];return h.map(function(u){return"".concat(u.isAsync?"async ":"","(").concat(u.arguments.map(function(l){return"".concat(l.key,": ").concat(n.toString(l))}).join(", "),") => ").concat(n.toString(u.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(n){return JSON.stringify(n)}).join(" | ")},oneOf:function(e){var n=this;return e.oneOf.map(function(s){return n.getValidClassName(s)||n.toString(s)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},o=function(e){var n=useState(function(){return M.toString(e)}),s=_slicedToArray(n,2),h=s[0],u=s[1];return useEffect(function(){u(M.toString(e))},[e]),_jsx("code",{children:h})},y=function(e){var n,s=useRouteMeta(),h=s.frontmatter,u=useAtomAssets(),l=u.components,f=e.id||h.atomId,_=useIntl();if(!f)throw new Error("`id` properties if required for API component!");var x=l==null?void 0:l[f];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:_.formatMessage({id:"api.component.name"})}),_jsx("th",{children:_.formatMessage({id:"api.component.description"})}),_jsx("th",{children:_.formatMessage({id:"api.component.type"})}),_jsx("th",{children:_.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:x&&(n=x.propsConfig)!==null&&n!==void 0&&n.properties?Object.entries(x.propsConfig.properties).map(function(m){var v,c=_slicedToArray(m,2),a=c[0],r=c[1];return _jsxs("tr",{children:[_jsx("td",{children:a}),_jsx("td",{children:r.description||"--"}),_jsx("td",{children:_jsx(o,_objectSpread({},r))}),_jsx("td",{children:_jsx("code",{children:(v=x.propsConfig.required)!==null&&v!==void 0&&v.includes(a)?_.formatMessage({id:"api.component.required"}):JSON.stringify(r.default)||"--"})})]},a)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:_.formatMessage({id:"api.component.".concat(l?"not.found":"unavailable")},{id:f})})})})]})})},P=null},68804:function(S,p,t){var A=t(24325),O=t(35250),E=function(C){return _jsx("span",_objectSpread({className:"dumi-default-badge"},C))},T=null},31177:function(S,p,t){var A=t(24325),O=t(28633),E=t(19317),T=t(14315),b=t(70079),C=t(35250),L=null,g=function(y){var P=y.children,i=_objectWithoutProperties(y,L),e=useRef(null),n=useState(!1),s=_slicedToArray(n,2),h=s[0],u=s[1],l=useState(!1),f=_slicedToArray(l,2),_=f[0],x=f[1];return useEffect(function(){var m=e.current;if(m){var v=throttle(function(){u(m.scrollLeft>0),x(m.scrollLeft<m.scrollWidth-m.offsetWidth)},100);return v(),m.addEventListener("scroll",v),window.addEventListener("resize",v),function(){m.removeEventListener("scroll",v),window.removeEventListener("resize",v)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":h||void 0,"data-right-folded":_||void 0,children:_jsx("table",_objectSpread(_objectSpread({},i),{},{children:P}))})})},M=null},2131:function(S,p,t){t.d(p,{Z:function(){return v}});var A=t(24325),O=t.n(A),E=t(28633),T=t.n(E),b=t(12027),C=t.n(b),L=t(77324),g=t(88570),M=t(79275),o=t(60895),y=t(39865),P=t(1687),i=t(70079),e=t(35250);function n(c){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",r=[];return[].concat(c).forEach(function(d,I){var j="".concat(a?"".concat(a,"-"):"").concat(I);switch(d==null?void 0:d.type){case"ul":{var D,N=((D=r[r.length-1])===null||D===void 0?void 0:D.children)||r,B=n(d.props.children||[],j);N.push.apply(N,C()(B));break}case"li":{var R=n(d.props.children,j);r.push({title:[].concat(d.props.children).filter(function(W){return W.type!=="ul"}),key:j,children:R,isLeaf:!R.length});break}default:}}),r}var s=function(a){var r=(0,i.useState)(n(a)),d=T()(r,2),I=d[0],j=d[1];return(0,i.useEffect)(function(){j(n(a))},[a]),I},h=function(a){var r=a.isLeaf,d=a.expanded;return r?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(L.r,{fill:"currentColor"})}):d?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(g.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(M.r,{fill:"currentColor"})})},u=function(a){var r=a.isLeaf,d=a.expanded;return r?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):d?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(o.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(y.r,{fill:"currentColor"})})})},l=function(){return{height:0,opacity:0}},f=function(a){var r=a.scrollHeight;return{height:r,opacity:1}},_=function(a){return{height:a?a.offsetHeight:0}},x=function(a,r){return(r==null?void 0:r.deadline)===!0||r.propertyName==="height"},m={motionName:"ant-motion-collapse",onAppearStart:l,onEnterStart:l,onAppearActive:f,onEnterActive:f,onLeaveStart:_,onLeaveActive:l,onAppearEnd:x,onEnterEnd:x,onLeaveEnd:x,motionDeadline:500},v=function(c){var a=s(c.children),r=(0,i.createRef)(),d=function(j,D){var N=D.isLeaf;N||j.shiftKey||j.metaKey||j.ctrlKey||r.current.onNodeExpand(j,D)};return(0,e.jsx)(P.Z,{className:"dumi-default-tree",icon:h,ref:r,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:O()(O()({},m),{},{motionAppear:!1}),onClick:d,treeData:[{key:"0",title:c.title||"<root>",children:a}],defaultExpandAll:!0,switcherIcon:u})}}}]);
