"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _dispatch = _interopRequireDefault(require("../core/base/dispatch"));

function _default(action, payLoadWhenActionIsString, rkOrOptions, delay, extra) {
  return (0, _dispatch["default"])(action, payLoadWhenActionIsString, rkOrOptions, delay, extra);
}