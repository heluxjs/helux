"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _runtimeHandler = _interopRequireDefault(require("../../cc-context/runtime-handler"));

var _default = function _default(err) {
  var errorHandler = _runtimeHandler["default"].errorHandler;
  if (errorHandler) errorHandler(err);else throw err;
};

exports["default"] = _default;