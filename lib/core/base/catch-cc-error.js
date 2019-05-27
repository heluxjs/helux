"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _default = function _default(err) {
  if (_ccContext["default"].errorHandler) _ccContext["default"].errorHandler(err);else throw err;
};

exports["default"] = _default;