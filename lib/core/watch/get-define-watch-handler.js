"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _defineHandlerToFns = _interopRequireDefault(require("../base/define-handler-to-fns"));

function _default(refCtx, watchFns, immediateWatchKeys) {
  return function (watchItem, watchHandler, immediate) {
    if (immediate) (0, _defineHandlerToFns["default"])(refCtx, watchItem, watchHandler, watchFns, immediateWatchKeys);else (0, _defineHandlerToFns["default"])(refCtx, watchItem, watchHandler, watchFns);
  };
}