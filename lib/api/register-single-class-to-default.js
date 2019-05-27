"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _register = _interopRequireDefault(require("./register"));

var _constant = require("../support/constant");

function _default(ccClassKey, option) {
  if (option === void 0) {
    option = {};
  }

  if (!option.sharedStateKeys) option.sharedStateKeys = '*';
  option.module = _constant.MODULE_DEFAULT;
  option.isSingle = true;
  return (0, _register["default"])(ccClassKey, option);
}