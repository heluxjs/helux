"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _useConcent = _interopRequireDefault(require("../api/use-concent"));

/**
 * inspired by mobx's <Observer>{state=>state.name}</Observer>
 */
var _default = _react["default"].memo(function (props) {
  var firstProps = _react["default"].useRef(props);

  var _firstProps$current = firstProps.current,
      module = _firstProps$current.module,
      connect = _firstProps$current.connect,
      render = _firstProps$current.render,
      children = _firstProps$current.children;

  if (module && connect) {
    throw new Error("module, connect can not been supplied both");
  } else if (!module && !connect) {
    throw new Error("module or connect should been supplied");
  }

  var view = render || children;
  var register = module ? {
    module: module
  } : {
    connect: connect
  };
  register.lite = 1;
  var ctx = (0, _useConcent["default"])(register);
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