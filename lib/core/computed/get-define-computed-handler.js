"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _defineHandlerToFns = _interopRequireDefault(require("../base/define-handler-to-fns"));

function _default(refCtx, watchFns) {
  return function (computedItem, computedHandler) {
    (0, _defineHandlerToFns["default"])(refCtx, computedItem, computedHandler, watchFns);
  };
}