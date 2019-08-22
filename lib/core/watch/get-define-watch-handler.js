"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _defineHandlerToFns = _interopRequireDefault(require("../base/define-handler-to-fns"));

function _default(refCtx) {
  return function (watchItem, watchHandler, immediate, depStateKeys) {
    (0, _defineHandlerToFns["default"])(refCtx, watchItem, watchHandler, refCtx.watchFns, immediate, depStateKeys, refCtx.watchDep, 2);
  };
}