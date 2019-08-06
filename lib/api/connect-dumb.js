"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _registerDumb = _interopRequireDefault(require("./register-dumb"));

function _default(connectSpec, ccClassKey) {
  return (0, _registerDumb["default"])({
    connect: connectSpec
  }, ccClassKey);
}