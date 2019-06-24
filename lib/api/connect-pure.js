"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _connectDumb = _interopRequireDefault(require("./connect-dumb"));

var _default = function _default(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      module = _ref.module,
      mapProps = _ref.mapProps,
      mapState = _ref.mapState,
      connect = _ref.connect,
      state = _ref.state,
      setup = _ref.setup,
      bindCtxToMethod = _ref.bindCtxToMethod;

  if (mapState) throw new Error('mapState is not allowed in connectPure method args');
  var _mapProps = mapProps;
  if (!mapProps) _mapProps = function _mapProps() {};
  return (0, _connectDumb["default"])({
    module: module,
    mapProps: _mapProps,
    connect: connect,
    state: state,
    setup: setup,
    bindCtxToMethod: bindCtxToMethod
  });
};

exports["default"] = _default;