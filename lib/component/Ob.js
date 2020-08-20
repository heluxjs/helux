"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _useConcent = require("../core/hook/use-concent");

/**
 * inspired by mobx's <Observer>{state=>state.name}</Observer>
 */
var obView = function obView() {
  return 'Ob view';
};

var _default = React.memo(function (props) {
  var module = props.module,
      connect = props.connect,
      classKey = props.classKey,
      render = props.render,
      children = props.children;

  if (module && connect) {
    throw new Error("module, connect can not been supplied both");
  } else if (!module && !connect) {
    throw new Error("module or connect should been supplied");
  }

  var view = render || children || obView;
  var register = module ? {
    module: module
  } : {
    connect: connect
  }; // 设置为1，最小化ctx够造过程，仅附加状态数据，衍生数据、和reducer相关函数

  register.lite = 1;
  var ctx = (0, _useConcent.useConcentForOb)(register, classKey);
  var mr = ctx.mr,
      cr = ctx.cr,
      r = ctx.r;
  var state, computed;

  if (module) {
    state = ctx.moduleState;
    computed = ctx.moduleComputed;
  } else {
    state = ctx.connectedState;
    computed = ctx.connectedComputed;
  }

  return view([state, computed, {
    mr: mr,
    cr: cr,
    r: r
  }]);
});

exports["default"] = _default;