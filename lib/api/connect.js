"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _register = _interopRequireDefault(require("./register"));

function _default(connectSpec, ccClassKey) {
  return (0, _register["default"])({
    connect: connectSpec
  }, ccClassKey);
}