"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _useConcent = require("../core/hook/use-concent");

/**
 * inspired by mobx's <Observer>{state=>state.name}</Observer>
 */
var obView = function obView() {
  return 'Ob view';
};

var _default = _react["default"].memo(function (props) {
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
  };
  register.lite = 1;
  var ctx = (0, _useConcent.useConcentForOb)(register, classKey);
  var state, computed;

  if (module) {
    state = ctx.moduleState;
    computed = ctx.moduleComputed;
  } else {
    state = ctx.connectedState;
    computed = ctx.connectedComputed;
  }

  return view([state, computed]);
});

exports["default"] = _default;