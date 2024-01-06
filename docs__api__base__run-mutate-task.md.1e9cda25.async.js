"use strict";(self.webpackChunkhelux_docs=self.webpackChunkhelux_docs||[]).push([[4476],{54023:function(S,E,n){n.r(E);var A=n(31974),T=n(68804),O=n(14755),C=n(26713),p=n(81511),M=n(31177),L=n(2131),g=n(90167),P=n(70079),r=n(35250);function y(){var b=(0,g.eL)(),t=b.texts;return(0,r.jsx)(g.dY,{children:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{className:"markdown",children:[(0,r.jsxs)("h1",{id:"runmutatetask",children:[(0,r.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#runmutatetask",children:(0,r.jsx)("span",{className:"icon icon-link"})}),"runMutateTask"]}),(0,r.jsxs)("p",{children:[t[0].value,(0,r.jsx)("code",{children:t[1].value}),t[2].value]}),(0,r.jsxs)("h2",{id:"\u57FA\u7840\u4F7F\u7528",children:[(0,r.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#\u57FA\u7840\u4F7F\u7528",children:(0,r.jsx)("span",{className:"icon icon-link"})}),"\u57FA\u7840\u4F7F\u7528"]}),(0,r.jsx)(p.Z,{lang:"ts",children:t[3].value})]}),(0,r.jsx)(g.Dl,{demo:{id:"docs-api-base-run-mutate-task-demo-0"},previewerProps:{}}),(0,r.jsxs)("div",{className:"markdown",children:[(0,r.jsxs)("p",{children:[(0,r.jsx)("code",{children:t[4].value}),t[5].value,(0,r.jsx)("code",{children:t[6].value}),t[7].value,(0,r.jsx)("code",{children:t[8].value}),t[9].value]}),(0,r.jsx)(p.Z,{lang:"ts",children:t[10].value}),(0,r.jsxs)("p",{children:[t[11].value,(0,r.jsx)("code",{children:t[12].value}),t[13].value,(0,r.jsx)("code",{children:t[14].value}),t[15].value,(0,r.jsx)("code",{children:t[16].value}),t[17].value]}),(0,r.jsx)(p.Z,{lang:"ts",children:t[18].value}),(0,r.jsxs)("p",{children:[t[19].value,(0,r.jsx)("code",{children:t[20].value}),t[21].value,(0,r.jsx)("code",{children:t[22].value}),t[23].value]}),(0,r.jsx)(p.Z,{lang:"ts",children:t[24].value})]})]})})}E.default=y},31974:function(S,E,n){var A=n(24325),T=n.n(A),O=n(28633),C=n.n(O),p=n(90167),M=n(70079),L=n(31177),g=n(35250),P={toString:function(e){return typeof e.type=="string"&&e.type in this?"enum"in e?this.enum(e):this[e.type](e):e.type?this.getValidClassName(e)||e.type:"const"in e?"".concat(e.const):"oneOf"in e?this.oneOf(e):"unknown"},string:function(e){return e.type},number:function(e){return e.type},boolean:function(e){return e.type},any:function(e){return e.type},object:function(e){var a=this,o=[];return Object.entries(e.properties||{}).forEach(function(f){var u,l=C()(f,2),h=l[0],_=l[1];o.push("".concat(h).concat((u=e.required)!==null&&u!==void 0&&u.includes(h)?"":"?",": ").concat(_.type==="object"?"object":a.toString(_)))}),o.length?"{ ".concat(o.join("; ")," }"):"{}"},array:function(e){if(e.items){var a=this.getValidClassName(e.items);return a?"".concat(a,"[]"):"".concat(this.toString(e.items),"[]")}return"any[]"},element:function(e){return"<".concat(e.componentName," />")},function:function(e){var a=this,o=e.signature;if(!o)return"Function";var f="oneOf"in o?o.oneOf:[o];return f.map(function(u){return"".concat(u.isAsync?"async ":"","(").concat(u.arguments.map(function(l){return"".concat(l.key,": ").concat(a.toString(l))}).join(", "),") => ").concat(a.toString(u.returnType))}).join(" | ")},dom:function(e){return e.className||"DOM"},enum:function(e){return e.enum.map(function(a){return JSON.stringify(a)}).join(" | ")},oneOf:function(e){var a=this;return e.oneOf.map(function(o){return a.getValidClassName(o)||a.toString(o)}).join(" | ")},getValidClassName:function(e){return"className"in e&&typeof e.className=="string"&&e.className!=="__type"?e.className:null}},r=function(e){var a=useState(function(){return P.toString(e)}),o=_slicedToArray(a,2),f=o[0],u=o[1];return useEffect(function(){u(P.toString(e))},[e]),_jsx("code",{children:f})},y=function(e){var a,o=useRouteMeta(),f=o.frontmatter,u=useAtomAssets(),l=u.components,h=e.id||f.atomId,_=useIntl();if(!h)throw new Error("`id` properties if required for API component!");var x=l==null?void 0:l[h];return _jsx("div",{className:"markdown",children:_jsxs(Table,{children:[_jsx("thead",{children:_jsxs("tr",{children:[_jsx("th",{children:_.formatMessage({id:"api.component.name"})}),_jsx("th",{children:_.formatMessage({id:"api.component.description"})}),_jsx("th",{children:_.formatMessage({id:"api.component.type"})}),_jsx("th",{children:_.formatMessage({id:"api.component.default"})})]})}),_jsx("tbody",{children:x&&(a=x.propsConfig)!==null&&a!==void 0&&a.properties?Object.entries(x.propsConfig.properties).map(function(m){var v,c=_slicedToArray(m,2),s=c[0],i=c[1];return _jsxs("tr",{children:[_jsx("td",{children:s}),_jsx("td",{children:i.description||"--"}),_jsx("td",{children:_jsx(r,_objectSpread({},i))}),_jsx("td",{children:_jsx("code",{children:(v=x.propsConfig.required)!==null&&v!==void 0&&v.includes(s)?_.formatMessage({id:"api.component.required"}):JSON.stringify(i.default)||"--"})})]},s)}):_jsx("tr",{children:_jsx("td",{colSpan:4,children:_.formatMessage({id:"api.component.".concat(l?"not.found":"unavailable")},{id:h})})})})]})})},b=null},68804:function(S,E,n){var A=n(24325),T=n(35250),O=function(M){return _jsx("span",_objectSpread({className:"dumi-default-badge"},M))},C=null},31177:function(S,E,n){var A=n(24325),T=n(28633),O=n(19317),C=n(14315),p=n(70079),M=n(35250),L=null,g=function(y){var b=y.children,t=_objectWithoutProperties(y,L),e=useRef(null),a=useState(!1),o=_slicedToArray(a,2),f=o[0],u=o[1],l=useState(!1),h=_slicedToArray(l,2),_=h[0],x=h[1];return useEffect(function(){var m=e.current;if(m){var v=throttle(function(){u(m.scrollLeft>0),x(m.scrollLeft<m.scrollWidth-m.offsetWidth)},100);return v(),m.addEventListener("scroll",v),window.addEventListener("resize",v),function(){m.removeEventListener("scroll",v),window.removeEventListener("resize",v)}}},[]),_jsx("div",{className:"dumi-default-table",children:_jsx("div",{className:"dumi-default-table-content",ref:e,"data-left-folded":f||void 0,"data-right-folded":_||void 0,children:_jsx("table",_objectSpread(_objectSpread({},t),{},{children:b}))})})},P=null},2131:function(S,E,n){n.d(E,{Z:function(){return v}});var A=n(24325),T=n.n(A),O=n(28633),C=n.n(O),p=n(12027),M=n.n(p),L=n(77324),g=n(88570),P=n(79275),r=n(60895),y=n(39865),b=n(1687),t=n(70079),e=n(35250);function a(c){var s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"",i=[];return[].concat(c).forEach(function(d,I){var j="".concat(s?"".concat(s,"-"):"").concat(I);switch(d==null?void 0:d.type){case"ul":{var D,N=((D=i[i.length-1])===null||D===void 0?void 0:D.children)||i,B=a(d.props.children||[],j);N.push.apply(N,M()(B));break}case"li":{var R=a(d.props.children,j);i.push({title:[].concat(d.props.children).filter(function(W){return W.type!=="ul"}),key:j,children:R,isLeaf:!R.length});break}default:}}),i}var o=function(s){var i=(0,t.useState)(a(s)),d=C()(i,2),I=d[0],j=d[1];return(0,t.useEffect)(function(){j(a(s))},[s]),I},f=function(s){var i=s.isLeaf,d=s.expanded;return i?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(L.r,{fill:"currentColor"})}):d?(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(g.r,{fill:"currentColor"})}):(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(P.r,{fill:"currentColor"})})},u=function(s){var i=s.isLeaf,d=s.expanded;return i?(0,e.jsx)("span",{className:"tree-switcher-leaf-line"}):d?(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(r.r,{fill:"currentColor"})})}):(0,e.jsx)("span",{className:"tree-switcher-line-icon",children:(0,e.jsx)("span",{className:"dumi-default-tree-icon",children:(0,e.jsx)(y.r,{fill:"currentColor"})})})},l=function(){return{height:0,opacity:0}},h=function(s){var i=s.scrollHeight;return{height:i,opacity:1}},_=function(s){return{height:s?s.offsetHeight:0}},x=function(s,i){return(i==null?void 0:i.deadline)===!0||i.propertyName==="height"},m={motionName:"ant-motion-collapse",onAppearStart:l,onEnterStart:l,onAppearActive:h,onEnterActive:h,onLeaveStart:_,onLeaveActive:l,onAppearEnd:x,onEnterEnd:x,onLeaveEnd:x,motionDeadline:500},v=function(c){var s=o(c.children),i=(0,t.createRef)(),d=function(j,D){var N=D.isLeaf;N||j.shiftKey||j.metaKey||j.ctrlKey||i.current.onNodeExpand(j,D)};return(0,e.jsx)(b.Z,{className:"dumi-default-tree",icon:f,ref:i,itemHeight:20,showLine:!0,selectable:!1,virtual:!1,motion:T()(T()({},m),{},{motionAppear:!1}),onClick:d,treeData:[{key:"0",title:c.title||"<root>",children:s}],defaultExpandAll:!0,switcherIcon:u})}}}]);
