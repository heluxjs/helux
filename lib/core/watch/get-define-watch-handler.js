"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _configureDepFns = _interopRequireDefault(require("../base/configure-dep-fns"));

var _constant = require("../../support/constant");

function _default(refCtx) {
  return function (watchItem, watchHandler) {
    var confMeta = {
      type: 'watch',
      refCtx: refCtx,
      state: refCtx.state,
      module: refCtx.module,
      connect: refCtx.connect,
      dep: refCtx.watchDep
    };
    (0, _configureDepFns["default"])(_constant.CATE_REF, confMeta, watchItem, watchHandler);
  };
}