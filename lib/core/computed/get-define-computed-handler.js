"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _configureDepFns = _interopRequireDefault(require("../base/configure-dep-fns"));

var _constant = require("../../support/constant");

var sortFactor = 1;

function _default(refCtx, isLazyComputed) {
  if (isLazyComputed === void 0) {
    isLazyComputed = false;
  }

  return function (computedItem, computedHandler, depKeys, compare, sort) {
    // if user don't pass sort explicitly, computed fn will been called orderly by sortFactor
    // sort param may in computedHandler when it is an object like {fn:()=>{}, sort:10}
    var _sort = sort || sortFactor++;

    var confMeta = {
      type: 'computed',
      isLazyComputed: isLazyComputed,
      refCtx: refCtx,
      sort: _sort,
      stateKeys: refCtx.stateKeys,
      retKeyFns: refCtx.computedRetKeyFns,
      module: refCtx.module,
      connect: refCtx.connect,
      dep: refCtx.computedDep
    };
    (0, _configureDepFns["default"])(_constant.CATE_REF, confMeta, computedItem, computedHandler, depKeys, compare);
  };
}