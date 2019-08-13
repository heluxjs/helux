"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _dispatch = _interopRequireDefault(require("../core/base/dispatch"));

function _default(action, payLoadWhenActionIsString, delay, renderKey, option) {
  return (0, _dispatch["default"])(false, action, payLoadWhenActionIsString, delay, renderKey, option);
}