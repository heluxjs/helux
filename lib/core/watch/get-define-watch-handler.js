"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _configureDepFns = _interopRequireDefault(require("../base/configure-dep-fns"));

var _constant = require("../../support/constant");

function _default(refCtx) {
  return function (watchItem, watchHandler, depKeysOrOpt) {
    var confMeta = {
      type: _constant.FN_WATCH,
      refCtx: refCtx,
      stateKeys: refCtx.stateKeys,
      retKeyFns: refCtx.watchRetKeyFns,
      module: refCtx.module,
      connect: refCtx.connect,
      dep: refCtx.watchDep
    };
    refCtx.__$$cuOrWaCalled = true;
    (0, _configureDepFns["default"])(_constant.CATE_REF, confMeta, watchItem, watchHandler, depKeysOrOpt);
  };
}