"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[809],{32533:function(S,p,t){t.r(p);var g=t(31974),y=t(68804),A=t(14755),O=t(26713),b=t(81511),T=t(31177),L=t(2131),C=t(90167),M=t(70079),d=t(35250);function E(){var P=(0,C.eL)(),a=P.texts;return(0,d.jsx)(C.dY,{children:(0,d.jsx)(d.Fragment,{children:(0,d.jsxs)("div",{className:"markdown",children:[(0,d.jsxs)("h1",{id:"setdraft",children:[(0,d.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#setdraft",children:(0,d.jsx)("span",{className:"icon icon-link"})}),"setDraft"]}),(0,d.jsxs)("p",{children:[a[0].value,(0,d.jsx)("code",{children:a[1].value}),a[2].value]})]})})})}p.default=E},31974:function(S,p,t){var g=t(24325),y=t.n(g),A=t(28633),O=t.n(A),b=t(90167),T=t(70079),L=t(31177),C=t(35250),M={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var n=this,s=[];return Object.entries(e.properties||{}).forEach(function(h){var l,o=O()(h,2),f=o[0],_=o[1];s.push("".concat(f).concat((l=e.required)!==null&&l!==void 0&&l.includes(f)?"":"?",": ").concat(_.type==="object"?"object":n.toString(_)))}),s.length?"{ ".concat(s.join("; ")," }"):"{}"},array:function(e){if(e.items){var n=this.getValidClassName(e.items);return n?"".concat(n,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var n=this,s=e.signature;if(!s)return"Function";var h="oneOf"in s?s.oneOf:[s];return h.map(function(l){return"".concat(l.isAsync?"async ":"","(").concat(l.arguments.map(function(o){return"".concat(o.key,": ").concat(n.toString(o))}).join(", "),") => ").concat(n.toString(l.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(n){return JSON.stringify(n)}).join(" | ")},oneOf:function(e){var n=this;return e.oneOf.map(function(s){return n.getValidClassName(s)||n.toString(s)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},d=function(e){var n=useState(function(){return M.toString(e)}),s=_slicedToArray(n,2),h=s[0],l=s[1];return useEffect(function(){l(M.toString(e))},[e]),_jsx("code",{children:h})},E=function(e){var n,s=useRouteMeta(),h=s.frontmatter,l=useAtomAssets(),o=l.components,f=e.id||h.atomId,_=useIntl();if(!f)throw new Error("`id` properties if required for API component!");var x=o==null?void 0:o[f];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:_.formatMessage({id:"api.component.name"})}),_jsx("th",{children:_.formatMessage({id:"api.component.description"})}),_jsx("th",{children:_.formatMessage({id:"api.component.type"})}),_jsx("th",{children:_.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:x&&(n=x.propsConfig)!==null&&n!==void 0&&n.properties?Object.entries(x.propsConfig.properties).map(function(m){var v,c=_slicedToArray(m,2),i=c[0],r=c[1];return _jsxs("tr",{children:[_jsx("td",{children:i}),_jsx("td",{children:r.description||"--"}),_jsx("td",{children:_jsx(d,_objectSpread({},r))}),_jsx("td",{children:_jsx("code",{children:(v=x.propsConfig.required)!==null&&v!==void 0&&v.includes(i)?_.formatMessage({id:"api.component.required"}):JSON.stringify(r.default)||"--"})})]},i)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:_.formatMessage({id:"api.component.".concat(o?"not.found":"unavailable")},{id:f})})})})]})})},P=null},68804:function(S,p,t){var g=t(24325),y=t(35250),A=function(T){return _jsx("span",_objectSpread({className:"dumi-default-badge"},T))},O=null},31177:function(S,p,t){var g=t(24325),y=t(28633),A=t(19317),O=t(14315),b=t(70079),T=t(35250),L=null,C=function(E){var P=E.children,a=_objectWithoutProperties(E,L),e=useRef(null),n=useState(!1),s=_slicedToArray(n,2),h=s[0],l=s[1],o=useState(!1),f=_slicedToArray(o,2),_=f[0],x=f[1];return useEffect(function(){var m=e.current;if(m){var v=throttle(function(){l(m.scrollLeft>0),x(m.scrollLeft<m.scrollWidth-m.offsetWidth)},100);return v(),m.addEventListener("scroll",v),window.addEventListener("resize",v),function(){m.removeEventListener("scroll",v),window.removeEventListener("resize",v)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":h||void 0,"data-right-folded":_||void 0,children:_jsx("table",_objectSpread(_objectSpread({},a),{},{children:P}))})})},M=null},2131:function(S,p,t){t.d(p,{Z:function(){return v}});var g=t(24325),y=t.n(g),A=t(28633),O=t.n(A),b=t(12027),T=t.n(b),L=t(77324),C=t(88570),M=t(79275),d=t(60895),E=t(39865),P=t(1687),a=t(70079),e=t(35250);function n(c){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",r=[];return[].concat(c).forEach(function(u,I){var j="".concat(i?"".concat(i,"-"):"").concat(I);switch(u==null?void 0:u.type){case"ul":{var D,N=((D=r[r.length-1])===null||D===void 0?void 0:D.children)||r,B=n(u.props.children||[],j);N.push.apply(N,T()(B));break}case"li":{var R=n(u.props.children,j);r.push({title:[].concat(u.props.children).filter(function(W){return W.type!=="ul"}),key:j,children:R,isLeaf:!R.length});break}default:}}),r}var s=function(i){var r=(0,a.useState)(n(i)),u=O()(r,2),I=u[0],j=u[1];return(0,a.useEffect)(function(){j(n(i))},[i]),I},h=function(i){var r=i.isLeaf,u=i.expanded;return r?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(L.r,{fill:"currentColor"})}):u?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(C.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(M.r,{fill:"currentColor"})})},l=function(i){var r=i.isLeaf,u=i.expanded;return r?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):u?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(d.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(E.r,{fill:"currentColor"})})})},o=function(){return{height:0,opacity:0}},f=function(i){var r=i.scrollHeight;return{height:r,opacity:1}},_=function(i){return{height:i?i.offsetHeight:0}},x=function(i,r){return(r==null?void 0:r.deadline)===!0||r.propertyName==="height"},m={motionName:"ant-motion-collapse",onAppearStart:o,onEnterStart:o,onAppearActive:f,onEnterActive:f,onLeaveStart:_,onLeaveActive:o,onAppearEnd:x,onEnterEnd:x,onLeaveEnd:x,motionDeadline:500},v=function(c){var i=s(c.children),r=(0,a.createRef)(),u=function(j,D){var N=D.isLeaf;N||j.shiftKey||j.metaKey||j.ctrlKey||r.current.onNodeExpand(j,D)};return(0,e.jsx)(P.Z,{className:"dumi-default-tree",icon:h,ref:r,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:y()(y()({},m),{},{motionAppear:!1}),onClick:u,treeData:[{key:"0",title:c.title||"<root>",children:i}],defaultExpandAll:!0,switcherIcon:l})}}}]);
