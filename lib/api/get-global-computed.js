"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _ccContext = _interopRequireDefault(require("../cc-context"));

var _constant = require("../support/constant");

var _computedValue = _ccContext["default"].computed._computedValue;

var _default = function _default() {
  return _computedValue[_constant.MODULE_GLOBAL];
};

exports["default"] = _default;